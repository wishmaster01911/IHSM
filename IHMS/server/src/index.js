import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import medicineRoutes from "./routes/medicines.js";
import orderRoutes from "./routes/orders.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import listingRoutes from "./routes/listing.js";
import { store } from "./store.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*", credentials: true }));

// seed medicines (demo)
if (store.medicines.length === 0) {
  store.medicines.push(
    { id: "m1", name: "Paracetamol 500mg", sku: "PARA-500", price: 20, stock: 100 },
    { id: "m2", name: "Amoxicillin 250mg", sku: "AMOX-250", price: 80, stock: 50 },
    { id: "m3", name: "Ibuprofen 200mg", sku: "IBU-200", price: 30, stock: 120 },
    { id: "m4", name: "Cough Syrup 100ml", sku: "COUGH-100", price: 90, stock: 40 },
    { id: "m5", name: "Vitamin C 1000mg", sku: "VITC-1000", price: 60, stock: 70 }
  );
}

app.get("/", (_req, res) => res.send("Infirmary HMS API (NoDB) running"));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/auth", listingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server (NoDB) on", PORT));
