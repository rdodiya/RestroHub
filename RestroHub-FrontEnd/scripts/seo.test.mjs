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
