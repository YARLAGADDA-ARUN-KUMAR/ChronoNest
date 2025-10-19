const cron = require("node-cron");
const Capsule = require("../models/Capsule");
const emailService = require("./emailService");

cron.schedule("0 0 * * *", async () => {
  console.log("CRON JOB: Checking for capsules to be released...");

  try {
    const now = new Date();
    const capsulesToRelease = await Capsule.find({
      isReleased: false,
      triggerDate: { $lte: now },
    });

    if (!capsulesToRelease.length) {
      return console.log("CRON JOB: No capsules are due for release today.");
    }

    console.log(
      `CRON JOB: Found ${capsulesToRelease.length} capsule(s) to release.`
    );

    await Promise.all(
      capsulesToRelease.map(async (capsule) => {
        capsule.isReleased = true;
        capsule.releaseDate = now;
        await capsule.save();

        const emailRecipients = capsule.recipients.filter((r) => r.email);

        const emailPromises = emailRecipients.map((recipient) =>
          emailService
            .sendCapsuleNotification(recipient.email, capsule)
            .then(() =>
              console.log(
                `   -> Notification sent successfully to ${recipient.email} for capsule ${capsule._id}`
              )
            )
            .catch((err) =>
              console.error(
                `   -> FAILED to send notification to ${recipient.email}:`,
                err.message
              )
            )
        );

        await Promise.all(emailPromises);
      })
    );

    console.log("CRON JOB: All due capsules have been processed successfully.");
  } catch (err) {
    console.error("CRON JOB: A critical error occurred:", err.message);
  }
});
