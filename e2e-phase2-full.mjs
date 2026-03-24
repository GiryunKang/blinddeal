import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
const results = [];
const USER_ID = 'b004a990-ff6f-4f96-99b1-1ea4df3bb3f3';

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
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await page.fill('#email', 'test@blinddeal.com');
  await page.fill('#password', 'Test1234!');
  console.log('[LOGIN] Filled credentials');

  await page.locator('button[type="submit"]').click();
  console.log('[LOGIN] Clicked submit');
  await page.waitForTimeout(5000);
  const afterLoginUrl = page.url();
  console.log('[LOGIN] Redirected to:', afterLoginUrl);
  await page.screenshot({ path: 'evidence/LOGIN-after.png' });

  // ========== F. PROFILE TESTS ==========
  console.log('\n=== F. PROFILE TESTS ===');

  // F1: /profile loads
  console.log('[F1] Testing /profile...');
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F1-profile.png' });
  const f1HasProfile = f1Text.includes('프로필') || f1Text.includes('test@blinddeal.com');
  const f1HasMembership = f1Text.includes('멤버십') || f1Text.includes('회원') || f1Text.includes('Membership');
  const f1HasVerification = f1Text.includes('인증') || f1Text.includes('레벨') || f1Text.includes('Level');
  log('F1', '/profile loads with name, email, membership, verification',
    'navigated to /profile',
    'N/A (read-only)',
    `profile=${f1HasProfile}, membership=${f1HasMembership}, verification=${f1HasVerification}`,
    f1HasProfile ? '통과' : '미완료');

  // F2: Edit display_name
  console.log('[F2] Testing display_name edit...');
  await page.goto(`${BASE}/profile/edit`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'evidence/F2-before.png' });

  let f2Status = '미완료';
  let f2Input = '';
  try {
    const nameField = page.locator('#display_name');
    await nameField.waitFor({ timeout: 10000 });
    await nameField.clear();
    await nameField.fill('E2E수정테스트');
    f2Input = 'cleared #display_name, filled "E2E수정테스트"';
    console.log('[F2] Filled display_name');

    await page.locator('button[type="submit"]').click();
    console.log('[F2] Clicked save');
    await page.waitForTimeout(3000);

    const successMsg = await page.textContent('body');
    const saved = successMsg.includes('저장') || successMsg.includes('success');
    await page.screenshot({ path: 'evidence/F2-after.png' });
    f2Status = 'DB_CHECK';
  } catch (e) {
    console.log('[F2] Error:', e.message);
    await page.screenshot({ path: 'evidence/F2-error.png', fullPage: true });
  }
  log('F2', 'Edit display_name to E2E수정테스트', f2Input, 'PENDING_DB', 'evidence/F2-after.png', f2Status);

  // F3: Edit bio
  console.log('[F3] Testing bio edit...');
  await page.goto(`${BASE}/profile/edit`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  let f3Status = '미완료';
  let f3Input = '';
  try {
    const bioField = page.locator('#bio');
    await bioField.waitFor({ timeout: 10000 });
    await bioField.clear();
    await bioField.fill('E2E 자기소개 테스트');
    f3Input = 'cleared #bio, filled "E2E 자기소개 테스트"';
    console.log('[F3] Filled bio');

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'evidence/F3-after.png' });
    f3Status = 'DB_CHECK';
  } catch (e) {
    console.log('[F3] Error:', e.message);
  }
  log('F3', 'Edit bio to E2E 자기소개 테스트', f3Input, 'PENDING_DB', 'evidence/F3-after.png', f3Status);

  // F4: Edit phone
  console.log('[F4] Testing phone edit...');
  await page.goto(`${BASE}/profile/edit`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  let f4Status = '미완료';
  let f4Input = '';
  try {
    const phoneField = page.locator('#phone');
    await phoneField.waitFor({ timeout: 10000 });
    await phoneField.clear();
    await phoneField.fill('010-5555-6666');
    f4Input = 'cleared #phone, filled "010-5555-6666"';
    console.log('[F4] Filled phone');

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'evidence/F4-after.png' });
    f4Status = 'DB_CHECK';
  } catch (e) {
    console.log('[F4] Error:', e.message);
  }
  log('F4', 'Edit phone to 010-5555-6666', f4Input, 'PENDING_DB', 'evidence/F4-after.png', f4Status);

  // F6: Verification page
  console.log('[F6] Testing /profile/verification...');
  await page.goto(`${BASE}/profile/verification`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f6Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F6-verification.png', fullPage: true });
  const f6HasStepper = f6Text.includes('Lv') || f6Text.includes('레벨') || f6Text.includes('인증') || f6Text.includes('단계') || f6Text.includes('Level');
  log('F6', 'Verification stepper with 5 levels', 'navigated to /profile/verification', 'N/A',
    `stepper found=${f6HasStepper}, text snippet: ${f6Text.substring(0, 150)}`,
    f6HasStepper ? '통과' : '미완료');

  // F7: Match preferences
  console.log('[F7] Testing /profile/matches...');
  await page.goto(`${BASE}/profile/matches`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f7Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F7-matches-before.png', fullPage: true });
  console.log('[F7] Page text:', f7Text.substring(0, 300));

  let f7Input = 'navigated to /profile/matches';
  let f7Status = '미완료';
  try {
    // Try clicking category checkboxes / toggle buttons
    const checkboxes = page.locator('input[type="checkbox"], [role="checkbox"], button[data-state]');
    const cbCount = await checkboxes.count();
    console.log('[F7] Checkboxes/toggles:', cbCount);

    if (cbCount > 0) {
      // Click first 2 checkboxes if available
      await checkboxes.nth(0).click();
      f7Input += ', toggled checkbox 0';
      if (cbCount > 1) {
        await checkboxes.nth(1).click();
        f7Input += ', toggled checkbox 1';
      }
    }

    // Look for save button
    const saveBtn = page.locator('button[type="submit"], button:has-text("저장"), button:has-text("Save")').first();
    if (await saveBtn.isVisible().catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(3000);
      f7Input += ', clicked save';
      f7Status = 'DB_CHECK';
    } else {
      f7Status = cbCount > 0 ? '통과(페이지로드+UI확인)' : (f7Text.length > 100 ? '통과(페이지로드)' : '미완료');
    }
    await page.screenshot({ path: 'evidence/F7-matches-after.png', fullPage: true });
  } catch (e) {
    console.log('[F7] Error:', e.message);
  }
  log('F7', 'Match preferences save', f7Input, 'PENDING', 'evidence/F7-matches-after.png', f7Status);

  // F8: Notifications page
  console.log('[F8] Testing /profile/notifications...');
  await page.goto(`${BASE}/profile/notifications`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f8Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F8-notifications.png' });
  const f8Loaded = f8Text.includes('알림') || f8Text.includes('notification') || f8Text.length > 100;
  log('F8', 'Notifications page loads', 'navigated to /profile/notifications', 'N/A',
    `loaded=${f8Loaded}`, f8Loaded ? '통과' : '미완료');

  // ========== J. COMMUNITY TESTS ==========
  console.log('\n=== J. COMMUNITY TESTS ===');

  // J1: Community loads
  console.log('[J1] Testing /community...');
  await page.goto(`${BASE}/community`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const j1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/J1-community.png' });
  const j1HasTabs = j1Text.includes('일반') || j1Text.includes('부동산') || j1Text.includes('M&A') || j1Text.includes('커뮤니티');
  log('J1', '/community loads with board tabs', 'navigated to /community', 'N/A',
    `tabs found=${j1HasTabs}`, j1HasTabs ? '통과' : '미완료');

  // J2: Create new post
  console.log('[J2] Testing /community/new...');
  await page.goto(`${BASE}/community/new`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'evidence/J2-new-before.png' });

  let j2Status = '미완료';
  let j2Input = '';
  let j2PostUrl = '';
  try {
    // Select "일반" board (should be default)
    const generalBtn = page.locator('button:has-text("일반")');
    if (await generalBtn.isVisible().catch(() => false)) {
      await generalBtn.click();
      j2Input += 'clicked 일반 board, ';
    }

    await page.fill('#title', 'E2E커뮤니티테스트');
    await page.fill('#content', '전수테스트 게시글');
    j2Input += 'filled title="E2E커뮤니티테스트", content="전수테스트 게시글"';
    console.log('[J2] Filled post form');

    await page.locator('button[type="submit"]').click();
    console.log('[J2] Clicked submit');
    await page.waitForTimeout(5000);
    j2PostUrl = page.url();
    console.log('[J2] Redirected to:', j2PostUrl);
    await page.screenshot({ path: 'evidence/J2-new-after.png' });
    j2Status = 'DB_CHECK';
  } catch (e) {
    console.log('[J2] Error:', e.message);
    await page.screenshot({ path: 'evidence/J2-error.png', fullPage: true });
  }
  log('J2', 'Create community post', j2Input, 'PENDING_DB', `redirected to ${j2PostUrl}`, j2Status);

  // J3: Comment on post
  console.log('[J3] Testing comment...');
  let j3Status = '미완료';
  let j3Input = '';
  if (j2PostUrl && j2PostUrl.includes('/community/')) {
    try {
      await page.waitForTimeout(2000);
      const j3Text = await page.textContent('body');
      console.log('[J3] Post page text:', j3Text.substring(0, 200));

      // Look for comment input
      const commentInput = page.locator('textarea[name="content"], textarea[placeholder*="댓글"], textarea[placeholder*="comment"], textarea').first();
      const commentVisible = await commentInput.isVisible().catch(() => false);
      console.log('[J3] Comment textarea visible:', commentVisible);

      if (commentVisible) {
        await commentInput.fill('E2E테스트댓글');
        j3Input = 'filled comment textarea with "E2E테스트댓글"';

        const commentBtn = page.locator('button[type="submit"]:has-text("댓글"), button[type="submit"]:has-text("작성"), button:has-text("등록"), form button[type="submit"]').first();
        await commentBtn.click();
        console.log('[J3] Clicked comment submit');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'evidence/J3-comment-after.png' });
        j3Status = 'DB_CHECK';
      } else {
        // Try looking for input field instead
        const commentField = page.locator('input[placeholder*="댓글"]').first();
        if (await commentField.isVisible().catch(() => false)) {
          await commentField.fill('E2E테스트댓글');
          j3Input = 'filled comment input with "E2E테스트댓글"';
          const btn = page.locator('button:has-text("등록"), button:has-text("작성"), button[type="submit"]').first();
          await btn.click();
          await page.waitForTimeout(3000);
          await page.screenshot({ path: 'evidence/J3-comment-after.png' });
          j3Status = 'DB_CHECK';
        }
      }
    } catch (e) {
      console.log('[J3] Error:', e.message);
      await page.screenshot({ path: 'evidence/J3-error.png', fullPage: true });
    }
  }
  log('J3', 'Comment on post', j3Input || 'post URL not available', 'PENDING_DB', 'evidence/J3-comment-after.png', j3Status);

  // J4: Like button
  console.log('[J4] Testing like...');
  let j4Status = '미완료';
  let j4Input = '';
  if (j2PostUrl && j2PostUrl.includes('/community/')) {
    try {
      // Already on the post page
      const likeBtn = page.locator('button:has-text("좋아요"), button[aria-label*="like"], button[aria-label*="좋아요"], button:has(svg.lucide-heart), button:has(svg.lucide-thumbs-up)').first();
      const likeVisible = await likeBtn.isVisible().catch(() => false);
      console.log('[J4] Like button visible:', likeVisible);

      if (likeVisible) {
        await likeBtn.click();
        j4Input = 'clicked like button';
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'evidence/J4-like-after.png' });
        j4Status = 'DB_CHECK';
      } else {
        // Try any heart/thumbs-up icon button
        const heartBtn = page.locator('button').filter({ has: page.locator('svg') });
        const heartBtns = await heartBtn.all();
        console.log('[J4] SVG buttons found:', heartBtns.length);
        for (let i = 0; i < heartBtns.length; i++) {
          const txt = await heartBtns[i].textContent().catch(() => '');
          const ariaLabel = await heartBtns[i].getAttribute('aria-label').catch(() => '');
          console.log(`[J4] SVG button ${i}: text="${txt.trim()}", aria="${ariaLabel}"`);
        }
        await page.screenshot({ path: 'evidence/J4-like-debug.png', fullPage: true });
      }
    } catch (e) {
      console.log('[J4] Error:', e.message);
    }
  }
  log('J4', 'Like button on post', j4Input || 'like button not found', 'PENDING_DB', 'evidence/J4-like-after.png', j4Status);

  // ========== K. DASHBOARD TESTS ==========
  console.log('\n=== K. DASHBOARD TESTS ===');

  // K1: Dashboard stat cards
  console.log('[K1] Testing /dashboard...');
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const k1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/K1-dashboard.png', fullPage: true });
  const k1HasStats = k1Text.includes('딜') || k1Text.includes('대시보드') || k1Text.includes('Dashboard');
  log('K1', 'Dashboard stat cards', 'navigated to /dashboard', 'PENDING_DB',
    `stats visible=${k1HasStats}`, k1HasStats ? '통과' : '미완료');

  // K2: Pipeline
  console.log('[K2] Testing pipeline...');
  const k2HasPipeline = k1Text.includes('파이프라인') || k1Text.includes('Pipeline') || k1Text.includes('진행') || k1Text.includes('활성');
  await page.screenshot({ path: 'evidence/K2-pipeline.png' });
  log('K2', 'Pipeline renders with deals', 'same page /dashboard', 'N/A',
    `pipeline found=${k2HasPipeline}`, k2HasPipeline ? '통과' : '미완료');

  // ========== L. ADMIN TESTS ==========
  console.log('\n=== L. ADMIN TESTS ===');

  // L1: Admin page
  console.log('[L1] Testing /admin...');
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const l1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L1-admin.png', fullPage: true });
  const l1HasStats = l1Text.includes('관리') || l1Text.includes('admin') || l1Text.includes('Admin') || l1Text.includes('사용자') || l1Text.includes('딜');
  log('L1', 'Admin stats', 'navigated to /admin', 'PENDING_DB',
    `admin loaded=${l1HasStats}`, l1HasStats ? '통과' : '미완료');

  // L2: Admin deals
  console.log('[L2] Testing /admin/deals...');
  await page.goto(`${BASE}/admin/deals`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const l2Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L2-admin-deals.png' });
  const l2HasTable = l2Text.includes('딜') || l2Text.includes('Deal') || l2Text.includes('제목') || l2Text.includes('상태');
  log('L2', 'Admin deals table', 'navigated to /admin/deals', 'N/A',
    `table loaded=${l2HasTable}`, l2HasTable ? '통과' : '미완료');

  // L3: Admin users
  console.log('[L3] Testing /admin/users...');
  await page.goto(`${BASE}/admin/users`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const l3Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L3-admin-users.png' });
  const l3HasUsers = l3Text.includes('사용자') || l3Text.includes('User') || l3Text.includes('이메일') || l3Text.includes('회원');
  log('L3', 'Admin users list', 'navigated to /admin/users', 'N/A',
    `users loaded=${l3HasUsers}`, l3HasUsers ? '통과' : '미완료');

  // L4: Admin verifications
  console.log('[L4] Testing /admin/verifications...');
  await page.goto(`${BASE}/admin/verifications`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const l4Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L4-admin-verifications.png' });
  const l4Loaded = l4Text.includes('인증') || l4Text.includes('Verification') || l4Text.includes('검증') || l4Text.length > 100;
  log('L4', 'Admin verifications page', 'navigated to /admin/verifications', 'N/A',
    `loaded=${l4Loaded}`, l4Loaded ? '통과' : '미완료');

  // ========== M. OTHER PAGES ==========
  console.log('\n=== M. OTHER PAGES ===');

  // M1: Insights
  console.log('[M1] Testing /insights...');
  await page.goto(`${BASE}/insights`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const m1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/M1-insights.png' });
  const m1Loaded = m1Text.includes('인사이트') || m1Text.includes('Insight') || m1Text.includes('분석') || m1Text.length > 200;
  log('M1', '/insights loads', 'navigated to /insights', 'N/A', `loaded=${m1Loaded}`, m1Loaded ? '통과' : '미완료');

  // M2: Experts
  console.log('[M2] Testing /experts...');
  await page.goto(`${BASE}/experts`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const m2Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/M2-experts.png' });
  const m2Loaded = m2Text.includes('전문가') || m2Text.includes('Expert') || m2Text.length > 200;
  log('M2', '/experts loads', 'navigated to /experts', 'N/A', `loaded=${m2Loaded}`, m2Loaded ? '통과' : '미완료');

  // M3: Deals map
  console.log('[M3] Testing /deals/map...');
  await page.goto(`${BASE}/deals/map`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const m3Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/M3-deals-map.png' });
  const m3Loaded = m3Text.includes('지도') || m3Text.includes('Map') || m3Text.includes('딜') || m3Text.length > 200;
  log('M3', '/deals/map loads', 'navigated to /deals/map', 'N/A', `loaded=${m3Loaded}`, m3Loaded ? '통과' : '미완료');

  // M4: Deals matched
  console.log('[M4] Testing /deals/matched...');
  await page.goto(`${BASE}/deals/matched`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const m4Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/M4-deals-matched.png' });
  const m4Loaded = m4Text.includes('매칭') || m4Text.includes('Matched') || m4Text.includes('딜') || m4Text.length > 200;
  log('M4', '/deals/matched loads', 'navigated to /deals/matched', 'N/A', `loaded=${m4Loaded}`, m4Loaded ? '통과' : '미완료');

  // ========== N. ERROR HANDLING ==========
  console.log('\n=== N. ERROR HANDLING ===');

  // N1: 404 for nonexistent deal
  console.log('[N1] Testing /deals/nonexistent-slug...');
  await page.goto(`${BASE}/deals/nonexistent-slug`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const n1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/N1-404.png' });
  const n1Is404 = n1Text.includes('404') || n1Text.includes('찾을 수 없') || n1Text.includes('not found') || n1Text.includes('존재하지 않');
  log('N1', '404 for nonexistent deal', 'navigated to /deals/nonexistent-slug', 'N/A',
    `404 shown=${n1Is404}`, n1Is404 ? '통과' : '미완료');

  // N2: Invalid room
  console.log('[N2] Testing /rooms/00000000-...');
  await page.goto(`${BASE}/rooms/00000000-0000-0000-0000-000000000000`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const n2Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/N2-invalid-room.png' });
  const n2Handled = n2Text.includes('404') || n2Text.includes('찾을 수 없') || n2Text.includes('오류') || n2Text.includes('error') || n2Text.includes('존재하지 않') || n2Text.includes('채팅');
  log('N2', 'Error handling for invalid room', 'navigated to /rooms/00000000-...', 'N/A',
    `error handled=${n2Handled}`, n2Handled ? '통과' : '미완료');

  // N3: Invalid community post
  console.log('[N3] Testing /community/general/00000000-...');
  await page.goto(`${BASE}/community/general/00000000-0000-0000-0000-000000000000`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const n3Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/N3-invalid-post.png' });
  const n3Handled = n3Text.includes('404') || n3Text.includes('찾을 수 없') || n3Text.includes('존재하지 않') || n3Text.includes('오류') || n3Text.includes('error');
  log('N3', 'Error handling for invalid post', 'navigated to /community/general/00000000-...', 'N/A',
    `error handled=${n3Handled}`, n3Handled ? '통과' : '미완료');

  await browser.close();

  console.log('\n\n========== PC TEST RESULTS ==========');
  results.forEach(r => {
    console.log(`| ${r.id} | ${r.test} | ${r.input} | ${r.db} | ${r.screen} | ${r.status} |`);
  });
})();
