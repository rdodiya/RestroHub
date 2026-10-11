import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPageMeta } from './pageMeta.js';

function fakeDoc() {
  const metas = {};
  return {
    title: '',
    metas,
    head: {
      appendChild: (el) => {
        metas[el.name] = el;
      },
    },
    createElement: () => ({
      setAttribute(k, v) {
        this[k] = v;
      },
    }),
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
