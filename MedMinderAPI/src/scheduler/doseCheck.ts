import cron from "node-cron";
import prisma from "../lib/prisma";
import { differenceInMinutes } from "date-fns";
import { sendPushNotification } from "../utils/sendPushNotifications";

export async function runDoseCheck() {
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

    const diff = Math.abs(differenceInMinutes(now, targetTime));
    if (diff <= 2) {
      console.log(`Time to dispense: ${dose.medicine} at ${dose.time}`);

      await prisma.dose.update({
        where: { id: dose.id },
        data: { dispensed: true },
      });

      if (!dose.userId) {
        console.warn(`Dose ${dose.id} is missing userId. Skipping.`);
        continue;
      }

      const user = await prisma.user.findUnique({
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
}
