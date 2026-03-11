# Flight Booking Backend - Complete Documentation

This is a comprehensive guide to the Flight Booking Backend API. Every file has been fully documented with detailed comments explaining the code.

## Project Overview

The Flight Booking Backend is a Node.js/Express REST API that manages flight bookings for an airline system. It handles:
- **User Management**: Registration, login, email verification  
- **Flight Management**: Create, read, update, delete flights
- **Booking Management**: Create bookings, view bookings, confirm/cancel bookings

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js (web server)
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs (password hashing)
- **Email**: Nodemailer + Mailtrap (email sending)

## Project Structure

```
flight-booking-backend/
├── server.js                 # Main entry point - initializes Express server
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (NOT in git)
├── .env.example              # Example environment variables
│
├── config/
│   └── db.js                 # MongoDB connection setup
│
├── controllers/              # Request handlers for business logic
│   ├── authController.js     # User registration, login, verification
│   ├── flightController.js   # Flight CRUD operations and search
│   └── BookingController.js  # Booking creation and management
│
├── models/                   # Database schemas
│   ├── User.js               # User document structure
│   ├── Flight.js             # Flight document structure
│   └── Booking.js            # Booking document structure
│
├── routes/                   # API endpoint definitions
│   ├── authRoutes.js         # /api/auth/* endpoints
│   ├── flightRoutes.js       # /api/flights/* endpoints
│   └── bookingRoutes.js      # /api/bookings/* endpoints
│
├── middleware/               # Express middleware functions
│   ├── authMiddleware.js     # JWT token verification
│   └── errorMiddleware.js    # Global error handling
│
├── utils/
│   └── sendEmail.js          # Email sending utility
│
├── DEPENDENCIES.md           # Dependencies documentation
└── README.md                 # This file
```

## File Descriptions

### Core Files

- **server.js** - Main Express application setup
  - Loads environment variables
  - Connects to MongoDB
  - Sets up middleware (CORS, JSON parsing)
  - Registers all routes
  - Handles 404 and global errors

- **config/db.js** - Database Configuration
  - Creates MongoDB connection
  - Handles connection errors

### Controllers (Business Logic)

These files contain the actual business logic that runs when an API endpoint is called.

- **controllers/authController.js**
  - `register()` - Create new user account with email verification
  - `login()` - Authenticate user and issue JWT token
  - `verifyEmail()` - Verify user's email with verification code

- **controllers/flightController.js**
  - `createFlight()` - Add new flight to system
  - `getAllFlights()` - Get list of all flights
  - `updateFlight()` - Modify flight details
  - `deleteFlight()` - Remove flight from system
  - `searchFlights()` - Search flights by route/date

- **controllers/BookingController.js**
  - `createBooking()` - Create booking and reserve seats
  - `getMyBookings()` - Get user's bookings
  - `updateBookingStatus()` - Confirm or cancel booking

### Models (Database Schemas)

These define the structure of data stored in MongoDB.

- **models/User.js**
  - name: User's full name
  - email: Unique email address
  - password: Hashed password
  - isVerified: Email verification status
  - verificationCode: 6-digit verification code
  - verificationCodeExpires: Code expiration time

- **models/Flight.js**
  - flightNumber: Unique flight identifier (e.g., "AA123")
  - from: Departure city
  - to: Arrival city
  - date: Departure date/time
  - totalSeats: Total seats on flight
  - availableSeats: Remaining available seats
  - price: Price per seat

- **models/Booking.js**
  - user: Reference to User (ObjectId)
  - flight: Reference to Flight (ObjectId)
  - bookingDate: When booking was created
  - numberOfSeats: Seats reserved
  - totalPrice: Total cost (price × seats)
  - status: "confirmed" or "canceled"

### Routes (API Endpoints)

- **routes/authRoutes.js**
  - POST /api/auth/register - Register new user
  - POST /api/auth/login - Authenticate user
  - POST /api/auth/verify-email - Verify email

- **routes/flightRoutes.js**
  - POST /api/flights - Create flight (protected)
  - GET /api/flights - List all flights
  - GET /api/flights/search - Search flights by criteria
  - PUT /api/flights/:id - Update flight (protected)
  - DELETE /api/flights/:id - Delete flight (protected)

- **routes/bookingRoutes.js**
  - POST /api/bookings - Create booking (protected)
  - GET /api/bookings/my-bookings - Get user's bookings (protected)
  - PUT /api/bookings/:id/status - Update booking status (protected)

### Middleware

- **middleware/authMiddleware.js**
  - `protect()` - Verify JWT token in Authorization header
  - Used on protected routes to ensure user is authenticated

- **middleware/errorMiddleware.js**
  - `errorHandler()` - Catch and process errors
  - Must be LAST middleware in server.js

### Utilities

- **utils/sendEmail.js**
  - `sendEmail()` - Send emails via Mailtrap SMTP
  - Used for verification codes during registration

## Getting Started

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd flight-booking-backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create .env file**:
   - Copy `.env.example` to `.env`
   - Fill in your actual values (database URI, JWT secret, email credentials)

