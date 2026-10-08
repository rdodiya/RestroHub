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
