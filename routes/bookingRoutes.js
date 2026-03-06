const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require("../controllers/BookingController");
const { protect } = require("../middleware/authMiddleware");

// Create booking
router.post("/", protect, createBooking);

// Get my bookings
router.get("/my-bookings", protect, getMyBookings);

// Update booking status
router.put("/:id/status", protect, updateBookingStatus);

module.exports = router;