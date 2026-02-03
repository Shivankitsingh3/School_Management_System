import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-indigo-900 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-white text-indigo-900 px-2 py-1 rounded font-extrabold text-lg">
          School
        </div>
        <span className="font-semibold hidden sm:inline">MS</span>
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <div className="flex gap-4 items-center">
            <Link
              to="/login"
              className="text-sm hover:text-indigo-200 cursor-pointer"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded text-sm font-medium cursor-pointer"
            >
              Register
            </Link>
          </div>
        ) : (
          <>
            <NotificationBell />

            <div className="flex items-center gap-4 border-l border-indigo-700 pl-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold leading-none">
                  {user.name || "User"}
                </p>
                <p className="text-[10px] text-indigo-300 uppercase mt-1">
                  {user.role}
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/change-password"
                  className="bg-indigo-700 hover:bg-indigo-600 px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
                >
                 Change Password
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
