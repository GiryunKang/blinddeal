import { chromium } from 'playwright';

const BASE = 'https://blinddeal-ten.vercel.app';
const CACHE_BUST = `?_cb=${Date.now()}`;
const LOGIN_EMAIL = 'test@blinddeal.com';
const LOGIN_PASS = 'Test1234!';

async function safeGoto(page, url, label) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    return true;
  } catch (e) {
    console.log(`  WARN: goto ${label} failed, retrying...`);
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      await page.waitForTimeout(5000);
      return true;
    } catch (e2) {
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
    console.log(`  Login error: ${e.message.slice(0, 80)}`);
    return false;
  }
}

// Deep inspection: find element by text, then check it AND all ancestors for touch target height
async function deepInspect(page, searchText) {
  return await page.evaluate((text) => {
    // Find all elements containing this text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    const matches = [];
    while (node = walker.nextNode()) {
      // Check direct text content (not children)
      const directText = Array.from(node.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join('');

      if (directText.includes(text) || node.textContent?.trim() === text) {
        const rect = node.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) {
          // Walk up to find the interactive parent (a, button) or the closest with min-height >= 44
          let current = node;
          const chain = [];
          while (current && current !== document.body) {
            const r = current.getBoundingClientRect();
            const cs = getComputedStyle(current);
            chain.push({
              tag: current.tagName,
              className: (current.className || '').toString().slice(0, 60),
              height: Math.round(r.height),
              minHeight: cs.minHeight,
              padding: `${cs.paddingTop} ${cs.paddingBottom}`,
              isInteractive: current.tagName === 'A' || current.tagName === 'BUTTON' || current.getAttribute('role') === 'button'
            });
            current = current.parentElement;
          }
          matches.push({
            directText: directText.slice(0, 40),
            selfHeight: Math.round(rect.height),
            chain: chain.slice(0, 8)
          });
        }
      }
    }
    return matches.slice(0, 3);
  }, searchText);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page = await ctx.newPage();

  // Check hero CTAs on landing
  console.log('=== Landing Hero CTAs ===');
  await safeGoto(page, `${BASE}/${CACHE_BUST}`, 'landing');

  console.log('\n--- "딜 등록하기" hero CTA ---');
  const r1 = await deepInspect(page, '딜 등록하기');
  console.log(JSON.stringify(r1, null, 2));

  console.log('\n--- "딜 둘러보기" hero CTA ---');
  const r2 = await deepInspect(page, '딜 둘러보기');
  console.log(JSON.stringify(r2, null, 2));

  // Check login page elements
  console.log('\n=== Login Page ===');
  await safeGoto(page, `${BASE}/auth/login${CACHE_BUST}`, '/auth/login');

  console.log('\n--- "비밀번호를 잊으셨나요?" ---');
  const r3 = await deepInspect(page, '비밀번호를 잊으셨나요?');
  console.log(JSON.stringify(r3, null, 2));

  console.log('\n--- "회원가입" ---');
  const r4 = await deepInspect(page, '회원가입');
  console.log(JSON.stringify(r4, null, 2));

  // Login and check profile
  console.log('\n=== Profile Page ===');
  await login(page);
  await safeGoto(page, `${BASE}/profile${CACHE_BUST}`, '/profile');

  console.log('\n--- "프로필 수정" ---');
  const r5 = await deepInspect(page, '프로필 수정');
  console.log(JSON.stringify(r5, null, 2));

  console.log('\n--- "인증 관리" ---');
  const r6 = await deepInspect(page, '인증 관리');
  console.log(JSON.stringify(r6, null, 2));

  await ctx.close();
  await browser.close();

  console.log('\nDone.');
})();
