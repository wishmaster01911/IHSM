import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
export default function Navbar(){
  const { user, logout } = useAuth();
  return (
    <div className="nav">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">Infirmary HMS (NoDB)</Link>
          <div className="flex items-center gap-3">
            {user ? (<>
              <span className="text-sm text-slate-600">Hi, {user.name} ({user.role}){user.doctorCode?` · ${user.doctorCode}`:""}</span>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </>) : (<>
              <Link className="btn-secondary" to="/login">Login</Link>
              <Link className="btn-primary" to="/register">Register</Link>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
