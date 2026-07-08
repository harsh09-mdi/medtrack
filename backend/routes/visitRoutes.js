const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", visitController.getVisits);
router.post("/", visitController.createVisit);
router.put("/:id", visitController.updateVisit);
router.delete("/:id", visitController.deleteVisit);

module.exports = router;
