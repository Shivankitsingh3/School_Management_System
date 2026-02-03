import api from "./axios";


export const markAttendanceAPI = (data) => api.post("attendance/mark/", data);


export const getTeacherDailyReportAPI = (date, subjectId, classroomId) =>
  api.get(
    `attendance/reports/teacher/daily/?date=${date}&subject=${subjectId}&classroom=${classroomId}`
  );


export const getTeacherAttendancePercentageAPI = (subjectId, classroomId) =>
  api.get(
    `attendance/reports/teacher/percentage/?subject=${subjectId}&classroom=${classroomId}`
  );




export const getStudentAttendanceAPI = () => api.get("attendance/my/");


export const getStudentAttendanceSummaryAPI = () =>
  api.get("attendance/reports/student/summary/");




export const getPrincipalDailyAttendanceAPI = (
  date,
  classroomId,
  subjectId
) => {
  const params = new URLSearchParams();
  params.append("date", date);

  if (classroomId) {
    params.append("classroom", classroomId);
  }
  if (subjectId) {
    params.append("subject", subjectId);
  }

  return api.get(`attendance/reports/principal/daily/?${params.toString()}`);
};
