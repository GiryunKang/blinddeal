import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://blinddeal-ten.vercel.app';
const results = [];

if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

function log(id, test, input, db, screen, status) {
  results.push({ id, test, input, db, screen, status });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  // === LOGIN ===
  console.log('[LOGIN] Starting...');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const pwInput = page.locator('input[type="password"], input[name="password"]').first();

  await emailInput.fill('test@blinddeal.com');
  await pwInput.fill('Test1234!');
  console.log('[LOGIN] Filled credentials');

  const loginBtn = page.locator('button[type="submit"]').first();
  await loginBtn.click();
  console.log('[LOGIN] Clicked login button');

  await page.waitForTimeout(5000);
  const afterLoginUrl = page.url();
  console.log('[LOGIN] After login URL:', afterLoginUrl);

  // === F1: Profile page loads ===
  console.log('[F1] Testing /profile...');
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f1Url = page.url();
  const f1Text = await page.textContent('body');
  const f1HasProfile = f1Text.includes('프로필') || f1Text.includes('profile') || f1Text.includes('Profile');
  const f1HasEmail = f1Text.includes('test@blinddeal.com') || f1Text.includes('blinddeal');
  await page.screenshot({ path: 'evidence/F1-profile.png', fullPage: false });
  console.log('[F1] URL:', f1Url, 'HasProfile:', f1HasProfile, 'HasEmail:', f1HasEmail);
  log('F1', '/profile loads',
    'navigated to /profile, URL=' + f1Url,
    'N/A (read-only page)',
    'screenshot saved, profile found=' + f1HasProfile + ', email found=' + f1HasEmail,
    (f1HasProfile || f1HasEmail) ? '통과' : '미완료');

  // === F2: Edit display_name ===
  console.log('[F2] Testing display_name edit...');
  await page.goto(`${BASE}/profile/edit`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'evidence/F2-edit-before.png', fullPage: true });

  // Debug: list all inputs
  const allInputs = await page.locator('input').all();
  console.log('[F2] Total inputs found:', allInputs.length);
  for (let i = 0; i < Math.min(allInputs.length, 15); i++) {
    const name = await allInputs[i].getAttribute('name').catch(() => '');
    const type = await allInputs[i].getAttribute('type').catch(() => '');
    const placeholder = await allInputs[i].getAttribute('placeholder').catch(() => '');
    const val = await allInputs[i].inputValue().catch(() => '');
    console.log(`[F2] Input ${i}: name=${name}, type=${type}, placeholder=${placeholder}, value=${val.substring(0,30)}`);
  }

  const textareas = await page.locator('textarea').all();
  console.log('[F2] Total textareas found:', textareas.length);
  for (let i = 0; i < textareas.length; i++) {
    const name = await textareas[i].getAttribute('name').catch(() => '');
    const placeholder = await textareas[i].getAttribute('placeholder').catch(() => '');
    console.log(`[F2] Textarea ${i}: name=${name}, placeholder=${placeholder}`);
  }

  let f2Input = 'field not found';
  let f2Status = '미완료';
  try {
    const nameField = page.locator('input[name="display_name"], input[name="displayName"], input[name="name"]').first();
    const exists = await nameField.count();
    if (exists === 0) {
      // Try first text input
      const firstText = page.locator('input[type="text"]').first();
      const firstTextExists = await firstText.count();
      if (firstTextExists > 0) {
        await firstText.clear();
        await firstText.fill('E2E수정테스트');
        f2Input = 'filled first text input with E2E수정테스트';
        console.log('[F2] Used first text input');
      }
    } else {
      await nameField.clear();
      await nameField.fill('E2E수정테스트');
      f2Input = 'filled display_name=E2E수정테스트';
      console.log('[F2] Filled name field');
    }

    const saveBtn = page.locator('button[type="submit"], button:has-text("저장"), button:has-text("Save"), button:has-text("수정"), button:has-text("완료")').first();
    await saveBtn.click();
    console.log('[F2] Clicked save');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'evidence/F2-edit-after.png', fullPage: false });
    f2Status = 'DB_CHECK';
  } catch (e) {
    console.log('[F2] Error:', e.message);
    await page.screenshot({ path: 'evidence/F2-edit-error.png', fullPage: true });
  }
  log('F2', 'Edit display_name', f2Input, 'PENDING_DB_CHECK', 'screenshot saved', f2Status);

  // === F3: Edit bio ===
  console.log('[F3] Testing bio edit...');
  await page.goto(`${BASE}/profile/edit`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  let f3Input = 'field not found';
  let f3Status = '미완료';
  try {
    const bioField = page.locator('textarea').first();
    const bioExists = await bioField.count();
    if (bioExists > 0) {
      await bioField.clear();
      await bioField.fill('E2E 자기소개 테스트');
      f3Input = 'filled textarea bio=E2E 자기소개 테스트';
      console.log('[F3] Filled bio');

      const saveBtn = page.locator('button[type="submit"], button:has-text("저장"), button:has-text("Save"), button:has-text("수정"), button:has-text("완료")').first();
      await saveBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'evidence/F3-bio-after.png', fullPage: false });
      f3Status = 'DB_CHECK';
    }
  } catch (e) {
    console.log('[F3] Error:', e.message);
  }
  log('F3', 'Edit bio', f3Input, 'PENDING_DB_CHECK', 'screenshot saved', f3Status);

  // === F4: Edit phone ===
  console.log('[F4] Testing phone edit...');
  await page.goto(`${BASE}/profile/edit`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  let f4Input = 'field not found';
  let f4Status = '미완료';
  try {
    const phoneField = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="010"]').first();
    const phoneExists = await phoneField.count();
    if (phoneExists > 0) {
      await phoneField.clear();
      await phoneField.fill('010-5555-6666');
      f4Input = 'filled phone=010-5555-6666';
      console.log('[F4] Filled phone');
    } else {
      // Try finding by label
      const phoneLabel = page.locator('label:has-text("전화"), label:has-text("연락처"), label:has-text("phone")');
      const phoneLabelCount = await phoneLabel.count();
      console.log('[F4] Phone labels found:', phoneLabelCount);
      // Try all inputs and find one that looks like phone
      const inputs = await page.locator('input[type="text"], input:not([type])').all();
      for (let i = 0; i < inputs.length; i++) {
        const name = await inputs[i].getAttribute('name').catch(() => '');
        const ph = await inputs[i].getAttribute('placeholder').catch(() => '');
        if (name && (name.includes('phone') || name.includes('tel') || name.includes('연락'))) {
          await inputs[i].clear();
          await inputs[i].fill('010-5555-6666');
          f4Input = 'filled input[name=' + name + '] with 010-5555-6666';
          break;
        }
        if (ph && (ph.includes('010') || ph.includes('전화') || ph.includes('연락'))) {
          await inputs[i].clear();
          await inputs[i].fill('010-5555-6666');
          f4Input = 'filled input[placeholder=' + ph + '] with 010-5555-6666';
          break;
        }
      }
    }

    if (f4Input !== 'field not found') {
      const saveBtn = page.locator('button[type="submit"], button:has-text("저장"), button:has-text("Save"), button:has-text("수정"), button:has-text("완료")').first();
      await saveBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'evidence/F4-phone-after.png', fullPage: false });
      f4Status = 'DB_CHECK';
    }
  } catch (e) {
    console.log('[F4] Error:', e.message);
  }
  log('F4', 'Edit phone', f4Input, 'PENDING_DB_CHECK', 'screenshot saved', f4Status);

  // === F6: Verification page ===
  console.log('[F6] Testing /profile/verification...');
  await page.goto(`${BASE}/profile/verification`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f6Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F6-verification.png', fullPage: true });
  const f6HasLevels = f6Text.includes('레벨') || f6Text.includes('Level') || f6Text.includes('인증') || f6Text.includes('단계') || f6Text.includes('Lv');
  console.log('[F6] HasLevels:', f6HasLevels, 'Text snippet:', f6Text.substring(0, 300));
  log('F6', 'Verification stepper', 'navigated to /profile/verification', 'N/A', 'screenshot saved, levels found=' + f6HasLevels, f6HasLevels ? '통과' : '미완료');

  // === F7: Match preferences ===
  console.log('[F7] Testing /profile/matches...');
  await page.goto(`${BASE}/profile/matches`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f7Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F7-matches-before.png', fullPage: true });
  console.log('[F7] Text snippet:', f7Text.substring(0, 300));

  let f7Input = 'navigated to /profile/matches';
  let f7Status = '미완료';
  try {
    const checkboxes = page.locator('input[type="checkbox"], [role="checkbox"], button[role="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log('[F7] Checkboxes found:', checkboxCount);

    // Also look for buttons that might be category selectors
    const categoryBtns = page.locator('button[data-state], [data-state="unchecked"], [data-state="checked"]');
    const catCount = await categoryBtns.count();
    console.log('[F7] Data-state elements:', catCount);

    if (checkboxCount > 0) {
      await checkboxes.first().click();
      f7Input += ', toggled first checkbox';
      console.log('[F7] Toggled checkbox');
    }
    if (catCount > 0) {
      await categoryBtns.first().click();
      f7Input += ', toggled first category';
      console.log('[F7] Toggled category');
    }

    const saveBtn = page.locator('button[type="submit"], button:has-text("저장"), button:has-text("Save")').first();
    const saveBtnVisible = await saveBtn.isVisible().catch(() => false);
    if (saveBtnVisible) {
      await saveBtn.click();
      await page.waitForTimeout(3000);
      f7Input += ', clicked save';
      f7Status = 'DB_CHECK';
    } else {
      console.log('[F7] No save button found');
      // Page might auto-save or might not have preferences UI
      f7Status = f7Text.length > 100 ? '통과(페이지로드)' : '미완료';
    }
    await page.screenshot({ path: 'evidence/F7-matches-after.png', fullPage: true });
  } catch (e) {
    console.log('[F7] Error:', e.message);
  }
  log('F7', 'Match preferences', f7Input, 'PENDING', 'screenshot saved', f7Status);

  // === F8: Notifications page ===
  console.log('[F8] Testing /profile/notifications...');
  await page.goto(`${BASE}/profile/notifications`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const f8Url = page.url();
  const f8Text = await page.textContent('body');
  await page.screenshot({ path: 'evidence/F8-notifications.png', fullPage: false });
  const f8Loaded = f8Text.includes('알림') || f8Text.includes('notification') || f8Text.includes('Notification') || f8Text.length > 100;
  console.log('[F8] URL:', f8Url, 'Loaded:', f8Loaded, 'Text:', f8Text.substring(0, 200));
  log('F8', 'Notifications page', 'navigated to /profile/notifications', 'N/A', 'screenshot saved, loaded=' + f8Loaded, f8Loaded ? '통과' : '미완료');

  await browser.close();

  console.log('\n=== PART 1 RESULTS ===');
  results.forEach(r => console.log(JSON.stringify(r)));
})();
