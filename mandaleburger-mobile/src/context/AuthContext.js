// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/auth";
import { getCurrentUser } from "../services/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el usuario actual
  const fetchCurrentUser = async () => {
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

  // Se ejecuta al montar el context
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Función para refrescar el usuario
  const refreshUser = async () => {
    return await fetchCurrentUser();
  };

  // Login
  const login = async (username, password) => {
    await apiLogin(username, password);
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  // Logout
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
