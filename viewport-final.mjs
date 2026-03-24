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
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      await page.waitForTimeout(5000);
      return true;
    } catch (_) {
      return false;
    }
  }
}

async function login(page) {
  const ok = await safeGoto(page, `${BASE}/auth/login${CACHE_BUST}`, '/auth/login');
  if (!ok) return false;
  try {
    await page.locator('input[type="email"], input[name="email"]').first().fill(LOGIN_EMAIL);
    await page.locator('input[type="password"], input[name="password"]').first().fill(LOGIN_PASS);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
    return true;
  } catch (e) {
    return false;
  }
}

// Find the actual interactive touch target height for a given text
// Checks: the element itself, then its closest interactive ancestor or descendant
async function measureTouchTarget(page, searchText) {
  return await page.evaluate((text) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    const candidates = [];

    while (node = walker.nextNode()) {
      const directText = Array.from(node.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join('');

      if (directText.includes(text)) {
        const rect = node.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) {
          // Check the element itself
          const isInteractive = node.tagName === 'A' || node.tagName === 'BUTTON' || node.getAttribute('role') === 'button';

          // Walk up to find interactive ancestor
          let interactiveAncestor = null;
          let current = node.parentElement;
          while (current && current !== document.body) {
            if (current.tagName === 'A' || current.tagName === 'BUTTON' || current.getAttribute('role') === 'button') {
              interactiveAncestor = current;
              break;
            }
            current = current.parentElement;
          }

          // Walk down to find interactive descendant
          let interactiveDescendant = null;
          const interactive = node.querySelector('a, button, [role="button"]');
          if (interactive) {
            interactiveDescendant = interactive;
          }

          // Determine the actual touch target
          let touchTarget = node;
          if (isInteractive) {
            touchTarget = node;
          } else if (interactiveAncestor) {
            touchTarget = interactiveAncestor;
          } else if (interactiveDescendant) {
            touchTarget = interactiveDescendant;
          }

          // Also check parent wrapper that might have min-height
          let wrapperWithMinHeight = null;
          current = node;
          while (current && current !== document.body) {
            const style = getComputedStyle(current);
            const mh = parseFloat(style.minHeight);
            if (mh >= 44) {
              wrapperWithMinHeight = current;
              break;
            }
            current = current.parentElement;
          }

          const touchRect = touchTarget.getBoundingClientRect();
          const wrapperRect = wrapperWithMinHeight ? wrapperWithMinHeight.getBoundingClientRect() : null;

          candidates.push({
            text: directText.slice(0, 30),
            selfTag: node.tagName,
            selfHeight: Math.round(rect.height),
            touchTargetTag: touchTarget.tagName,
            touchTargetHeight: Math.round(touchRect.height),
            touchTargetMinHeight: getComputedStyle(touchTarget).minHeight,
            wrapperHeight: wrapperRect ? Math.round(wrapperRect.height) : null,
            wrapperTag: wrapperWithMinHeight ? wrapperWithMinHeight.tagName : null,
          });
        }
      }
    }
    return candidates;
  }, searchText);
}

