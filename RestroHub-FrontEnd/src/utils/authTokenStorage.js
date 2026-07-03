const TOKEN_KEYS = ["accessToken", "refreshToken", "roles"];

const getActiveStorage = () =>
  sessionStorage.getItem("accessToken") ? sessionStorage : localStorage;

export const getAccessToken = () =>
  sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

export const getRefreshToken = () =>
  sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken");

export const getRolesJson = () =>
  sessionStorage.getItem("roles") || localStorage.getItem("roles");

export const persistAuthTokens = (
  { accessToken, refreshToken, roles },
  rememberMe = true,
) => {
  const target = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  TOKEN_KEYS.forEach((key) => other.removeItem(key));

  target.setItem("accessToken", accessToken);
  target.setItem("refreshToken", refreshToken);
  target.setItem("roles", JSON.stringify(roles));
};

export const clearAuthTokens = () => {
  TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export const getAuthStorage = getActiveStorage;
