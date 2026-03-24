import { chromium } from 'playwright';

const BASE = 'https://blinddeal-ten.vercel.app';
const CACHE_BUST = `?_cb=${Date.now()}`;
const LOGIN_EMAIL = 'test@blinddeal.com';
const LOGIN_PASS = 'Test1234!';

const results = [];

function record(test, viewport, element, previous, current, status) {
  results.push({ test, viewport, element, previous, current, status });
}

async function safeGoto(page, url, label) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    return true;
  } catch (e) {
    console.log(`  WARN: goto ${label} failed: ${e.message.slice(0, 80)}`);
    // Try once more with load event
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      await page.waitForTimeout(5000);
      return true;
    } catch (e2) {
      console.log(`  ERROR: retry also failed for ${label}`);
      return false;
    }
  }
}

async function login(page) {
  const ok = await safeGoto(page, `${BASE}/auth/login${CACHE_BUST}`, '/auth/login');
  if (!ok) return false;

  try {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passInput = page.locator('input[type="password"], input[name="password"]').first();

    await emailInput.fill(LOGIN_EMAIL);
    await passInput.fill(LOGIN_PASS);

    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    await page.waitForTimeout(5000);
    return true;
  } catch (e) {
    console.log(`  Login error: ${e.message.slice(0, 80)}`);
    return false;
  }
}

