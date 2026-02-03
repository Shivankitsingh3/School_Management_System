import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ActivateAccount from "./pages/auth/ActivateAccount";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSubmissions from "./pages/student/StudentSubmissions";
import AttendanceSummary from "./pages/student/AttendanceSummary";
import SubmitAssignment from "./pages/student/SubmitAssignment";
import ClassroomStudentList from "./pages/student/ClassroomStudentList";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import AttendanceReports from "./pages/teacher/AttendanceReports";
import TeacherSubmissions from "./pages/teacher/TeacherSubmissions";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import StudentsList from "./pages/teacher/StudentsList";
import AssignmentDetail from "./pages/teacher/AssignmentDetail";
import StudentDetail from "./pages/teacher/StudentDetail";

import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import AssignTeacher from "./pages/principal/AssignTeacher";
import PendingTeachers from "./pages/principal/PendingTeachers";
import PrincipalAttendanceReports from "./pages/principal/AttendanceAnalytics";
import StudentList from "./pages/principal/StudentList";
import TeachersList from "./pages/principal/TeachersList";
import PrincipalProfile from "./pages/principal/MyProfile";
import UserProfile from "./pages/principal/UserProfile";


import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";




function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen p-6 bg-gray-50">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* AUTH ROUTES */}
          <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* STUDENT ROUTES */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/me"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submissions"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments/:id/submit"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SubmitAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AttendanceSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/studentlist"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ClassroomStudentList />
              </ProtectedRoute>
            }
          />

          {/* TEACHER ROUTES */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/me"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assignments"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assignments/:id"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <AssignmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assignments/create"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/reports"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <AttendanceReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/submissions"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/studentlist"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <StudentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/student/:id"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <StudentDetail />
              </ProtectedRoute>
            }
          />

          {/* PRINCIPAL ROUTES */}
          <Route
            path="/principal"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/me"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/assign"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <AssignTeacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/attendance"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalAttendanceReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/pending-teachers"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PendingTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/studentlist"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/teacherlist"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <TeachersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/users/:id"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
