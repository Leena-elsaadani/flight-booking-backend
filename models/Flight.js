// ============================================================================
// FLIGHT MODEL
// ============================================================================
// Defines the MongoDB schema and model for Flight documents
// Flights contain information about available flights including route, date, and pricing

const mongoose = require("mongoose");

// Define the Flight collection schema
const flightSchema = new mongoose.Schema({
  // Unique flight identifier (e.g., "AA123", "BA456")
  // Must be unique - no two flights can have the same flight number
  flightNumber: { type: String, required: true, unique: true },
  
  // Departure city/airport (e.g., "New York", "JFK")
  from: { type: String, required: true },
  
  // Arrival city/airport (e.g., "Los Angeles", "LAX")
  to: { type: String, required: true },
  
  // Flight departure date and time
  date: { type: Date, required: true },
  
  // Total number of seats available on the flight
  // This value remains constant for a flight
  totalSeats: { type: Number, required: true },
  
  // Number of seats still available for booking
  // Decreases as bookings are made, increases if bookings are cancelled
  availableSeats: { type: Number, required: true },
  
  // Price per seat in the flight (in currency units)
  // Total booking cost = price * numberOfSeats
  price: { type: Number, required: true },
});

// Create and export the Flight model based on the schema
module.exports = mongoose.model("Flight", flightSchema);