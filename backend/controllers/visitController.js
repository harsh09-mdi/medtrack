const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

exports.getVisits = (req, res) => {
  const db = readDB();
  const visits = db.visits
    .filter((v) => v.userId === req.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ visits });
};

exports.createVisit = (req, res) => {
  const { doctorName, hospital, date, diagnosis, followUpDate, notes } = req.body;

  if (!doctorName || !date) {
    return res.status(400).json({ message: "Doctor name and visit date are required." });
  }

  const db = readDB();
  const newVisit = {
    id: uuidv4(),
    userId: req.userId,
    doctorName,
    hospital: hospital || "",
    date,
    diagnosis: diagnosis || "",
    followUpDate: followUpDate || "",
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  db.visits.push(newVisit);
  writeDB(db);
  return res.status(201).json({ visit: newVisit });
};

exports.updateVisit = (req, res) => {
  const db = readDB();
  const index = db.visits.findIndex((v) => v.id === req.params.id && v.userId === req.userId);

  if (index === -1) {
    return res.status(404).json({ message: "Visit not found." });
  }

  db.visits[index] = { ...db.visits[index], ...req.body };
  writeDB(db);
  return res.json({ visit: db.visits[index] });
};

exports.deleteVisit = (req, res) => {
  const db = readDB();
  const exists = db.visits.some((v) => v.id === req.params.id && v.userId === req.userId);

  if (!exists) {
    return res.status(404).json({ message: "Visit not found." });
  }

  db.visits = db.visits.filter((v) => !(v.id === req.params.id && v.userId === req.userId));
  writeDB(db);
  return res.json({ message: "Visit deleted successfully." });
};
