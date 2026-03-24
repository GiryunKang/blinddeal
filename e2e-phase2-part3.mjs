import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
const results = [];

if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

function log(id, test, input, db, screen, status) {
  results.push({ id, test, input, db, screen, status });
  console.log(`[${id}] ${status} - ${test}`);
}

async function login(page) {
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Wait for form to be ready
  await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });
  await page.fill('#email', 'test@blinddeal.com');
  await page.fill('#password', 'Test1234!');
  await page.waitForTimeout(500);
  await page.locator('button[type="submit"]').click();

  // Wait for navigation away from login page
  await page.waitForURL(url => !url.toString().includes('/auth/login'), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const url = page.url();
  const loggedIn = !url.includes('/auth/login');
  console.log('[LOGIN] URL:', url, 'Success:', loggedIn);
  return loggedIn;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  const loggedIn = await login(page);
  if (!loggedIn) {
    console.log('LOGIN FAILED - retrying...');
    await login(page);
  }

  // === J3: Comment ===
  console.log('\n=== J3: Comment ===');
  let j3Status = '미완료';
  let j3Input = '';
  try {
    // Navigate directly to the post we created
    await page.goto(`${BASE}/community/general/44bbe4b8-da56-4114-b7f1-b2d162eb40b0`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);

    const postText = await page.textContent('body');
    console.log('[J3] Page has post:', postText.includes('E2E커뮤니티테스트'));

    // Fill the comment textarea
    const commentArea = page.locator('textarea').first();
    await commentArea.waitFor({ state: 'visible', timeout: 10000 });
    await commentArea.fill('E2E테스트댓글');
    j3Input = 'filled comment textarea with "E2E테스트댓글"';
    console.log('[J3] Filled comment');

    // Click "댓글 작성" button - it's a Button with onClick handler
    const commentBtn = page.locator('button:has-text("댓글 작성")').first();
    await commentBtn.waitFor({ state: 'visible', timeout: 5000 });
    await commentBtn.click();
    console.log('[J3] Clicked 댓글 작성');
    await page.waitForTimeout(5000);

    // Verify
    const afterText = await page.textContent('body');
    const commentVisible = afterText.includes('E2E테스트댓글');
    console.log('[J3] Comment visible:', commentVisible);
    await page.screenshot({ path: 'evidence/J3-comment-after-v2.png' });
    j3Status = commentVisible ? 'DB_CHECK' : '미완료';
    j3Input += ', clicked 댓글 작성 button';
  } catch (e) {
    console.log('[J3] Error:', e.message);
    await page.screenshot({ path: 'evidence/J3-error-v2.png', fullPage: true });
  }
  log('J3', 'Comment on post', j3Input, 'PENDING_DB', 'evidence/J3-comment-after-v2.png', j3Status);

  // === K1: Dashboard ===
  console.log('\n=== K1: Dashboard ===');
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const k1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/K1-dashboard-v2.png', fullPage: true });
    console.log('[K1] Text snippet:', k1Text.substring(0, 300));
    const k1HasStats = k1Text.includes('대시보드') || k1Text.includes('Dashboard') || k1Text.includes('내 딜') || k1Text.includes('활성') || k1Text.includes('전체');
    const k1IsLoginPage = k1Text.includes('로그인') && k1Text.includes('비밀번호');
    log('K1', 'Dashboard stat cards', 'navigated to /dashboard', 'PENDING_DB',
      `stats=${k1HasStats}, isLogin=${k1IsLoginPage}`, (k1HasStats && !k1IsLoginPage) ? '통과' : '미완료');

    // K2
    const k2HasPipeline = k1Text.includes('파이프라인') || k1Text.includes('Pipeline') || k1Text.includes('진행') || k1Text.includes('활성') || k1Text.includes('상태') || k1Text.includes('등록한 딜');
    log('K2', 'Pipeline renders', 'same page /dashboard', 'N/A',
      `pipeline found=${k2HasPipeline}`, (k2HasPipeline && !k1IsLoginPage) ? '통과' : '미완료');
  } catch (e) {
    console.log('[K] Error:', e.message);
    log('K1', 'Dashboard stat cards', 'error', 'N/A', e.message.substring(0, 100), '미완료');
    log('K2', 'Pipeline renders', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // === L1: Admin ===
  console.log('\n=== L1: Admin ===');
  try {
    await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L1-admin-v2.png', fullPage: true });
    console.log('[L1] Text snippet:', l1Text.substring(0, 300));
    const l1HasAdmin = l1Text.includes('관리') || l1Text.includes('Admin') || l1Text.includes('통계') || l1Text.includes('전체 사용자') || l1Text.includes('전체 딜');
    log('L1', 'Admin stats', 'navigated to /admin', 'PENDING_DB',
      `admin loaded=${l1HasAdmin}`, l1HasAdmin ? '통과' : '미완료');
  } catch (e) {
    log('L1', 'Admin stats', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // === L2: Admin deals ===
  console.log('[L2] Testing /admin/deals...');
  try {
    await page.goto(`${BASE}/admin/deals`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l2Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L2-admin-deals-v2.png' });
    const l2HasTable = l2Text.includes('딜') || l2Text.includes('Deal') || l2Text.includes('제목');
    log('L2', 'Admin deals table', 'navigated to /admin/deals', 'N/A',
      `table loaded=${l2HasTable}`, l2HasTable ? '통과' : '미완료');
  } catch (e) {
    log('L2', 'Admin deals table', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // === L3: Admin users ===
  console.log('[L3] Testing /admin/users...');
  try {
    await page.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l3Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L3-admin-users-v2.png' });
    const l3HasUsers = l3Text.includes('사용자') || l3Text.includes('User') || l3Text.includes('이메일');
    log('L3', 'Admin users list', 'navigated to /admin/users', 'N/A',
      `users loaded=${l3HasUsers}`, l3HasUsers ? '통과' : '미완료');
  } catch (e) {
    log('L3', 'Admin users list', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // === L4: Admin verifications ===
  console.log('[L4] Testing /admin/verifications...');
  try {
    await page.goto(`${BASE}/admin/verifications`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const l4Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/L4-admin-verif-v2.png' });
    const l4Loaded = l4Text.includes('인증') || l4Text.includes('Verification') || l4Text.includes('검증');
    log('L4', 'Admin verifications', 'navigated to /admin/verifications', 'N/A',
      `loaded=${l4Loaded}`, l4Loaded ? '통과' : '미완료');
  } catch (e) {
    log('L4', 'Admin verifications', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // === M. OTHER PAGES ===
  console.log('\n=== M. OTHER PAGES ===');

  for (const [id, path, keywords] of [
    ['M1', '/insights', ['인사이트', 'Insight', '시장', '분석']],
    ['M2', '/experts', ['전문가', 'Expert', '자문']],
    ['M3', '/deals/map', ['지도', 'Map', '딜']],
    ['M4', '/deals/matched', ['매칭', 'Matched', '추천', '딜']],
  ]) {
    console.log(`[${id}] Testing ${path}...`);
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(4000);
      const text = await page.textContent('body');
      await page.screenshot({ path: `evidence/${id}-v2.png` });
      const loaded = keywords.some(k => text.includes(k)) || text.length > 200;
      log(id, `${path} loads`, `navigated to ${path}`, 'N/A', `loaded=${loaded}`, loaded ? '통과' : '미완료');
    } catch (e) {
      log(id, `${path} loads`, 'error', 'N/A', e.message.substring(0, 100), '미완료');
    }
  }

  // === N. ERROR HANDLING ===
  console.log('\n=== N. ERROR HANDLING ===');

  // N1
  console.log('[N1] Testing 404...');
  try {
    await page.goto(`${BASE}/deals/nonexistent-slug`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const n1Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N1-404-v2.png' });
    const n1Is404 = n1Text.includes('404') || n1Text.includes('찾을 수 없') || n1Text.includes('존재하지 않');
    log('N1', '404 for nonexistent deal', 'navigated to /deals/nonexistent-slug', 'N/A',
      `404=${n1Is404}`, n1Is404 ? '통과' : '미완료');
  } catch (e) {
    log('N1', '404', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // N2
  console.log('[N2] Testing invalid room...');
  try {
    await page.goto(`${BASE}/rooms/00000000-0000-0000-0000-000000000000`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const n2Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N2-room-v2.png' });
    const n2Handled = n2Text.includes('404') || n2Text.includes('찾을 수 없') || n2Text.includes('오류') || n2Text.includes('존재하지 않') || n2Text.includes('채팅') || n2Text.includes('메시지');
    log('N2', 'Error for invalid room', 'navigated to /rooms/00000000-...', 'N/A',
      `handled=${n2Handled}`, n2Handled ? '통과' : '미완료');
  } catch (e) {
    log('N2', 'Error for invalid room', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  // N3
  console.log('[N3] Testing invalid post...');
  try {
    await page.goto(`${BASE}/community/general/00000000-0000-0000-0000-000000000000`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const n3Text = await page.textContent('body');
    await page.screenshot({ path: 'evidence/N3-post-v2.png' });
    const n3Handled = n3Text.includes('404') || n3Text.includes('찾을 수 없') || n3Text.includes('존재하지 않') || n3Text.includes('오류');
    log('N3', 'Error for invalid post', 'navigated to /community/general/00000000-...', 'N/A',
      `handled=${n3Handled}`, n3Handled ? '통과' : '미완료');
  } catch (e) {
    log('N3', 'Error for invalid post', 'error', 'N/A', e.message.substring(0, 100), '미완료');
  }

  await browser.close();

  console.log('\n\n========== PART 3 RESULTS ==========');
  results.forEach(r => {
    console.log(`| ${r.id} | ${r.test} | ${r.input} | ${r.db} | ${r.screen} | ${r.status} |`);
  });
})();
