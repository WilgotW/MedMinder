import cron from "node-cron";
import prisma from "../lib/prisma";
import { isSameMinute } from "date-fns";
import { sendPushNotification } from "../utils/sendPushNotifications";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const doses = await prisma.dose.findMany({
    where: { dispensed: false },
  });

  for (const dose of doses) {
    const [hours, minutes] = dose.time.split(":").map(Number);
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    if (isSameMinute(now, targetTime)) {
      console.log(`Time to dispense: ${dose.medicine} at ${dose.time}`);

      await prisma.dose.update({
        where: { id: dose.id },
        data: { dispensed: true },
      });

      const user = await prisma.user.findFirst({
        where: { id: dose.userId },
      });

      if (user?.expoToken) {
        try {
          await sendPushNotification(
            user.expoToken,
            `💊 Time to dispense ${dose.medicine} at ${dose.time}`
          );
          console.log(`Push notification sent to user ${dose.userId}`);
        } catch (error) {
          console.error("Error sending push notification:", error);
        }
      } else {
        console.warn(`No expo token found for user ${dose.userId}`);
      }

      // TODO: SEND COMMAND TO ESP
    }
  }
});
