import api from "./axios";

export const loginAPI = (data) => api.post("account/login/", data);

export const registerAPI = (data) => api.post("account/register/", data);

export const activateAccountAPI = (uid, token) =>
  api.get(`account/activate/${uid}/${token}/`);

export const forgotPasswordAPI = (email) =>
  api.post("account/forgot-password/", { email });

export const resetPasswordAPI = (uid, token, data) =>
  api.post(`account/reset-password/${uid}/${token}/`, data);

export const changePasswordAPI = (data) =>
  api.post("account/change-password/", data);

export const getProfileAPI = () => api.get("account/me/");
