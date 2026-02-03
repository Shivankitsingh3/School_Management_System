import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, getProfileAPI } from "../api/auth.api";
import { setTokens, clearTokens, getAccessToken } from "../utils/token";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirectByRole = useCallback(
    (role) => {
      switch (role) {
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
        case "principal":
          navigate("/principal");
          break;
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  const login = async (credentials) => {
    try {
      const res = await loginAPI(credentials);
      setTokens(res.data.access, res.data.refresh);

      const profile = await getProfileAPI();
      setUser(profile.data);

      redirectByRole(profile.data.role);
      return profile.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Token found, fetching profile...");
        const res = await getProfileAPI();
        console.log("Profile loaded:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
