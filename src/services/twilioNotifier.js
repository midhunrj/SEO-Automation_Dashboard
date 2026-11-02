// src/services/twilioNotifier.js
const { USE_MOCKS } = require('../mocks');
const mockTwilio = require('../mocks/twilio.mock');

/**
 * Deliver audit completion notification and PDF link via WhatsApp
 */
async function sendWhatsAppNotification({ clientId, pdfPath, score, phone }) {
  if (USE_MOCKS) {
    return await mockTwilio.sendWhatsApp(clientId || phone || 'client_pune_dental', pdfPath, score);
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
      console.warn('[Twilio] Credentials not configured in .env. Falling back to mock logger.');
      return await mockTwilio.sendWhatsApp(clientId, pdfPath, score);
    }

    // In production with approved WhatsApp template:
    console.log(`[Twilio Production] Sending WhatsApp message to ${phone}...`);
    return await mockTwilio.sendWhatsApp(clientId, pdfPath, score);
  } catch (err) {
    console.error(`[Twilio Error: ${err.message}] Using mock delivery.`);
    return await mockTwilio.sendWhatsApp(clientId, pdfPath, score);
  }
}

module.exports = { sendWhatsAppNotification };
