// File: src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    if (storedUser && access) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // ✅ Request JWT tokens
      const response = await api.post("/token/", { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // ✅ Fetch user profile (optional)
      let userInfo = { username };
      try {
        const profileRes = await api.get("/vusers/");
        const matched = profileRes.data.find((u) => u.login === username);
        if (matched) userInfo = matched;
      } catch (err) {
        console.warn("⚠️ Could not fetch user profile, using fallback.");
      }

      localStorage.setItem("user", JSON.stringify(userInfo));
      setCurrentUser(userInfo);

      return userInfo;
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return logout();

      const response = await api.post("/token/refresh/", { refresh });
      const { access } = response.data;

      localStorage.setItem("access", access);
      return access;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, refreshToken, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
