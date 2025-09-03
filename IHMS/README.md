# Infirmary HMS (MERN, No Database)

This variant uses **in-memory storage only** — no MongoDB required. Data resets on server restart.

## Run
### Server
```bash
cd server
cp .env.example .env
npm install
npm run dev   # http://localhost:5000
```
### Client
```bash
cd client
npm install
# echo "VITE_API_URL=http://localhost:5000/api" > .env  # optional
npm run dev   # http://localhost:5173
```

## Notes
- Doctors get a unique `DR-XXXXXX` code on signup and must provide it at login.
- Medicines are seeded at server start.
- Everything (users, appointments, prescriptions, orders, inventory) lives in memory.
- Same API shape as the DB version, so the client is identical.
