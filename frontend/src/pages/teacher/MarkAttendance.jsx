import { useState, useEffect } from "react";
import { getTeacherAssignedClassroomsAPI } from "../../api/teacher.api";
import { getTeacherAssignedSubjectsAPI } from "../../api/teacher.api";
import { getStudentsByClassroomAPI } from "../../api/student.api";
import { markAttendanceAPI } from "../../api/attendance.api";
import DashboardLayout from "../../layouts/DashboardLayout";

const MarkAttendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [header, setHeader] = useState({
    date: new Date().toISOString().split("T")[0],
    classroom: "",
    subject: "",
  });
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch classrooms on mount
  useEffect(() => {
    getTeacherAssignedClassroomsAPI()
      .then((res) => setClassrooms(res.data))
      .catch((err) => {
        console.error("Error fetching classrooms:", err);
        setError("Failed to load classrooms");
      });
  }, []);

  useEffect(() => {
    if (header.classroom) {
      getTeacherAssignedSubjectsAPI()
        .then((res) => {
          const filtered = res.data.filter(
            (s) => s.classroom === Number(header.classroom)
          );
          setSubjects(filtered);
        })
        .catch((err) => {
          console.error("Error fetching subjects:", err);
          setError("Failed to load subjects");
        });

      getStudentsByClassroomAPI(header.classroom)
        .then((res) => {
          setStudents(res.data);
          const initialStatus = {};
          res.data.forEach((stu) => (initialStatus[stu.id] = "P"));
          setAttendanceData(initialStatus);
          setError(null);
          setSubmitted(false);
        })
        .catch((err) => {
          console.error("Error fetching students:", err);
          setError("Failed to load students");
        });
    } else {
      setSubjects([]);
      setStudents([]);
      setAttendanceData({});
      setSubmitted(false);
    }
  }, [header.classroom]);

  useEffect(() => {
    setSubmitted(false);
  }, [header.date, header.subject]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
    setSubmitted(false);
  };

  const submitAttendance = async () => {
    // Validation
    if (!header.classroom) {
      setError("Please select a classroom");
      return;
    }
    if (!header.subject) {
      setError("Please select a subject");
      return;
    }
    if (!header.date) {
      setError("Please select a date");
      return;
    }
    if (students.length === 0) {
      setError("No students found for this classroom");
      return;
    }

    if (submitted) {
      setError(
        "Attendance has already been submitted for this selection. Please change the date, subject, or classroom to submit again."
      );
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      date: header.date,
      classroom: Number(header.classroom),
      subject: Number(header.subject),
      records: Object.keys(attendanceData).map((id) => ({
        student: Number(id),
        status: attendanceData[id],
      })),
    };

    try {
      await markAttendanceAPI(payload);

      setError(null);
      setSubmitted(true);
      alert("✅ Attendance marked successfully!");
    } catch (err) {
      console.error("Error marking attendance:", err);

      if (err.response?.data?.error === "duplicate") {
        setError(
          "⚠️ Attendance has already been marked for this date, classroom, and subject. Please change the date or subject to mark attendance again."
        );
        setSubmitted(true);
      } else {
        const errorMsg =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          Object.values(err.response?.data || {})[0]?.[0] ||
          "Error marking attendance. Please try again.";
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHeader({
      date: new Date().toISOString().split("T")[0],
      classroom: "",
      subject: "",
    });
    setAttendanceData({});
    setError(null);
    setSubmitted(false);
  };

  const presentCount = Object.values(attendanceData).filter(
    (s) => s === "P"
  ).length;
  const absentCount = Object.values(attendanceData).filter(
    (s) => s === "A"
  ).length;
  const leaveCount = Object.values(attendanceData).filter(
    (s) => s === "L"
  ).length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto bg-white p-6 rounded border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {submitted && !error && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Attendance has been marked successfully! Change the date,
            subject, or classroom to mark attendance for a different session.
          </div>
        )}

        {/* Header Controls */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
              value={header.date}
              onChange={(e) => setHeader({ ...header, date: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Classroom</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
              value={header.classroom}
              onChange={(e) =>
                setHeader({
                  ...header,
                  classroom: e.target.value,
                  subject: "",
                })
              }
              disabled={loading}
            >
              <option value="">Select Class</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
              value={header.subject}
              disabled={!header.classroom || loading}
              onChange={(e) =>
                setHeader({ ...header, subject: e.target.value })
              }
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.subject}>
                  {s.subject_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Statistics */}
        {students.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-700">
                {students.length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-sm text-green-600 font-medium">Present</p>
              <p className="text-2xl font-bold text-green-700">
                {presentCount}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <p className="text-sm text-red-600 font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-700">{absentCount}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm text-yellow-600 font-medium">Leave</p>
              <p className="text-2xl font-bold text-yellow-700">{leaveCount}</p>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        {students.length > 0 && (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left text-sm font-semibold border-b">
                      Registration ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold border-b">
                      Name
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{student.registration_id}</td>
                      <td className="p-3 text-sm">
                        {student.user?.name || student.name}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleStatusChange(student.id, "P")}
                            disabled={loading || submitted}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              attendanceData[student.id] === "P"
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, "A")}
                            disabled={loading || submitted}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              attendanceData[student.id] === "A"
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Absent"
                          >
                            A
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, "L")}
                            disabled={loading || submitted}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              attendanceData[student.id] === "L"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Leave"
                          >
                            L
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                disabled={loading || !header.subject || submitted}
                onClick={submitAttendance}
                className="flex-1 bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? "Submitting..."
                  : submitted
                  ? "Already Submitted ✓"
                  : "Submit Attendance"}
              </button>
              <button
                disabled={loading}
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </>
        )}

        {/* No Students Message */}
        {header.classroom && students.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No students found in this classroom.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;
