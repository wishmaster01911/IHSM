import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register(){
  const [params] = useSearchParams();
  const defaultRole = params.get("role") || "patient";
  const [form, setForm] = useState({ name: "", email: "", password: "", role: defaultRole });
  const { setToken } = useAuth(); const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/auth/register", form);
    setToken(data.token);
    data.user.role === "doctor" ? nav("/doctor") : nav("/patient");
  };
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
          </div>
          <button className="btn-primary w-full">Sign Up</button>
        </form>
        {form.role==="doctor" && <p className="text-xs text-slate-500 mt-3">A unique Doctor Code will be generated automatically on signup and shown in the top bar. You'll use it when logging in.</p>}
      </div>
    </div>
  );
}
