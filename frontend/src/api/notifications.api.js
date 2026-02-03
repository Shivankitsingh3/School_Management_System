import api from "./axios";


export const getNotificationsAPI = () => {
  return api.get("notifications/");
};


export const markNotificationReadAPI = (pk) => {
  return api.patch(`notifications/${pk}/read/`);
};


export const markAllNotificationsReadAPI = () => {
  return api.patch("notifications/mark-all-read/");
};
