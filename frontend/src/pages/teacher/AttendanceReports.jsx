import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTeacherAssignedClassroomsAPI } from "../../api/teacher.api";
import { getTeacherAssignedSubjectsAPI } from "../../api/teacher.api";
import {
  getTeacherDailyReportAPI,
  getTeacherAttendancePercentageAPI,
} from "../../api/attendance.api";

const AttendanceReports = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dailyReport, setDailyReport] = useState(null);
  const [percentageReport, setPercentageReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [filter, setFilter] = useState({
    date: new Date().toISOString().split("T")[0],
    classroom: "",
    subject: "",
  });

  useEffect(() => {
    getTeacherAssignedClassroomsAPI().then((res) => setClassrooms(res.data));
  }, []);

  useEffect(() => {
    if (filter.classroom) {
      getTeacherAssignedSubjectsAPI().then((res) => {
        const filtered = res.data.filter(
          (s) => s.classroom === Number(filter.classroom),
        );
        setSubjects(filtered);
      });
    } else {
      setSubjects([]);
    }
  }, [filter.classroom]);

  const generateReports = async () => {
    if (!filter.classroom) {
      setError("Please select a classroom");
      return;
    }
    if (!filter.subject) {
      setError("Please select a subject");
      return;
    }
    if (!filter.date) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    setError(null);
    setHasGenerated(true);

    try {
      const dailyRes = await getTeacherDailyReportAPI(
        filter.date,
        filter.subject,
        filter.classroom,
      );
      setDailyReport(dailyRes.data);

      const percentageRes = await getTeacherAttendancePercentageAPI(
        filter.subject,
        filter.classroom,
      );
      setPercentageReport(percentageRes.data);
    } catch (err) {
      console.error("Error generating reports:", err);
      const errorMsg =
        err.response?.data?.detail ||
        "Failed to load reports. Please try again.";
      setError(errorMsg);
      setDailyReport(null);
      setPercentageReport([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setHasGenerated(false);
    if (field === "classroom") {
      setFilter({
        ...filter,
        classroom: value,
        subject: "",
      });
    } else {
      setFilter({ ...filter, [field]: value });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Attendance Reports</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded border shadow-sm">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={filter.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                disabled={loading}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Classroom
              </label>
              <select
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
                value={filter.classroom}
                onChange={(e) =>
                  handleFilterChange("classroom", e.target.value)
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
                value={filter.subject}
                disabled={!filter.classroom || loading}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.subject}>
                    {s.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={generateReports}
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded px-4 py-2 font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Loading..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {dailyReport && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total" value={dailyReport.summary.total} />
              <StatCard
                label="Present"
                value={dailyReport.summary.present}
                color="green"
              />
              <StatCard
                label="Absent"
                value={dailyReport.summary.absent}
                color="red"
              />
              <StatCard
                label="Leave"
                value={dailyReport.summary.leave}
                color="yellow"
              />
            </div>
          </div>
        )}

        {percentageReport.length > 0 && (
          <div className="bg-white p-6 rounded border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Student-wise Attendance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left text-sm font-semibold border-b">
                      Registration_id
                    </th>
                    <th className="p-3 text-left text-sm font-semibold border-b">
                      Name
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b">
                      Total Days
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b">
                      Present
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b">
                      Absent
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b">
                      Leave
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {percentageReport.map((p) => (
                    <tr
                      key={p.student__id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 text-sm">
                        {p.student__registration_id}
                      </td>
                      <td className="p-3 text-sm">{p.student__user__name}</td>
                      <td className="p-3 text-center text-sm">
                        {p.total_days}
                      </td>
                      <td className="p-3 text-center text-sm text-green-600 font-medium">
                        {p.present_days}
                      </td>
                      <td className="p-3 text-center text-sm text-red-600 font-medium">
                        {p.absent_days}
                      </td>
                      <td className="p-3 text-center text-sm text-yellow-600 font-medium">
                        {p.leave_days}
                      </td>
                      <td className="p-3 text-center text-sm">
                        <span
                          className={`font-bold ${
                            p.attendance_percentage < 75
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {p.attendance_percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {hasGenerated && !dailyReport && !loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No attendance records found for the selected filters.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    red: "bg-red-50 border-red-200 text-red-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
  };

  return (
    <div className={`p-4 rounded border ${colorClasses[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AttendanceReports;
