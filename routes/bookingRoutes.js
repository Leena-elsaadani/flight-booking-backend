// ============================================================================
// BOOKING ROUTES
// ============================================================================
// Defines all routes for flight booking operations
// Routes for creating bookings, retrieving user bookings, and updating booking status

const express = require("express");
const router = express.Router();

// Import controller functions that handle the route logic
const { 
  createBooking, 
  getMyBookings, 
  updateBookingStatus 
} = require("../controllers/BookingController");

// Import authentication middleware to protect all booking routes
const { protect } = require("../middleware/authMiddleware");

// ============================================================================
// ROUTE DEFINITIONS - ALL PROTECTED ROUTES (require authentication)
// ============================================================================

// POST /api/bookings
// Create a new booking (book seats on a flight)
// PROTECTED - requires JWT token in Authorization header
// Body: { flightId: string, numberOfSeats: number }
// Response: { success: boolean, data: Booking }
router.post("/", protect, createBooking);

// GET /api/bookings/my-bookings
// Retrieve all bookings for the authenticated user
// PROTECTED - requires JWT token in Authorization header
// Response: { success: boolean, data: Array<Booking> }
// Note: Bookings are populated with full flight details for display
router.get("/my-bookings", protect, getMyBookings);

// PUT /api/bookings/:id/status
// Update booking status (confirm or cancel a booking)
// PROTECTED - requires JWT token in Authorization header
// Params: id = booking._id
// Body: { status: "confirmed" | "canceled" }
// Response: { success: boolean, data: Booking }
// Note: If status is changed to "canceled", seats are released back to the flight
router.put("/:id/status", protect, updateBookingStatus);

// Export the router for use in server.js
module.exports = router;