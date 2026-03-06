const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { flightId, numberOfSeats } = req.body;
    const userId = req.user.id;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });

    if (flight.availableSeats < numberOfSeats) {
      return res.status(400).json({ success: false, message: "Not enough available seats" });
    }

    // Calculate total price
    const totalPrice = flight.price * numberOfSeats;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      flight: flightId,
      numberOfSeats,
      totalPrice,
    });

    // Decrement available seats
    flight.availableSeats -= numberOfSeats;
    await flight.save();

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings for logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("flight");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status (confirm/cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // "confirmed" or "canceled"
    const booking = await Booking.findById(req.params.id).populate("flight");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // If canceling, increment available seats
    if (status === "canceled" && booking.status !== "canceled") {
      booking.flight.availableSeats += booking.numberOfSeats;
      await booking.flight.save();
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};