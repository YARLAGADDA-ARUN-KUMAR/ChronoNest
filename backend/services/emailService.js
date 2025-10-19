const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendCapsuleNotification = async (recipientEmail, capsule) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `You've received a memory from ChronoNest!`,
    html: `
      <h2>${capsule.title}</h2>
      <p>${capsule.content.text || ""}</p>
      ${
        capsule.content.images.length
          ? `<strong>Images:</strong><br>${capsule.content.images
              .map(
                (img) =>
                  `<img src="${img}" alt="Capsule Image" width="200"/><br>`
              )
              .join("")}`
          : ""
      }
      ${
        capsule.content.videoUrls.length
          ? `<strong>Videos:</strong><br>${capsule.content.videoUrls
              .map((url) => `<a href="${url}">${url}</a><br>`)
              .join("")}`
          : ""
      }
      <p>Sent via ChronoNest ❤️</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
