import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login(){
  const [params] = useSearchParams();
  const defaultRole = params.get("role") || "patient";
  const [form, setForm] = useState({ email: "", password: "", role: defaultRole, doctorCode: "" });
  const { setToken } = useAuth(); const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const body = { email: form.email, password: form.password, role: form.role };
    if (form.role === "doctor") body.doctorCode = form.doctorCode;
    const { data } = await API.post("/auth/login", body);
    setToken(data.token);
    data.user.role === "doctor" ? nav("/doctor") : nav("/patient");
  };
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
          </div>
          {form.role==="doctor" && (
            <div>
              <label className="label">Doctor Code</label>
              <input className="input" value={form.doctorCode} onChange={e=>setForm({...form, doctorCode:e.target.value})} placeholder="DR-XXXXXX" required />
            </div>
          )}
          <button className="btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
