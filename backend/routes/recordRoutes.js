const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", recordController.getRecords);
router.get("/:id", recordController.getRecord);
router.post("/", recordController.createRecord);
router.put("/:id", recordController.updateRecord);
router.delete("/:id", recordController.deleteRecord);

module.exports = router;
