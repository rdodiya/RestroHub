import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, getRolesJson } from "@/utils/authTokenStorage";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  let roles = [];
  try {
    const rolesStr = getRolesJson();
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

export default ProtectedRoute;