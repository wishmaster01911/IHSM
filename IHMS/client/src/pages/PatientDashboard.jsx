import React, { useEffect, useState } from "react";
import API from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function PatientDashboard(){
  const { user } = useAuth();
  const [lastPrescription, setLastPrescription] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: "", datetime: "", reason: "" });

  useEffect(() => {
    (async () => {
      const pres = await API.get("/prescriptions/last"); setLastPrescription(pres.data);
      const appts = await API.get("/appointments/me"); setAppointments(appts.data);
      const docs = await API.get("/auth/doctors"); setDoctors(docs.data);
    })();
  }, []);

  const book = async (e) => {
    e.preventDefault();
    await API.post("/appointments", form);
    const appts = await API.get("/appointments/me"); setAppointments(appts.data);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Book Appointment</h2>
          <form className="space-y-3" onSubmit={book}>
            <div>
              <label className="label">Doctor</label>
              <select className="input" value={form.doctorId} onChange={e=>setForm({...form, doctorId:e.target.value})} required>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name} · {d.doctorCode}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date & Time</label>
              <input className="input" type="datetime-local" value={form.datetime} onChange={e=>setForm({...form, datetime:e.target.value})} required />
            </div>
            <div>
              <label className="label">Reason</label>
              <input className="input" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
            </div>
            <button className="btn-primary">Create</button>
          </form>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Last Prescription</h2>
          {lastPrescription ? (
            <div>
              <div className="text-sm text-slate-500 mb-2">Created: {new Date(lastPrescription.createdAt).toLocaleString()}</div>
              <ul className="list-disc pl-5">
                {lastPrescription.items.map((i, idx) => <li key={idx}>{i.medicine?.name} — {i.dosage || "N/A"} × {i.quantity}</li>)}
              </ul>
              {lastPrescription.notes && <p className="mt-2 text-slate-600">{lastPrescription.notes}</p>}
            </div>
          ) : <p className="text-slate-500">No prescriptions yet.</p>}
        </div>
      </div>
      <div className="card">
        <h2 className="text-xl font-bold mb-2">My Appointments</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left"><th className="p-2">When</th><th className="p-2">Doctor</th><th className="p-2">Reason</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a._id} className="border-t">
                  <td className="p-2">{new Date(a.datetime).toLocaleString()}</td>
                  <td className="p-2">{a.doctor?.name} ({a.doctor?.doctorCode})</td>
                  <td className="p-2">{a.reason}</td>
                  <td className="p-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
