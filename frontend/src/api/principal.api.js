import api from "./axios";

export const getPrincipalDashboardStatsAPI = () =>
  api.get("principal/dashboard/stats/");

export const getPendingTeachersAPI = () =>
  api.get("principal/teachers/pending/");

export const getAllTeachersAPI = () => api.get("/teacher/");

export const getSubjectsByClassroomAPI = (classroomId) =>
  api.get(`/subjects/?classroom=${classroomId}`);

export const assignTeacherAPI = (data) => api.post("/principal/assign/", data);

export const getPrincipalDailyAttendanceAPI = (
  date,
  classroomId = null,
  subjectId = null,
) => {
  let url = `attendance/reports/principal/daily/?date=${date}`;
  if (classroomId) url += `&classroom=${classroomId}`;
  if (subjectId) url += `&subject=${subjectId}`;
  return api.get(url);
};


export const getPrincipalProfileAPI = () => api.get("principal/me/");


export const getPrincipalStudentPercentagesAPI = (
  classroom,
  subject = null,
) => {
  let url = `/attendance/principal/student-percentages/?classroom=${classroom}`;
  if (subject) {
    url += `&subject=${subject}`;
  }
  return api.get(url);
};