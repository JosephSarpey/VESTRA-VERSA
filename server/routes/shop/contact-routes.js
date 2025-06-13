const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212;">
    <div style="max-width: 600px; margin: auto; background-color: #1e1e1e; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(255,215,0,0.1);">
      <div style="background-color: #2c2c2c; color: #FFD700; padding: 20px;">
        <h2 style="margin: 0;">New Contact Form Submission</h2>
      </div>
      <div style="padding: 20px; color: #f0f0f0;">
        <p><strong style="color: #FFD700;">Name:</strong> ${name}</p>
        <p><strong style="color: #FFD700;">Email:</strong> ${email}</p>
        <p><strong style="color: #FFD700;">Subject:</strong> ${subject}</p>
        <hr style="border-color: #FFD700; margin: 20px 0;" />
        <h3 style="margin-bottom: 10px; color: #FFD700;">Message</h3>
        <p style="white-space: pre-line;">${message}</p>

        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${email}" style="background-color: #FFD700; color: #121212; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reply to ${name}
          </a>
        </div>
      </div>
      <div style="background-color: #2c2c2c; text-align: center; padding: 10px; font-size: 12px; color: #aaa;">
        <p>This message was sent from your website's contact form.</p>
      </div>
    </div>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({
      message: 'Failed to send message. Please try again later.',
      error: error.message
    });
  }
});

module.exports = router;