4. **Start the server**:
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

Server is running at `http://localhost:5000`

## API Reference

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, message }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, message, data: { user, token } }
```

#### Verify Email
```
POST /api/auth/verify-email
Body: { email, code }
Response: { success, message }
```

### Flight Endpoints

#### Create Flight (Protected)
```
POST /api/flights
Headers: Authorization: Bearer <token>
Body: { flightNumber, from, to, date, totalSeats, availableSeats, price }
Response: { success, data: Flight }
```

#### Get All Flights
```
GET /api/flights
Response: { success, data: [Flight] }
```

#### Search Flights
```
GET /api/flights/search?from=NYC&to=LAX&date=2024-12-25
Response: { success, data: [Flight] }
```

#### Update Flight (Protected)
```
PUT /api/flights/:id
Headers: Authorization: Bearer <token>
Body: { any fields to update }
Response: { success, data: Flight }
```

#### Delete Flight (Protected)
```
DELETE /api/flights/:id
Headers: Authorization: Bearer <token>
Response: { success, message }
```

### Booking Endpoints

#### Create Booking (Protected)
```
POST /api/bookings
Headers: Authorization: Bearer <token>
Body: { flightId, numberOfSeats }
Response: { success, data: Booking }
```

#### Get My Bookings (Protected)
```
GET /api/bookings/my-bookings
Headers: Authorization: Bearer <token>
Response: { success, data: [Booking] }
```

#### Update Booking Status (Protected)
```
PUT /api/bookings/:id/status
Headers: Authorization: Bearer <token>
Body: { status: "confirmed" | "canceled" }
Response: { success, data: Booking }
```

## How It Works

### User Registration Flow
1. User sends registration request with name, email, password
2. Server validates all fields are provided
3. Server checks if email already exists
4. Server hashes the password using bcryptjs
5. Server generates random 6-digit verification code
6. Server creates user document in MongoDB
7. Server sends verification code via email to user
8. Response sent to client to check email

### User Login Flow
1. User sends login request with email and password
2. Server finds user by email
3. Server compares provided password with hashed password
4. If valid, server generates JWT token
5. Server returns user info and token
6. Client stores token for future authenticated requests

### Flight Booking Flow
1. Client requests available flights (with optional filters)
2. User selects a flight and number of seats
3. Client sends booking request (must include JWT token)
4. Server verifies user is authenticated (authMiddleware)
5. Server checks if flight exists and has available seats
6. Server creates booking document
7. Server decrements flight's available seats
8. Response sent with booking confirmation

### Booking Cancellation Flow
1. User requests to cancel booking (with JWT token)
2. Server finds the booking
3. If status is "confirmed", increment flight's available seats
4. Change booking status to "canceled"
5. Response sent with updated booking

## Environment Variables

See `.env.example` for all required variables:

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `MAIL_HOST` - SMTP server host
- `MAIL_PORT` - SMTP server port
- `MAIL_USER` - SMTP username
- `MAIL_PASS` - SMTP password

## Security Notes

1. **Never commit .env file** - Add to .gitignore
2. **Use strong JWT_SECRET** - Change the default value
3. **Passwords are hashed** - Using bcryptjs with 10 salt rounds
4. **Use HTTPS in production** - Never send tokens over HTTP
5. **Keep JWT tokens secure** - Store in secure, httpOnly cookies
6. **Validate all inputs** - Server performs input validation
7. **Use CORS carefully** - Configure allowed origins in production

## Common Issues & Solutions

**Cannot connect to MongoDB**
- Check MONGO_URI in .env file
- Ensure MongoDB is running
- Check firewall and network settings

**Email not being sent**
- Verify Mailtrap credentials in .env
- Check email configuration in sendEmail.js
- Ensure port 587 is not blocked

**JWT token errors**
- Token may have expired (tokens expire after 1 day)
- Verify token format: "Bearer <token>"
- Check JWT_SECRET matches between sign and verify

**Booking fails with "Not enough seats"**
- Number of requested seats exceeds available seats
- Check flight availability before booking
- Another user may have booked seats simultaneously

## Future Enhancements

These features could be added:
- Email verification completion (verifyEmail handler)
- Payment processing (Stripe, PayPal)
- User profile management
- Booking history and analytics
- Admin dashboard for flight management
- Seat selection and seating map
- Booking price calculations with taxes
- Cancellation fees
- Refund management
- Email notifications for booking status
- SMS notifications
- Multi-language support

## Testing

Recommended tools for testing the API:
- **Postman** - GUI for making API requests
- **Insomnia** - Alternative REST client
- **curl** - Command-line HTTP client
- **Thunder Client** - VS Code extension

Example curl request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Support

For issues or questions:
1. Check the commented code in each file
2. Review the API Reference section
3. Check environment variables are set correctly
4. Review MongoDB connection
5. Check server logs for error messages

## License

ISC

---

**Every line of code in this project has detailed comments explaining what it does and why. Check each file for in-depth explanations!**
