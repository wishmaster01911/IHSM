import React, { useEffect, useState } from "react";
import API from "../api.js";

export default function DoctorDashboard(){
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [presc, setPresc] = useState({ patientId: "", items: [], notes: "" });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    (async () => {
      const appts = await API.get("/appointments/doctor"); setAppointments(appts.data);
      const meds = await API.get("/medicines"); setMedicines(meds.data);
      const pats = await API.get("/auth/patients"); setPatients(pats.data);
    })();
  }, []);

  const updateStatus = async (id, status) => {
    await API.patch(`/appointments/${id}/status`, { status });
    const appts = await API.get("/appointments/doctor"); setAppointments(appts.data);
  };

  const updateStock = async (id, stock) => {
    await API.patch(`/medicines/${id}/stock`, { stock });
    const meds = await API.get("/medicines"); setMedicines(meds.data);
  };

  const addItem = (medicineId) => {
    if (presc.items.find(i => i.medicineId === medicineId)) return;
    setPresc({ ...presc, items: [...presc.items, { medicineId, dosage: "", quantity: 1 }] });
  };

  const submitPresc = async (e) => {
    e.preventDefault();
    await API.post("/prescriptions", presc);
    setPresc({ patientId: "", items: [], notes: "" });
    alert("Prescription created");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Appointments</h2>
          <div className="space-y-2">
            {appointments.map(a => (
              <div key={a._id} className="border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.patient?.name}</div>
                  <div className="text-sm text-slate-500">{new Date(a.datetime).toLocaleString()} · {a.reason}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{a.status}</span>
                  <select className="input" value={a.status} onChange={e => updateStatus(a._id, e.target.value)}>
                    {["pending","confirmed","completed","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Inventory</h2>
          <div className="space-y-2">
            {medicines.map(m => (
              <div key={m._id} className="border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-slate-500">₹{m.price} · Stock: {m.stock}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input className="input w-24" type="number" min="0" defaultValue={m.stock} onBlur={e => updateStock(m._id, Number(e.target.value))} />
                  <button type="button" className="btn-secondary" onClick={() => addItem(m._id)}>Add to Rx</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-2">Create Prescription</h2>
        <form className="space-y-3" onSubmit={submitPresc}>
          <div>
            <label className="label">Patient</label>
            <select className="input" value={presc.patientId} onChange={e => setPresc({ ...presc, patientId: e.target.value })} required>
              <option value="">Select patient</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name} · {p.email}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            {presc.items.length === 0 ? <p className="text-slate-500 text-sm">No items</p> : presc.items.map((i, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select className="input" value={i.medicineId} onChange={e => {
                  const items = [...presc.items]; items[idx].medicineId = e.target.value; setPresc({ ...presc, items });
                }}>
                  {medicines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <input className="input" placeholder="Dosage" value={i.dosage} onChange={e => { const items=[...presc.items]; items[idx].dosage=e.target.value; setPresc({ ...presc, items }); }} />
                <input className="input w-24" type="number" min="1" value={i.quantity} onChange={e => { const items=[...presc.items]; items[idx].quantity=Number(e.target.value); setPresc({ ...presc, items }); }} />
              </div>
            ))}
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows="3" value={presc.notes} onChange={e => setPresc({ ...presc, notes: e.target.value })} />
          </div>
          <button className="btn-primary">Save Prescription</button>
        </form>
      </div>
    </div>
  );
}
