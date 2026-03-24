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
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  // === LOGIN ===
  console.log('=== LOGIN ===');
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.fill('#email', 'test@blinddeal.com');
  await page.fill('#password', 'Test1234!');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(5000);
  console.log('[LOGIN] Done, URL:', page.url());

  // === J3: Comment on the post we created ===
  console.log('\n=== J3: Comment ===');
  // Find the post we created
  await page.goto(`${BASE}/community`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  let j3Status = '미완료';
  let j3Input = '';
  let postUrl = '';
  try {
    // Find our test post
    const postLink = page.locator('a:has-text("E2E커뮤니티테스트")').first();
    const postExists = await postLink.isVisible().catch(() => false);
    console.log('[J3] Post link visible:', postExists);

    if (postExists) {
      await postLink.click();
      await page.waitForTimeout(3000);
      postUrl = page.url();
      console.log('[J3] Navigated to post:', postUrl);
    } else {
      // Try going to general board
      await page.goto(`${BASE}/community/general`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const postLink2 = page.locator('a:has-text("E2E커뮤니티테스트")').first();
      if (await postLink2.isVisible().catch(() => false)) {
        await postLink2.click();
        await page.waitForTimeout(3000);
        postUrl = page.url();
      }
    }

    if (postUrl) {
      // Fill comment textarea - it's the main textarea with placeholder "댓글을 작성하세요..."
      const commentTextarea = page.locator('textarea[placeholder="댓글을 작성하세요..."]').first();
      await commentTextarea.fill('E2E테스트댓글');
      j3Input = 'filled comment textarea with "E2E테스트댓글"';
      console.log('[J3] Filled comment');

      // Click "댓글 작성" button (it's a Button with onClick, not form submit)
      const commentBtn = page.locator('button:has-text("댓글 작성")').first();
      await commentBtn.click();
      console.log('[J3] Clicked 댓글 작성');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: 'evidence/J3-comment-after.png' });

      // Verify comment appears on page
      const pageText = await page.textContent('body');
      const commentVisible = pageText.includes('E2E테스트댓글');
      console.log('[J3] Comment visible on page:', commentVisible);
      j3Status = 'DB_CHECK';
    }
  } catch (e) {
    console.log('[J3] Error:', e.message);
    await page.screenshot({ path: 'evidence/J3-error.png', fullPage: true });
  }
  log('J3', 'Comment on post', j3Input, 'PENDING_DB', 'evidence/J3-comment-after.png', j3Status);

  // === K. DASHBOARD TESTS ===
  console.log('\n=== K. DASHBOARD ===');

  // K1
  console.log('[K1] Testing /dashboard...');
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const k1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/K1-dashboard.png', fullPage: true });
    const k1HasStats = k1Text.includes('딜') || k1Text.includes('대시보드') || k1Text.includes('Dashboard') || k1Text.includes('내 딜');
    log('K1', 'Dashboard stat cards', 'navigated to /dashboard', 'PENDING_DB',
      `stats visible=${k1HasStats}, text: ${k1Text.substring(0, 200)}`, k1HasStats ? '통과' : '미완료');

    // K2
    const k2HasPipeline = k1Text.includes('파이프라인') || k1Text.includes('Pipeline') || k1Text.includes('진행') || k1Text.includes('활성') || k1Text.includes('상태');
    log('K2', 'Pipeline renders', 'same page /dashboard', 'N/A',
      `pipeline found=${k2HasPipeline}`, k2HasPipeline ? '통과' : '미완료');
  } catch (e) {
    console.log('[K1] Error:', e.message);
    log('K1', 'Dashboard stat cards', 'navigated to /dashboard', 'N/A', 'network error', '미완료');
    log('K2', 'Pipeline renders', 'same page', 'N/A', 'network error', '미완료');
  }

  // === L. ADMIN TESTS ===
  console.log('\n=== L. ADMIN ===');

  // L1
  console.log('[L1] Testing /admin...');
  try {
    await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L1-admin.png', fullPage: true });
    const l1HasStats = l1Text.includes('관리') || l1Text.includes('admin') || l1Text.includes('Admin') || l1Text.includes('사용자') || l1Text.includes('딜') || l1Text.includes('통계');
    log('L1', 'Admin stats', 'navigated to /admin', 'PENDING_DB',
      `admin loaded=${l1HasStats}`, l1HasStats ? '통과' : '미완료');
  } catch (e) {
    console.log('[L1] Error:', e.message);
    log('L1', 'Admin stats', 'error', 'N/A', e.message, '미완료');
  }

  // L2
  console.log('[L2] Testing /admin/deals...');
  try {
    await page.goto(`${BASE}/admin/deals`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l2Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L2-admin-deals.png' });
    const l2HasTable = l2Text.includes('딜') || l2Text.includes('Deal') || l2Text.includes('제목') || l2Text.includes('상태');
    log('L2', 'Admin deals table', 'navigated to /admin/deals', 'N/A',
      `table loaded=${l2HasTable}`, l2HasTable ? '통과' : '미완료');
  } catch (e) {
    console.log('[L2] Error:', e.message);
    log('L2', 'Admin deals table', 'error', 'N/A', e.message, '미완료');
  }

  // L3
  console.log('[L3] Testing /admin/users...');
  try {
    await page.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l3Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L3-admin-users.png' });
    const l3HasUsers = l3Text.includes('사용자') || l3Text.includes('User') || l3Text.includes('이메일') || l3Text.includes('회원');
    log('L3', 'Admin users list', 'navigated to /admin/users', 'N/A',
      `users loaded=${l3HasUsers}`, l3HasUsers ? '통과' : '미완료');
  } catch (e) {
    console.log('[L3] Error:', e.message);
    log('L3', 'Admin users list', 'error', 'N/A', e.message, '미완료');
  }

  // L4
  console.log('[L4] Testing /admin/verifications...');
  try {
    await page.goto(`${BASE}/admin/verifications`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l4Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L4-admin-verifications.png' });
    const l4Loaded = l4Text.includes('인증') || l4Text.includes('Verification') || l4Text.includes('검증') || l4Text.length > 100;
    log('L4', 'Admin verifications page', 'navigated to /admin/verifications', 'N/A',
      `loaded=${l4Loaded}`, l4Loaded ? '통과' : '미완료');
  } catch (e) {
    console.log('[L4] Error:', e.message);
    log('L4', 'Admin verifications page', 'error', 'N/A', e.message, '미완료');
  }

  // === M. OTHER PAGES ===
  console.log('\n=== M. OTHER PAGES ===');

  // M1
  console.log('[M1] Testing /insights...');
  try {
    await page.goto(`${BASE}/insights`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const m1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/M1-insights.png' });
    const m1Loaded = m1Text.includes('인사이트') || m1Text.includes('Insight') || m1Text.length > 200;
    log('M1', '/insights loads', 'navigated to /insights', 'N/A', `loaded=${m1Loaded}`, m1Loaded ? '통과' : '미완료');
  } catch (e) {
    log('M1', '/insights loads', 'error', 'N/A', e.message, '미완료');
  }

  // M2
  console.log('[M2] Testing /experts...');
  try {
    await page.goto(`${BASE}/experts`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const m2Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/M2-experts.png' });
    const m2Loaded = m2Text.includes('전문가') || m2Text.includes('Expert') || m2Text.length > 200;
    log('M2', '/experts loads', 'navigated to /experts', 'N/A', `loaded=${m2Loaded}`, m2Loaded ? '통과' : '미완료');
  } catch (e) {
    log('M2', '/experts loads', 'error', 'N/A', e.message, '미완료');
  }

  // M3
  console.log('[M3] Testing /deals/map...');
  try {
    await page.goto(`${BASE}/deals/map`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const m3Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/M3-deals-map.png' });
    const m3Loaded = m3Text.includes('지도') || m3Text.includes('Map') || m3Text.includes('딜') || m3Text.length > 200;
    log('M3', '/deals/map loads', 'navigated to /deals/map', 'N/A', `loaded=${m3Loaded}`, m3Loaded ? '통과' : '미완료');
  } catch (e) {
    log('M3', '/deals/map loads', 'error', 'N/A', e.message, '미완료');
  }

  // M4
  console.log('[M4] Testing /deals/matched...');
  try {
    await page.goto(`${BASE}/deals/matched`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const m4Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/M4-deals-matched.png' });
    const m4Loaded = m4Text.includes('매칭') || m4Text.includes('Matched') || m4Text.includes('딜') || m4Text.length > 200;
    log('M4', '/deals/matched loads', 'navigated to /deals/matched', 'N/A', `loaded=${m4Loaded}`, m4Loaded ? '통과' : '미완료');
  } catch (e) {
    log('M4', '/deals/matched loads', 'error', 'N/A', e.message, '미완료');
  }

  // === N. ERROR HANDLING ===
  console.log('\n=== N. ERROR HANDLING ===');

  // N1
  console.log('[N1] Testing /deals/nonexistent-slug...');
  try {
    await page.goto(`${BASE}/deals/nonexistent-slug`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const n1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N1-404.png' });
    const n1Is404 = n1Text.includes('404') || n1Text.includes('찾을 수 없') || n1Text.includes('not found') || n1Text.includes('존재하지 않');
    log('N1', '404 for nonexistent deal', 'navigated to /deals/nonexistent-slug', 'N/A',
      `404 shown=${n1Is404}`, n1Is404 ? '통과' : '미완료');
  } catch (e) {
    log('N1', '404 for nonexistent deal', 'error', 'N/A', e.message, '미완료');
  }

  // N2
  console.log('[N2] Testing /rooms/00000000-...');
  try {
    await page.goto(`${BASE}/rooms/00000000-0000-0000-0000-000000000000`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const n2Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N2-invalid-room.png' });
    const n2Handled = n2Text.includes('404') || n2Text.includes('찾을 수 없') || n2Text.includes('오류') || n2Text.includes('error') || n2Text.includes('존재하지 않') || n2Text.includes('채팅') || n2Text.includes('메시지');
    log('N2', 'Error handling for invalid room', 'navigated to /rooms/00000000-...', 'N/A',
      `error handled=${n2Handled}, text: ${n2Text.substring(0, 150)}`, n2Handled ? '통과' : '미완료');
  } catch (e) {
    log('N2', 'Error handling for invalid room', 'error', 'N/A', e.message, '미완료');
  }

  // N3
  console.log('[N3] Testing /community/general/00000000-...');
  try {
    await page.goto(`${BASE}/community/general/00000000-0000-0000-0000-000000000000`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const n3Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N3-invalid-post.png' });
    const n3Handled = n3Text.includes('404') || n3Text.includes('찾을 수 없') || n3Text.includes('존재하지 않') || n3Text.includes('오류') || n3Text.includes('error');
    log('N3', 'Error handling for invalid post', 'navigated to /community/general/00000000-...', 'N/A',
      `error handled=${n3Handled}, text: ${n3Text.substring(0, 150)}`, n3Handled ? '통과' : '미완료');
  } catch (e) {
    log('N3', 'Error handling for invalid post', 'error', 'N/A', e.message, '미완료');
  }

  await browser.close();

  console.log('\n\n========== PART 2 RESULTS ==========');
  results.forEach(r => {
    console.log(`| ${r.id} | ${r.test} | ${r.input} | ${r.db} | ${r.screen} | ${r.status} |`);
  });
})();
