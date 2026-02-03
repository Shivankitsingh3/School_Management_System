const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
