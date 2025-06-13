const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer transporter setup
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
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Contact Form Submission</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
              <tr>
                <td align="center" style="padding: 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(255,215,0,0.2);">
                    <tr>
                      <td bgcolor="#ffffff" style="padding: 20px; color: #FFD700; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">New Contact Form Submission</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; color: #f0f0f0;">
                        <p><strong style="color: #FFD700;">Name:</strong> ${name}</p>
                        <p><strong style="color: #FFD700;">Email:</strong> ${email}</p>
                        <p><strong style="color: #FFD700;">Subject:</strong> ${subject}</p>
                        <hr style="border: none; border-top: 1px solid #FFD700; margin: 20px 0;" />
                        <h3 style="margin: 0 0 10px; color: #FFD700;">Message</h3>
                        <p style="white-space: pre-line; line-height: 1.6;">${message}</p>
                        <div style="text-align: center; margin-top: 30px;">
                          <a href="mailto:${email}" style="background-color: #FFD700; color: #121212; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Reply to ${name}
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" style="text-align: center; padding: 10px; font-size: 12px; color: #aaa;">
                        <p style="margin: 0;">This message was sent from your website's contact form.</p>
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
