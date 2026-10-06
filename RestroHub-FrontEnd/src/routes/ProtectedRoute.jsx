import { Navigate, useLocation } from 'react-router-dom';
import { hasRole } from '@hooks/useAuth';
import { getAccessToken } from '@services/common/authStorage';
import { canAccessPath, getDefaultAdminPath, readStoredRoles } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const roles = readStoredRoles();
  if (!canAccessPath(roles, location.pathname)) {
    const home = getDefaultAdminPath(roles);
    return <Navigate to={home} replace />;
  }

  return children;
};

/**
 * Route guard that restricts access to users with ADMIN or SUPER_ADMIN roles.
 * Wraps individual routes inside an already-authenticated layout.
 * Non-admin users are redirected to the admin dashboard.
 */
const AdminRoute = ({ children }) => {
  if (!hasRole('ADMIN', 'SUPER_ADMIN')) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export { AdminRoute };
export default ProtectedRoute;
