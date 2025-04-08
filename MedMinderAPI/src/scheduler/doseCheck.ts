import cron from "node-cron";
import prisma from "../lib/prisma";
import { differenceInMinutes } from "date-fns";
import { sendPushNotification } from "../utils/sendPushNotifications";

cron.schedule("* * * * *", () => {
  console.log("Running task every minute at", new Date().toLocaleTimeString());
  doseCheck();
});

async function doseCheck() {
  const now = new Date();

  const doses = await prisma.dose.findMany({
    where: { dispensed: false },
  });

  for (const dose of doses) {
    //compare current time with dispense time
    if (!dose.time || !dose.time.includes(":")) continue;

    const [hours, minutes] = dose.time.split(":");
    if (
      now.getHours() >= parseInt(hours) &&
      now.getMinutes() >= parseInt(minutes)
    ) {
      console.log(`Time to dispense: ${dose.medicine}`);

      //update dose dispensed
      await prisma.dose.update({
        where: { id: dose.id },
        data: { dispensed: true },
      });
    }
  }
}

export async function runDoseCheck() {
  // const now = new Date();
  // const doses = await prisma.dose.findMany({
  //   where: {
  //     dispensed: false,
  //     // This condition does not filter anything if userId is always non-null:
  //     userId: { not: 0 },
  //   },
  // });
  // for (const dose of doses) {
  //   const [hours, minutes] = dose.time.split(":").map(Number);
  //   const targetTime = new Date(
  //     now.getFullYear(),
  //     now.getMonth(),
  //     now.getDate(),
  //     hours,
  //     minutes
  //   );
  //   const diff = Math.abs(differenceInMinutes(now, targetTime));
  //   if (diff <= 2) {
  //     console.log(`Time to dispense: ${dose.medicine} at ${dose.time}`);
  //     await prisma.dose.update({
  //       where: { id: dose.id },
  //       data: { dispensed: true },
  //     });
  //     if (!dose.userId) {
  //       console.warn(`Dose ${dose.id} is missing userId. Skipping.`);
  //       continue;
  //     }
  //     const user = await prisma.user.findUnique({
  //       where: { id: dose.userId },
  //     });
  //     console.log("Checking dose:", dose);
  //     if (user?.expoToken) {
  //       try {
  //         await sendPushNotification(
  //           user.expoToken,
  //           `💊 Time to dispense ${dose.medicine} at ${dose.time}`
  //         );
  //         console.log(`Push notification sent to user ${dose.userId}`);
  //       } catch (error) {
  //         console.error("Error sending push notification:", error);
  //       }
  //     } else {
  //       console.warn(`No expo token found for user ${dose.userId}`);
  //     }
  //     // TODO: SEND COMMAND TO ESP
  //   }
  // }
}
