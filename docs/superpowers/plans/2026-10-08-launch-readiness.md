# Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the pre-launch gaps found in the audit (SEO, consent + analytics, spam protection, image weight, landing CTA, HTTPS docs, a11y/perf report).

**Architecture:** Small dependency-free modules. Pure logic lives in `*.js` utils tested with Node's built-in `node --test`; React components are thin wrappers. Backend spam protection is one servlet filter on the public auth endpoints, driven by a `mode` property.

**Tech Stack:** React 18 + Vite 7 + Tailwind (frontend), Spring Boot 3.2.6 / Java 21 / JUnit 5 (backend), Node built-in test runner.

**Spec:** none written. Source of requirements is the user's audit checklist and answers in the conversation of 2026-10-08 (summarized in Global Constraints). Rulings made without a spec are provisional.

## Global Constraints

- Work only in worktree `D:\projects\Restroly\.worktrees\launch-readiness` on branch `feature/launch-readiness`. Never touch `D:\projects\Restroly` main tree.
- Frontend deps: run `npm ci` in `RestroHub-FrontEnd/` of the worktree first. NO new npm or Gradle dependencies. One-off `npx --yes <tool>` for measurement or image conversion is allowed only if it does not modify `package.json` / lockfile.
- Analytics is **Google Analytics 4** only, loaded ONLY after the visitor accepts cookies, and only when `VITE_GA_MEASUREMENT_ID` is set. No ID means no banner and no script.
- Spam protection is controlled by one property: backend `app.spam-protection.mode` (env `SPAM_PROTECTION_MODE`, values `honeypot` default | `turnstile`); frontend `VITE_SPAM_PROTECTION_MODE` (same values). `honeypot` = hidden field + backend rate limiting, no keys. `turnstile` = Cloudflare Turnstile, needs `VITE_TURNSTILE_SITE_KEY` (frontend) and `TURNSTILE_SECRET_KEY` (backend). Rate limiting is always on in both modes.
- HTTPS: documentation only (`agent/HTTPS_NGINX.md`). Do NOT change `nginx.conf` or any backend HTTPS config.
- Site URL comes from env `VITE_SITE_URL` (default `http://localhost:3000`). Never hard-code a production domain.
- Never commit secrets or `.env` files. Document new env vars in `.env.example` and `RestroHub-FrontEnd/Dockerfile` ARG/ENV (follow the existing `VITE_GOOGLE_CLIENT_ID` pattern).
- Java: constructor injection only, Javadoc on public methods, run `./gradlew spotlessApply` before committing Java. React: functional components, one per file, Tailwind classes.
- Commits: Conventional Commits, end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Verify frontend with `npm test`, `npm run lint`, `npm run build` (from `RestroHub-FrontEnd/`); backend with `./gradlew test --tests "<class>"` (from `RestroHub/`).

## Review Focus

- `VITE_SITE_URL` unset: sitemap, robots, canonical, `og:image` must still be valid (localhost default), never the literal text `%VITE_SITE_URL%` in built `dist/index.html`.
- Browser blocks `localStorage` (private mode): consent read/write must not throw; banner still renders and the page works.
- Visitor declines cookies or never answers: `gtag.js` must never be requested.
- Honeypot header sent by a real user must be empty; a normal login/register must succeed with the interceptor attached.
- Rate limiter under many distinct IPs must not grow without bound.
- A request to a non-protected path (e.g. `GET /public/api/v1/...`, `/secure/api/**`) must be untouched by the spam filter.

---

### Task 1: SEO files, absolute meta, build-time site URL

**Files:**
- Create: `RestroHub-FrontEnd/scripts/seo.mjs`, `RestroHub-FrontEnd/scripts/seo.test.mjs`
- Modify: `RestroHub-FrontEnd/package.json` (scripts), `RestroHub-FrontEnd/index.html`, `RestroHub-FrontEnd/.env.example`, `RestroHub-FrontEnd/Dockerfile`, `RestroHub-FrontEnd/vite.config.js` (only if needed), `.gitignore`

**Interfaces:**
- Produces: `buildSeoFiles(siteUrl: string): { sitemap: string, robots: string }` exported from `scripts/seo.mjs`; npm scripts `test` and `prebuild`.

- [ ] **Step 1: Write the failing test** `scripts/seo.test.mjs`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeoFiles } from './seo.mjs';

test('sitemap lists public pages on the given site and strips trailing slash', () => {
  const { sitemap } = buildSeoFiles('https://example.test/');
  assert.match(sitemap, /<loc>https:\/\/example\.test\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/example\.test\/privacy-policy<\/loc>/);
  assert.doesNotMatch(sitemap, /\/\/privacy/);
});

