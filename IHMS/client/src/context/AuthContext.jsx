import React, { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    if (token) {
      const p = jwtDecode(token);
      setUser({ id: p.id, role: p.role, name: p.name, doctorCode: p.doctorCode || null });
      localStorage.setItem("token", token);
    } else { setUser(null); localStorage.removeItem("token"); }
  }, [token]);
  const logout = () => setToken(null);
  return <AuthContext.Provider value={{ user, token, setToken, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
