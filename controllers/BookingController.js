// ============================================================================
// BOOKING CONTROLLER
// ============================================================================
// Handles all booking-related operations for flight reservations
// Manages booking creation, retrieval for users, and booking status updates (confirm/cancel)

const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

// ============================================================================
// CREATE BOOKING - User books seats on a flight
// ============================================================================
// POST /api/bookings (protected route - requires authentication)
// 
// Request body: {
//   flightId: string,      // MongoDB ID of flight to book
//   numberOfSeats: number  // Number of seats to reserve (minimum 1)
// }
// Response: { success: boolean, data: Booking }

exports.createBooking = async (req, res) => {
  try {
    // Extract booking data from request body
    const { flightId, numberOfSeats } = req.body;
    // Get authenticated user ID from middleware (set by protect middleware)
    const userId = req.user.id;

    // Find the flight being booked
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: "Flight not found" 
      });
    }

    // Check if enough seats are available
    // Cannot book more seats than are available on the flight
    if (flight.availableSeats < numberOfSeats) {
      return res.status(400).json({ 
        success: false, 
        message: "Not enough available seats" 
      });
    }

    // Calculate total price for this booking
    // Formula: price per seat × number of seats being booked
    const totalPrice = flight.price * numberOfSeats;

    // Create new booking document in database
    const booking = await Booking.create({
      user: userId,           // Reference to the user making the booking
      flight: flightId,       // Reference to the flight being booked
      numberOfSeats,          // Number of seats reserved
      totalPrice,             // Total cost of booking (price × seats)
      // status defaults to "confirmed" as defined in Booking model
    });

    // Update the flight's available seats count
    // Decrease available seats by the number of seats just booked
    flight.availableSeats -= numberOfSeats;
    await flight.save();

    // Return newly created booking to client
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    // Return error response if booking creation fails
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// GET MY BOOKINGS - Retrieve all bookings for authenticated user
// ============================================================================
// GET /api/bookings/my-bookings (protected route - requires authentication)
// 
// Response: { success: boolean, data: Array<Booking> }
// Bookings are populated with full flight details (flight name, date, price, etc.)

exports.getMyBookings = async (req, res) => {
  try {
    // Find all bookings for the authenticated user
    // .populate("flight") replaces flight ID with full flight document details
    const bookings = await Booking.find({ user: req.user.id }).populate("flight");
    
    // Return user's bookings to client
    res.json({ success: true, data: bookings });
  } catch (error) {
    // Return error response if retrieval fails
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// UPDATE BOOKING STATUS - Confirm or cancel a booking
// ============================================================================
// PUT /api/bookings/:id/status (protected route - requires authentication)
// 
// URL parameters: id = booking._id
// Request body: { status: "confirmed" | "canceled" }
// Response: { success: boolean, data: Booking }
// 
// If canceling: releases the reserved seats back to the flight's available count

exports.updateBookingStatus = async (req, res) => {
  try {
    // Extract the new status from request body
    // Expected values: "confirmed" or "canceled"
    const { status } = req.body;
    
    // Find the booking by ID and populate flight details
    // .populate("flight") retrieves full flight document info needed for seat updates
    const booking = await Booking.findById(req.params.id).populate("flight");

    // If no booking found with this ID, return 404 error
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // If status is being changed to "canceled" and it's not already canceled
    // then release the seats back to the flight's available count
    if (status === "canceled" && booking.status !== "canceled") {
      // Add the reserved seats back to the flight's available seats
      booking.flight.availableSeats += booking.numberOfSeats;
      // Save the updated flight document to database
      await booking.flight.save();
    }

    // Update the booking status
    booking.status = status;
    // Save the updated booking to database
    await booking.save();

    // Return updated booking to client
    res.json({ success: true, data: booking });
  } catch (error) {
    // Return error response if status update fails
    res.status(500).json({ success: false, message: error.message });
  }
};