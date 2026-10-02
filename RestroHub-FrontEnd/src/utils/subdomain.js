// Tenant slug from a host such as royalbites.restroly.in -> "royalbites".
// Returns null for localhost, IPs, www, the bare app domain and unrelated hosts.
export const APP_DOMAIN = 'restroly.in';

export const getSubdomainSlug = (hostname = window.location.hostname) => {
  const host = String(hostname).toLowerCase().replace(/:\d+$/, '');
  if (!host.endsWith(`.${APP_DOMAIN}`)) return null;
  const slug = host.slice(0, -APP_DOMAIN.length - 1).split('.')[0];
  return slug && slug !== 'www' ? slug : null;
};

// self-check: call from the browser console (no test runner wired for the frontend)
export const __subdomainSelfCheck = () => {
  console.assert(getSubdomainSlug('royalbites.restroly.in') === 'royalbites');
  console.assert(getSubdomainSlug('royalbites.restroly.in:3000') === 'royalbites');
  console.assert(getSubdomainSlug('www.restroly.in') === null);
  console.assert(getSubdomainSlug('restroly.in') === null);
  console.assert(getSubdomainSlug('localhost') === null);
  console.assert(getSubdomainSlug('127.0.0.1') === null);
};
