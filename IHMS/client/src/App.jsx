import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import MedicineStore from "./pages/MedicineStore.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App(){
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<ProtectedRoute role='patient'><PatientDashboard /></ProtectedRoute>} />
        <Route path="/doctor" element={<ProtectedRoute role='doctor'><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/store" element={<ProtectedRoute role='patient'><MedicineStore /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <footer className="text-center text-xs text-slate-400 py-8">
        <Link to="/store" className="underline">Medicine Store</Link>
      </footer>
    </AuthProvider>
  );
}
