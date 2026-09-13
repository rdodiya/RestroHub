// src/hooks/useAuth.js
// Utility hook to read user roles from storage (localStorage or sessionStorage).
import { getStoredRoles } from '@services/common/authStorage';

/**
 * Returns the current user's roles from storage.
 * The login flow stores roles as JSON.stringify(["ROLE_ADMIN", "ROLE_CUSTOMER", ...])
 */
export const getUserRoles = () => {
  return getStoredRoles();
};

/**
 * Check if the current user has ANY of the specified roles.
 * Handles both "ADMIN" and "ROLE_ADMIN" formats from the backend.
 *
 * @param  {...string} requiredRoles - e.g. 'ADMIN', 'SUPER_ADMIN'
 * @returns {boolean}
 */
export const hasRole = (...requiredRoles) => {
  const userRoles = getUserRoles();
  const matched = requiredRoles.some((role) => {
    const normalised = role.trim().toUpperCase();
    return userRoles.some(
      (ur) => {
        const roleName = typeof ur === 'string' ? ur : ur?.authority || ur?.name || '';
        const cleaned = roleName.trim().toUpperCase();
        return cleaned === normalised || cleaned === `ROLE_${normalised}`;
      }
    );
  });
  return matched;
};

/**
 * Convenience: true when user is ADMIN or SUPER_ADMIN.
 */
export const isAdmin = () => hasRole('ADMIN', 'SUPER_ADMIN');


