const cron = require("node-cron");
const Capsule = require("../models/Capsule");
const User = require("../models/User");
const emailService = require("./emailService");
const whatsappService = require("./whatsappService");

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
        const whatsappRecipients = capsule.recipients.filter((r) => r.whatsapp);

        if (emailRecipients.length > 0) {
          await Promise.all(
            emailRecipients.map(async (recipient) => {
              try {
                await emailService.sendCapsuleNotification(
                  recipient.email,
                  capsule
                );
                console.log(
                  `Email notification sent to ${recipient.email} for capsule ${capsule._id}`
                );
              } catch (err) {
                console.error(
                  `FAILED email notification to ${recipient.email}:`,
                  err.message
                );
              }
            })
          );
        }

        if (whatsappRecipients.length > 0) {
          await Promise.all(
            whatsappRecipients.map(async (recipient) => {
              try {
                const message = `🎁 You've received a memory capsule from ChronoNest!\n\nTitle: ${
                  capsule.title
                }\nDescription: ${
                  capsule.description || "No description"
                }\n\nThis capsule was created to be delivered to you on this special date. Cherish the memories! ❤️`;
                await whatsappService.sendWhatsAppMessage(
                  recipient.whatsapp,
                  message
                );
                console.log(
                  `WhatsApp notification sent to ${recipient.whatsapp} for capsule ${capsule._id}`
                );
              } catch (err) {
                console.error(
                  `FAILED WhatsApp notification to ${recipient.whatsapp}:`,
                  err.message
                );

                if (err.message.includes("Not authorized")) {
                  console.log(
                    `Sending sandbox invite to ${recipient.whatsapp}`
                  );
                  try {
                    await whatsappService.sendSandboxInvite(recipient.whatsapp);
                  } catch (inviteError) {
                    console.error(
                      `Failed to send sandbox invite:`,
                      inviteError.message
                    );
                  }
                }
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
                const whatsappRecipients = capsule.recipients.filter(
                  (r) => r.whatsapp
                );

                for (const recipient of emailRecipients) {
                  try {
                    await emailService.sendCapsuleNotification(
                      recipient.email,
                      capsule
                    );
                    console.log(
                      `Butterfly email notification sent to ${recipient.email} for capsule ${capsule._id}`
                    );
                  } catch (emailError) {
                    console.error(
                      `Failed to send butterfly email to ${recipient.email}:`,
                      emailError.message
                    );
                  }
                }

                for (const recipient of whatsappRecipients) {
                  try {
                    const message = `🦋 Butterfly Capsule Released!\n\nTitle: ${
                      capsule.title
                    }\nDescription: ${
                      capsule.description || "No description"
                    }\n\nThis capsule was released because the creator hasn't checked in recently. This ensures your memories are never lost. ❤️`;
                    await whatsappService.sendWhatsAppMessage(
                      recipient.whatsapp,
                      message
                    );
                    console.log(
                      `Butterfly WhatsApp notification sent to ${recipient.whatsapp} for capsule ${capsule._id}`
                    );
                  } catch (whatsappError) {
                    console.error(
                      `Failed to send butterfly WhatsApp to ${recipient.whatsapp}:`,
                      whatsappError.message
                    );

                    if (whatsappError.message.includes("Not authorized")) {
                      console.log(
                        `Sending sandbox invite to ${recipient.whatsapp}`
                      );
                      try {
                        await whatsappService.sendSandboxInvite(
                          recipient.whatsapp
                        );
                      } catch (inviteError) {
                        console.error(
                          `Failed to send sandbox invite:`,
                          inviteError.message
                        );
                      }
                    }
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

          if (
            user.preferredHeartbeatChannel === "whatsapp" &&
            user.heartbeatContact
          ) {
            try {
              const message = `⏰ ChronoNest Heartbeat Reminder\n\nHi ${user.name}, it's time to check in!\n\nYou've missed ${user.heartbeatMissedCount} check-in(s). Please log in to ChronoNest to keep your capsules safe.\n\nIf you miss 3 check-ins, your butterfly capsules will be released automatically.`;
              await whatsappService.sendWhatsAppMessage(
                user.heartbeatContact,
                message
              );
              console.log(
                `WhatsApp heartbeat reminder sent to ${user.heartbeatContact}`
              );
            } catch (whatsappError) {
              console.error(
                `Failed to send WhatsApp reminder to ${user.heartbeatContact}:`,
                whatsappError.message
              );

              if (whatsappError.message.includes("Not authorized")) {
                console.log(
                  `Sending sandbox invite to ${user.heartbeatContact}`
                );
                try {
                  await whatsappService.sendSandboxInvite(
                    user.heartbeatContact
                  );
                } catch (inviteError) {
                  console.error(
                    `Failed to send sandbox invite:`,
                    inviteError.message
                  );
                }
              }

              await emailService.sendHeartbeatReminder(user);
            }
          } else {
            await emailService.sendHeartbeatReminder(user);
          }

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
