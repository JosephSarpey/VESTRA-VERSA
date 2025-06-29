const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_EMAIL_PASS,
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
      from: `"${name}" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission From ${name} - ${subject}`,
      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Contact Form Message</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f8f8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #1e1e1e; color: #FFD700; text-align: center; padding: 20px;">
                  <h2 style="margin: 0;">New Contact Form Message</h2>
                </td>
              </tr>

              <!-- Message Content -->
              <tr>
                <td style="padding: 30px; color: #333333;">
                  <p>Hello Admin,</p>
                  <p>You have received a new contact form submission:</p>

                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject}</p>

                  <h3 style="color:rgb(51, 4, 4); margin-top: 30px;">Message</h3>
                  <p style="line-height: 1.6; white-space: pre-line;">${message}</p>

                  <!-- Reply Button -->
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="mailto:${email}" style="background-color: #FFD700; color: #1e1e1e; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                      ✉️ Reply to ${name}
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px; text-align: center; font-size: 13px; color: #888;">
                  <p>Need help? Contact your site admin.</p>
                  <p style="margin-top: 10px;"><strong>The Vestra Versa Team</strong></p>
                  <p style="margin-top: 20px;">© ${new Date().getFullYear()} www.vestraversa.com. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`,

    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({
      message: 'Failed to send message. Please try again later.',
      error: error.message,
    });
  }
});

module.exports = router;
