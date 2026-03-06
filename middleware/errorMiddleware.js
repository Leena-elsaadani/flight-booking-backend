// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // logs the full error stack for debugging

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    // optional: only in dev
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;