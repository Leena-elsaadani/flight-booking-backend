// ============================================================================
// EMAIL UTILITY FUNCTION
// ============================================================================
// Helper function to send emails using Nodemailer
// Used for sending verification codes to users during registration
// Configured to work with Mailtrap (email testing service) or production email service

const nodemailer = require("nodemailer");

/**
 * sendEmail - Send an email to a user
 *
 * Description:
 * - Creates a nodemailer transporter configured with Mailtrap credentials
 * - Constructs email with sender, recipient, subject, and body text
 * - Sends the email asynchronously
 * - Logs success or error messages to console
 *
 * Parameters:
 * @param {string} to - Recipient email address (e.g., "user@example.com")
 * @param {string} subject - Email subject line (e.g., "Verify your Flight Booking account")
 * @param {string} text - Email body content (plain text, not HTML)
 *
 * Returns:
 * - Promise that resolves when email is sent successfully
 * - Rejects if email sending fails
 *
 * Environment Variables Required:
 * - MAIL_HOST: SMTP server host (e.g., "sandbox.smtp.mailtrap.io")
 * - MAIL_PORT: SMTP port number (typically 587 for TLS)
 * - MAIL_USER: SMTP username for authentication
 * - MAIL_PASS: SMTP password for authentication
 */
const sendEmail = async (to, subject, text) => {
  try {
    // Create a nodemailer transporter with Mailtrap SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,           // Mailtrap SMTP host from .env
      port: process.env.MAIL_PORT,           // Mailtrap SMTP port from .env
      secure: false,                          // IMPORTANT: false for TLS (port 587)
      // Set to true only if using port 465 with SSL
      auth: {
        user: process.env.MAIL_USER,        // Mailtrap username from .env
        pass: process.env.MAIL_PASS         // Mailtrap password from .env
      }
    });

    // Construct the email message with sender, recipient, subject, and body
    const mailOptions = {
      from: '"Flight Booking" <no-reply@flight.com>',  // Sender display name and address
      to,                                                  // Recipient email address (passed as parameter)
      subject,                                             // Email subject line (passed as parameter)
      text                                                 // Email body content (passed as parameter)
    };

    // Send the email asynchronously
    // This returns a promise that resolves when email is sent
    await transporter.sendMail(mailOptions);

    // Log success message if email is sent without errors
    console.log(`Email sent to ${to}`);

  } catch (error) {
    // Log error message if email sending fails
    // Email sending failure should not crash the application
    console.error("Email sending failed:", error.message);
    // Note: We don't throw the error here, allowing the application to continue
    // This graceful error handling prevents registration from failing if email service is temporarily down
  }
};

// Export the sendEmail function for use in controllers
module.exports = sendEmail;