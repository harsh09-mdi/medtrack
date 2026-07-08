const { readDB } = require("../utils/db");

exports.searchPatient = (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Patient ID is required." });
  }

  const db = readDB();
  const patient = db.users.find(
    (u) => u.role === "patient" && u.patientCode?.toLowerCase() === code.trim().toLowerCase()
  );

  if (!patient) {
    return res.status(404).json({ message: "No patient found with this ID. Please check the code and try again." });
  }

  const { password, ...safePatient } = patient;
  return res.json({ patient: safePatient });
};
