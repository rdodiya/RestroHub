import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const PAGES = [
  '/',
  '/login',
  '/register',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
];

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
  const { sitemap, robots } = buildSeoFiles(
    env.VITE_SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:3000'
  );
  writeFileSync('public/sitemap.xml', sitemap);
  writeFileSync('public/robots.txt', robots);
}
