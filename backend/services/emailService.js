const nodemailer = require("nodemailer");

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
    const checkInUrl = `${process.env.FRONTEND_URL}/heartbeat-checkin`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "ChronoNest Heartbeat Check-in Reminder",
      html: `
        <h2>Hi ${user.name}, it's time to check in!</h2>
        <p>Please log in to ChronoNest and check in to let us know you're still with us.</p>
        <p>This is a crucial step to ensure your capsules are not released prematurely.</p>
        <p><strong>Missed check-ins:</strong> ${
          user.heartbeatMissedCount + 1
        }</p>
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
