export const ADMIN_ACCESS_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'];
export const FULL_ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];
export const LIMITED_ADMIN_ROLES = ['MANAGER', 'STAFF'];

export const normalizeRole = (role) => {
  const roleName = typeof role === 'string' ? role : role?.authority || role?.name || '';
  return roleName.replace(/^ROLE_/, '').toUpperCase();
};

export const readStoredRoles = () => {
  try {
    const rolesStr = localStorage.getItem('roles');
    const roles = rolesStr ? JSON.parse(rolesStr) : [];
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

export const getDefaultAdminPath = (roles) => {
  if (hasAnyRole(roles, FULL_ADMIN_ROLES)) return '/admin/dashboard';
  if (hasAnyRole(roles, LIMITED_ADMIN_ROLES)) return '/admin/kds';
  return '/unauthorized';
};
