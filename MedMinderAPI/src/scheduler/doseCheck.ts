import cron from "node-cron";
import prisma from "../lib/prisma";
import { isSameMinute } from "date-fns";
import { sendPushNotification } from "../utils/sendPushNotifications";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const doses = await prisma.dose.findMany({
    where: {
      dispensed: false,
    },
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
      console.log(`Time do dispense: ${dose.medicine} at ${dose.time}`);

      await prisma.dose.update({
        where: { id: dose.id },
        data: { dispensed: true },
      });

      //send push notification to MedMinder app:
      //find dose user
      const user = await prisma.user.findFirst({
        where: { id: dose.userId },
      });
      //send notification
      if (user?.expoToken) {
        await sendPushNotification(
          user.expoToken,
          `💊 Time to dispense ${dose.medicine} at ${dose.time}`
        );
      }

      //TODO: SEND COMMAND TO ESP
    }
  }
});
