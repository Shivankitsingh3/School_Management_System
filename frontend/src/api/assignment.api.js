import api from "./axios";



export const createAssignmentAPI = (data) =>
  api.post("assignments/create/", data);

export const listAssignmentsAPI = () => api.get("assignments/");

export const getAssignmentDetailAPI = (assignmentId) =>
  api.get(`assignments/${assignmentId}/`);




export const submitAssignmentAPI = (assignmentId, data) => {
  const formData = new FormData();
  formData.append("answer_text", data.answer_text || "");

  if (data.answer_file) {
    formData.append("answer_file", data.answer_file);
  }

  return api.post(`assignments/${assignmentId}/submit/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStudentSubmissionsAPI = () =>
  api.get("assignments/my-submissions/");

export const getTeacherSubmissionsAPI = () =>
  api.get("assignments/submissions/teacher/");

export const evaluateSubmissionAPI = (submissionId, data) =>
  api.patch(`assignments/submissions/${submissionId}/evaluate/`, data);

export const getAISuggestionAPI = (submissionId) =>
  api.get(`assignments/ai-suggestion/${submissionId}/`);
