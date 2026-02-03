import api from "./axios";


export const getTeacherListAPI = (params = {}) => {
  return api.get("teacher/", { params });
};


export const getTeacherProfileAPI = () => api.get("teacher/me/");


export const getTeacherAssignedClassroomsAPI = () =>
  api.get("teacher/my-classrooms/");


export const getTeacherAssignedSubjectsAPI = (classroomId = null) => {
  if (classroomId) {
    return api.get(`teacher/my-subjects/?classroom=${classroomId}`);
  }
  return api.get("teacher/my-subjects/");
};


export const getTeacherDetailAPI = (teacherId) =>
  api.get(`teacher/${teacherId}/`);


