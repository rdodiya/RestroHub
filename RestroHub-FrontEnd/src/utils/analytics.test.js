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
  assert.ok(
    win.dataLayer.some(
      (e) => e[0] === 'event' && e[1] === 'page_view' && e[2].page_path === '/login'
    )
  );
});
