const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  const expirationMinutes = 10; // OTP valid for 10 minutes
  const expirationTime = new Date(Date.now() + expirationMinutes * 60000).toLocaleString();

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Vestra Versa Fashion Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Account Activation',
      text: `Your OTP is ${otp}. It will expire in ${expirationMinutes} minutes (by ${expirationTime}).`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #222; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Vestra Versa Fashion Hub</h1>
            </div>
            <div style="padding: 30px; text-align: center;">
              <h2 style="color: #333;">Your OTP for Account Activation</h2>
              <p style="font-size: 18px; margin: 20px 0;">Use the following OTP to activate your account:</p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #444;">${otp}</p>
              <p style="color: #888; margin-top: 20px;">This OTP will expire in <strong>${expirationMinutes} minutes</strong> (by <strong>${expirationTime}</strong>).</p>
              <p style="margin-top: 30px; font-size: 14px; color: #aaa;">If you did not request this email, please ignore it.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOtpEmail };
