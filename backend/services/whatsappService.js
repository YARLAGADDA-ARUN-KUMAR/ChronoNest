const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendWhatsAppMessage = async (to, body) => {
  try {
    await client.messages.create({
      body: body,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${to}`,
    });
    console.log(`WhatsApp message sent to ${to}`);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};
