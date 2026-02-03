import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentAttendanceSummaryAPI } from "../../api/attendance.api";

const AttendanceSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStudentAttendanceSummaryAPI()
      .then((res) => {
        setSummary(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setError(
          err.response?.data?.detail || "Failed to load attendance summary"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-center text-gray-600">Loading attendance...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Attendance Summary</h1>

        {summary.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No attendance records found yet.
          </div>
        ) : (
          <>
            {/* Summary Statistics */}
            <div className="mb-8 grid grid-cols-4 gap-4">
              <StatCard
                label="Total Subjects"
                value={summary.length}
                color="blue"
              />
              <StatCard
                label="Overall Attendance"
                value={
                  summary.length > 0
                    ? (
                        summary.reduce(
                          (sum, s) => sum + s.attendance_percentage,
                          0
                        ) / summary.length
                      ).toFixed(1) + "%"
                    : "0%"
                }
                color="blue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summary.map((s) => {
                const percentage = s.attendance_percentage || 0;
                const status =
                  percentage < 75
                    ? { color: "red", bg: "red", label: "Below 75%" }
                    : { color: "green", bg: "green", label: "Good" };

                return (
                  <div
                    key={s.subject_id}
                    className="bg-white p-6 rounded border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {s.subject_name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Present:</span>
                        <span className="text-sm font-medium text-green-600">
                          {s.present_days} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Absent:</span>
                        <span className="text-sm font-medium text-red-600">
                          {s.absent_days} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Leave:</span>
                        <span className="text-sm font-medium text-yellow-600">
                          {s.leave_days} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium text-gray-700">
                          Total:
                        </span>
                        <span className="text-sm font-medium">
                          {s.total_days} days
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          Attendance
                        </span>
                        <span
                          className={`text-sm font-bold text-${status.color}-600`}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all bg-${status.bg}-600`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${status.bg}-50 text-${status.bg}-700`}
                    >
                      {status.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {summary.some((s) => s.attendance_percentage < 75) && (
              <div className="mt-6 bg-orange-50 border border-orange-200 p-4 rounded">
                <p className="text-orange-800 font-medium">
                  ⚠️ Your attendance is below 75% in some subjects. Please
                  contact your teacher immediately.
                </p>
              </div>
            )}
          </>
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
  };

  return (
    <div className={`p-4 rounded border ${colorClasses[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AttendanceSummary;
