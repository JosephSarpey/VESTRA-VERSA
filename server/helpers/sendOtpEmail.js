const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,    // e.g., your_gmail@gmail.com
      pass: process.env.EMAIL_PASS,    // e.g., your app password
    },
  });

  let mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Account Activation OTP',
    text: `Your OTP for account activation is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };