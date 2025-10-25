const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendWhatsAppMessage = async (to, body) => {
  try {
    if (!to || !body) {
      throw new Error("Recipient number and message body are required");
    }

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error("Twilio credentials are not configured");
    }

    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    const formattedFrom = twilioPhoneNumber.startsWith("whatsapp:")
      ? twilioPhoneNumber
      : `whatsapp:${twilioPhoneNumber}`;

    const message = await client.messages.create({
      body: body,
      from: formattedFrom,
      to: formattedTo,
    });

    console.log(`WhatsApp message sent to ${to}, SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);

    if (error.code === 21211) {
      throw new Error(
        "Invalid WhatsApp number format. Use format: +1234567890"
      );
    }
    if (error.code === 21608) {
      throw new Error(
        "Not authorized to send to this number. User must join WhatsApp sandbox first."
      );
    }

    throw error;
  }
};

exports.sendSandboxInvite = async (userPhoneNumber) => {
  try {
    const sandboxCode = "your-sandbox-code"; // You'll get this from Twilio
    const message = `To receive ChronoNest WhatsApp notifications, please send "join ${sandboxCode}" to ${twilioPhoneNumber}`;

    return await this.sendWhatsAppMessage(userPhoneNumber, message);
  } catch (error) {
    console.error("Error sending sandbox invite:", error);
    throw error;
  }
};
