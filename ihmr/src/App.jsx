import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope, Pill, CalendarDays, LogIn, LogOut, UserPlus, ShoppingCart, Plus, Minus, X,
  ClipboardList, CheckCircle2, Clock3, ChevronRight, ShieldCheck, Store, Home, UserCircle2
} from "lucide-react";

// --- Helpers -------
// A simple utility to conditionally join class names
const cn = (...cls) => cls.filter(Boolean).join(" ");

// Fake in-memory data to demonstrate UI without a backend
const DOCTORS = [
  { id: "d1", name: "Dr. Asha Menon", spec: "General Physician", code: "DR-2K8H3FJ" },
  { id: "d2", name: "Dr. Nikhil Rao", spec: "Cardiologist", code: "DR-Q7P2Z5C" },
  { id: "d3", name: "Dr. Meera Shah", spec: "Dermatologist", code: "DR-Y8L4T9M" },
];

const MEDICINES = [
  { id: "m1", name: "Paracetamol 500mg", price: 20, stock: 250 },
  { id: "m2", name: "Amoxicillin 250mg", price: 60, stock: 120 },
  { id: "m3", name: "Cetirizine 10mg", price: 15, stock: 180 },
  { id: "m4", name: "Omeprazole 20mg", price: 35, stock: 90 },
  { id: "m5", name: "Vitamin D3 1000IU", price: 25, stock: 140 },
];

// --- Badge / Button / Card primitives ------
function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
  type,
}) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium transition active:scale-[.98]";
  const styles = {
    primary: "bg-black text-white hover:bg-gray-800",
    ghost: "bg-gray-100 hover:bg-gray-200",
    soft: "bg-white border border-gray-200 hover:border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, styles[variant], disabled && "opacity-50", className)}
    >
      {children}
    </button>
  );
}

function Card({ title, icon, actions, children, className }) {
  return (
    <div className={cn("bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] p-6", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div>{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}

// Custom Message/Alert Box component
function MessageBox({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <div className="text-lg font-semibold mb-2">Notice</div>
        <p className="text-gray-600 mb-4">{message}</p>
        <Button onClick={onClose} className="w-full">OK</Button>
      </motion.div>
    </div>
  );
}

// --- Navbar -------
function Navbar({ user, onLogout, onNav }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white"><Stethoscope size={18}/></span>
          <span className="font-semibold text-lg">IHMS</span>
          <Badge>Secure • Fast • Modern</Badge>
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Badge>
                <UserCircle2 size={14} /> {user.name} • {user.role}
              </Badge>
              {user.role === "doctor" && user.code && <Badge><ShieldCheck size={14}/> {user.code}</Badge>}
              <Button variant="soft" onClick={() => onNav(user.role === "doctor" ? "doctor" : "patient")}>Dashboard</Button>
              <Button onClick={onLogout}><LogOut className="mr-2" size={16}/> Logout</Button>
            </>
          ) : (
            <Button onClick={() => onNav("auth")}><LogIn className="mr-2" size={16}/> Login / Sign Up</Button>
          )}
        </nav>
      </div>
    </header>
  );
}

// --- Auth -----
function AuthView({ onAuth, onMessage }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doctorCode, setDoctorCode] = useState("");

  function submit(e) {
    e.preventDefault();
    if (mode === "signup" && role === "doctor" && !doctorCode) {
      // Generate a pretty demo code — in real app this comes from backend
      const code = "DR-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setDoctorCode(code);
      onMessage(`Your Doctor ID is ${code}. Keep it safe!`);
    }
    onAuth({ name: name || (role === "patient" ? "Rahul Verma" : "Dr. Asha Menon"), role, email: email || "demo@ihms.test", code: role === "doctor" ? (doctorCode || "DR-DEMO123") : undefined });
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card
        title="Welcome to IHMS"
        icon={<ShieldCheck className="text-black" size={20}/>}>
        <div className="flex gap-2 mb-4">
          <Button variant={mode === "login" ? "primary" : "ghost"} onClick={() => setMode("login")}>Login</Button>
          <Button variant={mode === "signup" ? "primary" : "ghost"} onClick={() => setMode("signup")}>Sign Up</Button>
        </div>
        <div className="flex gap-2 mb-6">
          <Button variant={role === "patient" ? "primary" : "ghost"} onClick={() => setRole("patient")}>Patient</Button>
          <Button variant={role === "doctor" ? "primary" : "ghost"} onClick={() => setRole("doctor")}>Doctor</Button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password" className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {role === "doctor" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Doctor ID</label>
              <input placeholder="DR-XXXXXXX" className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={doctorCode} onChange={(e) => setDoctorCode(e.target.value)} required={mode === "login"} />
              <p className="text-xs text-gray-500 mt-1">(Required for login. Generated during sign up in real app.)</p>
            </div>
          )}
          <Button className="w-full" type="submit">{mode === "login" ? "Login" : "Create Account"}</Button>
        </form>
      </Card>
    </div>
  );
}

