// controllers/flightController.js
const Flight = require("../models/Flight");

// Create flight
exports.createFlight = async (req, res) => {
  try {
    const { flightNumber, from, to, date, totalSeats, availableSeats, price } = req.body;

    const flightExists = await Flight.findOne({ flightNumber });
    if (flightExists) {
      return res.status(400).json({ success: false, message: "Flight already exists" });
    }

    const flight = await Flight.create({
      flightNumber,
      from,
      to,
      date,
      totalSeats,
      availableSeats,
      price,
    });

    res.status(201).json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json({ success: true, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    res.json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    res.json({ success: true, message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};