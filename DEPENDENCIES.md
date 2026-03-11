# ============================================================================
# FLIGHT BOOKING BACKEND - PACKAGE.JSON REFERENCE
# ============================================================================
# This file documents all the dependencies and scripts in package.json
# ============================================================================

## PROJECT METADATA

- **name**: flight-booking-backend
  The name of the Node.js project

- **version**: 1.0.0
  The current semantic version of the project

- **description**: Flight Booking API
  Brief description of what this project does

- **main**: index.js
  The entry point file (though server.js is actually used)

## AVAILABLE SCRIPTS

You can run these scripts using: `npm run script-name`

### Start Scripts

- **npm start**
  Runs: `node server.js`
  Starts the production server
  
- **npm run dev**
  Runs: `nodemon server.js`
  Starts the development server with auto-reload
  When you modify any file, nodemon automatically restarts the server
  BEST FOR DEVELOPMENT!

## PRODUCTION DEPENDENCIES

These packages are required to run the application:

### **express** (^5.2.1)
Web application framework for Node.js
- Creates the HTTP server and handles routing
- Manages middleware, request/response handling
- Used for: app initialization, route definitions, middleware setup

### **cors** (^2.8.6)
Enables Cross-Origin Resource Sharing
- Allows requests from different domains/ports
- Without CORS, browsers would block API requests from frontend
- Used in: server.js middleware setup

### **dotenv** (^17.3.1)
Loads environment variables from .env file
- Reads .env file and makes variables available via process.env
- Allows Configuration without hardcoding secrets
- Used in: server.js (first line: require("dotenv").config())

### **mongoose** (^9.2.4)
ODM (Object Document Mapper) for MongoDB
- Provides schema definition and validation
- Handles database connections and queries
- Used in: all model files (User.js, Flight.js, Booking.js)
- Used in: config/db.js for database connection

### **jsonwebtoken** (^9.0.3)
JWT (JSON Web Token) library for authentication
- Creates and verifies JWT tokens
- Tokens are used for user session management
- Used in: authController.js (login function)
- Used in: authMiddleware.js (protect function)

### **bcryptjs** (^3.0.3)
Password hashing library
- Hashes passwords securely using bcrypt algorithm
- Compares plain text passwords with hashed versions
- Used in: authController.js (register and login)

### **nodemailer** (^8.0.1)
Email sending library
- Sends emails via SMTP servers
- Configured to work with Mailtrap for development
- Used in: utils/sendEmail.js

## DEVELOPMENT DEPENDENCIES

These packages are only needed during development:

### **nodemon** (^3.1.14)
Auto-reload development tool
- Watches file system for changes
- Automatically restarts Node.js server when files change
- Speeds up development workflow
- Used with: `npm run dev` command

## CONFIGURATION

- **"type"**: "commonjs"
  Specifies that the project uses CommonJS module syntax (require/module.exports)
  Alternative: "module" would use ES6 import/export syntax

## HOW TO USE

1. **Install dependencies**:
   ```bash
   npm install
   ```
   This reads package.json and installs all listed packages

2. **Development**:
   ```bash
   npm run dev
   ```
   Starts server with auto-reload feature

3. **Production**:
   ```bash
   npm start
   ```
   Starts server normally (no auto-reload)

## INSTALLING NEW PACKAGES

To add a new dependency:
```bash
npm install package-name
```

To add a development-only dependency:
```bash
npm install --save-dev package-name
```

This automatically updates package.json and package-lock.json
