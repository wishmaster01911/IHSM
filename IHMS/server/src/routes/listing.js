import express from "express";
import { store } from "../store.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/doctors", (_req, res) => {
  const docs = store.users.filter(u => u.role === "doctor").map(u => ({ _id: u.id, name: u.name, doctorCode: u.doctorCode }));
  res.json(docs);
});

router.get("/patients", auth("doctor"), (_req, res) => {
  const pats = store.users.filter(u => u.role === "patient").map(u => ({ _id: u.id, name: u.name, email: u.email }));
  res.json(pats);
});

export default router;
