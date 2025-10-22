/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (formData) => {
    try {
      let body, headers;
      if (formData instanceof FormData) {
        body = formData;
        headers = undefined;
      } else {
        body = JSON.stringify(formData);
        headers = { "Content-Type": "application/json" };
      }
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers,
        body,
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message || "Signup failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      signup,
      logout,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
