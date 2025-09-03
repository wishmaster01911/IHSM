// Simple in-memory store (resets on restart)
export const store = {
  users: [],         // {id, name, email, passwordHash, role, doctorCode?}
  appointments: [],  // {id, patientId, doctorId, datetime, reason, status}
  medicines: [],     // {id, name, sku, price, stock}
  prescriptions: [], // {id, doctorId, patientId, items:[{medicineId,dosage,quantity}], notes, createdAt}
  orders: []         // {id, patientId, items:[{medicineId,quantity,price}], total, status, createdAt}
};
