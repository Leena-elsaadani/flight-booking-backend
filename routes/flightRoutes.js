// ============================================================================
// FLIGHT ROUTES
// ============================================================================
// Defines all routes for flight management operations
// Routes for creating, reading, updating, and deleting flights, plus searching

const express = require("express");
const router = express.Router();

// Import controller functions that handle the route logic
const { 
  createFlight, 
  getAllFlights, 
  updateFlight, 
  deleteFlight, 
  searchFlights 
} = require("../controllers/flightController");

// Import authentication middleware to protect certain routes
const { protect } = require("../middleware/authMiddleware");

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

// POST /api/flights
// Create a new flight (PROTECTED - requires JWT token)
// Body: { flightNumber, from, to, date, totalSeats, availableSeats, price }
// Response: { success: boolean, data: Flight }
router.post("/", protect, createFlight);

// GET /api/flights
// Retrieve all flights (PUBLIC - no authentication required)
// Response: { success: boolean, data: Array<Flight> }
router.get("/", getAllFlights);

// PUT /api/flights/:id
// Update an existing flight by ID (PROTECTED - requires JWT token)
// Params: id = flight._id
// Body: { any fields to update }
// Response: { success: boolean, data: Flight }
router.put("/:id", protect, updateFlight);

// DELETE /api/flights/:id
// Delete a flight by ID (PROTECTED - requires JWT token)
// Params: id = flight._id
// Response: { success: boolean, message: string }
router.delete("/:id", protect, deleteFlight);

// GET /api/flights/search?from=...&to=...&date=...
// Search for flights based on criteria (PUBLIC - no authentication required)
// Query Params:
//   - from: departure city (optional)
//   - to: arrival city (optional)
//   - date: departure date (optional)
// Response: { success: boolean, data: Array<Flight> }
// NOTE: This route must be defined BEFORE the /:id routes to avoid conflicts
// Without this order, "/search" would match "/:id" with id="search"
router.get("/search", searchFlights);

// Export the router for use in server.js
module.exports = router;