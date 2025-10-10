import { createContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/auth";
import { getCurrentUser } from "../services/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return null;
    }
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const refreshUser = async () => {
    return await fetchCurrentUser();
  };

  const login = async (username, password) => {
    await apiLogin(username, password);
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
