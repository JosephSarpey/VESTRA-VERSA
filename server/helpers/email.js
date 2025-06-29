const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendResetEmail(to, resetLink) {
  const mailOptions = {
    from: `"Vestra Versa Fashion Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. If you did not request this, ignore this email.</p>`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendResetEmail };