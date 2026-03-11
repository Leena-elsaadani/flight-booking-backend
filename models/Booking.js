// ============================================================================
// BOOKING MODEL
// ============================================================================
// Defines the MongoDB schema and model for Booking documents
// A booking represents a user's reservation for one or more seats on a flight

const mongoose = require("mongoose");

// Define the Booking collection schema
const bookingSchema = new mongoose.Schema({
  // Reference to the User who made this booking
  // Type: ObjectId - references the _id field of a User document
  // ref: "User" - tells Mongoose to populate this field from the User collection
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Reference to the Flight being booked
  // Type: ObjectId - references the _id field of a Flight document
  // ref: "Flight" - tells Mongoose to populate this field from the Flight collection
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  
  // Date when the booking was created
  // Stored using Date.now() - automatically set to current time when booking is created
  bookingDate: { type: Date, default: Date.now },
  
  // Number of seats being booked on this flight
  // Must be >= 1 and cannot exceed available seats on the flight
  numberOfSeats: { type: Number, required: true },
  
  // Total price of the booking (calculated as: flight.price * numberOfSeats)
  // Stored separately for historical record (price doesn't change if flight price is updated later)
  totalPrice: { type: Number, required: true },
  
  // Current status of the booking
  // "confirmed" - booking is active, seats are reserved
  // "canceled" - booking is cancelled, seats are released back to the flight
  status: { type: String, enum: ["confirmed", "canceled"], default: "confirmed" },
});

// Create and export the Booking model based on the schema
module.exports = mongoose.model("Booking", bookingSchema);