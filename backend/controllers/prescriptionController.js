const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

exports.getPrescriptions = (req, res) => {
  const db = readDB();
  const prescriptions = db.prescriptions
    .filter((p) => p.userId === req.userId)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  return res.json({ prescriptions });
};

exports.createPrescription = (req, res) => {
  const { medicineName, dosage, frequency, startDate, endDate, doctorName, notes } = req.body;

  if (!medicineName || !dosage || !startDate) {
    return res.status(400).json({ message: "Medicine name, dosage and start date are required." });
  }

  const db = readDB();
  const newPrescription = {
    id: uuidv4(),
    userId: req.userId,
    medicineName,
    dosage,
    frequency: frequency || "",
    startDate,
    endDate: endDate || "",
    doctorName: doctorName || "",
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  db.prescriptions.push(newPrescription);
  writeDB(db);
  return res.status(201).json({ prescription: newPrescription });
};

exports.updatePrescription = (req, res) => {
  const db = readDB();
  const index = db.prescriptions.findIndex((p) => p.id === req.params.id && p.userId === req.userId);

  if (index === -1) {
    return res.status(404).json({ message: "Prescription not found." });
  }

  db.prescriptions[index] = { ...db.prescriptions[index], ...req.body };
  writeDB(db);
  return res.json({ prescription: db.prescriptions[index] });
};

exports.deletePrescription = (req, res) => {
  const db = readDB();
  const exists = db.prescriptions.some((p) => p.id === req.params.id && p.userId === req.userId);

  if (!exists) {
    return res.status(404).json({ message: "Prescription not found." });
  }

  db.prescriptions = db.prescriptions.filter(
    (p) => !(p.id === req.params.id && p.userId === req.userId)
  );
  writeDB(db);
  return res.json({ message: "Prescription deleted successfully." });
};
