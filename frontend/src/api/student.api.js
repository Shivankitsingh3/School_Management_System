import api from "./axios";

export const getStudentListAPI = (params) => api.get("student/", {params});

export const getStudentProfileAPI = () => api.get("student/me/");


export const getStudentDetailAPI = (id) => api.get(`student/${id}/`);


export const getStudentsByClassroomAPI = (classroomId) =>
  api.get(`student/?classroom=${classroomId}`);
