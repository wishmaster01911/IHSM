import express from "express";
import { body, validationResult } from "express-validator";
import { store } from "../store.js";
import { nanoid } from "../utils.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth("patient"),
  [body("doctorId").notEmpty(), body("datetime").isISO8601(), body("reason").optional().isString()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { doctorId, datetime, reason } = req.body;
    const doctor = store.users.find(u => u.id === doctorId && u.role === "doctor");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const appt = { id: nanoid(), patientId: req.user.id, doctorId, datetime: new Date(datetime).toISOString(), reason: reason || "", status: "pending" };
    store.appointments.push(appt);
    res.json(appt);
  }
);

router.get("/me", auth("patient"), (req, res) => {
  const list = store.appointments
    .filter(a => a.patientId === req.user.id)
    .sort((a,b)=>new Date(b.datetime)-new Date(a.datetime))
    .map(a => ({ ...a, _id: a.id, doctor: ((d)=> d ? { name: d.name, doctorCode: d.doctorCode } : null)(store.users.find(u=>u.id===a.doctorId)) }));
  res.json(list);
});

router.get("/doctor", auth("doctor"), (req, res) => {
  const list = store.appointments
    .filter(a => a.doctorId === req.user.id)
    .sort((a,b)=>new Date(b.datetime)-new Date(a.datetime))
    .map(a => ({ ...a, _id: a.id, patient: ((p)=> p ? { name: p.name } : null)(store.users.find(u=>u.id===a.patientId)) }));
  res.json(list);
});

router.patch("/:id/status", auth("doctor"), (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
  const appt = store.appointments.find(a => a.id === req.params.id && a.doctorId === req.user.id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  appt.status = status;
  res.json({ ...appt });
});

export default router;
