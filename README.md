# MedTrack – Digital Health Record Tracker

A full-stack web app to manage personal health records, prescriptions, and doctor visit
history — built with **React (Vite)** on the frontend and **Node.js + Express** on the
backend. Data is stored in a simple JSON file, so there's **no database installation
required** — just run both servers and you're good to go.

```
MedTrack/
├── backend/     → Express REST API (JWT auth + JSON file storage)
└── frontend/    → React (Vite) app — colourful dashboard UI
```

---

## ✨ Features

- Secure registration & login (JWT + bcrypt password hashing)
- **Two account types — Patient and Doctor** — chosen from a role drawer on the
  login/register screen
- Every **patient gets a unique Patient ID** (e.g. `PT-A1B2C`) shown on their dashboard
- Doctors register with a shared **Doctor Access Code** (set in `backend/.env`) so
  random users can't create doctor accounts
- **Doctors** search a patient by their Patient ID and add a **checkup** (diagnosis,
  symptoms, vitals, notes, follow-up date) — only that doctor can edit/delete it later
- **Patients** see all their doctor-added checkups in a read-only "Doctor Checkups"
  section — they can view but never edit or delete this data
- Dashboard with live stats (records, prescriptions, visits, doctor checkups)
- Add / edit / delete health records, with search & filter (patient-editable)
- Prescription tracker (dosage, frequency, active/completed status) (patient-editable)
- Doctor visit history shown as a timeline, with follow-up dates (patient-editable)
- Editable user profile (age, blood group, phone for patients; specialization for doctors)
- Fully responsive, colourful gradient UI

---

## 🚀 Getting Started

You need **Node.js (v18 or later)** installed. Open **two terminals in VS Code**
(one for backend, one for frontend).

### 1. Backend setup

```bash
cd backend
npm install
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
npm run dev
```

The API will start at **http://localhost:5000**.
You can verify it's running by visiting **http://localhost:5000/api/health**.

> **Doctor Access Code:** Open `backend/.env` and check the `DOCTOR_ACCESS_CODE` value
> (default is `MEDTRACK-DOC-2026`). Anyone registering as a **Doctor** must enter this
> exact code — change it to something private in a real deployment.

### 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
npm run dev
```

The app will start at **http://localhost:5173**. Open it in your browser, register a new
account, and start adding your health records!

---

## 🩺 How the Patient / Doctor flow works

1. On the login or register page, a **drawer** asks you to choose **Patient** or **Doctor**.
2. **Patients** register normally and instantly get a unique **Patient ID** (shown on
   their dashboard, e.g. `PT-A1B2C`) — share this with your doctor at a checkup.
3. **Doctors** register with the **Doctor Access Code** (see above) and get a
   **Doctor ID** of their own.
4. After logging in, a doctor lands on **"Find Patient"** — enter the patient's
   Patient ID to pull up their profile, then click **Add Checkup** to record the
   diagnosis, symptoms, vitals, notes and a follow-up date.
5. That checkup instantly appears on the **patient's** dashboard under
   **"Doctor Checkups"** — the patient can read it but cannot edit or delete it
   (this is enforced on the backend, not just hidden in the UI).
6. Patients can still freely add/edit/delete their **own** Health Records,
   Prescriptions, and Doctor Visits — only the doctor-authored checkups are locked.
7. A doctor can only edit or delete the checkups **they personally created** — not
   another doctor's entries.

---

## 🗂️ Where is the data stored?

All data (users, records, prescriptions, visits, checkups) is stored in:

```
backend/data/db.json
```

This file is created automatically the first time the server runs. You can inspect it,
back it up, or clear it any time (just don't delete the surrounding folder).

> Want to switch to a real database later (MongoDB, PostgreSQL, etc.)? The `utils/db.js`
> file is the only place that reads/writes data — swap its logic and everything else
> (routes/controllers) stays the same.

---

## 🔌 API Overview

| Method | Endpoint                  | Description                     | Auth required |
|--------|----------------------------|----------------------------------|:---:|
| POST   | `/api/auth/register`       | Create a new account             | ❌ |
| POST   | `/api/auth/login`          | Log in, returns a JWT token      | ❌ |
| GET    | `/api/auth/me`             | Get current logged-in user       | ✅ |
| PUT    | `/api/auth/me`             | Update profile details           | ✅ |
| GET    | `/api/records?search=...`  | List / search health records     | ✅ |
| POST   | `/api/records`             | Add a health record              | ✅ |
| PUT    | `/api/records/:id`         | Update a health record            | ✅ |
| DELETE | `/api/records/:id`         | Delete a health record            | ✅ |
| GET    | `/api/prescriptions`       | List prescriptions               | ✅ |
| POST   | `/api/prescriptions`       | Add a prescription               | ✅ |
| PUT    | `/api/prescriptions/:id`   | Update a prescription            | ✅ |
| DELETE | `/api/prescriptions/:id`   | Delete a prescription            | ✅ |
| GET    | `/api/visits`              | List doctor visits               | ✅ |
| POST   | `/api/visits`              | Add a doctor visit               | ✅ |
| PUT    | `/api/visits/:id`          | Update a doctor visit            | ✅ |
| DELETE | `/api/visits/:id`          | Delete a doctor visit            | ✅ |
| GET    | `/api/patients/search?code=` | Doctor searches a patient by Patient ID | ✅ (doctor only) |
| GET    | `/api/checkups`            | Patient: own checkups. Doctor: own added checkups (or a searched patient's, via `?patientCode=`) | ✅ |
| POST   | `/api/checkups`            | Doctor adds a checkup for a patient | ✅ (doctor only) |
| PUT    | `/api/checkups/:id`        | Doctor edits their own checkup   | ✅ (doctor only, owner) |
| DELETE | `/api/checkups/:id`        | Doctor deletes their own checkup | ✅ (doctor only, owner) |

All protected routes require an `Authorization: Bearer <token>` header — the frontend
handles this automatically once you're logged in.

---

## 🧰 Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, lucide-react (icons)
**Backend:** Node.js, Express, JSON Web Tokens, bcryptjs, UUID
**Storage:** JSON file (`backend/data/db.json`) — no external database needed

---

## 📌 Notes for viva / submission

- This project matches the modules described in the synopsis: User Authentication,
  Dashboard, Health Record Management, Prescription Management, Doctor Visit History,
  and Search & Filter.
- Passwords are never stored in plain text (hashed with bcrypt).
- Each user only sees their own records — enforced on the backend via the JWT-decoded
  user id, not just hidden in the UI.
- Future enhancements (from the synopsis) like cloud database integration, PDF report
  uploads, and appointment scheduling can be added on top of this structure.

---

## 🛠️ Troubleshooting

- **"Cannot connect to backend" / network error on login** → make sure the backend
  terminal is running (`npm run dev` inside `backend/`) and that `frontend/.env` points
  to `http://localhost:5000/api`.
- **Port already in use** → change `PORT` in `backend/.env`, and update
  `VITE_API_URL` in `frontend/.env` to match.
- **Blank page after `npm run dev`** → make sure you ran `npm install` in that folder
  first.
