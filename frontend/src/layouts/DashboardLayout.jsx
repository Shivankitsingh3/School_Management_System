import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const menuConfig = {
    teacher: [
      { name: "Dashboard", path: "/teacher" },
      { name: "My Profile", path: "/teacher/me" },
      { name: "My Assignments", path: "/teacher/assignments" },
      { name: "Create Assignment", path: "/teacher/assignments/create" },
      { name: "Mark Attendance", path: "/teacher/attendance" },
      { name: "Reports", path: "/teacher/reports" },
      { name: "Submissions", path: "/teacher/submissions" },
      { name: "Students List", path: "/teacher/studentlist"},
    ],
    principal: [
      { name: "Dashboard", path: "/principal" },
      { name: "My Profile", path: "/principal/me" },
      { name: "Assign Faculty", path: "/principal/assign" },
      { name: "Pending Teachers", path: "/principal/pending-teachers" },
      { name: "Attendance Reports", path: "/principal/attendance" },
      { name: "Teachers List", path: "/principal/teacherlist" },
      { name: "Students List", path: "/principal/studentlist" },
    ],
    student: [
      { name: "Dashboard", path: "/student" },
      { name: "My Profile", path: "/student/me" },
      { name: "My Submissions", path: "/student/submissions" },
      { name: "Attendance Summary", path: "/student/attendance" },
      { name: "classroom Student List", path: "/student/studentlist" },
    ],
  };

  const navItems = menuConfig[role] || [];

  return (
    <div className="flex min-h-screen bg-gray-100 text-slate-800">
      <nav
        className={`
        ${showMobileMenu ? "block" : "hidden"} 
        md:block w-64 bg-white border-r border-gray-200 fixed md:sticky top-0 h-screen z-20
      `}
      >
        <div className="p-6 border-b border-gray-200 font-bold text-indigo-600 text-xl bg-white flex-row">
          <span className="bg-white text-gray-00 p-2 rounded font-extrabold group-hover:bg-indigo-100 transition">
            School
          </span>
          <span className="font-bold">MS Portal</span>
        </div>

        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-2 rounded-md font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            className="md:hidden text-gray-600 font-bold"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? "Close" : "Menu"}
          </button>

          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {role} Panel
          </div>
        </header>

        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
