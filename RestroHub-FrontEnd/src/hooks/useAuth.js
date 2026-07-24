// src/hooks/useAuth.js
// Utility hook to read user roles from localStorage.
// Once backend APIs are integrated, this can be extended to use context/API calls.

/**
 * Returns the current user's roles from localStorage.
 * The login flow stores roles as JSON.stringify(["ROLE_ADMIN", "ROLE_CUSTOMER", ...])
 */
export const getUserRoles = () => {
  try {
    const raw = localStorage.getItem('roles');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
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
        const cleaned = ur.trim().toUpperCase();
        return cleaned === normalised || cleaned === `ROLE_${normalised}`;
      }
    );
  });
  console.log("Checking roles:", { userRoles, requiredRoles, matched });
  return matched;
};

/**
 * Convenience: true when user is ADMIN or SUPER_ADMIN.
 */
export const isAdmin = () => hasRole('ADMIN', 'SUPER_ADMIN');


