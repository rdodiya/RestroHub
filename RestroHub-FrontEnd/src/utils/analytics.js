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
