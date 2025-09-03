import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { store } from "../store.js";
import { nanoid, genDoctorCode } from "../utils.js";

const router = express.Router();

router.post("/register",
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({min:6}), body("role").isIn(["patient","doctor"])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, role } = req.body;
    if (store.users.find(u => u.email === email)) return res.status(400).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: nanoid(), name, email, passwordHash, role };
    if (role === "doctor") {
      let code;
      do { code = genDoctorCode(); } while (store.users.some(u => u.doctorCode === code));
      user.doctorCode = code;
    }
    store.users.push(user);
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, doctorCode: user.doctorCode || null }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { ...user, passwordHash: undefined } });
  }
);

router.post("/login",
  [body("email").isEmail(), body("password").notEmpty(), body("role").isIn(["patient","doctor"])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, role, doctorCode } = req.body;
    const user = store.users.find(u => u.email === email && u.role === role);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (role === "doctor" && (!doctorCode || doctorCode !== user.doctorCode)) return res.status(400).json({ message: "Doctor code required/invalid" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, doctorCode: user.doctorCode || null }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { ...user, passwordHash: undefined } });
  }
);

export default router;
