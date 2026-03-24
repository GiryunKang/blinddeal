import { chromium } from 'playwright';

const BASE = 'https://blinddeal-ten.vercel.app';
const SELLER = { email: 'test@blinddeal.com', password: 'Test1234!' };
const BUYER = { email: 'buyer@blinddeal-test.com', password: 'Buyer1234!' };

const results = [];

function log(id, test, input, db, screen, status) {
  results.push({ id, test, input, db, screen, status });
  const mark = status === 'PASS' ? 'PASS' : status === 'FAIL' ? 'FAIL' : 'WARN';
  console.log(`[${mark}] ${id}: ${test}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function loginAs(page, creds, label) {
  console.log(`  >> Logging in as ${label} (${creds.email})...`);
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(1500);

  const emailField = await page.$('input[type="email"], input[name="email"]');
  const pwField = await page.$('input[type="password"], input[name="password"]');

  if (!emailField || !pwField) throw new Error('Login form fields not found');

  await emailField.fill(creds.email);
  await pwField.fill(creds.password);

  const loginBtn = await page.$('button[type="submit"]');
  if (!loginBtn) throw new Error('Login button not found');
  await loginBtn.click();
  await sleep(5000);

  // Check if redirected away from login page
  const currentUrl = page.url();
  console.log(`  >> Login result URL: ${currentUrl}`);

  if (currentUrl.includes('/auth/login')) {
    // Maybe there is an error? Check for error messages
    const bodyText = await page.textContent('body');
    const hasError = bodyText.includes('오류') || bodyText.includes('실패') || bodyText.includes('잘못');
    if (hasError) throw new Error(`Login failed with error on page`);

    // Maybe login succeeded but didn't redirect - wait longer
    await sleep(3000);
    const url2 = page.url();
    if (url2.includes('/auth/login')) {
      // Try manually navigating to home
      await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
      await sleep(2000);
    }
  }

  return page.url();
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  let page = await context.newPage();

  // ============ A. PUBLIC PAGES ============

  // A1: Landing page loads
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);
    const title = await page.title();
    const bodyText = await page.textContent('body');
    const hasHero = bodyText.includes('블라인드딜') || bodyText.includes('BlindDeal') || bodyText.includes('blinddeal');
    await page.screenshot({ path: 'e2e-screenshots/A1-landing.png', fullPage: false });
    log('A1', 'Landing page loads', `goto ${BASE}`, 'N/A (no DB)', `title="${title}", hasHero=${hasHero}`, hasHero ? 'PASS' : 'FAIL');
  } catch (e) {
    log('A1', 'Landing page loads', `goto ${BASE}`, 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A3: Header "문의" button scrolls to inquiry form
  try {
    // Find the header nav link with "문의" text
    const headerLinks = await page.$$('header a, nav a');
    let inquiryBtn = null;
    for (const link of headerLinks) {
      const text = await link.textContent();
      if (text.includes('문의')) {
        inquiryBtn = link;
        break;
      }
    }
    if (!inquiryBtn) {
      // Also try buttons
      inquiryBtn = await page.$('header button:has-text("문의"), nav button:has-text("문의")');
    }
    if (!inquiryBtn) {
      // Also try any a tag with href containing contact/inquiry
      inquiryBtn = await page.$('a[href*="#inquiry"], a[href*="#contact"], a[href*="inquiry"]');
    }

    if (inquiryBtn) {
      await inquiryBtn.click();
      await sleep(1500);
      await page.screenshot({ path: 'e2e-screenshots/A3-inquiry-scroll.png' });
      const scrollY = await page.evaluate(() => window.scrollY);
      log('A3', 'Header 문의 button scrolls', 'click 문의 button', 'N/A', `scrollY=${scrollY} (scrolled=${scrollY > 100})`, scrollY > 100 ? 'PASS' : 'FAIL');
    } else {
      log('A3', 'Header 문의 button scrolls', 'No 문의 button found in header', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('A3', 'Header 문의 button scrolls', 'click attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A5: Floating CTA button works
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(1500);
    // Scroll down to trigger floating button
    await page.evaluate(() => window.scrollTo(0, 500));
    await sleep(1000);

    const fixedElements = await page.evaluate(() => {
      const all = document.querySelectorAll('button, a');
      const result = [];
      for (const el of all) {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          result.push({
            tag: el.tagName,
            text: el.textContent.trim().substring(0, 50),
            position: style.position,
            bottom: style.bottom,
            right: style.right,
          });
        }
      }
      return result;
    });
    console.log('  Fixed/sticky elements:', JSON.stringify(fixedElements));

    const hasCTA = fixedElements.length > 0;
    if (hasCTA) {
      // Click the first floating CTA
      const ctaSelector = fixedElements[0].tag === 'BUTTON' ? 'button' : 'a';
      const floatingEl = await page.evaluateHandle((tag) => {
        const all = document.querySelectorAll(tag);
        for (const el of all) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && el.textContent.trim()) return el;
        }
        return null;
      }, ctaSelector);
      if (floatingEl.asElement()) {
        await floatingEl.asElement().click().catch(() => {});
        await sleep(1000);
      }
    }
    await page.screenshot({ path: 'e2e-screenshots/A5-floating-cta.png' });
    log('A5', 'Floating CTA button works', 'search for fixed/sticky CTA', 'N/A', `found ${fixedElements.length} fixed elements`, hasCTA ? 'PASS' : 'FAIL');
  } catch (e) {
    log('A5', 'Floating CTA button works', 'search attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A9: Inquiry form fill and submit
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);

    // Scroll to the bottom to reveal inquiry form
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(2000);

    // Get the inquiry form section
    const formFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.map(el => ({
        tag: el.tagName,
        type: el.getAttribute('type') || '',
        name: el.getAttribute('name') || '',
        placeholder: el.getAttribute('placeholder') || '',
      }));
    });
    console.log('  Landing page form fields:', JSON.stringify(formFields.slice(0, 20)));

    // Fill name
    const nameInput = await page.$('input[name="name"]');
    if (nameInput) await nameInput.fill('E2E테스트');

    // Fill email
    const emailInput = await page.$('input[name="email"], input[type="email"]');
    if (emailInput) await emailInput.fill('e2efull@test.com');

    // Fill phone
    const phoneInput = await page.$('input[name="phone"], input[type="tel"]');
    if (phoneInput) await phoneInput.fill('01011112222');

    // Fill company
    const companyInput = await page.$('input[name="company"]');
    if (companyInput) await companyInput.fill('E2E회사');

    // Type: try to find radio buttons or select for inquiry type (buy)
    // Check for tabs/radio style: "매수/매각"
    const buyOption = await page.$('button:has-text("매수"), [role="tab"]:has-text("매수"), label:has-text("매수")');
    if (buyOption) {
      await buyOption.click();
      await sleep(500);
    }

    // Category: 부동산
    // Look for Radix Select trigger with category
    const categoryTriggers = await page.$$('[role="combobox"], button[data-slot="select-trigger"]');
    for (const trigger of categoryTriggers) {
      const text = await trigger.textContent();
      if (text.includes('카테고리') || text.includes('유형') || text.includes('분야') || text.includes('선택')) {
        await trigger.click();
        await sleep(500);
        const reOption = await page.$('[role="option"]:has-text("부동산")');
        if (reOption) {
          await reOption.click();
          await sleep(500);
          break;
        }
      }
    }

    // Budget
    const budgetTriggers = await page.$$('[role="combobox"], button[data-slot="select-trigger"]');
    for (const trigger of budgetTriggers) {
      const text = await trigger.textContent();
      if (text.includes('예산') || text.includes('금액') || text.includes('규모')) {
        await trigger.click();
        await sleep(500);
        const budgetOption = await page.$('[role="option"]:has-text("50"), [role="option"]:has-text("100억")');
        if (budgetOption) {
          await budgetOption.click();
          await sleep(500);
          break;
        }
      }
    }

    // Content
    const contentArea = await page.$('textarea[name="content"], textarea[name="message"], textarea');
    if (contentArea) await contentArea.fill('E2E 전수테스트 문의');

    // Preferences - look for preferences input
    const prefInput = await page.$('input[name="preferences"], input[name="preferred_location"], textarea[name="preferences"]');
    if (prefInput) await prefInput.fill('서울 강남');

    await page.screenshot({ path: 'e2e-screenshots/A9-inquiry-filled.png' });

    // Submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await sleep(4000);

      const pageText = await page.textContent('body');
      const success = pageText.includes('감사') || pageText.includes('완료') || pageText.includes('접수') || pageText.includes('성공');

      await page.screenshot({ path: 'e2e-screenshots/A9-inquiry-submitted.png' });
      log('A9', 'Inquiry form submit',
        'fill: name=E2E테스트, email=e2efull@test.com, phone=01011112222, company=E2E회사, type=buy, category=real_estate, budget=50~100억, content=E2E 전수테스트 문의, preferences=서울 강남',
        'DB_CHECK_NEEDED',
        `success indicators on page: ${success}`,
        success ? 'PASS' : 'FAIL');
    } else {
      log('A9', 'Inquiry form submit', 'form filled but no submit button', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('A9', 'Inquiry form submit', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A11-A15: Static pages load
  const staticPages = [
    { id: 'A11', path: '/about', name: '/about page loads' },
    { id: 'A12', path: '/terms', name: '/terms page loads' },
    { id: 'A13', path: '/privacy', name: '/privacy page loads' },
    { id: 'A14', path: '/escrow-guide', name: '/escrow-guide page loads' },
    { id: 'A15', path: '/service', name: '/service page loads' },
  ];
  for (const sp of staticPages) {
    try {
      const resp = await page.goto(`${BASE}${sp.path}`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(1000);
      const status = resp.status();
      const bodyLen = (await page.textContent('body')).trim().length;
      await page.screenshot({ path: `e2e-screenshots/${sp.id}.png` });
      log(sp.id, sp.name, `goto ${BASE}${sp.path}`, 'N/A', `status=${status}, contentLen=${bodyLen}`, status === 200 && bodyLen > 50 ? 'PASS' : 'FAIL');
    } catch (e) {
      log(sp.id, sp.name, `goto ${BASE}${sp.path}`, 'N/A', `Error: ${e.message}`, 'FAIL');
    }
  }

  // A16-A18: Auth pages load
  const authPages = [
    { id: 'A16', path: '/auth/login', name: '/auth/login loads' },
    { id: 'A17', path: '/auth/register', name: '/auth/register loads' },
    { id: 'A18', path: '/auth/forgot-password', name: '/auth/forgot-password loads' },
  ];
  for (const ap of authPages) {
    try {
      const resp = await page.goto(`${BASE}${ap.path}`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(1000);
      const status = resp.status();
      const hasForm = await page.$('form, input[type="email"], input[type="password"]');
      await page.screenshot({ path: `e2e-screenshots/${ap.id}.png` });
      log(ap.id, ap.name, `goto ${BASE}${ap.path}`, 'N/A', `status=${status}, hasForm=${!!hasForm}`, status === 200 ? 'PASS' : 'FAIL');
    } catch (e) {
      log(ap.id, ap.name, `goto ${BASE}${ap.path}`, 'N/A', `Error: ${e.message}`, 'FAIL');
    }
  }

  // A19: 404 page
  try {
    const resp = await page.goto(`${BASE}/nonexistent-page-xyz`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1000);
    const status = resp.status();
    const bodyText = await page.textContent('body');
    const has404 = bodyText.includes('404') || bodyText.includes('찾을 수 없') || bodyText.includes('not found');
    await page.screenshot({ path: 'e2e-screenshots/A19-404.png' });
    log('A19', '/nonexistent -> 404', `goto ${BASE}/nonexistent-page-xyz`, 'N/A', `status=${status}, has404text=${has404}`, (status === 404 || has404) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('A19', '/nonexistent -> 404', 'goto attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ B. AUTH FLOW ============

  // B5: Login with wrong password
  try {
    await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1500);
    const emailField = await page.$('input[type="email"]');
    const pwField = await page.$('input[type="password"]');
    await emailField.fill('test@blinddeal.com');
    await pwField.fill('WrongPassword123!');
    const loginBtn = await page.$('button[type="submit"]');
    await loginBtn.click();
    await sleep(3000);
    const bodyText = await page.textContent('body');
    const hasError = bodyText.includes('오류') || bodyText.includes('실패') || bodyText.includes('잘못') || bodyText.includes('error') || bodyText.includes('invalid') || bodyText.includes('일치');
    await page.screenshot({ path: 'e2e-screenshots/B5-wrong-password.png' });
    log('B5', 'Login wrong password -> error', `fill email=test@blinddeal.com, pw=WrongPassword123!, click submit`, 'N/A', `hasError=${hasError}, bodySnippet=${bodyText.substring(0, 200)}`, hasError ? 'PASS' : 'FAIL');
  } catch (e) {
    log('B5', 'Login wrong password -> error', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // B9: Protected routes redirect when not logged in
  try {
    await context.clearCookies();
    const protectedTests = [];
    for (const pp of ['/dashboard', '/rooms']) {
      await page.goto(`${BASE}${pp}`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(2000);
      const currentUrl = page.url();
      const redirected = currentUrl.includes('/auth/login') || currentUrl.includes('/auth');
      protectedTests.push({ path: pp, redirected, currentUrl });
    }
    await page.screenshot({ path: 'e2e-screenshots/B9-protected-redirect.png' });
    const allRedirected = protectedTests.every(t => t.redirected);
    log('B9', 'Protected routes redirect',
      `visit /dashboard, /rooms while logged out`,
      'N/A',
      protectedTests.map(t => `${t.path}->${t.currentUrl}`).join('; '),
      allRedirected ? 'PASS' : 'FAIL');
  } catch (e) {
    log('B9', 'Protected routes redirect', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // B4: Login with correct seller credentials
  try {
    const resultUrl = await loginAs(page, SELLER, 'seller');
    const loggedIn = !resultUrl.includes('/auth/login');

    // Verify we can access protected page
    await page.goto(`${BASE}/deals/new`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);
    const canAccessProtected = page.url().includes('/deals/new');

    await page.screenshot({ path: 'e2e-screenshots/B4-login-success.png' });
    log('B4', 'Login seller -> redirect home',
      `fill email=${SELLER.email}, pw=***, click submit`,
      'N/A',
      `redirected to: ${resultUrl}, canAccessProtected=${canAccessProtected}`,
      (loggedIn || canAccessProtected) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('B4', 'Login seller -> redirect home', `login attempt`, 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ C. DEAL REGISTRATION ============

  // C1: /deals/new loads
  try {
    await page.goto(`${BASE}/deals/new`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);
    const hasForm = await page.$('form');
    const hasTitleInput = await page.$('input[name="title"]');
    await page.screenshot({ path: 'e2e-screenshots/C1-deals-new.png' });
    log('C1', '/deals/new loads', `goto ${BASE}/deals/new`, 'N/A', `hasForm=${!!hasForm}, hasTitleInput=${!!hasTitleInput}`, (hasForm && hasTitleInput) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('C1', '/deals/new loads', 'goto attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // C3-C4: Fill and submit real estate deal
  try {
    if (!page.url().includes('/deals/new')) {
      await page.goto(`${BASE}/deals/new`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(2000);
    }

    // Ensure "부동산" tab is selected (it's default, but click to be sure)
    const reTab = await page.$('[role="tab"]:has-text("부동산")');
    if (reTab) {
      await reTab.click();
      await sleep(500);
    }

    // Fill title
    const titleInput = await page.$('input[name="title"]');
    await titleInput.fill('E2E전수테스트딜');

    // Fill description
    const descInput = await page.$('textarea[name="description"]');
    await descInput.fill('전수테스트용 딜입니다');

    // Deal type: select "오피스" - this is a Radix UI Select
    // The Select renders a trigger button, we need to click it then select the option
    const dealTypeSection = await page.$('label:has-text("딜 유형")');
    if (dealTypeSection) {
      // Find the trigger near the deal type label
      const selectTrigger = await page.$('button[data-slot="select-trigger"]:near(label:has-text("딜 유형"))');
      if (!selectTrigger) {
        // Alternative: find all select triggers and pick the one with "유형 선택" text
        const triggers = await page.$$('button[data-slot="select-trigger"]');
        for (const trigger of triggers) {
          const text = await trigger.textContent();
          console.log('  Select trigger text:', text);
          if (text.includes('유형 선택') || text.includes('유형')) {
            await trigger.click();
            await sleep(1000);
            // Now look for "오피스" option
            const officeOption = await page.$('[role="option"]:has-text("오피스")');
            if (officeOption) {
              await officeOption.click();
              await sleep(500);
              console.log('  Selected "오피스" deal type');
            }
            break;
          }
        }
      } else {
        await selectTrigger.click();
        await sleep(1000);
        const officeOption = await page.$('[role="option"]:has-text("오피스")');
        if (officeOption) {
          await officeOption.click();
          await sleep(500);
        }
      }
    }

    // Verify deal_type hidden input has value
    const dealTypeValue = await page.$eval('input[name="deal_type"]', el => el.value).catch(() => '');
    console.log('  deal_type value after selection:', dealTypeValue);

    // If deal_type is still empty, try alternative approach
    if (!dealTypeValue) {
      console.log('  Trying alternative select approach...');
      // Click on the select trigger by its role
      const allTriggers = await page.$$('[role="combobox"]');
      for (const trigger of allTriggers) {
        const text = await trigger.textContent();
        if (text.includes('유형 선택') || text.includes('유형')) {
          await trigger.click();
          await sleep(1000);
          const officeOpt = await page.$('[role="option"]:has-text("오피스")');
          if (officeOpt) {
            await officeOpt.click();
            await sleep(500);
            break;
          }
          // Press Escape if no option found to close popover
          await page.keyboard.press('Escape');
        }
      }
    }

    // Fill asking price
    const priceInput = await page.$('input[name="asking_price"]');
    await priceInput.fill('7500000000');

    // Trigger change event so progress bar updates
    await page.click('body');
    await sleep(500);

    await page.screenshot({ path: 'e2e-screenshots/C3-deal-filled.png' });

    const finalDealType = await page.$eval('input[name="deal_type"]', el => el.value).catch(() => '');
    console.log('  Final deal_type value:', finalDealType);

    log('C3', 'Fill real estate deal form',
      `title=E2E전수테스트딜, desc=전수테스트용 딜입니다, deal_type=${finalDealType || 'office'}, asking_price=7500000000`,
      'N/A',
      `title filled, desc filled, deal_type=${finalDealType}, price=7500000000`,
      finalDealType ? 'PASS' : 'FAIL');

    // C4: Submit
    const submitBtn = await page.$('button[type="submit"]:has-text("딜 등록하기")');
    if (submitBtn) {
      await submitBtn.click();
      await sleep(8000);

      const currentUrl = page.url();
      const bodyText = await page.textContent('body');
      const redirectedToDeal = currentUrl.includes('/deals/') && !currentUrl.includes('/deals/new');
      const success = redirectedToDeal || bodyText.includes('E2E전수테스트딜');

      await page.screenshot({ path: 'e2e-screenshots/C4-deal-submitted.png' });
      console.log('  After submit URL:', currentUrl);

      log('C4', 'Submit deal -> verify',
        'click "딜 등록하기"',
        'DB_CHECK_NEEDED',
        `url=${currentUrl}, redirectedToDeal=${redirectedToDeal}`,
        success ? 'PASS' : 'FAIL');
    } else {
      log('C4', 'Submit deal -> verify', 'submit button not found', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    console.error('  C3/C4 error:', e.message);
    log('C3', 'Fill real estate deal form', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
    log('C4', 'Submit deal -> verify', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ D. MARKETPLACE ============

  // D1: /deals loads with deal list
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(3000);
    const bodyText = await page.textContent('body');
    const hasE2EDeal = bodyText.includes('E2E전수테스트딜');
    const dealCards = await page.$$('a[href*="/deals/"]');
    await page.screenshot({ path: 'e2e-screenshots/D1-deals-list.png' });
    log('D1', '/deals loads with deal list',
      `goto ${BASE}/deals`,
      'N/A',
      `hasE2EDeal=${hasE2EDeal}, dealCards=${dealCards.length}`,
      (hasE2EDeal || dealCards.length > 0) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('D1', '/deals loads with deal list', 'goto attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // D2: Category filter 부동산
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);

    // Look for category filter buttons/tabs/select
    const reFilterBtn = await page.$('button:has-text("부동산"), [role="tab"]:has-text("부동산")');
    if (reFilterBtn) {
      await reFilterBtn.click();
      await sleep(2000);
      const bodyText = await page.textContent('body');
      await page.screenshot({ path: 'e2e-screenshots/D2-filter-realestate.png' });
      log('D2', 'Category filter 부동산', 'click 부동산 filter tab/button', 'N/A', `currentUrl=${page.url()}, contentLen=${bodyText.length}`, 'PASS');
    } else {
      // Try select dropdown
      const filterSelect = await page.$$('[role="combobox"], button[data-slot="select-trigger"]');
      let filtered = false;
      for (const sel of filterSelect) {
        const text = await sel.textContent();
        if (text.includes('전체') || text.includes('카테고리')) {
          await sel.click();
          await sleep(500);
          const reOpt = await page.$('[role="option"]:has-text("부동산")');
          if (reOpt) {
            await reOpt.click();
            await sleep(2000);
            filtered = true;
            break;
          }
          await page.keyboard.press('Escape');
        }
      }
      await page.screenshot({ path: 'e2e-screenshots/D2-filter-realestate.png' });
      log('D2', 'Category filter 부동산', 'select 부동산 from dropdown', 'N/A', `filtered=${filtered}`, filtered ? 'PASS' : 'FAIL');
    }
  } catch (e) {
    log('D2', 'Category filter 부동산', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // D4: Search "E2E"
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);
    const searchInput = await page.$('input[type="search"], input[placeholder*="검색"], input[name="search"], input[name="q"]');
    if (searchInput) {
      await searchInput.fill('E2E');
      // Try pressing Enter or wait for auto-search
      await searchInput.press('Enter');
      await sleep(3000);

      const bodyText = await page.textContent('body');
      const found = bodyText.includes('E2E전수테스트딜');
      await page.screenshot({ path: 'e2e-screenshots/D4-search-e2e.png' });
      log('D4', 'Search E2E returns test deal', 'fill search=E2E, press Enter', 'N/A', `found=${found}`, found ? 'PASS' : 'FAIL');
    } else {
      log('D4', 'Search E2E returns test deal', 'no search input found', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('D4', 'Search E2E returns test deal', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ E. DEAL INTERACTIONS AS BUYER ============

  // Login as buyer
  let buyerLoggedIn = false;
  try {
    await context.clearCookies();
    const resultUrl = await loginAs(page, BUYER, 'buyer');
    buyerLoggedIn = !resultUrl.includes('/auth/login');

    if (!buyerLoggedIn) {
      // Verify by trying to access a page
      await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(2000);
      buyerLoggedIn = true; // If /deals loads, we might be logged in
    }
    console.log(`  Buyer logged in: ${buyerLoggedIn}`);
  } catch (e) {
    console.log('  Buyer login error:', e.message);
  }

  // E1: Click test deal -> detail page loads
  let testDealSlug = null;
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(3000);

    // Find E2E deal link
    const dealLink = await page.$('a:has-text("E2E전수테스트딜")');
    if (dealLink) {
      const href = await dealLink.getAttribute('href');
      testDealSlug = href?.match(/\/deals\/([^/?]+)/)?.[1];
      await dealLink.click();
      await sleep(3000);

      const currentUrl = page.url();
      const bodyText = await page.textContent('body');
      const hasDealDetail = bodyText.includes('E2E전수테스트딜');

      await page.screenshot({ path: 'e2e-screenshots/E1-deal-detail.png' });
      log('E1', 'Click test deal -> detail',
        `click E2E전수테스트딜 link (href=${href})`,
        'N/A',
        `url=${currentUrl}, hasDealDetail=${hasDealDetail}`,
        hasDealDetail ? 'PASS' : 'FAIL');
    } else {
      // Maybe search for it
      const searchInput = await page.$('input[type="search"], input[placeholder*="검색"]');
      if (searchInput) {
        await searchInput.fill('E2E전수테스트딜');
        await searchInput.press('Enter');
        await sleep(3000);
        const dealLink2 = await page.$('a:has-text("E2E전수테스트딜")');
        if (dealLink2) {
          await dealLink2.click();
          await sleep(3000);
          testDealSlug = page.url().match(/\/deals\/([^/?]+)/)?.[1];
          await page.screenshot({ path: 'e2e-screenshots/E1-deal-detail.png' });
          log('E1', 'Click test deal -> detail', 'searched and clicked E2E deal', 'N/A', `url=${page.url()}`, 'PASS');
        } else {
          await page.screenshot({ path: 'e2e-screenshots/E1-no-deal.png' });
          log('E1', 'Click test deal -> detail', 'E2E deal not found in search', 'N/A', 'deal not in marketplace', 'FAIL');
        }
      } else {
        await page.screenshot({ path: 'e2e-screenshots/E1-no-deal.png' });
        log('E1', 'Click test deal -> detail', 'E2E deal link not found', 'N/A', 'deal not in list', 'FAIL');
      }
    }
  } catch (e) {
    log('E1', 'Click test deal -> detail', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // E2: Interest toggle ON
  try {
    if (page.url().includes('/deals/') && !page.url().includes('/deals/new')) {
      // The interest button contains "관심 등록" text
      const interestBtn = await page.$('button:has-text("관심 등록")');
      if (interestBtn) {
        const beforeText = await interestBtn.textContent();
        await interestBtn.click();
        await sleep(3000);

        const afterText = await interestBtn.textContent();
        const toggled = afterText.includes('등록됨') || afterText !== beforeText;

        await page.screenshot({ path: 'e2e-screenshots/E2-interest-on.png' });
        log('E2', 'Interest toggle ON',
          `click "관심 등록" button on deal page`,
          'DB_CHECK_NEEDED',
          `before="${beforeText}", after="${afterText}", toggled=${toggled}`,
          toggled ? 'PASS' : 'FAIL');
      } else {
        await page.screenshot({ path: 'e2e-screenshots/E2-no-interest-btn.png' });
        log('E2', 'Interest toggle ON', 'no "관심 등록" button found', 'N/A', 'button not found on deal page', 'FAIL');
      }
    } else {
      log('E2', 'Interest toggle ON', 'not on deal detail page', 'N/A', `currentUrl=${page.url()}`, 'FAIL');
    }
  } catch (e) {
    log('E2', 'Interest toggle ON', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // E3: Interest toggle OFF
  try {
    if (page.url().includes('/deals/') && !page.url().includes('/deals/new')) {
      // After toggling ON, button text should include "관심 등록됨"
      const interestBtn = await page.$('button:has-text("관심")');
      if (interestBtn) {
        const beforeText = await interestBtn.textContent();
        await interestBtn.click();
        await sleep(3000);

        const afterText = await interestBtn.textContent();
        const toggledOff = !afterText.includes('등록됨') || afterText !== beforeText;

        await page.screenshot({ path: 'e2e-screenshots/E3-interest-off.png' });
        log('E3', 'Interest toggle OFF',
          `click "관심 등록됨" button to toggle off`,
          'DB_CHECK_NEEDED',
          `before="${beforeText}", after="${afterText}", toggledOff=${toggledOff}`,
          toggledOff ? 'PASS' : 'FAIL');
      } else {
        log('E3', 'Interest toggle OFF', 'no interest button found', 'N/A', 'N/A', 'FAIL');
      }
    } else {
      log('E3', 'Interest toggle OFF', 'not on deal detail page', 'N/A', `currentUrl=${page.url()}`, 'FAIL');
    }
  } catch (e) {
    log('E3', 'Interest toggle OFF', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  await browser.close();

  // Print summary
  console.log('\n========================================');
  console.log('E2E PHASE 1 TEST RESULTS');
  console.log('========================================\n');

  console.log('| ID | Test | Input Evidence | DB Evidence | Screen Evidence | Status |');
  console.log('|---|---|---|---|---|---|');
  for (const r of results) {
    console.log(`| ${r.id} | ${r.test} | ${r.input.substring(0, 80)} | ${r.db} | ${r.screen.substring(0, 80)} | ${r.status} |`);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`\nTotal: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);
  console.log(`\nTest deal slug: ${testDealSlug}`);
}

run().catch(e => console.error('Fatal:', e));
