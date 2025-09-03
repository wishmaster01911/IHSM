import express from "express";
import { body, validationResult } from "express-validator";
import { store } from "../store.js";
import { nanoid } from "../utils.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth("doctor"),
  [body("patientId").notEmpty(), body("items").isArray({min:1})],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { patientId, items, notes } = req.body;
    const mapped = items.map(i => ({
      medicineId: i.medicineId,
      dosage: i.dosage || "",
      quantity: i.quantity || 1
    }));
    if (mapped.some(i => !store.medicines.find(m => m.id === i.medicineId))) return res.status(400).json({ message: "Invalid medicine in items" });
    const presc = { id: nanoid(), doctorId: req.user.id, patientId, items: mapped, notes: notes || "", createdAt: new Date().toISOString() };
    store.prescriptions.push(presc);
    res.json({ ...presc, _id: presc.id });
  }
);

router.get("/last", auth("patient"), (req, res) => {
  const list = store.prescriptions.filter(p => p.patientId === req.user.id).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
  const last = list[0];
  if (!last) return res.json(null);
  const hydrated = {
    ...last,
    _id: last.id,
    items: last.items.map(i => ({ ...i, medicine: { name: (store.medicines.find(m=>m.id===i.medicineId)||{}).name } }))
  };
  res.json(hydrated);
});

router.get("/doctor", auth("doctor"), (req, res) => {
  const list = store.prescriptions.filter(p => p.doctorId === req.user.id).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
    .map(p => ({ ...p, _id: p.id, patient: { name: (store.users.find(u=>u.id===p.patientId)||{}).name } }));
  res.json(list);
});

export default router;
