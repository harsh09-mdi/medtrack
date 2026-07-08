const express = require("express");
const router = express.Router();
const checkupController = require("../controllers/checkupController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// GET works for both roles (logic branches inside the controller)
router.get("/", checkupController.getCheckups);

// Only doctors can create, edit or delete checkups
router.post("/", requireRole("doctor"), checkupController.createCheckup);
router.put("/:id", requireRole("doctor"), checkupController.updateCheckup);
router.delete("/:id", requireRole("doctor"), checkupController.deleteCheckup);

module.exports = router;
