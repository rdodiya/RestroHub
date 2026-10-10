import { getStoredRoles } from '../services/common/authStorage';

export const FULL_ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

export const normalizeRole = (role) => {
  const roleName = typeof role === 'string' ? role : role?.authority || role?.name || '';
  return roleName.replace(/^ROLE_/, '').toUpperCase();
};

export const readStoredRoles = () => {
  try {
    const roles = getStoredRoles();
    return Array.isArray(roles) ? roles.map(normalizeRole).filter(Boolean) : [];
  } catch {
    console.error('Failed to parse roles');
    return [];
  }
};

export const hasAnyRole = (roles, allowedRoles = []) => {
  const normalizedRoles = roles.map(normalizeRole);
  const allowed = allowedRoles.map(normalizeRole);
  return normalizedRoles.some((role) => allowed.includes(role));
};

// Mirrors security/Permission.java. First matching prefix wins.
// App roles: SUPER_ADMIN (platform owner), ADMIN (restaurant owner), MANAGER, STAFF (KDS/orders).
const SETTINGS = ['SUPER_ADMIN', 'ADMIN'];
const FINANCIAL = [...SETTINGS, 'MANAGER'];
const NOT_STAFF = FINANCIAL;
const EVERYONE = [...NOT_STAFF, 'STAFF'];
const ROUTE_ACCESS = [
  ['/admin/dashboard', FINANCIAL],
  ['/admin/menus', NOT_STAFF],
  ['/admin/store', NOT_STAFF],
  ['/admin/marketing', SETTINGS],
  ['/admin/upi-links', SETTINGS],
  ['/admin/subscriptions', ['SUPER_ADMIN']],
  ['/admin/registration-requests', ['SUPER_ADMIN']],
  ['/admin/role-management', ['SUPER_ADMIN']],
  ['/admin/orders', EVERYONE],
  ['/admin/kds', EVERYONE],
  ['/admin/profile', EVERYONE],
  ['/admin/help-support', EVERYONE],
];

/** True when any of the (ROLE_-prefixed or bare) roles may open the admin path. Unknown paths: deny. */
export const canAccessPath = (roles, path) => {
  const rule = ROUTE_ACCESS.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return !!rule && hasAnyRole(roles, rule[1]);
};

export const getDefaultAdminPath = (roles) => {
  if (canAccessPath(roles, '/admin/dashboard')) return '/admin/dashboard';
  if (canAccessPath(roles, '/admin/kds')) return '/admin/kds';
  return '/unauthorized';
};

// self-check (run: node src/utils/auth.js is not wired; call from console if needed)
export const __authSelfCheck = () => {
  console.assert(canAccessPath(['ROLE_STAFF'], '/admin/orders'));
  console.assert(!canAccessPath(['STAFF'], '/admin/menus'));
  console.assert(!canAccessPath(['STAFF'], '/admin/dashboard'));
  console.assert(!canAccessPath(['MANAGER'], '/admin/upi-links'));
  console.assert(canAccessPath(['ROLE_ADMIN'], '/admin/upi-links'));
};

/** Human label for the highest app role in the list (SUPER_ADMIN > ADMIN > MANAGER > STAFF). */
export const roleLabel = (roles) => {
  const labels = [
    ['SUPER_ADMIN', 'Platform Owner'],
    ['ADMIN', 'Restaurant Owner'],
    ['MANAGER', 'Manager'],
    ['STAFF', 'Staff'],
  ];
  const found = labels.find(([role]) => hasAnyRole(roles, [role]));
  return found ? found[1] : '';
};
