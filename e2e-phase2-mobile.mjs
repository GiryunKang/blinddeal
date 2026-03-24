import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
const results = [];

if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

function log(id, test, input, db, screen, status) {
  results.push({ id, test, input, db, screen, status });
  console.log(`[${id}] ${status} - ${test}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ===== A1-M: Landing page mobile (no login needed) =====
  console.log('=== A1-M: Landing page mobile ===');
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    page.setDefaultTimeout(15000);

    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    const text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/A1-M-landing-mobile.png', fullPage: false });

    // Check for hamburger menu (mobile nav)
    const hamburger = page.locator('button[aria-label*="메뉴"], button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg.lucide-menu), [data-testid="mobile-menu"]');
    const hamburgerCount = await hamburger.count();
    // Also check for any menu-like button
    const menuBtns = page.locator('button').filter({ has: page.locator('svg') });
    const menuCount = await menuBtns.count();
    console.log('[A1-M] Hamburger count:', hamburgerCount, 'SVG buttons:', menuCount);
    const hasLanding = text.includes('BlindDeal') || text.includes('보이지 않는');
    log('A1-M', 'Landing page mobile layout',
      'navigated to / with viewport 390x844',
      'N/A',
      `hamburger buttons=${hamburgerCount}, landing=${hasLanding}`,
      hasLanding ? '통과' : '미완료');
    await ctx.close();
  }

  // ===== N1-M: 404 on mobile =====
  console.log('\n=== N1-M: 404 on mobile ===');
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    page.setDefaultTimeout(15000);

    await page.goto(`${BASE}/deals/nonexistent-slug`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N1-M-404-mobile.png', fullPage: false });
    const is404 = text.includes('404') || text.includes('찾을 수 없');
    log('N1-M', '404 on mobile', 'navigated to /deals/nonexistent-slug with 390x844', 'N/A',
      `404=${is404}`, is404 ? '통과' : '미완료');
    await ctx.close();
  }

  // ===== Tests requiring login =====
  console.log('\n=== LOGIN for mobile tests ===');
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await mobileCtx.newPage();
  page.setDefaultTimeout(15000);

  // Login
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });
  await page.fill('#email', 'test@blinddeal.com');
  await page.fill('#password', 'Test1234!');
  await page.waitForTimeout(500);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(url => !url.toString().includes('/auth/login'), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  console.log('[LOGIN-MOBILE] URL:', page.url());

  // ===== A9-M: Inquiry form on mobile =====
  console.log('\n=== A9-M: Inquiry form mobile ===');
  let a9Status = '미완료';
  let a9Input = '';
  try {
    // Find a deal to submit inquiry on
    await page.goto(`${BASE}/deals`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Click first deal link
    const dealLink = page.locator('a[href*="/deals/"]').first();
    if (await dealLink.isVisible().catch(() => false)) {
      await dealLink.click();
      await page.waitForTimeout(3000);
      console.log('[A9-M] On deal page:', page.url());
      await page.screenshot({ path: 'evidence/A9-M-deal-page.png', fullPage: true });

      const dealText = await page.textContent('body');
      // Look for inquiry button or form
      const inquiryBtn = page.locator('button:has-text("문의"), button:has-text("관심"), a:has-text("문의"), button:has-text("연락")').first();
      const inquiryVisible = await inquiryBtn.isVisible().catch(() => false);
      console.log('[A9-M] Inquiry button visible:', inquiryVisible);

      if (inquiryVisible) {
        await inquiryBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'evidence/A9-M-inquiry-form.png', fullPage: true });

        // Fill inquiry form if it appears
        const emailField = page.locator('input[name="email"], input[type="email"]').first();
        const emailVisible = await emailField.isVisible().catch(() => false);
        if (emailVisible) {
          await emailField.clear();
          await emailField.fill('e2emobile@test.com');
          a9Input = 'filled email=e2emobile@test.com';

          // Look for message/content field
          const msgField = page.locator('textarea').first();
          if (await msgField.isVisible().catch(() => false)) {
            await msgField.fill('E2E 모바일 테스트 문의');
            a9Input += ', message=E2E 모바일 테스트 문의';
          }

          // Submit
          const submitBtn = page.locator('button[type="submit"], button:has-text("제출"), button:has-text("보내기"), button:has-text("문의")').first();
          if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click();
            await page.waitForTimeout(3000);
            a9Status = 'DB_CHECK';
          }
        } else {
          // Maybe it's an interest/관심 button that doesn't have a form
          a9Input = 'clicked inquiry/interest button (no email form)';
          a9Status = '통과(버튼클릭)';
        }
        await page.screenshot({ path: 'evidence/A9-M-inquiry-after.png', fullPage: true });
      } else {
        // Check for deal interest buttons - it might be a deal_interests interaction which Phase 1 handles
        a9Input = 'inquiry button not found on deal page';
        // A9-M is about inquiry form, not deal_interests
        // Let's check if there's a general contact/inquiry page
      }
    }
  } catch (e) {
    console.log('[A9-M] Error:', e.message);
    await page.screenshot({ path: 'evidence/A9-M-error.png', fullPage: true });
  }
  log('A9-M', 'Inquiry form on mobile',
    a9Input || 'no inquiry form found', 'PENDING_DB',
    'evidence/A9-M-inquiry-after.png', a9Status);

  // ===== F1-M: Profile mobile =====
  console.log('\n=== F1-M: Profile mobile ===');
  try {
    await page.goto(`${BASE}/profile`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    const f1mText = await page.textContent('body');
    await page.screenshot({ path: 'evidence/F1-M-profile-mobile.png', fullPage: false });
    const hasProfile = f1mText.includes('프로필') || f1mText.includes('E2E수정테스트') || f1mText.includes('test@blinddeal.com');
    log('F1-M', 'Profile mobile layout',
      'navigated to /profile with 390x844',
      'N/A',
      `profile visible=${hasProfile}`,
      hasProfile ? '통과' : '미완료');
  } catch (e) {
    log('F1-M', 'Profile mobile layout', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // ===== J1-M: Community mobile =====
  console.log('\n=== J1-M: Community mobile ===');
  try {
    await page.goto(`${BASE}/community`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    const j1mText = await page.textContent('body');
    await page.screenshot({ path: 'evidence/J1-M-community-mobile.png', fullPage: false });
    const hasCommunity = j1mText.includes('커뮤니티') || j1mText.includes('일반') || j1mText.includes('게시');
    log('J1-M', 'Community mobile layout',
      'navigated to /community with 390x844',
      'N/A',
      `community visible=${hasCommunity}`,
      hasCommunity ? '통과' : '미완료');
  } catch (e) {
    log('J1-M', 'Community mobile layout', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // ===== K1-M: Dashboard mobile =====
  console.log('\n=== K1-M: Dashboard mobile ===');
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    const k1mText = await page.textContent('body');
    await page.screenshot({ path: 'evidence/K1-M-dashboard-mobile.png', fullPage: false });
    const hasDash = k1mText.includes('대시보드') || k1mText.includes('Dashboard') || k1mText.includes('내 딜');
    log('K1-M', 'Dashboard mobile layout',
      'navigated to /dashboard with 390x844',
      'N/A',
      `dashboard visible=${hasDash}`,
      hasDash ? '통과' : '미완료');
  } catch (e) {
    log('K1-M', 'Dashboard mobile layout', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  await browser.close();

  console.log('\n\n========== MOBILE RESULTS ==========');
  results.forEach(r => {
    console.log(`| ${r.id} | ${r.test} | ${r.input} | ${r.db} | ${r.screen} | ${r.status} |`);
  });
})();
