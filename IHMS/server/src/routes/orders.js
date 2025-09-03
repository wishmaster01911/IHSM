import express from "express";
import { store } from "../store.js";
import { auth } from "../middleware/auth.js";
import { nanoid } from "../utils.js";

const router = express.Router();

router.post("/", auth("patient"), (req, res) => {
  const { items } = req.body; // [{medicineId, quantity}]
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "No items" });
  const orderItems = [];
  let total = 0;
  for (const i of items) {
    const m = store.medicines.find(mm => mm.id === i.medicineId);
    if (!m) return res.status(400).json({ message: "Invalid medicine" });
    if (m.stock < i.quantity) return res.status(400).json({ message: `Insufficient stock for ${m.name}` });
  }
  // second pass: decrement
  for (const i of items) {
    const m = store.medicines.find(mm => mm.id === i.medicineId);
    m.stock -= i.quantity;
    orderItems.push({ medicineId: m.id, quantity: i.quantity, price: m.price });
    total += i.quantity * m.price;
  }
  const order = { id: nanoid(), patientId: req.user.id, items: orderItems, total, status: "paid", createdAt: new Date().toISOString() };
  store.orders.push(order);
  res.json({ ...order, _id: order.id });
});

router.get("/me", auth("patient"), (req, res) => {
  const orders = store.orders
    .filter(o => o.patientId === req.user.id)
    .map(o => ({
      ...o,
      _id: o.id,
      items: o.items.map(it => ({ ...it, medicine: { name: (store.medicines.find(m=>m.id===it.medicineId)||{}).name } }))
    }));
  res.json(orders);
});

export default router;
