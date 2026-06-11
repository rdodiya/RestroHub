import { Navigate } from "react-router-dom";
import { hasRole } from "@hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
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
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

export { AdminRoute };
export default ProtectedRoute;