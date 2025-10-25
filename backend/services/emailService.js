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
                  `<img src="${img}" alt="Capsule Image" width="200"/><br>`
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
};
