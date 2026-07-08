const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

exports.getRecords = (req, res) => {
  const db = readDB();
  const { search } = req.query;

  let records = db.records.filter((r) => r.userId === req.userId);

  if (search) {
    const term = search.toLowerCase();
    records = records.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.description || "").toLowerCase().includes(term) ||
        (r.type || "").toLowerCase().includes(term)
    );
  }

  records.sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ records });
};

exports.getRecord = (req, res) => {
  const db = readDB();
  const record = db.records.find((r) => r.id === req.params.id && r.userId === req.userId);

  if (!record) {
    return res.status(404).json({ message: "Record not found." });
  }
  return res.json({ record });
};

exports.createRecord = (req, res) => {
  const { title, type, description, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: "Title and date are required." });
  }

  const db = readDB();
  const newRecord = {
    id: uuidv4(),
    userId: req.userId,
    title,
    type: type || "General",
    description: description || "",
    date,
    createdAt: new Date().toISOString(),
  };

  db.records.push(newRecord);
  writeDB(db);
  return res.status(201).json({ record: newRecord });
};

exports.updateRecord = (req, res) => {
  const db = readDB();
  const index = db.records.findIndex((r) => r.id === req.params.id && r.userId === req.userId);

  if (index === -1) {
    return res.status(404).json({ message: "Record not found." });
  }

  const { title, type, description, date } = req.body;
  db.records[index] = {
    ...db.records[index],
    title: title ?? db.records[index].title,
    type: type ?? db.records[index].type,
    description: description ?? db.records[index].description,
    date: date ?? db.records[index].date,
  };

  writeDB(db);
  return res.json({ record: db.records[index] });
};

exports.deleteRecord = (req, res) => {
  const db = readDB();
  const exists = db.records.some((r) => r.id === req.params.id && r.userId === req.userId);

  if (!exists) {
    return res.status(404).json({ message: "Record not found." });
  }

  db.records = db.records.filter((r) => !(r.id === req.params.id && r.userId === req.userId));
  writeDB(db);
  return res.json({ message: "Record deleted successfully." });
};