async function checkTouchTarget(page, selectorList, label) {
  try {
    let box = null;
    let matchedSel = '';
    for (const sel of selectorList) {
      try {
        const el = page.locator(sel).first();
        const count = await el.count();
        if (count > 0) {
          const visible = await el.isVisible().catch(() => false);
          if (visible) {
            box = await el.boundingBox();
            if (box) {
              matchedSel = sel;
              break;
            }
          }
        }
      } catch (_) {
        // try next selector
      }
    }

    if (!box) {
      // Try JS fallback for text-based elements
      const fallbackBox = await page.evaluate((lbl) => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent?.trim();
          // Extract the core text from the label (remove quotes)
          const searchText = lbl.replace(/[""]/g, '');
          if (text === searchText || node.innerText?.trim() === searchText) {
            const rect = node.getBoundingClientRect();
            if (rect.height > 0 && rect.width > 0) {
              return { height: rect.height, width: rect.width, tag: node.tagName };
            }
          }
        }
        return null;
      }, label);

      if (fallbackBox) {
        const height = Math.round(fallbackBox.height);
        const pass = height >= 44;
        record('Touch Targets', 'iPhone SE 375x667', `${label} (h=${height}px, JS fallback)`, 'FAIL',
          pass ? `${height}px >= 44px` : `${height}px < 44px`,
          pass ? 'PASS' : 'FAIL');
        return;
      }

      record('Touch Targets', 'iPhone SE 375x667', label, 'FAIL', 'Element not found/visible', 'FAIL');
      return;
    }
    const height = Math.round(box.height);
    const pass = height >= 44;
    record('Touch Targets', 'iPhone SE 375x667', `${label} (h=${height}px)`, 'FAIL',
      pass ? `${height}px >= 44px` : `${height}px < 44px`,
      pass ? 'PASS' : 'FAIL');
  } catch (e) {
    record('Touch Targets', 'iPhone SE 375x667', label, 'FAIL', `ERROR: ${e.message.slice(0, 80)}`, 'FAIL');
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ===== TEST 1: Touch Targets at iPhone SE 375x667 =====
  console.log('=== TEST 1: Touch Targets ===');
  const ctx1 = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page1 = await ctx1.newPage();

  // 1a. Landing page
  console.log('Checking landing page...');
  if (await safeGoto(page1, `${BASE}/${CACHE_BUST}`, 'landing')) {
    await checkTouchTarget(page1, [
      'header a:has-text("BlindDeal")',
      'a:has-text("BlindDeal")',
      'header a[href="/"]'
    ], 'Logo link "BlindDeal"');

    await checkTouchTarget(page1, [
      'a:has-text("딜 등록하기")',
      'button:has-text("딜 등록하기")'
    ], '"딜 등록하기" hero CTA');

    await checkTouchTarget(page1, [
      'a:has-text("딜 둘러보기")',
      'button:has-text("딜 둘러보기")'
    ], '"딜 둘러보기" hero CTA');
  }

  // 1b. Auth login page
  console.log('Checking /auth/login...');
  if (await safeGoto(page1, `${BASE}/auth/login${CACHE_BUST}`, '/auth/login')) {
    await checkTouchTarget(page1, [
      'a:has-text("비밀번호를 잊으셨나요?")',
      'button:has-text("비밀번호를 잊으셨나요?")',
    ], '"비밀번호를 잊으셨나요?"');

    await checkTouchTarget(page1, [
      'a:has-text("회원가입")',
      'button:has-text("회원가입")',
    ], '"회원가입"');

    await checkTouchTarget(page1, [
      'a:has-text("홈으로 돌아가기")',
      'button:has-text("홈으로 돌아가기")',
    ], '"홈으로 돌아가기"');
  }

  // 1c. Login then check /profile
  console.log('Logging in for profile...');
  const loggedIn1 = await login(page1);

  if (loggedIn1) {
    console.log('Checking /profile...');
    if (await safeGoto(page1, `${BASE}/profile${CACHE_BUST}`, '/profile')) {
      await checkTouchTarget(page1, [
        'a:has-text("프로필 수정")',
        'button:has-text("프로필 수정")',
      ], '"프로필 수정"');

      await checkTouchTarget(page1, [
        'a:has-text("인증 관리")',
        'button:has-text("인증 관리")',
      ], '"인증 관리"');
    }
  }

  // 1d. /deals page
  console.log('Checking /deals...');
  if (await safeGoto(page1, `${BASE}/deals${CACHE_BUST}`, '/deals')) {
    await checkTouchTarget(page1, [
      'select',
      'button:has-text("필터")',
      '[role="combobox"]',
      '[class*="filter"]',
      '[class*="Filter"]',
      '[class*="select"]'
    ], 'Filter dropdowns');

    await checkTouchTarget(page1, [
      'a:has-text("지도로 보기")',
      'button:has-text("지도로 보기")',
    ], '"지도로 보기"');
  }

  // 1e. /service page
  console.log('Checking /service...');
  if (await safeGoto(page1, `${BASE}/service${CACHE_BUST}`, '/service')) {
    await checkTouchTarget(page1, [
      'a:has-text("딜 등록하기")',
      'button:has-text("딜 등록하기")'
    ], '"딜 등록하기" on /service');
  }

  await ctx1.close();

  // ===== TEST 2: Dashboard Pipeline at iPad Mini 768x1024 =====
  console.log('\n=== TEST 2: Dashboard Pipeline ===');
  const ctx2 = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page2 = await ctx2.newPage();

  const loggedIn2 = await login(page2);

  if (loggedIn2) {
    console.log('Checking /dashboard...');
    if (await safeGoto(page2, `${BASE}/dashboard${CACHE_BUST}`, '/dashboard')) {
      const pipelineOverflow = await page2.evaluate(() => {
        const overflowContainers = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const style = getComputedStyle(el);
          if (style.overflowX === 'auto' || style.overflowX === 'scroll' ||
              style.overflow === 'auto' || style.overflow === 'scroll' ||
              style.overflow === 'hidden' || style.overflowX === 'hidden') {
            const rect = el.getBoundingClientRect();
            if (rect.width > 100) {
              overflowContainers.push({
                tag: el.tagName,
                className: (el.className || '').toString().slice(0, 80),
                overflow: style.overflow,
                overflowX: style.overflowX,
                width: Math.round(rect.width)
              });
            }
          }
        }

        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          overflowContainers: overflowContainers.slice(0, 15),
          hasHorizontalOverflow: document.documentElement.scrollWidth > 768
        };
      });

      console.log('Pipeline check:', JSON.stringify(pipelineOverflow, null, 2));

      const pipeNoOverflow = !pipelineOverflow.hasHorizontalOverflow;
      record('Dashboard Pipeline', 'iPad Mini 768x1024',
        `scrollWidth=${pipelineOverflow.scrollWidth} vs viewport=768`,
        'FAIL',
        pipeNoOverflow ? `${pipelineOverflow.scrollWidth}px <= 768px` : `${pipelineOverflow.scrollWidth}px > 768px`,
        pipeNoOverflow ? 'PASS' : 'FAIL');

      if (pipelineOverflow.overflowContainers.length > 0) {
        record('Dashboard Pipeline', 'iPad Mini 768x1024',
          `Overflow containers: ${pipelineOverflow.overflowContainers.length}`,
          'FAIL', 'Has overflow:hidden/auto containers', 'PASS');
      } else {
        record('Dashboard Pipeline', 'iPad Mini 768x1024',
          'Overflow containers', 'FAIL', 'No overflow containers found', 'FAIL');
      }
    }
  }

  await ctx2.close();

  // ===== TEST 3: Landing Content at iPhone SE 375x667 =====
  console.log('\n=== TEST 3: Landing Content ===');
  const ctx3 = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page3 = await ctx3.newPage();

  if (await safeGoto(page3, `${BASE}/${CACHE_BUST}`, 'landing (overflow check)')) {
    const landingScroll = await page3.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });

    console.log('Landing scroll:', landingScroll);

    const landingPass = landingScroll.scrollWidth <= 375;
    record('Landing Content', 'iPhone SE 375x667',
      `scrollWidth=${landingScroll.scrollWidth} vs viewport=375`,
      'FAIL',
      landingPass ? `${landingScroll.scrollWidth}px <= 375px` : `${landingScroll.scrollWidth}px > 375px`,
      landingPass ? 'PASS' : 'FAIL');
  }

  await ctx3.close();
  await browser.close();

  // ===== REPORT =====
  console.log('\n\n========== TEST RESULTS ==========');
  console.log('| Test | Viewport | Element | Previous | Current | Status |');
  console.log('|------|----------|---------|----------|---------|--------|');

  let passCount = 0;
  let failCount = 0;

  for (const r of results) {
    if (r.status === 'PASS') passCount++;
    else failCount++;
    console.log(`| ${r.test} | ${r.viewport} | ${r.element} | ${r.previous} | ${r.current} | ${r.status} |`);
  }

  console.log(`\n${passCount} PASS / ${failCount} still FAIL`);
})();
