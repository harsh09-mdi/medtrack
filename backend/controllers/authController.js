const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");
const generateCode = require("../utils/generateCode");

function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "medtrack_super_secret_key_change_this",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      accessCode,
      age,
      bloodGroup,
      phone,
      specialization,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const finalRole = role === "doctor" ? "doctor" : "patient";

    if (finalRole === "doctor") {
      const validCode = process.env.DOCTOR_ACCESS_CODE || "MEDTRACK-DOC-2026";
      if (!accessCode || accessCode.trim() !== validCode) {
        return res.status(403).json({ message: "Invalid doctor access code. Please check with your admin." });
      }
    }

    const db = readDB();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      createdAt: new Date().toISOString(),
    };

    if (finalRole === "patient") {
      const existingCodes = db.users.filter((u) => u.patientCode).map((u) => u.patientCode);
      newUser.patientCode = generateCode("PT", existingCodes);
      newUser.age = age || "";
      newUser.bloodGroup = bloodGroup || "";
      newUser.phone = phone || "";
    } else {
      const existingCodes = db.users.filter((u) => u.doctorCode).map((u) => u.doctorCode);
      newUser.doctorCode = generateCode("DR", existingCodes);
      newUser.specialization = specialization || "General Physician";
      newUser.phone = phone || "";
    }

    db.users.push(newUser);
    writeDB(db);

    const token = generateToken(newUser.id, newUser.role);
    return res.status(201).json({ token, user: sanitizeUser(newUser) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while registering." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user.id, user.role || "patient");
    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while logging in." });
  }
};

exports.getMe = (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user: sanitizeUser(user) });
};

exports.updateProfile = (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex((u) => u.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  const { name, age, bloodGroup, phone, specialization } = req.body;
  const user = db.users[userIndex];

  db.users[userIndex] = {
    ...user,
    name: name ?? user.name,
    phone: phone ?? user.phone,
    ...(user.role === "patient"
      ? {
          age: age ?? user.age,
          bloodGroup: bloodGroup ?? user.bloodGroup,
        }
      : {
          specialization: specialization ?? user.specialization,
        }),
  };

  writeDB(db);
  return res.json({ user: sanitizeUser(db.users[userIndex]) });
};
