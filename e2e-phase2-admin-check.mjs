import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
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
  console.log('[LOGIN] URL:', page.url());

  // Check cookies
  const cookies = await context.cookies();
  console.log('[COOKIES] Total:', cookies.length);
  for (const c of cookies) {
    if (c.name.includes('supabase') || c.name.includes('auth') || c.name.includes('sb-')) {
      console.log(`  ${c.name}: ${c.value.substring(0, 50)}...`);
    }
  }

  // Go to admin
  await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const finalUrl = page.url();
  console.log('[ADMIN] Final URL:', finalUrl);
  const text = await page.textContent('body');
  console.log('[ADMIN] Text (first 500):', text.substring(0, 500));
  const isAdmin = text.includes('관리자') || text.includes('총 사용자') || text.includes('활성 딜');
  const isHome = text.includes('보이지 않는 곳에서');
  console.log('[ADMIN] isAdmin:', isAdmin, 'isHome:', isHome);
  await page.screenshot({ path: 'evidence/L-admin-check.png', fullPage: false });

  // Also try /admin/deals
  await page.goto(`${BASE}/admin/deals`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  console.log('[ADMIN/DEALS] URL:', page.url());
  const dealsText = await page.textContent('body');
  console.log('[ADMIN/DEALS] Text (first 300):', dealsText.substring(0, 300));
  await page.screenshot({ path: 'evidence/L2-admin-deals-check.png', fullPage: false });

  await browser.close();
})();
