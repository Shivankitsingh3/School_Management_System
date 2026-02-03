import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getSubjectsByClassroomAPI,
  getPrincipalDailyAttendanceAPI,
  getPrincipalStudentPercentagesAPI,
} from "../../api/principal.api";
import { getClassroomsAPI } from "../../api/classroom.api";


const PrincipalAttendanceReports = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [report, setReport] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState({
    date: new Date().toISOString().split("T")[0],
    classroom: "",
    subject: "",
  });

  useEffect(() => {
    getClassroomsAPI()
      .then((res) => {
        const data = res.data.results || res.data;
        setClassrooms(data);
      })
      .catch((err) => console.error("Error fetching classrooms:", err));
  }, []);

  useEffect(() => {
    if (filter.classroom) {
      getSubjectsByClassroomAPI(filter.classroom)
        .then((res) => {
          const data = res.data.results || res.data;
          setSubjects(data);
        })
        .catch((err) => console.error("Error fetching subjects:", err));
    } else {
      setSubjects([]);
    }
  }, [filter.classroom]);

  const generateReport = async () => {
    if (!filter.date) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getPrincipalDailyAttendanceAPI(
        filter.date,
        filter.classroom || null,
        filter.subject || null,
      );
      setReport(res.data);

      if (filter.classroom) {
        const detailRes = await getPrincipalStudentPercentagesAPI(
          filter.classroom,
          filter.subject || null,
        );
        setStudentDetails(detailRes.data);
      } else {
        setStudentDetails([]);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to load report. Please try again.");
      setReport(null);
      setStudentDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPercentage = (present, total) => {
    return total > 0 ? ((present / total) * 100).toFixed(1) : 0;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Attendance Analytics</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Classroom
              </label>
              <select
                className="w-full border p-2 rounded"
                value={filter.classroom}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    classroom: e.target.value,
                    subject: "",
                  })
                }
              >
                <option value="">All Classrooms</option>
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
                className="w-full border p-2 rounded"
                value={filter.subject}
                disabled={!filter.classroom}
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded px-4 py-2 font-medium hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        {report && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Records"
              value={report.summary.total}
              color="blue"
            />
            <StatCard
              label="Present"
              value={report.summary.present}
              color="green"
              percentage={getTotalPercentage(
                report.summary.present,
                report.summary.total,
              )}
            />
            <StatCard
              label="Absent"
              value={report.summary.absent}
              color="red"
              percentage={getTotalPercentage(
                report.summary.absent,
                report.summary.total,
              )}
            />
            <StatCard
              label="Overall %"
              value={getTotalPercentage(
                report.summary.present,
                report.summary.total,
              )}
              color="purple"
            />
          </div>
        )}

        {studentDetails.length > 0 && (
          <div className="bg-white p-6 rounded border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Student-wise Attendance Report
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 text-left text-sm font-semibold">
                      Reg. ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="p-3 text-center text-sm font-semibold">
                      Total Days
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-green-600">
                      Present
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-red-600">
                      Absent
                    </th>
                    <th className="p-3 text-center text-sm font-semibold">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentDetails.map((s) => (
                    <tr
                      key={s.student__id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 text-sm">
                        {s.student__registration_id}
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {s.student__user__name}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {s.total_days}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {s.present_days}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {s.absent_days}
                      </td>
                      <td className="p-3 text-center text-sm">
                        <span
                          className={`font-bold ${s.attendance_percentage < 75 ? "text-red-600" : "text-green-600"}`}
                        >
                          {s.attendance_percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ label, value, color, percentage = null }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className={`p-4 rounded border ${colorClasses[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-2">
        {value}
        {percentage !== null && (
          <span className="text-lg"> ({percentage}%)</span>
        )}
      </p>
    </div>
  );
};

export default PrincipalAttendanceReports;
