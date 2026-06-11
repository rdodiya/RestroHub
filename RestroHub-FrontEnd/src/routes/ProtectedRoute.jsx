import { Navigate, useLocation } from "react-router-dom";
import { hasRole } from "@hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  let roles = [];
  try {
    const rolesStr = localStorage.getItem("roles");
    if (rolesStr) roles = JSON.parse(rolesStr);
  } catch (e) {
    console.error("Failed to parse roles");
  }

  const hasRole = (roleToCheck) => {
    if (!Array.isArray(roles)) return false;
    return roles.some(r => {
      const roleName = typeof r === 'string' ? r : r.authority || r.name;
      return roleName === roleToCheck || roleName === `ROLE_${roleToCheck}`;
    });
  };

  const isAdmin = hasRole("ADMIN");
  const isManager = hasRole("MANAGER");
  const isStaff = hasRole("STAFF");

  if (!isAdmin && (isManager || isStaff)) {
    const allowedPaths = ["/admin/kds", "/admin/orders", "/admin/profile"];
    const isAllowed = allowedPaths.some(p => location.pathname.startsWith(p));

    if (!isAllowed || location.pathname === "/admin" || location.pathname === "/admin/dashboard") {
      return <Navigate to="/admin/kds" replace />;
    }
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
