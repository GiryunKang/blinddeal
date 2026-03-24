import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);

  // Go to landing page - inquiry form is in the premium sections
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Scroll to bottom to find the inquiry form
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  // Look for the inquiry form
  const nameField = page.locator('#inquiry-name, input[name="name"]').first();
  const nameVisible = await nameField.isVisible().catch(() => false);
  console.log('[A9-M] Name field visible:', nameVisible);

  if (!nameVisible) {
    // Try scrolling to the form section specifically
    const formSection = page.locator('form:has(input[name="email"])').first();
    const formExists = await formSection.count();
    console.log('[A9-M] Form exists:', formExists);
    if (formExists > 0) {
      await formSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    } else {
      // Scroll more gradually
      for (let i = 0; i < 10; i++) {
        await page.evaluate((step) => window.scrollTo(0, step * 1000), i);
        await page.waitForTimeout(500);
        const visible = await page.locator('#inquiry-name').isVisible().catch(() => false);
        if (visible) {
          console.log('[A9-M] Found form at scroll step', i);
          break;
        }
      }
    }
  }

  await page.screenshot({ path: 'evidence/A9-M-form-area.png', fullPage: false });

  // Try to fill the form
  let status = '미완료';
  let input = '';
  try {
    const emailField = page.locator('#inquiry-email, input[name="email"]').first();
    await emailField.waitFor({ state: 'visible', timeout: 5000 });

    // Fill required fields
    await page.fill('#inquiry-name', 'E2E모바일');
    await page.fill('#inquiry-email', 'e2emobile@test.com');
    input = 'filled name=E2E모바일, email=e2emobile@test.com';
    console.log('[A9-M] Filled name and email');

    // Fill description (required)
    await page.fill('#inquiry-description', 'E2E 모바일 테스트 문의입니다');
    input += ', description=E2E 모바일 테스트 문의입니다';
    console.log('[A9-M] Filled description');

    await page.screenshot({ path: 'evidence/A9-M-form-filled.png', fullPage: false });

    // Submit
    const submitBtn = page.locator('button[type="submit"]:has-text("문의 보내기")').first();
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    console.log('[A9-M] Clicked submit');
    await page.waitForTimeout(5000);

    const afterText = await page.textContent('body');
    const success = afterText.includes('접수') || afterText.includes('감사') || afterText.includes('success');
    console.log('[A9-M] Success:', success);
    await page.screenshot({ path: 'evidence/A9-M-form-submitted.png', fullPage: false });
    status = success ? 'DB_CHECK' : '미완료';
  } catch (e) {
    console.log('[A9-M] Error:', e.message);
    await page.screenshot({ path: 'evidence/A9-M-error.png', fullPage: true });
  }

  console.log('\n[A9-M] Status:', status, 'Input:', input);

  await browser.close();
})();
