import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPrincipalDashboardStatsAPI } from "../../api/principal.api";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, color }) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const PrincipalDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrincipalDashboardStatsAPI()
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Dashboard stats error:", err);
        alert("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center py-10">Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Principal Dashboard
        </h1>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Teachers"
            value={stats.teachers.total}
            color="text-indigo-600"
          />
          <StatCard
            title="Assigned Teachers"
            value={stats.teachers.assigned}
            color="text-green-600"
          />
          <StatCard
            title="Pending Teachers"
            value={stats.teachers.pending}
            color="text-red-500"
          />
          <StatCard
            title="Active Assignments"
            value={stats.assignments.active}
            color="text-blue-600"
          />
        </div>

        {/* ACTIONS */}
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-indigo-800">
              Pending Teacher Assignments
            </h2>
            <p className="text-sm text-indigo-600">
              Assign teachers to classrooms to enable assignments & attendance.
            </p>
          </div>

          <Link
            to="/principal/assign"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Assign Teachers
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrincipalDashboard;
