// ============================================================================
// DATABASE CONFIGURATION MODULE
// ============================================================================
// This file handles the connection to MongoDB using Mongoose
// It exports a function that should be called in server.js to initialize the DB

const mongoose = require("mongoose");

/**
 * connectDB - Establishes connection to MongoDB database
 * 
 * Description:
 * - Uses the MONGO_URI from environment variables to connect to the database
 * - If connection succeeds, logs a success message to console
 * - If connection fails, logs the error message and exits the process with status code 1
 * 
 * Returns: Promise that resolves when connected, rejects if connection fails
 * 
 * This async function is called in server.js at application startup
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from .env file
    // Example: mongodb://127.0.0.1:27017/flight-booking
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    // Log error message if connection fails
    console.error("Database connection failed:", error.message);
    // Exit the process (status 1 = error) if database connection cannot be established
    // This prevents the server from running without a database
    process.exit(1);
  }
};

// Export the connectDB function for use in server.js
module.exports = connectDB;