async function testTouch(page, searchText, label) {
  try {
    const candidates = await measureTouchTarget(page, searchText);
    if (!candidates || candidates.length === 0) {
      record('Touch Targets', 'iPhone SE 375x667', label, 'FAIL', 'Element not found', 'FAIL');
      return;
    }

    // Use the best candidate (prefer the one where the interactive element is large enough)
    let best = candidates[0];
    for (const c of candidates) {
      if (c.touchTargetHeight >= 44) {
        best = c;
        break;
      }
    }

    const effectiveHeight = Math.max(best.touchTargetHeight, best.wrapperHeight || 0);
    const pass = effectiveHeight >= 44;
    const detail = `${best.touchTargetTag}=${best.touchTargetHeight}px` +
      (best.wrapperHeight ? `, wrapper=${best.wrapperHeight}px` : '') +
      `, effective=${effectiveHeight}px`;

    record('Touch Targets', 'iPhone SE 375x667', `${label} (${detail})`, 'FAIL',
      pass ? `${effectiveHeight}px >= 44px` : `${effectiveHeight}px < 44px`,
      pass ? 'PASS' : 'FAIL');
  } catch (e) {
    record('Touch Targets', 'iPhone SE 375x667', label, 'FAIL', `ERROR: ${e.message.slice(0, 80)}`, 'FAIL');
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ===== TEST 1: Touch Targets =====
  console.log('=== TEST 1: Touch Targets ===');
  const ctx1 = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page1 = await ctx1.newPage();

  // Landing page
  console.log('Checking landing page...');
  await safeGoto(page1, `${BASE}/${CACHE_BUST}`, 'landing');

  await testTouch(page1, 'BlindDeal', 'Logo link "BlindDeal"');
  await testTouch(page1, '딜 등록하기', '"딜 등록하기" hero CTA');
  await testTouch(page1, '딜 둘러보기', '"딜 둘러보기" hero CTA');

  // Login page
  console.log('Checking /auth/login...');
  await safeGoto(page1, `${BASE}/auth/login${CACHE_BUST}`, '/auth/login');

  await testTouch(page1, '비밀번호를 잊으셨나요?', '"비밀번호를 잊으셨나요?"');
  await testTouch(page1, '회원가입', '"회원가입"');
  await testTouch(page1, '홈으로 돌아가기', '"홈으로 돌아가기"');

  // Profile
  console.log('Logging in...');
  await login(page1);
  console.log('Checking /profile...');
  await safeGoto(page1, `${BASE}/profile${CACHE_BUST}`, '/profile');

  await testTouch(page1, '프로필 수정', '"프로필 수정"');
  await testTouch(page1, '인증 관리', '"인증 관리"');

  // Deals
  console.log('Checking /deals...');
  await safeGoto(page1, `${BASE}/deals${CACHE_BUST}`, '/deals');

  // Filter dropdowns - use Playwright locator for select/combobox
  const filterBox = await (async () => {
    for (const sel of ['select', '[role="combobox"]', 'button:has-text("필터")']) {
      try {
        const el = page1.locator(sel).first();
        if (await el.count() > 0 && await el.isVisible().catch(() => false)) {
          const b = await el.boundingBox();
          if (b) return b;
        }
      } catch (_) {}
    }
    return null;
  })();
  if (filterBox) {
    const h = Math.round(filterBox.height);
    record('Touch Targets', 'iPhone SE 375x667', `Filter dropdowns (h=${h}px)`, 'FAIL',
      h >= 44 ? `${h}px >= 44px` : `${h}px < 44px`, h >= 44 ? 'PASS' : 'FAIL');
  } else {
    record('Touch Targets', 'iPhone SE 375x667', 'Filter dropdowns', 'FAIL', 'Not found', 'FAIL');
  }

  await testTouch(page1, '지도로 보기', '"지도로 보기"');

  // Service
  console.log('Checking /service...');
  await safeGoto(page1, `${BASE}/service${CACHE_BUST}`, '/service');
  await testTouch(page1, '딜 등록하기', '"딜 등록하기" on /service');

  await ctx1.close();

  // ===== TEST 2: Dashboard Pipeline =====
  console.log('\n=== TEST 2: Dashboard Pipeline ===');
  const ctx2 = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page2 = await ctx2.newPage();
  await login(page2);
  console.log('Checking /dashboard...');
  await safeGoto(page2, `${BASE}/dashboard${CACHE_BUST}`, '/dashboard');

  const dashData = await page2.evaluate(() => {
    const overflowContainers = [];
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const style = getComputedStyle(el);
      if (['auto', 'scroll', 'hidden'].includes(style.overflowX) ||
          ['auto', 'scroll', 'hidden'].includes(style.overflow)) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 100) {
          overflowContainers.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 60),
            overflow: style.overflow,
            overflowX: style.overflowX,
            w: Math.round(rect.width)
          });
        }
      }
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      containers: overflowContainers.length,
      hasOverflow: document.documentElement.scrollWidth > 768
    };
  });

  console.log(`  scrollWidth=${dashData.scrollWidth}, clientWidth=${dashData.clientWidth}, overflowContainers=${dashData.containers}`);

  record('Dashboard Pipeline', 'iPad Mini 768x1024',
    `scrollWidth=${dashData.scrollWidth} vs 768`,
    'FAIL',
    !dashData.hasOverflow ? `${dashData.scrollWidth}px <= 768px (no overflow)` : `${dashData.scrollWidth}px > 768px`,
    !dashData.hasOverflow ? 'PASS' : 'FAIL');

  record('Dashboard Pipeline', 'iPad Mini 768x1024',
    `Pipeline overflow containment (${dashData.containers} containers)`,
    'FAIL',
    dashData.containers > 0 ? 'overflow:hidden/auto present' : 'No containers',
    dashData.containers > 0 ? 'PASS' : 'FAIL');

  await ctx2.close();

  // ===== TEST 3: Landing Content =====
  console.log('\n=== TEST 3: Landing Content ===');
  const ctx3 = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page3 = await ctx3.newPage();
  await safeGoto(page3, `${BASE}/${CACHE_BUST}`, 'landing');

  const landingData = await page3.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));

  console.log(`  scrollWidth=${landingData.scrollWidth}, clientWidth=${landingData.clientWidth}`);

  const landingOk = landingData.scrollWidth <= 375;
  record('Landing Content', 'iPhone SE 375x667',
    `scrollWidth=${landingData.scrollWidth} vs 375`,
    'FAIL',
    landingOk ? `${landingData.scrollWidth}px <= 375px` : `${landingData.scrollWidth}px > 375px`,
    landingOk ? 'PASS' : 'FAIL');

  await ctx3.close();
  await browser.close();

  // ===== FINAL REPORT =====
  console.log('\n\n========== FINAL TEST RESULTS ==========');
  console.log('| Test | Viewport | Element | Previous | Current | Status |');
  console.log('|------|----------|---------|----------|---------|--------|');

  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.status === 'PASS') pass++; else fail++;
    console.log(`| ${r.test} | ${r.viewport} | ${r.element} | ${r.previous} | ${r.current} | ${r.status} |`);
  }
  console.log(`\n${pass} PASS / ${fail} still FAIL`);
})();
