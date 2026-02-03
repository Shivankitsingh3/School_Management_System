import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-indigo-600 font-semibold">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default PublicRoute;