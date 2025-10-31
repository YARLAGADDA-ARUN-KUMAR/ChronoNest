const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendCapsuleNotification = async (recipientEmail, capsule) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: `You've received a memory from ChronoNest!`,
      html: `
        <h2>${capsule.title}</h2>
        <p>${capsule.description || ""}</p>
        ${
          capsule.images && capsule.images.length
            ? `<strong>Images:</strong><br>${capsule.images
                .map(
                  (img) =>
                    `<img src="${img}" alt="Capsule Image" width="200" style="margin: 5px;"/><br>`
                )
                .join("")}`
            : ""
        }
        ${
          capsule.videos && capsule.videos.length
            ? `<strong>Videos:</strong><br>${capsule.videos
                .map((url) => `<a href="${url}">${url}</a><br>`)
                .join("")}`
            : ""
        }
        <p>Sent via ChronoNest ❤️</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Capsule notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Failed to send capsule notification:", error);
    throw error;
  }
};

exports.sendHeartbeatReminder = async (user) => {
  try {
    const checkInUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/dashboard`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "ChronoNest Heartbeat Check-in Reminder",
      html: `
        <h2>Hi ${user.name}, it's time to check in!</h2>
        <p>Please log in to ChronoNest and check in to let us know you're still with us.</p>
        <p>This is a crucial step to ensure your capsules are not released prematurely.</p>
        <p><strong>Missed check-ins:</strong> ${user.heartbeatMissedCount}</p>
        <p>If you miss 3 check-ins, your butterfly capsules will be released automatically.</p>
        <a href="${checkInUrl}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Check In Now</a>
        <p>Thank you for using ChronoNest.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Heartbeat reminder sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send heartbeat reminder:", error);
    throw error;
  }
};

exports.sendEngagementEmail = async (user) => {
  try {
    const engagementToken = jwt.sign(
      { userId: user._id, type: "engagement" },
      process.env.JWT_SECRET,
      { expiresIn: "35d" }
    );

    const clickUrl = `${
      process.env.BACKEND_URL || "http://localhost:3000"
    }/api/engagement/click?token=${engagementToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Are you still with us? A note from ChronoNest",
      html: `
        <h2>Hi ${user.name},</h2>
        <p>Just a friendly check-in from ChronoNest to see if you're still receiving our messages.</p>
        <p>We value having you as part of our community. Please click the link below to let us know you're still engaged. This is separate from your "heartbeat" check-in for capsule release.</p>
        <br>
        <a href="${clickUrl}" style="padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Yes, I'm still here!</a>
        <br>
        <p>If you don't click this link, we'll try again next month. If we don't hear from you for 3 consecutive months, we'll send you a final "Butterfly Mode" message.</p>
        <p>Thank you for using ChronoNest.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Engagement email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send engagement email:", error);
    throw error;
  }
};

exports.sendButterflyModeEmail = async (user) => {
  try {
    const loginUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/login`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "A farewell message from ChronoNest",
      html: `
        <h2>Hi ${user.name},</h2>
        <p>We've noticed you haven't engaged with our monthly check-in emails for the last 3 months.</p>
        <p>We understand that life gets busy, or perhaps your journey with us has come to an end. This is our "Butterfly Mode" message – a gentle way of saying goodbye for now.</p>
        <p>Your account and capsules are still safe, but we will stop sending you these monthly engagement emails. Your heartbeat check-ins (if configured) will still function as normal to protect your capsules.</p>
        <p>If you wish to re-engage, simply log in to your account.</p>
        <br>
        <a href="${loginUrl}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Log in to ChronoNest</a>
        <br>
        <p>We wish you all the best.</p>
        <p>The ChronoNest Team</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`"Butterfly Mode" (disengaged) email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send butterfly mode email:", error);
    throw error;
  }
};
