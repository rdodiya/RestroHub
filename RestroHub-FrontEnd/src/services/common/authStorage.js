const AUTH_KEYS = ["accessToken", "refreshToken", "roles"];

const getStorage = (rememberMe) => (rememberMe ? localStorage : sessionStorage);

export const getAuthItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

export const getAccessToken = () => getAuthItem("accessToken");

export const getStoredRoles = () => {
  const rolesStr = getAuthItem("roles");
  if (!rolesStr) return [];

  try {
    const roles = JSON.parse(rolesStr);
    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error("Failed to parse roles", error);
    return [];
  }
};

export const storeAuthSession = ({ accessToken, refreshToken, roles }, rememberMe) => {
  clearAuthSession();

  const storage = getStorage(rememberMe);
  storage.setItem("accessToken", accessToken);
  storage.setItem("refreshToken", refreshToken);
  storage.setItem("roles", JSON.stringify(roles || []));
};

export const clearAuthSession = () => {
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};
