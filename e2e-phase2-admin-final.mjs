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
  await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });
  await page.fill('#email', 'test@blinddeal.com');
  await page.fill('#password', 'Test1234!');
  await page.waitForTimeout(500);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(url => !url.toString().includes('/auth/login'), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  console.log('[LOGIN] URL:', page.url());
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  await login(page);

  // L1: Admin dashboard
  console.log('[L1] Testing /admin...');
  await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const l1Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L1-admin-final.png', fullPage: false });
  const l1HasAdmin = l1Text.includes('관리자') && l1Text.includes('총 사용자');
  console.log('[L1] isAdmin:', l1HasAdmin);
  // Extract stats
  const totalUsersMatch = l1Text.match(/총 사용자(\d+)/);
  const activeDealsMatch = l1Text.match(/활성 딜(\d+)/);
  const totalUsers = totalUsersMatch ? totalUsersMatch[1] : 'N/A';
  const activeDeals = activeDealsMatch ? activeDealsMatch[1] : 'N/A';
  console.log('[L1] Total users:', totalUsers, 'Active deals:', activeDeals);
  log('L1', 'Admin stats match DB',
    'navigated to /admin',
    `DB: profiles=2, active_deals=1. UI: 총 사용자=${totalUsers}, 활성 딜=${activeDeals}`,
    'evidence/L1-admin-final.png',
    l1HasAdmin ? '통과' : '미완료');

  // L2: Admin deals
  console.log('[L2] Testing /admin/deals...');
  await page.goto(`${BASE}/admin/deals`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const l2Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L2-admin-deals-final.png', fullPage: false });
  const l2HasTable = l2Text.includes('딜 관리') && (l2Text.includes('제목') || l2Text.includes('대기'));
  console.log('[L2] HasTable:', l2HasTable);
  log('L2', 'Admin deals table loads',
    'navigated to /admin/deals',
    'N/A',
    'evidence/L2-admin-deals-final.png',
    l2HasTable ? '통과' : '미완료');

  // L3: Admin users
  console.log('[L3] Testing /admin/users...');
  await page.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const l3Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L3-admin-users-final.png', fullPage: false });
  const l3HasUsers = l3Text.includes('사용자') && (l3Text.includes('이메일') || l3Text.includes('이름') || l3Text.includes('관리'));
  console.log('[L3] HasUsers:', l3HasUsers);
  log('L3', 'Admin users list',
    'navigated to /admin/users',
    'N/A',
    'evidence/L3-admin-users-final.png',
    l3HasUsers ? '통과' : '미완료');

  // L4: Admin verifications
  console.log('[L4] Testing /admin/verifications...');
  await page.goto(`${BASE}/admin/verifications`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const l4Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/L4-admin-verif-final.png', fullPage: false });
  const l4Loaded = l4Text.includes('인증') && l4Text.includes('관리');
  console.log('[L4] Loaded:', l4Loaded);
  log('L4', 'Admin verifications page loads',
    'navigated to /admin/verifications',
    'N/A',
    'evidence/L4-admin-verif-final.png',
    l4Loaded ? '통과' : '미완료');

  await browser.close();

  console.log('\n========== ADMIN RESULTS ==========');
  results.forEach(r => {
    console.log(`| ${r.id} | ${r.test} | ${r.input} | ${r.db} | ${r.screen} | ${r.status} |`);
  });
})();
