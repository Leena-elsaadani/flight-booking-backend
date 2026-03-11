// ============================================================================
// FLIGHT CONTROLLER
// ============================================================================
// Handles all flight-related operations: CRUD operations and flight search
// Manages flight creation, retrieval, updates, deletion, and search functionality

const Flight = require("../models/Flight");

// ============================================================================
// CREATE FLIGHT - Add a new flight to the system
// ============================================================================
// POST /api/flights (protected route - requires authentication)
// 
// Request body: {
//   flightNumber: string,    // e.g., "AA123"
//   from: string,           // Departure city/airport
//   to: string,             // Arrival city/airport
//   date: Date,             // Flight departure date and time
//   totalSeats: number,     // Total seats on the flight
//   availableSeats: number, // Initially same as totalSeats
//   price: number           // Price per seat
// }
// Response: { success: boolean, data: Flight }

exports.createFlight = async (req, res) => {
  try {
    // Extract flight data from request body
    const { flightNumber, from, to, date, totalSeats, availableSeats, price } = req.body;

    // Check if a flight with this flight number already exists
    // Flight numbers must be unique
    const flightExists = await Flight.findOne({ flightNumber });
    if (flightExists) {
      return res.status(400).json({ 
        success: false, 
        message: "Flight already exists" 
      });
    }

    // Create new flight document in database
    const flight = await Flight.create({
      flightNumber,
      from,
      to,
      date,
      totalSeats,
      availableSeats,
      price,
    });

    // Return newly created flight to client
    res.status(201).json({ success: true, data: flight });
  } catch (error) {
    // Return error response if creation fails
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// GET ALL FLIGHTS - Retrieve all flights from the database
// ============================================================================
// GET /api/flights (public route - no authentication required)
// 
// Response: { success: boolean, data: Array<Flight> }

exports.getAllFlights = async (req, res) => {
  try {
    // Fetch all flight documents from the database
    const flights = await Flight.find();
    
    // Return all flights to client
    res.json({ success: true, data: flights });
  } catch (error) {
    // Return error response if retrieval fails
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// UPDATE FLIGHT - Update an existing flight's information
// ============================================================================
// PUT /api/flights/:id (protected route - requires authentication)
// 
// URL parameters: id = flight._id
// Request body: { flightNumber?: string, from?: string, ... } (any fields to update)
// Response: { success: boolean, data: Flight }

exports.updateFlight = async (req, res) => {
  try {
    // Find flight by ID and update with data from request body
    // { new: true } option returns the updated document instead of original
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // If no flight found with this ID, return 404 error
    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: "Flight not found" 
      });
    }
    
    // Return updated flight to client
    res.json({ success: true, data: flight });
  } catch (error) {
    // Return error response if update fails
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// DELETE FLIGHT - Remove a flight from the system
// ============================================================================
// DELETE /api/flights/:id (protected route - requires authentication)
// 
// URL parameters: id = flight._id
// Response: { success: boolean, message: string }

exports.deleteFlight = async (req, res) => {
  try {
    // Find flight by ID and delete it from database
    const flight = await Flight.findByIdAndDelete(req.params.id);
    
    // If no flight found with this ID, return 404 error
    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: "Flight not found" 
      });
    }
    
    // Return success message to client
    res.json({ success: true, message: "Flight deleted successfully" });
  } catch (error) {
    // Return error response if deletion fails
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// SEARCH FLIGHTS - Search for flights based on criteria
// ============================================================================
// GET /api/flights/search?from=...&to=...&date=... (public route)
// 
// Query parameters (all optional):
// - from: string (departure city)
// - to: string (arrival city)
// - date: string (departure date in ISO format, e.g., "2024-12-25")
// 
// Response: { success: boolean, data: Array<Flight> }
// Returns flights matching ALL provided filters (AND logic)

exports.searchFlights = async (req, res) => {
  try {
    // Extract search filters from query parameters
    // query params are in format: /search?from=NYC&to=LAX&date=2024-12-25
    const { from, to, date } = req.query;

    // Build dynamic filter object
    // Only add properties to filter if they were provided in the request
    let filter = {};
    if (from) filter.from = from;        // Match departure city
    if (to) filter.to = to;              // Match arrival city
    if (date) filter.date = new Date(date); // Convert date string to Date object for comparison

    // Find all flights matching the filter criteria
    const flights = await Flight.find(filter);

    // Return matching flights to client
    res.json({ success: true, data: flights });
  } catch (error) {
    // Return error response if search fails
    res.status(500).json({ success: false, message: error.message });
  }
};