import express from "express";
import { store } from "../store.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (_req, res) => {
  const meds = [...store.medicines].sort((a,b)=> a.name.localeCompare(b.name)).map(m => ({ ...m, _id: m.id }));
  res.json(meds);
});

router.patch("/:id/stock", auth("doctor"), (req, res) => {
  const med = store.medicines.find(m => m.id === req.params.id);
  if (!med) return res.status(404).json({ message: "Medicine not found" });
  med.stock = Number(req.body.stock ?? med.stock);
  res.json({ ...med, _id: med.id });
});

export default router;