test('robots blocks admin and points to the sitemap', () => {
  const { robots } = buildSeoFiles('https://example.test');
  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Sitemap: https:\/\/example\.test\/sitemap\.xml/);
});
```

- [ ] **Step 2: Run** `npm test` (add script `"test": "node --test"` first). Expected: FAIL, cannot find `./seo.mjs`.

- [ ] **Step 3: Implement** `scripts/seo.mjs`

```js
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const PAGES = ['/', '/login', '/register', '/privacy-policy', '/terms-of-service', '/refund-policy'];

export function buildSeoFiles(siteUrl) {
  const site = siteUrl.replace(/\/+$/, '');
  const urls = PAGES.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n');
  return {
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    robots: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /secure\nSitemap: ${site}/sitemap.xml\n`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = loadEnv('production', process.cwd(), '');
  const { sitemap, robots } = buildSeoFiles(env.VITE_SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:3000');
  writeFileSync('public/sitemap.xml', sitemap);
  writeFileSync('public/robots.txt', robots);
}
```

- [ ] **Step 4: Run** `npm test`. Expected: PASS (2 tests).

- [ ] **Step 5: Wire up.**
  - `package.json` scripts: `"test": "node --test"`, `"prebuild": "node scripts/seo.mjs"`.
  - Root `.gitignore`: add `RestroHub-FrontEnd/public/sitemap.xml` and `RestroHub-FrontEnd/public/robots.txt` (generated).
  - `index.html` head: change `og:image` to `%VITE_SITE_URL%/restro-banner.jpg` (the JPG is produced in Task 3; use that name now), add `<link rel="canonical" href="%VITE_SITE_URL%/" />`, `og:url`, `og:site_name` = Restroly, `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (same absolute URL).
  - Vite only replaces `%VITE_*%` when the variable is defined. So in `vite.config.js` add `loadEnv`-based default: use `define`-free approach, namely a tiny inline plugin `{ name: 'site-url-default', transformIndexHtml: (html) => html.replaceAll('%VITE_SITE_URL%', process.env.VITE_SITE_URL || loadEnv(mode, process.cwd(), '').VITE_SITE_URL || 'http://localhost:3000') }` with `enforce: 'pre'`. Keep it under 8 lines.
  - `.env.example`: add `VITE_SITE_URL=http://localhost:3000` with a one-line comment. `Dockerfile`: add `ARG VITE_SITE_URL=http://localhost:3000` and to the `ENV` line, matching the existing pattern.

- [ ] **Step 6: Verify.** `npm run build`. Then check `dist/index.html` contains no `%VITE_SITE_URL%`, and `public/sitemap.xml`, `public/robots.txt` exist and appear in `dist/`.

- [ ] **Step 7: Commit** `feat(seo): add sitemap/robots generation and absolute social meta`

---

### Task 2: Per-page titles and descriptions

**Files:**
- Create: `RestroHub-FrontEnd/src/utils/pageMeta.js`, `RestroHub-FrontEnd/src/utils/pageMeta.test.js`, `RestroHub-FrontEnd/src/hooks/usePageMeta.js`
- Modify: `src/pages/public/{Landing,Login,Register,ForgotPassword,PrivacyPolicy,TermsOfService,RefundPolicy,NotFound}.jsx`

**Interfaces:**
- Produces: `applyPageMeta(doc, { title, description, noindex })` in `utils/pageMeta.js`; hook `usePageMeta({ title, description, noindex })` in `hooks/usePageMeta.js`.

- [ ] **Step 1: Failing test** `src/utils/pageMeta.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPageMeta } from './pageMeta.js';

function fakeDoc() {
  const metas = {};
  return {
    title: '',
    metas,
    head: { appendChild: (el) => { metas[el.name] = el; } },
    createElement: () => ({ setAttribute(k, v) { this[k] = v; } }),
    querySelector: (sel) => metas[sel.match(/name="(.+?)"/)[1]] || null,
  };
}

test('sets title and description, creating the meta tag when absent', () => {
  const doc = fakeDoc();
  applyPageMeta(doc, { title: 'Login | Restroly', description: 'Sign in' });
  assert.equal(doc.title, 'Login | Restroly');
  assert.equal(doc.metas.description.content, 'Sign in');
});

test('noindex adds robots meta, otherwise removes the restriction', () => {
  const doc = fakeDoc();
  applyPageMeta(doc, { title: 'x', noindex: true });
  assert.equal(doc.metas.robots.content, 'noindex');
  applyPageMeta(doc, { title: 'y' });
  assert.equal(doc.metas.robots.content, 'index,follow');
});
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL (module missing).

- [ ] **Step 3: Implement**

```js
// src/utils/pageMeta.js
function upsertMeta(doc, name, content) {
  let el = doc.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = doc.createElement('meta');
    el.setAttribute('name', name);
    doc.head.appendChild(el);
  }
  el.content = content;
}

export function applyPageMeta(doc, { title, description, noindex = false }) {
  if (title) doc.title = title;
  if (description) upsertMeta(doc, 'description', description);
  upsertMeta(doc, 'robots', noindex ? 'noindex' : 'index,follow');
}
```

Note: in the fake, `setAttribute('name', ...)` sets `el.name`; real DOM `setAttribute` also works. `el.content = ...` works on both.

```js
// src/hooks/usePageMeta.js
import { useEffect } from 'react';
import { applyPageMeta } from '../utils/pageMeta';

export default function usePageMeta(meta) {
  const { title, description, noindex } = meta;
  useEffect(() => {
    applyPageMeta(document, { title, description, noindex });
  }, [title, description, noindex]);
}
```

- [ ] **Step 4: Run** `npm test`. Expected: PASS.

- [ ] **Step 5: Use the hook** at the top of each listed page component with these exact values (titles end with ` | Restroly`; Landing keeps the existing index.html title/description verbatim):
  - Login: `Log in | Restroly` / `Sign in to manage your restaurant menu, orders and QR codes.`
  - Register: `Create your account | Restroly` / `Start free: create digital menus, QR ordering and UPI payment links in minutes.`
  - ForgotPassword: `Reset password | Restroly` / `Reset your Restroly account password.` and `noindex: true`
  - PrivacyPolicy: `Privacy Policy | Restroly` / `How Restroly collects, uses and protects your data.`
  - TermsOfService: `Terms of Service | Restroly` / `The terms that govern use of the Restroly platform.`
  - RefundPolicy: `Refund Policy | Restroly` / `Restroly subscription refund and cancellation policy.`
  - NotFound: `Page not found | Restroly` / `The page you are looking for does not exist.` and `noindex: true`

- [ ] **Step 6: Verify** `npm test && npm run lint && npm run build`. Expected: all pass (lint warnings in untouched files are acceptable; report them).

- [ ] **Step 7: Commit** `feat(seo): per-page titles and descriptions`

---

### Task 3: Image and bundle weight

**Files:**
- Modify/replace: `RestroHub-FrontEnd/public/restro-banner.png` (→ `restro-banner.jpg`), `public/favicon.ico`, `vite.config.js` (`sourcemap`)
- Modify: any file referencing `restro-banner.png` (grep first)

**Interfaces:**
- Consumes: Task 1 already points `og:image` at `/restro-banner.jpg`.
- Produces: `public/restro-banner.jpg` (1200x630, ≤150 KB), `public/favicon.ico` (≤30 KB).

- [ ] **Step 1: Measure.** `ls -l public` and `grep -rn "restro-banner" . --include=*.{js,jsx,html,css,md} --exclude-dir=node_modules --exclude-dir=dist`. Record sizes.

- [ ] **Step 2: Convert** with one-off tools that do not touch `package.json`: `npx --yes sharp-cli -i public/restro-banner.png -o public/restro-banner.jpg resize 1200 630 --fit cover` then JPEG quality ~78 (check `sharp-cli --help` for the flag; tune until ≤150 KB). Regenerate the favicon from `public/faviconnobg.png` as a 16/32/48 multi-size ICO with `npx --yes png-to-ico` (resize to 48x48 first). If a tool cannot run offline or fails twice, STOP and report BLOCKED rather than adding a dependency.

- [ ] **Step 3: Replace** references to the old PNG with the JPG; `git rm public/restro-banner.png`.

- [ ] **Step 4: Production source maps off.** In `vite.config.js` set `build.sourcemap: false`.

- [ ] **Step 5: Verify.** `npm run build`; confirm `dist/restro-banner.jpg` ≤150 KB, `dist/favicon.ico` ≤30 KB, no `.map` files in `dist/`; open `index.html` meta references resolve to existing files.

- [ ] **Step 6: Commit** `perf(assets): compress social banner and favicon, drop prod source maps`

---

### Task 4: Cookie consent banner and Google Analytics 4

**Files:**
- Create: `src/utils/consent.js`, `src/utils/consent.test.js`, `src/utils/analytics.js`, `src/utils/analytics.test.js`, `src/components/common/CookieConsent.jsx`, `src/components/common/AnalyticsTracker.jsx`
- Modify: `src/App.jsx`, `.env.example`, `Dockerfile`

**Interfaces:**
- Produces: `readConsent(storage): 'granted'|'denied'|null`, `writeConsent(storage, value)`, `initAnalytics(win, doc, measurementId): boolean`, `trackPageView(win, path)`.

- [ ] **Step 1: Failing tests**

```js
// src/utils/consent.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readConsent, writeConsent } from './consent.js';

const mem = () => { const m = {}; return { getItem: (k) => m[k] ?? null, setItem: (k, v) => { m[k] = v; } }; };
const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };

