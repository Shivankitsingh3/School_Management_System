import api from "./axios";

export const getSubjectsAPI = (classroomId = null) => {
  if (classroomId) {
    return api.get(`subjects/?classroom=${classroomId}`);
  }
  return api.get("subjects/");
};


