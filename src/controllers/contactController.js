const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, department, message } = req.body;

    // Server-side validation
    if (!name || !email || !phone || !department || !message || message.length > 250) {
      return res.status(400).send('Invalid form data');
    }

    const textMessage = `📩 *New Contact Form Submission:*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone}\n` +
      `*Department:* ${department}\n` +
      `*Message:* ${message}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await axios.post(telegramUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: textMessage,
      parse_mode: 'Markdown'
    });

    // Redirect to contact page with a success query
    res.redirect('/contact-us?success=1');
  } catch (error) {
    console.error('Contact form submission failed:', error.response?.data || error);
    res.status(500).send('Something went wrong.');
  }
};