test('round-trips granted/denied and ignores junk', () => {
  const s = mem();
  assert.equal(readConsent(s), null);
  writeConsent(s, 'granted');
  assert.equal(readConsent(s), 'granted');
  s.setItem('restroly_cookie_consent', 'banana');
  assert.equal(readConsent(s), null);
});

test('never throws when storage is blocked', () => {
  assert.equal(readConsent(blocked), null);
  assert.doesNotThrow(() => writeConsent(blocked, 'denied'));
});
```

```js
// src/utils/analytics.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { initAnalytics, trackPageView } from './analytics.js';

function env() {
  const appended = [];
  const win = {};
  const doc = { createElement: () => ({}), head: { appendChild: (el) => appended.push(el) } };
  return { win, doc, appended };
}

test('does nothing without a measurement id', () => {
  const { win, doc, appended } = env();
  assert.equal(initAnalytics(win, doc, ''), false);
  assert.equal(appended.length, 0);
});

test('injects gtag once and configures without auto page_view', () => {
  const { win, doc, appended } = env();
  assert.equal(initAnalytics(win, doc, 'G-TEST123'), true);
  assert.equal(initAnalytics(win, doc, 'G-TEST123'), false);
  assert.equal(appended.length, 1);
  assert.equal(appended[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  assert.ok(win.dataLayer.some((e) => e[0] === 'config' && e[2].send_page_view === false));
});

test('trackPageView is a no-op before init and pushes after', () => {
  const { win, doc } = env();
  assert.doesNotThrow(() => trackPageView(win, '/x'));
  initAnalytics(win, doc, 'G-TEST123');
  trackPageView(win, '/login');
  assert.ok(win.dataLayer.some((e) => e[0] === 'event' && e[1] === 'page_view' && e[2].page_path === '/login'));
});
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL (modules missing).

- [ ] **Step 3: Implement**

```js
// src/utils/consent.js
const KEY = 'restroly_cookie_consent';

export function readConsent(storage) {
  try {
    const v = storage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(storage, value) {
  try {
    storage.setItem(KEY, value);
  } catch {
    // storage blocked (private mode): choice just won't persist
  }
}
```

```js
// src/utils/analytics.js
export function initAnalytics(win, doc, measurementId) {
  if (!measurementId || win.__gaLoaded) return false;
  win.dataLayer = win.dataLayer || [];
  win.gtag = function gtag() {
    win.dataLayer.push(arguments);
  };
  win.gtag('js', new Date());
  win.gtag('config', measurementId, { send_page_view: false });
  const script = doc.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  doc.head.appendChild(script);
  win.__gaLoaded = true;
  return true;
}

export function trackPageView(win, path) {
  if (win.__gaLoaded) win.gtag('event', 'page_view', { page_path: path });
}
```

Note: `win.gtag` pushes the `arguments` object, so array-index access (`e[0]`) in the tests works on it.

```jsx
// src/components/common/CookieConsent.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { readConsent, writeConsent } from '../../utils/consent';
import { initAnalytics } from '../../utils/analytics';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => (GA_ID ? readConsent(window.localStorage) : 'denied'));

  if (choice === 'granted') initAnalytics(window, document, GA_ID);
  if (choice) return null;

  const decide = (value) => {
    writeConsent(window.localStorage, value);
    setChoice(value);
  };

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          We use cookies for anonymous analytics to improve Restroly. See our{' '}
          <Link to="/privacy-policy" className="font-medium underline">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => decide('denied')} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100">Decline</button>
          <button type="button" onClick={() => decide('granted')} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Accept</button>
        </div>
      </div>
    </div>
  );
}
```

```jsx
// src/components/common/AnalyticsTracker.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../utils/analytics';

export default function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(window, pathname);
  }, [pathname]);
  return null;
}
```

Note: a page view is sent only if GA is loaded. On the first accept the current page is not recorded; acceptable (ledger a ruling if the reviewer objects).

- [ ] **Step 4: Run** `npm test`. Expected: PASS (all consent + analytics tests).

- [ ] **Step 5: Mount.** In `src/App.jsx`, inside `<BrowserRouter>` after `<AppRoutes />`, add `<AnalyticsTracker />` and `<CookieConsent />` (import both). Add `VITE_GA_MEASUREMENT_ID=` (empty, with comment `# GA4 ID like G-XXXXXXXXXX; leave empty to disable analytics and the consent banner`) to `.env.example`, and ARG/ENV to `Dockerfile`.

- [ ] **Step 6: Verify.** `npm test && npm run lint && npm run build`. Review Focus checks: with `VITE_GA_MEASUREMENT_ID` unset the banner does not render (reason about code, state it in the report).

- [ ] **Step 7: Commit** `feat(analytics): cookie consent banner and consent-gated GA4`

---

### Task 5: Backend spam protection filter

**Files:**
- Create: `RestroHub/src/main/java/com/restroly/qrmenu/security/spam/RateLimiter.java`, `.../TurnstileVerifier.java`, `.../SpamProtectionFilter.java`; tests `RestroHub/src/test/java/com/restroly/qrmenu/security/spam/RateLimiterTest.java`, `SpamProtectionFilterTest.java`
- Modify: `RestroHub/src/main/resources/application.properties`

**Interfaces:**
- Produces: `RateLimiter(int max, long windowMs)` with `boolean allow(String key, long nowMillis)`; `TurnstileVerifier` with `boolean verify(String token, String ip)`; `SpamProtectionFilter extends OncePerRequestFilter` reading request headers `X-Hp` (honeypot, must be empty/absent) and `X-Turnstile-Token`.
- Protected paths (POST, matched on `request.getServletPath()`): `/public/api/v1/auth/{login,register,forgot-password,verify-reset-code,reset-password,resend-verification}`. Confirm the exact set against `AuthController`; if `resend-verification` is not a real endpoint, keep it in the set anyway and report it (the frontend calls it).

- [ ] **Step 1: Failing tests**

```java
// RateLimiterTest.java
package com.restroly.qrmenu.security.spam;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class RateLimiterTest {
  @Test
  void blocksAfterMaxWithinWindowAndRecoversAfter() {
    RateLimiter rl = new RateLimiter(2, 1000);
    assertTrue(rl.allow("ip", 0));
    assertTrue(rl.allow("ip", 10));
    assertFalse(rl.allow("ip", 20));
    assertTrue(rl.allow("other", 20));
    assertTrue(rl.allow("ip", 1001));
  }

  @Test
  void purgesIdleKeysSoMemoryStaysBounded() {
    RateLimiter rl = new RateLimiter(1, 10);
    for (int i = 0; i < 10_050; i++) rl.allow("k" + i, 0);
    rl.allow("trigger", 1_000);
    assertTrue(rl.size() < 10_050);
  }
}
```

```java
// SpamProtectionFilterTest.java
package com.restroly.qrmenu.security.spam;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class SpamProtectionFilterTest {
  private final TurnstileVerifier verifier = mock(TurnstileVerifier.class);
  private final FilterChain chain = mock(FilterChain.class);

  private SpamProtectionFilter filter(String mode, int max) {
    return new SpamProtectionFilter(mode, max, 60, verifier);
  }

  private MockHttpServletRequest post(String path) {
    MockHttpServletRequest r = new MockHttpServletRequest("POST", "/restroly" + path);
    r.setServletPath(path);
    r.setRemoteAddr("1.2.3.4");
    return r;
  }

  @Test
  void honeypotFilledIsRejectedWith400() throws Exception {
    MockHttpServletRequest r = post("/public/api/v1/auth/register");
    r.addHeader("X-Hp", "bot@spam.com");
    MockHttpServletResponse res = new MockHttpServletResponse();
    filter("honeypot", 10).doFilter(r, res, chain);
    assertEquals(400, res.getStatus());
    verify(chain, never()).doFilter(any(), any());
  }

  @Test
  void cleanRequestPassesAndExceedingLimitGets429() throws Exception {
    SpamProtectionFilter f = filter("honeypot", 2);
    for (int i = 0; i < 2; i++) {
      MockHttpServletResponse ok = new MockHttpServletResponse();
      f.doFilter(post("/public/api/v1/auth/login"), ok, chain);
      assertEquals(200, ok.getStatus());
    }
    MockHttpServletResponse limited = new MockHttpServletResponse();
    f.doFilter(post("/public/api/v1/auth/login"), limited, chain);
    assertEquals(429, limited.getStatus());
  }

  @Test
  void turnstileModeRequiresValidToken() throws Exception {
    when(verifier.verify("good", "1.2.3.4")).thenReturn(true);
    SpamProtectionFilter f = filter("turnstile", 10);

    MockHttpServletResponse missing = new MockHttpServletResponse();
    f.doFilter(post("/public/api/v1/auth/register"), missing, chain);
    assertEquals(400, missing.getStatus());

    MockHttpServletRequest r = post("/public/api/v1/auth/register");
    r.addHeader("X-Turnstile-Token", "good");
    MockHttpServletResponse ok = new MockHttpServletResponse();
    f.doFilter(r, ok, chain);
    assertEquals(200, ok.getStatus());
  }

  @Test
  void unprotectedPathsAreUntouched() throws Exception {
    MockHttpServletRequest get = new MockHttpServletRequest("GET", "/restroly/public/api/v1/auth/login");
    get.setServletPath("/public/api/v1/auth/login");
    get.addHeader("X-Hp", "x");
    MockHttpServletResponse res = new MockHttpServletResponse();
    filter("honeypot", 1).doFilter(get, res, chain);
    assertEquals(200, res.getStatus());
    verify(chain).doFilter(get, res);
  }
}
```

- [ ] **Step 2: Run** `./gradlew test --tests "com.restroly.qrmenu.security.spam.*"`. Expected: FAIL (classes missing). If the first Gradle run is blocked by environment (missing wrapper jar, no network), report BLOCKED with the output.

- [ ] **Step 3: Implement**

```java
// RateLimiter.java
package com.restroly.qrmenu.security.spam;

import java.util.ArrayDeque;
import java.util.concurrent.ConcurrentHashMap;

/** Sliding-window per-key limiter. ponytail: in-memory, per instance; use a shared store if the API scales out. */
public class RateLimiter {
  private static final int PURGE_THRESHOLD = 10_000;

  private final int max;
  private final long windowMs;
  private final ConcurrentHashMap<String, ArrayDeque<Long>> hits = new ConcurrentHashMap<>();

  public RateLimiter(int max, long windowMs) {
    this.max = max;
    this.windowMs = windowMs;
  }

  /**
   * Records a hit for {@code key}.
   *
   * @return false when the key already used {@code max} hits inside the window
   */
  public boolean allow(String key, long nowMillis) {
    if (hits.size() > PURGE_THRESHOLD) {
      hits.entrySet().removeIf(e -> prune(e.getValue(), nowMillis));
    }
    ArrayDeque<Long> q = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
    synchronized (q) {
      prune(q, nowMillis);
      if (q.size() >= max) {
        return false;
      }
      q.addLast(nowMillis);
      return true;
    }
  }

  int size() {
    return hits.size();
  }

  private boolean prune(ArrayDeque<Long> q, long now) {
    synchronized (q) {
      while (!q.isEmpty() && now - q.peekFirst() >= windowMs) {
        q.pollFirst();
      }
      return q.isEmpty();
    }
  }
}
```

```java
// TurnstileVerifier.java
package com.restroly.qrmenu.security.spam;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/** Verifies Cloudflare Turnstile tokens server-side. */
@Component
public class TurnstileVerifier {
  private static final String URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  private final String secret;
  private final RestClient client = RestClient.create();

  public TurnstileVerifier(@Value("${app.spam-protection.turnstile.secret:}") String secret) {
    this.secret = secret;
  }

  /**
   * @return true only when Cloudflare confirms the token; false on any error or missing secret
   */
  public boolean verify(String token, String ip) {
    if (secret.isBlank() || token == null || token.isBlank()) {
      return false;
    }
    MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
    form.add("secret", secret);
    form.add("response", token);
    form.add("remoteip", ip);
    try {
      Map<?, ?> body =
          client
              .post()
              .uri(URL)
              .contentType(MediaType.APPLICATION_FORM_URLENCODED)
              .body(form)
              .retrieve()
              .body(Map.class);
      return body != null && Boolean.TRUE.equals(body.get("success"));
    } catch (RuntimeException e) {
      return false;
    }
  }
}
```

```java
// SpamProtectionFilter.java
package com.restroly.qrmenu.security.spam;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Rate-limits abuse-prone public auth endpoints and checks a honeypot or Turnstile token. */
@Component
public class SpamProtectionFilter extends OncePerRequestFilter {
  private static final String BASE = "/public/api/v1/auth/";
  private static final Set<String> PROTECTED =
      Set.of(
          BASE + "login",
          BASE + "register",
          BASE + "forgot-password",
          BASE + "verify-reset-code",
          BASE + "reset-password",
          BASE + "resend-verification");

  private final boolean turnstile;
  private final RateLimiter limiter;
  private final TurnstileVerifier verifier;

  public SpamProtectionFilter(
      @Value("${app.spam-protection.mode:honeypot}") String mode,
      @Value("${app.spam-protection.rate-limit.max:10}") int max,
      @Value("${app.spam-protection.rate-limit.window-seconds:60}") int windowSeconds,
      TurnstileVerifier verifier) {
    this.turnstile = "turnstile".equalsIgnoreCase(mode);
    this.limiter = new RateLimiter(max, windowSeconds * 1000L);
    this.verifier = verifier;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return !"POST".equals(request.getMethod()) || !PROTECTED.contains(request.getServletPath());
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String ip = request.getRemoteAddr();
    if (!limiter.allow(ip, System.currentTimeMillis())) {
      reject(response, 429, "Too many requests. Please try again later.");
      return;
    }
    boolean human =
        turnstile
            ? verifier.verify(request.getHeader("X-Turnstile-Token"), ip)
            : isBlank(request.getHeader("X-Hp"));
    if (!human) {
      reject(response, 400, "Request rejected.");
      return;
    }
    chain.doFilter(request, response);
  }

  private static boolean isBlank(String s) {
    return s == null || s.isBlank();
  }

  private static void reject(HttpServletResponse response, int status, String message)
      throws IOException {
    response.setStatus(status);
    response.setContentType("application/json");
    response.getWriter().write("{\"message\":\"" + message + "\"}");
  }
}
```

- [ ] **Step 4: Properties.** Append to `application.properties`:

```
# Spam protection for public auth endpoints: honeypot (default, no keys) or turnstile
app.spam-protection.mode=${SPAM_PROTECTION_MODE:honeypot}
app.spam-protection.rate-limit.max=${SPAM_RATE_LIMIT_MAX:10}
app.spam-protection.rate-limit.window-seconds=${SPAM_RATE_LIMIT_WINDOW_SECONDS:60}
app.spam-protection.turnstile.secret=${TURNSTILE_SECRET_KEY:}
```

- [ ] **Step 5: Run** the Step 2 command. Expected: PASS (6 tests). Then `./gradlew spotlessApply` and `./gradlew compileJava`.

- [ ] **Step 6: Confirm** the `@Component` filter is not blocked by `SecurityConfig` (it is a plain servlet filter, runs before Spring Security). Note in the report that behind a reverse proxy `getRemoteAddr()` is the proxy IP unless `server.forward-headers-strategy=framework` is set (documented in Task 7, not changed here).

- [ ] **Step 7: Commit** `feat(security): honeypot/turnstile and rate limiting for public auth endpoints`

---

### Task 6: Frontend spam guard wiring

**Files:**
- Create: `src/utils/spamState.js`, `src/utils/spamState.test.js`, `src/components/common/SpamGuard.jsx`
- Modify: `src/services/common/api.js`, `src/pages/public/{Login,Register,ForgotPassword}.jsx`, `.env.example`, `Dockerfile`

**Interfaces:**
- Consumes: backend headers `X-Hp`, `X-Turnstile-Token` (Task 5).
- Produces: `setHoneypot(v)`, `setTurnstileToken(v)`, `spamHeaders(mode)` in `utils/spamState.js`; `<SpamGuard />` component.

- [ ] **Step 1: Failing test**

```js
// src/utils/spamState.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { setHoneypot, setTurnstileToken, spamHeaders } from './spamState.js';

test('honeypot mode sends X-Hp with the current field value', () => {
  setHoneypot('');
  assert.deepEqual(spamHeaders('honeypot'), { 'X-Hp': '' });
  setHoneypot('bot');
  assert.deepEqual(spamHeaders('honeypot'), { 'X-Hp': 'bot' });
});

test('turnstile mode sends the token instead', () => {
  setTurnstileToken('tok');
  assert.deepEqual(spamHeaders('turnstile'), { 'X-Turnstile-Token': 'tok' });
});
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL.

- [ ] **Step 3: Implement**

```js
// src/utils/spamState.js
let honeypot = '';
let turnstileToken = '';

export const setHoneypot = (v) => { honeypot = v; };
export const setTurnstileToken = (v) => { turnstileToken = v; };

export function spamHeaders(mode) {
  return mode === 'turnstile' ? { 'X-Turnstile-Token': turnstileToken } : { 'X-Hp': honeypot };
}
```

```jsx
// src/components/common/SpamGuard.jsx
import { useEffect, useRef } from 'react';
import { setHoneypot, setTurnstileToken } from '../../utils/spamState';

const MODE = import.meta.env.VITE_SPAM_PROTECTION_MODE || 'honeypot';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function SpamGuard() {
  const box = useRef(null);

  useEffect(() => {
    if (MODE !== 'turnstile' || !SITE_KEY) return undefined;
    let widgetId;
    const render = () => {
      widgetId = window.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        callback: setTurnstileToken,
        'expired-callback': () => setTurnstileToken(''),
      });
    };
    if (window.turnstile) {
      render();
    } else {
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => {
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  if (MODE === 'turnstile') return <div ref={box} className="my-2" />;

  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      onChange={(e) => setHoneypot(e.target.value)}
      className="absolute -left-[9999px] h-0 w-0 opacity-0"
    />
  );
}
```

- [ ] **Step 4: Interceptor.** In `src/services/common/api.js` request interceptor, before `return config;` add:

```js
if (config.method === 'post' && config.url?.includes('/public/api/v1/auth/')) {
  Object.assign(config.headers, spamHeaders(import.meta.env.VITE_SPAM_PROTECTION_MODE || 'honeypot'));
}
```

and `import { spamHeaders } from "../../utils/spamState";`.

- [ ] **Step 5: Place `<SpamGuard />`** inside the `<form>` of Login, Register and ForgotPassword (the form's parent must be `relative` so the off-screen input does not affect layout; add `relative` if missing). Add `VITE_SPAM_PROTECTION_MODE=honeypot` and `VITE_TURNSTILE_SITE_KEY=` (commented explanation) to `.env.example`, and ARG/ENV to `Dockerfile`.

- [ ] **Step 6: Verify.** `npm test && npm run lint && npm run build`. Also confirm by reading `Register.jsx` that `/public/api/v1/auth/resend-verification` is called and report whether `AuthController` actually defines it (likely a pre-existing broken link; do NOT fix in this task, just report).

- [ ] **Step 7: Commit** `feat(security): frontend honeypot/turnstile guard for public auth forms`

---

### Task 7: HTTPS documentation (no config changes)

**Files:**
- Create: `agent/HTTPS_NGINX.md`

- [ ] **Step 1: Write the document** with these sections, concrete commands/snippets, clearly marked "NOT APPLIED, for later":
  1. Context: current `RestroHub-FrontEnd/nginx.conf` listens on 80 only, no redirect/HSTS; backend sets no HSTS.
  2. Option A (recommended): TLS terminated at a load balancer / reverse proxy. nginx redirect snippet using `$http_x_forwarded_proto != "https"` → `return 301 https://$host$request_uri;`, plus `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;` (start with a short max-age, raise after verifying; no `preload` until sure).
  3. Option B: nginx terminates TLS (`listen 443 ssl http2`, cert paths, certbot commands, port-80 redirect server block).
  4. Backend: `server.forward-headers-strategy=framework` so `request.getRemoteAddr()` and scheme are correct behind the proxy (also required for the spam rate limiter to key on real client IPs); `CORS_ALLOWED_ORIGINS` must use `https://` origins; `VITE_API_BASE_URL` and `VITE_SITE_URL` must be `https://` at build time.
  5. Google OAuth: authorized origins must be the https origin.
  6. Verification checklist (curl -I http→301, HSTS header present, SSL Labs, no mixed content).
  Also mention `docker-compose.yml` port mapping must expose 443 for Option B.

- [ ] **Step 2: Verify** `git status` shows only this file; markdown renders (no broken code fences).

- [ ] **Step 3: Commit** `docs(https): nginx HTTPS enforcement runbook for later`

---

### Task 8: Landing page single clear CTA

**Files:**
- Modify: `RestroHub-FrontEnd/src/pages/public/Landing.jsx`

**Interfaces:** none.

- [ ] **Step 1: Inspect** every `<Link>`/`<a>`/`<button>` in `Landing.jsx` that acts as a call to action (labels like "Get Started", "Start Free", "Book a demo", "Contact", pricing buttons). Write the inventory (line, label, target) into the report.

- [ ] **Step 2: Apply this contract.**
  - The single primary CTA is **"Get Started Free"** and it links to `/register` (today the header button points at `/admin`, which is the authenticated area; fix it).
  - It uses the existing filled blue button style; every repeat of it (header, hero, pricing, footer band) uses the identical label and target.
  - The hero shows exactly one filled button. A secondary action, if present, is a plain text link ("Log in" → `/login`), not a second filled button.
  - Pricing-plan buttons may keep plan-specific labels only if they link to `/register` with the plan preserved (e.g. `/register?plan=pro`) and are not styled as competing filled hero buttons.
  - Do not restyle unrelated sections; no new copy beyond label/target changes.

- [ ] **Step 3: Verify** `npm run lint && npm run build`; report the before/after inventory.

- [ ] **Step 4: Commit** `feat(landing): single primary CTA pointing to registration`

---

### Task 9: Accessibility, performance and link audit

**Files:**
- Create: `agent/LAUNCH_AUDIT.md`
- Modify: only `src/pages/public/{Landing,Login,Register}.jsx` or shared components they use, and only for color-contrast fixes that are a class change (e.g. `text-slate-400` → `text-slate-600`).

- [ ] **Step 1: Build and serve** `npm run build && npx vite preview --port 4173` (background).

- [ ] **Step 2: Measure** with one-off tools (no dependency added): `npx --yes lighthouse http://localhost:4173/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless" --output=json --output-path=<scratch>` and `npx --yes @axe-core/cli http://localhost:4173/ http://localhost:4173/login http://localhost:4173/register`. If Chrome is unavailable, report that and skip, do not install a browser.

- [ ] **Step 3: Link check.** Extract every `to=`/`href=` internal target from `src/` and confirm each resolves to a route in `src/routes/index.jsx`; list dead ones. Also list frontend API calls whose path has no matching Spring mapping (known suspect: `/public/api/v1/auth/resend-verification`).

- [ ] **Step 4: Form validation check.** For Login, Register, ForgotPassword, list which fields have required/format/length validation client-side, and which backend DTOs have `@Valid`/constraints. Report gaps; fix none.

- [ ] **Step 5: Fix** only contrast violations rated serious/critical by axe on the three pages, via class changes. Re-run axe on those pages to confirm.

- [ ] **Step 6: Write** `agent/LAUNCH_AUDIT.md`: scores per category, remaining issues ranked, dead links, validation gaps, mobile (375px) observations if the tooling reported them, and what was not checked.

- [ ] **Step 7: Commit** `docs(audit): launch readiness audit and contrast fixes`