// --- Patient Dashboard -----------------------------------------------------
function PatientDashboard({ onGoStore }) {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const lastRx = {
    date: new Date().toLocaleDateString(),
    meds: [
      { name: "Paracetamol 500mg", dosage: "1 tab", qty: 10, inst: "After meals" },
      { name: "Cetirizine 10mg", dosage: "1 tab", qty: 5, inst: "Night" },
    ],
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Your Last Prescription" icon={<ClipboardList size={18}/>}
        actions={<Badge><CheckCircle2 size={14}/> Verified</Badge>}>
        <p className="text-sm text-gray-600 mb-3">Dated {lastRx.date}</p>
        <ul className="space-y-2">
          {lastRx.meds.map((m, i) => (
            <li key={i} className="flex items-center justify-between rounded-2xl border p-3">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-gray-500">{m.dosage} • {m.inst}</div>
              </div>
              <Badge>×{m.qty}</Badge>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Book Appointment" icon={<CalendarDays size={18}/>}
        actions={<Badge><Clock3 size={14}/> 9:00–18:00</Badge>}>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Doctor</label>
            <select className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
              <option value="">Select Doctor</option>
              {DOCTORS.map((d) => (
                <option key={d.id} value={d.id}>{d.name} • {d.spec} ({d.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input type="date" className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Time</label>
            <input type="time" className="w-full rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button disabled={!selectedDoctor || !date || !time}>Confirm Booking</Button>
          <Button variant="soft" onClick={onGoStore}><Store className="mr-2" size={16}/> Open Medicine Store</Button>
        </div>
      </Card>

      <Card title="Upcoming Appointments" icon={<Clock3 size={18}/>}
        className="md:col-span-2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-6">Date/Time</th>
                <th className="py-2 pr-6">Doctor</th>
                <th className="py-2 pr-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ts: "2025-09-04 10:00", doc: DOCTORS[0].name, status: "scheduled" },
                { ts: "2025-09-10 16:30", doc: DOCTORS[1].name, status: "scheduled" },
              ].map((a, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-6">{a.ts}</td>
                  <td className="py-2 pr-6">{a.doc}</td>
                  <td className="py-2 pr-6 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// --- Doctor Dashboard --------
function DoctorDashboard() {
  const [rxRows, setRxRows] = useState([{ medicine: "", dosage: "", qty: 1, note: "" }]);
  function setRow(i, key, val) {
    setRxRows((prev) => prev.map((r, idx) => (i === idx ? { ...r, [key]: val } : r)));
  }
  return (
    <div className="grid gap-6">
      <Card title="Today's Appointments" icon={<CalendarDays size={18}/>}
        actions={<Badge>2 scheduled</Badge>}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-6">Date/Time</th>
                <th className="py-2 pr-6">Patient</th>
                <th className="py-2 pr-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ts: "2025-09-01 11:00", patient: "Rahul Verma", status: "scheduled" },
                { ts: "2025-09-01 14:30", patient: "Kavya Iyer", status: "scheduled" },
              ].map((a, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-6">{a.ts}</td>
                  <td className="py-2 pr-6">{a.patient}</td>
                  <td className="py-2 pr-6 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Create Prescription" icon={<Pill size={18}/>}
        actions={<Button variant="soft"><ClipboardList className="mr-2" size={16}/> Save Prescription</Button>}>
        <div className="space-y-3">
          {rxRows.map((r, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-3">
              <select value={r.medicine} onChange={(e) => setRow(i, "medicine", e.target.value)}
                className="rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                <option value="">Medicine</option>
                {MEDICINES.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} (₹{m.price}, stock {m.stock})</option>
                ))}
              </select>
              <input placeholder="Dosage" value={r.dosage} onChange={(e) => setRow(i, "dosage", e.target.value)}
                className="rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"/>
              <input type="number" min={1} value={r.qty} onChange={(e) => setRow(i, "qty", e.target.value)}
                className="rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"/>
              <input placeholder="Instructions" value={r.note} onChange={(e) => setRow(i, "note", e.target.value)}
                className="rounded-2xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"/>
            </div>
          ))}
          <Button variant="ghost" onClick={() => setRxRows((p) => [...p, { medicine: "", dosage: "", qty: 1, note: "" }])}><Plus className="mr-2" size={16}/> Add medicine</Button>
        </div>
      </Card>

      <Card title="Inventory Overview" icon={<Store size={18}/>}
        actions={<Badge>{MEDICINES.length} items</Badge>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MEDICINES.map((m) => (
            <div key={m.id} className="rounded-2xl border p-4">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-600">₹{m.price} • Stock {m.stock}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// --- Medicine Store ---------
function MedicineStore({ onClose }) {
  const [cart, setCart] = useState([]);
  const items = MEDICINES;
  function add(id) {
    setCart((prev) => (prev.find((i) => i.id === id) ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...prev, { id, qty: 1 }]));
  }
  function inc(id) { setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))); }
  function dec(id) { setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))); }
  function remove(id) { setCart((p) => p.filter((i) => i.id !== id)); }
  const total = useMemo(() => cart.reduce((s, i) => s + (items.find((m) => m.id === i.id)?.price || 0) * i.qty, 0), [cart]);

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Store size={18}/> <h3 className="text-lg font-semibold">Medicine Store</h3></div>
          <Button variant="soft" onClick={onClose}><X size={16}/></Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((m) => (
            <div key={m.id} className="rounded-2xl border p-4 flex flex-col">
              <div className="font-medium line-clamp-1">{m.name}</div>
              <div className="text-sm text-gray-600 mb-2">₹{m.price} • Stock {m.stock}</div>
              <Button variant="ghost" onClick={() => add(m.id)} disabled={m.stock === 0}>{m.stock === 0 ? "Out of stock" : "Add to cart"}</Button>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Cart</h4>
            <Badge><ShoppingCart size={14}/> {cart.length} items</Badge>
          </div>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((c) => {
                const m = items.find((x) => x.id === c.id);
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-2xl border bg-white p-3">
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-600">₹{m.price} × {c.qty}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => dec(c.id)}><Minus size={14}/></Button>
                      <span>{c.qty}</span>
                      <Button variant="ghost" onClick={() => inc(c.id)}><Plus size={14}/></Button>
                      <Button variant="ghost" onClick={() => remove(c.id)}>Remove</Button>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2 font-medium">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Button className="w-full">Checkout</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// --- Landing -------
function Landing({ onStart }) {
  return (
    <section className="grid md:grid-cols-2 gap-6">
      <Card title="Patients" icon={<Stethoscope size={18}/>}
        actions={<ChevronRight/>}>
        <p className="text-gray-600 mb-4">Book appointments, view prescriptions and purchase medicines with real-time stock updates.</p>
        <Button onClick={() => onStart("patient")}><UserPlus size={16} className="mr-2"/> Continue as Patient</Button>
      </Card>
      <Card title="Doctors" icon={<ShieldCheck size={18}/>}
        actions={<ChevronRight/>}>
        <p className="text-gray-600 mb-4">Manage your schedule, create prescriptions and monitor inventory at a glance.</p>
        <Button onClick={() => onStart("doctor")}><Stethoscope size={16} className="mr-2"/> Continue as Doctor</Button>
      </Card>
    </section>
  );
}

// --- Root App ----------
export default function App() {
  const [route, setRoute] = useState("home");
  const [user, setUser] = useState(null);
  const [storeOpen, setStoreOpen] = useState(false);
  const [message, setMessage] = useState("");

  function go(path) {
    if (path === "auth") setRoute("auth");
    if (path === "patient") setRoute("patient");
    if (path === "doctor") setRoute("doctor");
  }

  function onAuth(u) {
    setUser(u);
    setRoute(u.role === "doctor" ? "doctor" : "patient");
  }

  function logout() {
    setUser(null);
    setRoute("home");
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 text-gray-900">
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Background Video */}
      <div className="fixed inset-0 z-0 opacity-40">
        <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
          <source src="https://pixabay.com/videos/hospital-medical-clinic-health-143993/" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-10">
        <Navbar user={user} onLogout={logout} onNav={go} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {route === "home" && (
              <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Landing onStart={(r) => setRoute("auth")} />
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {[
                    { icon: <ShieldCheck/>, title: "Secure Auth", text: "JWT-ready pattern with doctor ID support." },
                    { icon: <CalendarDays/>, title: "Smart Scheduling", text: "Clean booking flows with conflict awareness." },
                    { icon: <Pill/>, title: "Live Inventory", text: "Modern store UI with cart drawer." },
                  ].map((f, i) => (
                    <Card key={i} title={f.title} icon={f.icon}>
                      <p className="text-gray-600">{f.text}</p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {route === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AuthView onAuth={onAuth} onMessage={setMessage} />
              </motion.div>
            )}

            {route === "patient" && (
              <motion.div key="patient" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <PatientDashboard onGoStore={() => setStoreOpen(true)} />
              </motion.div>
            )}

            {route === "doctor" && (
              <motion.div key="doctor" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DoctorDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>{storeOpen && <MedicineStore onClose={() => setStoreOpen(false)} />}</AnimatePresence>
        <AnimatePresence>{message && <MessageBox message={message} onClose={() => setMessage("")} />}</AnimatePresence>

        <footer className="mt-10 border-t bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
            <span>© {new Date().getFullYear()} IHMS</span>
            <div className="flex items-center gap-3">
              <Badge><ShieldCheck size={14}/> HIPAA-style UX</Badge>
              <Badge><Pill size={14}/> Pharmacy-ready</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
