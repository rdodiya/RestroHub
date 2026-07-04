import { Navigate, useLocation } from "react-router-dom";
import {
  ADMIN_ACCESS_ROLES,
  FULL_ADMIN_ROLES,
  LIMITED_ADMIN_ROLES,
  getDefaultAdminPath,
  hasAnyRole,
  readStoredRoles,
} from "../utils/auth";

const LIMITED_ADMIN_PATHS = ["/admin/kds", "/admin/orders", "/admin/profile"];

const ProtectedRoute = ({ children, allowedRoles = ADMIN_ACCESS_ROLES }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const roles = readStoredRoles();

  if (!hasAnyRole(roles, allowedRoles)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  const hasFullAdminAccess = hasAnyRole(roles, FULL_ADMIN_ROLES);
  const hasLimitedAdminAccess = hasAnyRole(roles, LIMITED_ADMIN_ROLES);

  if (!hasFullAdminAccess && hasLimitedAdminAccess) {
    const isAllowed = LIMITED_ADMIN_PATHS.some((path) => location.pathname.startsWith(path));
    if (!isAllowed || location.pathname === "/admin" || location.pathname === "/admin/dashboard") {
      return <Navigate to={getDefaultAdminPath(roles)} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
