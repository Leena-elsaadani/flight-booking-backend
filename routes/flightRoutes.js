const express = require("express");
const router = express.Router();

// Make sure paths are correct
const { createFlight, getAllFlights, updateFlight, deleteFlight } = require("../controllers/flightController");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/", protect, createFlight);
router.get("/", getAllFlights);
router.put("/:id", protect, updateFlight);
router.delete("/:id", protect, deleteFlight);

module.exports = router;