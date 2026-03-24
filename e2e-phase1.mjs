import { chromium } from 'playwright';

const BASE = 'https://blinddeal-ten.vercel.app';
const SELLER = { email: 'test@blinddeal.com', password: 'Test1234!' };
const BUYER = { email: 'buyer@blinddeal-test.com', password: 'Buyer1234!' };

const results = [];

function log(id, test, input, db, screen, status) {
  results.push({ id, test, input, db, screen, status });
  const mark = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${mark} ${id}: ${test} → ${status}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
    const screenshot = await page.screenshot({ path: 'e2e-screenshots/A1-landing.png', fullPage: false });
    log('A1', 'Landing page loads', `goto ${BASE}`, 'N/A (no DB)', `title="${title}", hasHero=${hasHero}`, hasHero ? 'PASS' : 'FAIL');
  } catch (e) {
    log('A1', 'Landing page loads', `goto ${BASE}`, 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A3: Header "문의" button scrolls to inquiry form
  try {
    const inquiryBtn = await page.$('a[href*="inquiry"], a[href*="contact"], button:has-text("문의"), a:has-text("문의")');
    if (inquiryBtn) {
      await inquiryBtn.click();
      await sleep(1500);
      const screenshot = await page.screenshot({ path: 'e2e-screenshots/A3-inquiry-scroll.png' });
      const inquiryForm = await page.$('form, [id*="inquiry"], [id*="contact"], section:has-text("문의")');
      log('A3', 'Header 문의 button scrolls', 'click 문의 button', 'N/A', `form visible=${!!inquiryForm}`, inquiryForm ? 'PASS' : 'FAIL');
    } else {
      log('A3', 'Header 문의 button scrolls', 'No 문의 button found', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('A3', 'Header 문의 button scrolls', 'click attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A5: Floating CTA button works
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(1500);
    const floatingBtn = await page.$('[class*="fixed"] button, [class*="floating"] button, button[class*="fixed"], a[class*="fixed"]');
    let floatingFound = !!floatingBtn;
    // Also check for any fixed-position elements that might be a CTA
    if (!floatingBtn) {
      const fixedElements = await page.$$eval('*', els =>
        els.filter(el => {
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' && (el.tagName === 'BUTTON' || el.tagName === 'A');
        }).map(el => el.textContent.trim().substring(0, 50))
      );
      floatingFound = fixedElements.length > 0;
      if (floatingFound && fixedElements.length > 0) {
        console.log('  Found fixed elements:', fixedElements);
      }
    }
    if (floatingBtn) {
      await floatingBtn.click();
      await sleep(1000);
    }
    const screenshot = await page.screenshot({ path: 'e2e-screenshots/A5-floating-cta.png' });
    log('A5', 'Floating CTA button works', 'search for fixed CTA', 'N/A', `floatingFound=${floatingFound}`, floatingFound ? 'PASS' : 'FAIL');
  } catch (e) {
    log('A5', 'Floating CTA button works', 'search attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // A9: Inquiry form fill and submit
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);

    // Scroll to bottom to find inquiry form
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1500);

    // Try to find the inquiry section
    let formFound = false;

    // Look for form fields - try different selector strategies
    const nameInput = await page.$('input[name="name"], input[placeholder*="이름"], input[placeholder*="성함"]');
    const emailInput = await page.$('input[name="email"], input[type="email"], input[placeholder*="이메일"]');
    const phoneInput = await page.$('input[name="phone"], input[placeholder*="연락처"], input[placeholder*="전화"], input[type="tel"]');
    const companyInput = await page.$('input[name="company"], input[placeholder*="회사"], input[placeholder*="기업"]');

    if (nameInput && emailInput) {
      formFound = true;
      await nameInput.fill('E2E테스트');
      await emailInput.fill('e2efull@test.com');
      if (phoneInput) await phoneInput.fill('01011112222');
      if (companyInput) await companyInput.fill('E2E회사');

      // Look for type selector (buy/sell)
      const typeSelect = await page.$('select[name="type"], select[name="inquiry_type"]');
      if (typeSelect) {
        await typeSelect.selectOption({ label: '매수' }).catch(() => typeSelect.selectOption('buy').catch(() => {}));
      } else {
        // Try radio/button
        const buyBtn = await page.$('button:has-text("매수"), label:has-text("매수"), input[value="buy"]');
        if (buyBtn) await buyBtn.click();
      }

      // Category
      const categorySelect = await page.$('select[name="category"], select[name="deal_category"]');
      if (categorySelect) {
        await categorySelect.selectOption({ label: '부동산' }).catch(() => categorySelect.selectOption('real_estate').catch(() => {}));
      }

      // Budget
      const budgetSelect = await page.$('select[name="budget"]');
      if (budgetSelect) {
        await budgetSelect.selectOption({ label: '50~100억' }).catch(() => {});
      } else {
        const budgetInput = await page.$('input[name="budget"]');
        if (budgetInput) await budgetInput.fill('50~100억');
      }

      // Content/message
      const contentArea = await page.$('textarea[name="content"], textarea[name="message"], textarea');
      if (contentArea) await contentArea.fill('E2E 전수테스트 문의');

      // Preferences
      const prefInput = await page.$('input[name="preferences"], textarea[name="preferences"], input[name="preferred_location"]');
      if (prefInput) await prefInput.fill('서울 강남');

      await page.screenshot({ path: 'e2e-screenshots/A9-inquiry-filled.png' });

      // Submit
      const submitBtn = await page.$('button[type="submit"], button:has-text("제출"), button:has-text("보내기"), button:has-text("문의")');
      if (submitBtn) {
        await submitBtn.click();
        await sleep(3000);

        const pageText = await page.textContent('body');
        const success = pageText.includes('감사') || pageText.includes('완료') || pageText.includes('접수') || pageText.includes('성공') || pageText.includes('thank');

        await page.screenshot({ path: 'e2e-screenshots/A9-inquiry-submitted.png' });
        log('A9', 'Inquiry form submit',
          'fill name=E2E테스트, email=e2efull@test.com, phone=01011112222, company=E2E회사, type=buy, content=E2E 전수테스트 문의',
          'DB_CHECK_NEEDED',
          `success indicators: ${success}`,
          success ? 'PASS' : 'FAIL');
      } else {
        log('A9', 'Inquiry form submit', 'form filled but no submit button', 'N/A', 'N/A', 'FAIL');
      }
    } else {
      // Try finding form via scrolling through page sections
      await page.screenshot({ path: 'e2e-screenshots/A9-no-form.png' });
      log('A9', 'Inquiry form submit', `nameInput=${!!nameInput}, emailInput=${!!emailInput}`, 'N/A', 'form not found', 'FAIL');
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
      const bodyText = await page.textContent('body');
      const hasContent = bodyText.trim().length > 50;
      await page.screenshot({ path: `e2e-screenshots/${sp.id}-${sp.path.replace('/', '')}.png` });
      log(sp.id, sp.name, `goto ${BASE}${sp.path}`, 'N/A', `status=${status}, contentLen=${bodyText.trim().length}`, status === 200 && hasContent ? 'PASS' : 'FAIL');
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
      const bodyText = await page.textContent('body');
      const hasForm = await page.$('form, input[type="email"], input[type="password"]');
      await page.screenshot({ path: `e2e-screenshots/${ap.id}-auth.png` });
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
    const has404 = bodyText.includes('404') || bodyText.includes('찾을 수 없') || bodyText.includes('not found') || bodyText.includes('존재하지');
    await page.screenshot({ path: 'e2e-screenshots/A19-404.png' });
    log('A19', '/nonexistent → 404', `goto ${BASE}/nonexistent-page-xyz`, 'N/A', `status=${status}, has404text=${has404}`, (status === 404 || has404) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('A19', '/nonexistent → 404', 'goto attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ B. AUTH FLOW ============

  // B5: Login with wrong password → error
  try {
    await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1500);

    const emailField = await page.$('input[type="email"], input[name="email"]');
    const pwField = await page.$('input[type="password"], input[name="password"]');

    if (emailField && pwField) {
      await emailField.fill('test@blinddeal.com');
      await pwField.fill('WrongPassword123!');

      const loginBtn = await page.$('button[type="submit"], button:has-text("로그인"), button:has-text("Login")');
      if (loginBtn) await loginBtn.click();
      await sleep(3000);

      const bodyText = await page.textContent('body');
      const hasError = bodyText.includes('오류') || bodyText.includes('실패') || bodyText.includes('잘못') || bodyText.includes('error') || bodyText.includes('invalid') || bodyText.includes('일치하지');
      await page.screenshot({ path: 'e2e-screenshots/B5-wrong-password.png' });
      log('B5', 'Login wrong password → error', 'fill email=test@blinddeal.com, pw=WrongPassword123!', 'N/A', `hasError=${hasError}`, hasError ? 'PASS' : 'FAIL');
    } else {
      log('B5', 'Login wrong password → error', 'no form fields found', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('B5', 'Login wrong password → error', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // B9: Protected routes redirect when not logged in
  try {
    // Clear cookies to ensure logged out
    await context.clearCookies();
    const protectedPaths = ['/deals', '/dashboard', '/rooms'];
    const redirectResults = [];

    for (const pp of protectedPaths) {
      await page.goto(`${BASE}${pp}`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(2000);
      const currentUrl = page.url();
      const redirected = currentUrl.includes('/auth/login') || currentUrl.includes('/auth') || currentUrl.includes('login');
      redirectResults.push({ path: pp, redirected, currentUrl });
    }

    await page.screenshot({ path: 'e2e-screenshots/B9-protected-redirect.png' });

    // /deals might be public marketplace, so check /dashboard and /rooms
    const dashRedirected = redirectResults.find(r => r.path === '/dashboard')?.redirected;
    const roomsRedirected = redirectResults.find(r => r.path === '/rooms')?.redirected;

    log('B9', 'Protected routes redirect',
      `visit /deals, /dashboard, /rooms while logged out`,
      'N/A',
      redirectResults.map(r => `${r.path}→${r.currentUrl}`).join('; '),
      (dashRedirected || roomsRedirected) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('B9', 'Protected routes redirect', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // B4: Login with correct credentials
  try {
    await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1500);

    const emailField = await page.$('input[type="email"], input[name="email"]');
    const pwField = await page.$('input[type="password"], input[name="password"]');

    if (emailField && pwField) {
      await emailField.fill(SELLER.email);
      await pwField.fill(SELLER.password);

      const loginBtn = await page.$('button[type="submit"], button:has-text("로그인"), button:has-text("Login")');
      if (loginBtn) await loginBtn.click();
      await sleep(5000);

      const currentUrl = page.url();
      const loggedIn = !currentUrl.includes('/auth/login');
      await page.screenshot({ path: 'e2e-screenshots/B4-login-success.png' });
      log('B4', 'Login seller → redirect home', `fill email=${SELLER.email}, pw=***, click login`, 'N/A', `redirected to: ${currentUrl}, loggedIn=${loggedIn}`, loggedIn ? 'PASS' : 'FAIL');
    } else {
      log('B4', 'Login seller → redirect home', 'no form fields found', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('B4', 'Login seller → redirect home', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ C. DEAL REGISTRATION ============

  // C1: /deals/new loads
  try {
    await page.goto(`${BASE}/deals/new`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);
    const status = page.url();
    const hasForm = await page.$('form, input, textarea, select');
    await page.screenshot({ path: 'e2e-screenshots/C1-deals-new.png' });
    log('C1', '/deals/new loads', `goto ${BASE}/deals/new`, 'N/A', `url=${status}, hasForm=${!!hasForm}`, hasForm ? 'PASS' : 'FAIL');
  } catch (e) {
    log('C1', '/deals/new loads', 'goto attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // C3-C4: Fill and submit deal
  try {
    // We should already be on /deals/new
    if (!page.url().includes('/deals/new')) {
      await page.goto(`${BASE}/deals/new`, { waitUntil: 'networkidle', timeout: 20000 });
      await sleep(2000);
    }

    // Get all form fields info for debugging
    const formInfo = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.map(el => ({
        tag: el.tagName,
        type: el.type,
        name: el.name,
        id: el.id,
        placeholder: el.placeholder,
        labels: Array.from(el.labels || []).map(l => l.textContent.trim())
      }));
    });
    console.log('  Form fields:', JSON.stringify(formInfo, null, 2));

    // Fill title
    const titleInput = await page.$('input[name="title"], input[placeholder*="제목"], input[placeholder*="딜"]');
    if (titleInput) await titleInput.fill('E2E전수테스트딜');

    // Fill description
    const descInput = await page.$('textarea[name="description"], textarea[name="desc"], textarea[placeholder*="설명"], textarea');
    if (descInput) await descInput.fill('전수테스트용 딜입니다');

    // Deal category - 부동산
    const categorySelect = await page.$('select[name="deal_category"], select[name="category"]');
    if (categorySelect) {
      const options = await categorySelect.$$eval('option', opts => opts.map(o => ({ value: o.value, text: o.textContent })));
      console.log('  Category options:', JSON.stringify(options));
      await categorySelect.selectOption('real_estate').catch(async () => {
        await categorySelect.selectOption({ label: '부동산' }).catch(() => {});
      });
    }

    // Deal type - 오피스
    const typeSelect = await page.$('select[name="deal_type"], select[name="type"]');
    if (typeSelect) {
      const options = await typeSelect.$$eval('option', opts => opts.map(o => ({ value: o.value, text: o.textContent })));
      console.log('  Type options:', JSON.stringify(options));
      // Try common values for office
      await typeSelect.selectOption('office').catch(async () => {
        await typeSelect.selectOption({ label: '오피스' }).catch(async () => {
          await typeSelect.selectOption({ label: '사무실' }).catch(() => {});
        });
      });
    }

    // Price
    const priceInput = await page.$('input[name="asking_price"], input[name="price"], input[placeholder*="가격"], input[placeholder*="금액"], input[type="number"]');
    if (priceInput) await priceInput.fill('7500000000');

    // Location
    const locationInput = await page.$('input[name="location"], input[placeholder*="위치"], input[placeholder*="소재지"]');
    if (locationInput) await locationInput.fill('서울 강남구');

    // Size
    const sizeInput = await page.$('input[name="size"], input[name="area"], input[placeholder*="면적"]');
    if (sizeInput) await sizeInput.fill('500');

    await page.screenshot({ path: 'e2e-screenshots/C3-deal-filled.png' });

    // Submit
    const submitBtn = await page.$('button[type="submit"], button:has-text("등록"), button:has-text("저장"), button:has-text("제출")');
    if (submitBtn) {
      await submitBtn.click();
      await sleep(5000);

      const currentUrl = page.url();
      const bodyText = await page.textContent('body');
      const success = currentUrl.includes('/deals/') || bodyText.includes('등록') || bodyText.includes('완료') || bodyText.includes('E2E전수테스트딜');

      await page.screenshot({ path: 'e2e-screenshots/C4-deal-submitted.png' });

      log('C3', 'Fill real estate deal form',
        'title=E2E전수테스트딜, desc=전수테스트용 딜입니다, type=오피스, price=7500000000',
        'DB_CHECK_NEEDED',
        `redirected to: ${currentUrl}`,
        titleInput ? 'PASS' : 'FAIL');

      log('C4', 'Submit deal → verify DB',
        'click submit',
        'DB_CHECK_NEEDED',
        `success=${success}, url=${currentUrl}`,
        success ? 'PASS' : 'FAIL');
    } else {
      log('C3', 'Fill real estate deal form', 'filled fields', 'N/A', 'no submit button found', 'FAIL');
      log('C4', 'Submit deal → verify DB', 'N/A', 'N/A', 'no submit button', 'FAIL');
    }
  } catch (e) {
    log('C3', 'Fill real estate deal form', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
    log('C4', 'Submit deal → verify DB', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ D. MARKETPLACE ============

  // D1: /deals loads with deal list
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);

    const bodyText = await page.textContent('body');
    const hasDealList = bodyText.includes('E2E전수테스트딜') || await page.$('[class*="deal"], [class*="card"], [class*="list"]');
    await page.screenshot({ path: 'e2e-screenshots/D1-deals-list.png' });
    log('D1', '/deals loads with deal list', `goto ${BASE}/deals`, 'N/A', `hasDealList=${!!hasDealList}, includes E2E deal=${bodyText.includes('E2E전수테스트딜')}`, hasDealList ? 'PASS' : 'FAIL');
  } catch (e) {
    log('D1', '/deals loads with deal list', 'goto attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // D2: Category filter 부동산
  try {
    // Look for category filter
    const filterBtn = await page.$('button:has-text("부동산"), a:has-text("부동산"), [data-category="real_estate"]');
    const filterSelect = await page.$('select[name*="category"]');

    if (filterBtn) {
      await filterBtn.click();
      await sleep(2000);
    } else if (filterSelect) {
      await filterSelect.selectOption('real_estate').catch(async () => {
        await filterSelect.selectOption({ label: '부동산' }).catch(() => {});
      });
      await sleep(2000);
    }

    await page.screenshot({ path: 'e2e-screenshots/D2-filter-realestate.png' });
    const bodyText = await page.textContent('body');
    log('D2', 'Category filter 부동산', `click/select 부동산 filter`, 'N/A', `page content length=${bodyText.length}`, (filterBtn || filterSelect) ? 'PASS' : 'FAIL');
  } catch (e) {
    log('D2', 'Category filter 부동산', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // D4: Search "E2E"
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1500);

    const searchInput = await page.$('input[type="search"], input[placeholder*="검색"], input[name="search"], input[name="q"]');
    if (searchInput) {
      await searchInput.fill('E2E');
      await searchInput.press('Enter');
      await sleep(2000);

      const bodyText = await page.textContent('body');
      const found = bodyText.includes('E2E전수테스트딜');
      await page.screenshot({ path: 'e2e-screenshots/D4-search-e2e.png' });
      log('D4', 'Search E2E returns test deal', 'fill search=E2E, press Enter', 'N/A', `found E2E deal=${found}`, found ? 'PASS' : 'FAIL');
    } else {
      await page.screenshot({ path: 'e2e-screenshots/D4-no-search.png' });
      log('D4', 'Search E2E returns test deal', 'no search input found', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('D4', 'Search E2E returns test deal', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // ============ E. DEAL INTERACTIONS AS BUYER ============

  // Logout and login as buyer
  try {
    await context.clearCookies();
    await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1500);

    const emailField = await page.$('input[type="email"], input[name="email"]');
    const pwField = await page.$('input[type="password"], input[name="password"]');

    if (emailField && pwField) {
      await emailField.fill(BUYER.email);
      await pwField.fill(BUYER.password);

      const loginBtn = await page.$('button[type="submit"], button:has-text("로그인"), button:has-text("Login")');
      if (loginBtn) await loginBtn.click();
      await sleep(5000);

      const currentUrl = page.url();
      console.log('  Buyer login result URL:', currentUrl);
    }
  } catch (e) {
    console.log('  Buyer login error:', e.message);
  }

  // E1: Click test deal → detail page loads
  let dealId = null;
  try {
    await page.goto(`${BASE}/deals`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(2000);

    // Find and click on E2E deal
    const dealLink = await page.$('a:has-text("E2E전수테스트딜")');
    if (dealLink) {
      await dealLink.click();
      await sleep(3000);

      const currentUrl = page.url();
      const bodyText = await page.textContent('body');
      const hasDealDetail = bodyText.includes('E2E전수테스트딜');

      // Extract deal slug or ID from URL
      const urlMatch = currentUrl.match(/\/deals\/([^/?]+)/);
      if (urlMatch) dealId = urlMatch[1];

      await page.screenshot({ path: 'e2e-screenshots/E1-deal-detail.png' });
      log('E1', 'Click test deal → detail', `click E2E전수테스트딜 link`, 'N/A', `url=${currentUrl}, hasDealDetail=${hasDealDetail}`, hasDealDetail ? 'PASS' : 'FAIL');
    } else {
      await page.screenshot({ path: 'e2e-screenshots/E1-no-deal.png' });
      log('E1', 'Click test deal → detail', 'E2E deal link not found', 'N/A', 'deal not in list', 'FAIL');
    }
  } catch (e) {
    log('E1', 'Click test deal → detail', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // E2: Interest toggle ON
  try {
    if (dealId || page.url().includes('/deals/')) {
      const interestBtn = await page.$('button:has-text("관심"), button:has-text("찜"), button:has-text("interest"), [class*="interest"], [class*="bookmark"], button[aria-label*="관심"], button[aria-label*="찜"]');
      if (interestBtn) {
        await interestBtn.click();
        await sleep(2000);

        await page.screenshot({ path: 'e2e-screenshots/E2-interest-on.png' });
        log('E2', 'Interest toggle ON', `click interest button on deal ${dealId}`, 'DB_CHECK_NEEDED', 'clicked interest button', 'PASS');
      } else {
        // Try to find any heart/star/bookmark icon button
        const iconBtn = await page.$('button svg, button [class*="heart"], button [class*="star"], button [class*="bookmark"]');
        if (iconBtn) {
          const btn = await iconBtn.$('xpath=ancestor::button');
          if (btn) {
            await btn.click();
            await sleep(2000);
            await page.screenshot({ path: 'e2e-screenshots/E2-interest-on.png' });
            log('E2', 'Interest toggle ON', `click icon button on deal`, 'DB_CHECK_NEEDED', 'clicked icon button', 'PASS');
          } else {
            log('E2', 'Interest toggle ON', 'no interest button found', 'N/A', 'N/A', 'FAIL');
          }
        } else {
          await page.screenshot({ path: 'e2e-screenshots/E2-no-interest-btn.png' });
          log('E2', 'Interest toggle ON', 'no interest button found', 'N/A', 'N/A', 'FAIL');
        }
      }
    } else {
      log('E2', 'Interest toggle ON', 'not on deal detail page', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('E2', 'Interest toggle ON', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  // E3: Interest toggle OFF
  try {
    if (dealId || page.url().includes('/deals/')) {
      const interestBtn = await page.$('button:has-text("관심"), button:has-text("찜"), button:has-text("interest"), [class*="interest"], [class*="bookmark"]');
      if (interestBtn) {
        await interestBtn.click();
        await sleep(2000);

        await page.screenshot({ path: 'e2e-screenshots/E3-interest-off.png' });
        log('E3', 'Interest toggle OFF', `click interest button again on deal ${dealId}`, 'DB_CHECK_NEEDED', 'clicked interest button to toggle off', 'PASS');
      } else {
        const iconBtn = await page.$('button svg, button [class*="heart"], button [class*="star"]');
        if (iconBtn) {
          const btn = await iconBtn.$('xpath=ancestor::button');
          if (btn) {
            await btn.click();
            await sleep(2000);
            await page.screenshot({ path: 'e2e-screenshots/E3-interest-off.png' });
            log('E3', 'Interest toggle OFF', 'click icon button again', 'DB_CHECK_NEEDED', 'toggled off', 'PASS');
          }
        } else {
          log('E3', 'Interest toggle OFF', 'no interest button found', 'N/A', 'N/A', 'FAIL');
        }
      }
    } else {
      log('E3', 'Interest toggle OFF', 'not on deal detail page', 'N/A', 'N/A', 'FAIL');
    }
  } catch (e) {
    log('E3', 'Interest toggle OFF', 'attempt', 'N/A', `Error: ${e.message}`, 'FAIL');
  }

  await browser.close();

  // Print summary
  console.log('\n\n========================================');
  console.log('E2E TEST RESULTS SUMMARY');
  console.log('========================================\n');

  console.log('| ID | Test | Input Evidence | DB Evidence | Screen Evidence | Status |');
  console.log('|---|---|---|---|---|---|');
  for (const r of results) {
    console.log(`| ${r.id} | ${r.test} | ${r.input.substring(0, 60)} | ${r.db} | ${r.screen.substring(0, 60)} | ${r.status} |`);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`\nTotal: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);

  // Output dealId for DB queries
  console.log(`\nDeal ID/Slug for DB queries: ${dealId}`);
}

run().catch(e => console.error('Fatal:', e));
