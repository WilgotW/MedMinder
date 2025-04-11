import cron from "node-cron";
import prisma from "../lib/prisma";
// import { sendPushNotification } from "../utils/sendPushNotifications";

// cron.schedule(
//   "* * * * *",
//   () => {
//     doseCheck();
//   },
//   { timezone: "Europe/Stockholm" }
// );

async function doseCheck() {
  const now = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Stockholm",
  }).format(new Date());

  console.log("Running task every minute at", now);

  const [nowHours, nowMinutes] = now.split(":").map(Number);

  const doses = await prisma.dose.findMany({
    where: { dispensed: false },
  });

  for (const dose of doses) {
    if (!dose.time || !dose.time.includes(":")) continue;

    const [doseHours, doseMinutes] = dose.time.split(":").map(Number);

    if (
      nowHours > doseHours ||
      (nowHours === doseHours && nowMinutes >= doseMinutes)
    ) {
      console.log(`Time to dispense: ${dose.medicine}`);

      await prisma.dose.update({
        where: { id: dose.id },
        data: { dispensed: true },
      });

      // const user = await prisma.user.findUnique({
      //   where: {
      //     id: dose.userId,
      //   },
      // });

      // if (!user?.expoToken) {
      //   console.warn("No Expo push token found for user.");
      //   continue;
      // }

      // await sendPushNotification({
      //   to: user.expoToken,
      //   title: "Time to take your medicine",
      //   body: `Please take your ${dose.medicine} dose now.`,
      //   data: { doseId: dose.id },
      // });
    }
  }
}
