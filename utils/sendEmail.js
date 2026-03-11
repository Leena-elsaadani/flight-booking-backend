const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // IMPORTANT for Mailtrap
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: '"Flight Booking" <no-reply@flight.com>',
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${to}`);

  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

module.exports = sendEmail;