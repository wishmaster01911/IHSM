import React, { useEffect, useState } from "react";
import API from "../api.js";

export default function MedicineStore(){
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const meds = await API.get("/medicines"); setMedicines(meds.data);
      const my = await API.get("/orders/me"); setOrders(my.data);
    })();
  }, []);

  const add = (m) => {
    const existing = cart.find(c => c._id === m._id);
    if (existing) setCart(cart.map(c => c._id === m._id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...m, qty: 1 }]);
  };

  const checkout = async () => {
    if (!cart.length) return;
    await API.post("/orders", { items: cart.map(c => ({ medicineId: c._id, quantity: c.qty })) });
    setCart([]);
    const meds = await API.get("/medicines"); setMedicines(meds.data);
    const my = await API.get("/orders/me"); setOrders(my.data);
    alert("Order placed!");
  };

  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card">
          <h2 className="text-xl font-bold mb-2">Medicine Store</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {medicines.map(m => (
              <div key={m._id} className="border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-slate-500">₹{m.price} · Stock: {m.stock}</div>
                </div>
                <button disabled={m.stock===0} className="btn-primary disabled:opacity-50" onClick={() => add(m)}>Add</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Cart</h2>
          {cart.length === 0 ? <p className="text-slate-500 text-sm">No items</p> : (
            <div className="space-y-2">
              {cart.map(c => (
                <div key={c._id} className="flex justify-between items-center">
                  <div>{c.name}</div>
                  <div className="flex items-center gap-2">
                    <input className="input w-20" type="number" min="1" value={c.qty} onChange={e => setCart(cart.map(x => x._id===c._id ? { ...x, qty: Number(e.target.value) } : x))} />
                    <div>₹{c.qty * c.price}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>₹{total}</span></div>
              <button className="btn-primary w-full" onClick={checkout}>Checkout</button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-2">My Orders</h2>
        <div className="space-y-2 text-sm">
          {orders.map(o => (
            <div key={o._id} className="border rounded-xl p-3">
              <div className="font-medium">Order #{o._id.slice(-6)} · ₹{o.total}</div>
              <div className="text-slate-500">Placed {new Date(o.createdAt).toLocaleString()}</div>
              <ul className="list-disc pl-5 mt-1">
                {o.items.map((i, idx) => <li key={idx}>{i.medicine?.name || ""} × {i.quantity}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
