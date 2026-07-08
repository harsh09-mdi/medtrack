const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

router.get("/search", authMiddleware, requireRole("doctor"), patientController.searchPatient);

module.exports = router;
