import cron from "node-cron";
import prisma from "../lib/prisma";
import { isSameMinute } from "date-fns";

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

      //TODO: SEND TO ESP
      //TODO: SEND TO APP
    }
  }
});
