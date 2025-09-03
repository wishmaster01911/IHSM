import React from "react";
import { Link } from "react-router-dom";
export default function Landing(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Patients</h2>
          <p className="mb-4 text-slate-600">Book appointments, view last prescription, and buy medicines.</p>
          <div className="flex gap-3">
            <Link className="btn-primary" to="/register?role=patient">Patient Sign Up</Link>
            <Link className="btn-secondary" to="/login?role=patient">Patient Login</Link>
          </div>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Doctors</h2>
          <p className="mb-4 text-slate-600">Manage appointments, update inventory, and prescribe medicines.</p>
          <div className="flex gap-3">
            <Link className="btn-primary" to="/register?role=doctor">Doctor Sign Up</Link>
            <Link className="btn-secondary" to="/login?role=doctor">Doctor Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
