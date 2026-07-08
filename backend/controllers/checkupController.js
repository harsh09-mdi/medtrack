const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

// GET /api/checkups
// - Patient: returns their own checkups (read-only view)
// - Doctor without ?patientCode: returns checkups the doctor has created
// - Doctor with ?patientCode: returns checkups for that specific patient + patient summary
exports.getCheckups = (req, res) => {
  const db = readDB();

  if (req.role === "doctor") {
    const { patientCode } = req.query;

    if (!patientCode) {
      const checkups = db.checkups
        .filter((c) => c.doctorId === req.userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json({ checkups });
    }

    const patient = db.users.find(
      (u) => u.role === "patient" && u.patientCode?.toLowerCase() === patientCode.trim().toLowerCase()
    );

    if (!patient) {
      return res.status(404).json({ message: "No patient found with this ID." });
    }

    const checkups = db.checkups
      .filter((c) => c.patientId === patient.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const { password, ...safePatient } = patient;
    return res.json({ checkups, patient: safePatient });
  }

  // Patient viewing their own checkups
  const checkups = db.checkups
    .filter((c) => c.patientId === req.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ checkups });
};

exports.createCheckup = (req, res) => {
  const { patientCode, date, diagnosis, symptoms, vitals, notes, followUpDate } = req.body;

  if (!patientCode || !date || !diagnosis) {
    return res.status(400).json({ message: "Patient ID, date and diagnosis are required." });
  }

  const db = readDB();
  const patient = db.users.find(
    (u) => u.role === "patient" && u.patientCode?.toLowerCase() === patientCode.trim().toLowerCase()
  );

  if (!patient) {
    return res.status(404).json({ message: "No patient found with this ID. Please check the code." });
  }

  const doctor = db.users.find((u) => u.id === req.userId);

  const newCheckup = {
    id: uuidv4(),
    patientId: patient.id,
    patientCode: patient.patientCode,
    patientName: patient.name,
    doctorId: req.userId,
    doctorName: doctor?.name || "Doctor",
    date,
    diagnosis,
    symptoms: symptoms || "",
    vitals: vitals || "",
    notes: notes || "",
    followUpDate: followUpDate || "",
    createdAt: new Date().toISOString(),
  };

  db.checkups.push(newCheckup);
  writeDB(db);
  return res.status(201).json({ checkup: newCheckup });
};

exports.updateCheckup = (req, res) => {
  const db = readDB();
  const index = db.checkups.findIndex((c) => c.id === req.params.id && c.doctorId === req.userId);

  if (index === -1) {
    return res.status(404).json({ message: "Checkup not found or you don't have permission to edit it." });
  }

  const { date, diagnosis, symptoms, vitals, notes, followUpDate } = req.body;
  db.checkups[index] = {
    ...db.checkups[index],
    date: date ?? db.checkups[index].date,
    diagnosis: diagnosis ?? db.checkups[index].diagnosis,
    symptoms: symptoms ?? db.checkups[index].symptoms,
    vitals: vitals ?? db.checkups[index].vitals,
    notes: notes ?? db.checkups[index].notes,
    followUpDate: followUpDate ?? db.checkups[index].followUpDate,
  };

  writeDB(db);
  return res.json({ checkup: db.checkups[index] });
};

exports.deleteCheckup = (req, res) => {
  const db = readDB();
  const exists = db.checkups.some((c) => c.id === req.params.id && c.doctorId === req.userId);

  if (!exists) {
    return res.status(404).json({ message: "Checkup not found or you don't have permission to delete it." });
  }

  db.checkups = db.checkups.filter((c) => !(c.id === req.params.id && c.doctorId === req.userId));
  writeDB(db);
  return res.json({ message: "Checkup deleted successfully." });
};
