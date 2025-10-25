const cron = require("node-cron");
const Capsule = require("../models/Capsule");
const User = require("../models/User");
const emailService = require("./emailService");

cron.schedule("0 0 * * *", async () => {
  console.log("CRON: Checking for capsules to be released...");
  try {
    const now = new Date();
    const capsulesToRelease = await Capsule.find({
      isReleased: false,
      triggerType: "date",
      triggerDate: { $lte: now },
    });

    if (!capsulesToRelease.length) {
      return console.log("CRON: No eligible capsules for release.");
    }

    console.log(
      `CRON: Found ${capsulesToRelease.length} capsule(s) for release.`
    );

    for (const capsule of capsulesToRelease) {
      try {
        capsule.isReleased = true;
        capsule.releaseDate = now;
        await capsule.save();

        const emailRecipients = capsule.recipients.filter((r) => r.email);
        if (emailRecipients.length > 0) {
          await Promise.all(
            emailRecipients.map(async (recipient) => {
              try {
                await emailService.sendCapsuleNotification(
                  recipient.email,
                  capsule
                );
                console.log(
                  `Notification sent to ${recipient.email} for capsule ${capsule._id}`
                );
              } catch (err) {
                console.error(
                  `FAILED notification to ${recipient.email}:`,
                  err.message
                );
              }
            })
          );
        }
      } catch (capsuleError) {
        console.error(
          `Error processing capsule ${capsule._id}:`,
          capsuleError.message
        );
      }
    }

    console.log("CRON: Done processing all due capsules.");
  } catch (err) {
    console.error("CRON: Release error occurred:", err.message);
  }
});

cron.schedule("0 1 * * *", async () => {
  console.log("CRON: Checking for user heartbeats...");
  try {
    const now = new Date();
    const overdueUsers = await User.find({
      nextHeartbeat: { $lte: now },
      isActive: true,
    });

    if (!overdueUsers.length) {
      return console.log("CRON: No overdue users found.");
    }

    console.log(`CRON: Found ${overdueUsers.length} overdue user(s).`);

    for (const user of overdueUsers) {
      try {
        user.heartbeatMissedCount += 1;
        const missedThreshold = 3;

        if (user.heartbeatMissedCount >= missedThreshold) {
          console.log(
            `CRON: User ${user._id} missed ${user.heartbeatMissedCount} heartbeats. Releasing butterfly capsules.`
          );

          const capsulesToRelease = await Capsule.find({
            createdBy: user._id,
            triggerType: "butterfly",
            isReleased: false,
          });

          if (capsulesToRelease.length > 0) {
            for (const capsule of capsulesToRelease) {
              try {
                capsule.isReleased = true;
                capsule.releaseDate = now;
                await capsule.save();

                const emailRecipients = capsule.recipients.filter(
                  (r) => r.email
                );
                for (const recipient of emailRecipients) {
                  try {
                    await emailService.sendCapsuleNotification(
                      recipient.email,
                      capsule
                    );
                    console.log(
                      `Butterfly notification sent to ${recipient.email} for capsule ${capsule._id}`
                    );
                  } catch (emailError) {
                    console.error(
                      `Failed to send butterfly notification to ${recipient.email}:`,
                      emailError.message
                    );
                  }
                }
              } catch (capsuleError) {
                console.error(
                  `Error releasing butterfly capsule ${capsule._id}:`,
                  capsuleError.message
                );
              }
            }
          }
          user.isActive = false;
        } else {
          console.log(
            `CRON: Sending heartbeat reminder to user ${user._id}. Missed count: ${user.heartbeatMissedCount}`
          );
          await emailService.sendHeartbeatReminder(user);

          const nextHeartbeat = new Date();
          nextHeartbeat.setDate(now.getDate() + user.heartbeatIntervalDays);
          user.nextHeartbeat = nextHeartbeat;
        }

        await user.save();
      } catch (userError) {
        console.error(`Error processing user ${user._id}:`, userError.message);
      }
    }

    console.log("CRON: Done processing all overdue users.");
  } catch (err) {
    console.error("CRON: Heartbeat check error occurred:", err.message);
  }
});
