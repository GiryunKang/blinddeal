import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log('[DEBUG] Loading login page...');
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'evidence/debug-login.png', fullPage: true });

  const bodyHTML = await page.innerHTML('body');
  console.log('[DEBUG] Login page HTML (first 3000 chars):');
  console.log(bodyHTML.substring(0, 3000));

  // Check all form elements
  const inputs = await page.locator('input').all();
  console.log('\n[DEBUG] All inputs:', inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    const attrs = await inputs[i].evaluate(el => {
      return {
        type: el.type, name: el.name, id: el.id,
        placeholder: el.placeholder, className: el.className.substring(0, 50)
      };
    });
    console.log(`  Input ${i}:`, JSON.stringify(attrs));
  }

  const buttons = await page.locator('button').all();
  console.log('\n[DEBUG] All buttons:', buttons.length);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent().catch(() => '');
    const type = await buttons[i].getAttribute('type').catch(() => '');
    console.log(`  Button ${i}: type=${type}, text=${text.trim().substring(0, 50)}`);
  }

  await browser.close();
})();
