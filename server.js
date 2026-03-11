// ============================================================================
// MAIN SERVER FILE - Flight Booking Backend
// ============================================================================
// This is the entry point for the Express.js server application.
// It initializes middleware, database connection, and all API routes.
// When started, the server listens on the specified PORT and accepts HTTP requests.
// ============================================================================

// Load environment variables from .env file into process.env
// This allows us to use variables like process.env.PORT, process.env.MONGO_URI, etc.
require("dotenv").config();

// Import required packages
const express = require("express");        // Web framework for creating the API server
const cors = require("cors");              // Middleware to enable Cross-Origin Resource Sharing (CORS)

// Import database connection function from config folder
const connectDB = require("./config/db");

// Import route modules - these define all the API endpoints
const authRoutes = require("./routes/authRoutes");       // Routes for user registration, login, verification
const flightRoutes = require("./routes/flightRoutes");   // Routes for flight management (CRUD operations)
const bookingRoutes = require("./routes/bookingRoutes"); // Routes for booking management

// Import error handling middleware
const errorHandler = require("./middleware/errorMiddleware");

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Create Express application instance
const app = express();

// Connect to MongoDB database (async function that initializes the database connection)
connectDB();

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Enable CORS middleware - allows requests from different origins/domains
// Without this, browsers would block requests from frontend running on different port/domain
app.use(cors());

// JSON parser middleware - automatically parses incoming JSON request bodies
// Makes JSON data available in req.body for all routes
app.use(express.json());

// ============================================================================
// ROUTE SETUP - Define all API endpoints
// ============================================================================

// Authentication routes mounted at /api/auth/*
// Examples: POST /api/auth/register, POST /api/auth/login, POST /api/auth/verify-email
app.use("/api/auth", authRoutes);

// Flight management routes mounted at /api/flights/*
// Examples: GET /api/flights, POST /api/flights, PUT /api/flights/:id, DELETE /api/flights/:id
app.use("/api/flights", flightRoutes);

// Booking management routes mounted at /api/bookings/*
// Examples: POST /api/bookings, GET /api/bookings/my-bookings, PUT /api/bookings/:id/status
app.use("/api/bookings", bookingRoutes);

// Health check endpoint - simple route to verify server is running and accessible
app.get("/", (req, res) => {
  res.send("Flight Booking API Running");
});

// ============================================================================
// ERROR HANDLING & 404 ROUTES
// ============================================================================

// 404 handler middleware - catches all requests to undefined routes
// Returns a JSON response with error status and message
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler middleware - catches all errors thrown by routes/controllers
// Logs the full error stack to console and sends formatted error response to client
// This must be the LAST middleware defined
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

// Get port from environment variables (defined in .env file)
// If PORT is not defined, default to 5000
const PORT = process.env.PORT || 5000;

// Start the Express server - listen for incoming HTTP requests on the specified PORT
// Callback logs a message to console when server successfully starts
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);