import express, { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllDoses = async (req: Request, res: Response) => {
  const doses = await prisma.dose.findMany();
  res.json(doses);
};

export const getUserDoses = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  const doses = await prisma.dose.findMany({
    where: { userId },
  });
  res.status(201).json(doses);
};

export const addDose = async (req: Request, res: Response) => {
  const { time, medicine, userId } = req.body;

  if (!time || !medicine) {
    res.status(400).json({ message: "Missing time or medicin" });
    return;
  }

  const newDose = await prisma.dose.create({
    data: {
      userId,
      time,
      medicine,
      dispensed: false,
      espDispensed: false,
    },
  });

  res.status(201).json(newDose);
};

export const deleteDose = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.status(400).json({ message: "missing dose id" });
    return;
  }
  try {
    const deletedDose = await prisma.dose.delete({
      where: {
        id,
      },
    });
    res.status(200).json(deletedDose);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const dispenseDose = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.status(400).json({ message: "missing id" });
    return;
  }

  const dispenseDose = await prisma.dose.update({
    where: { id },
    data: { dispensed: true },
  });

  res.status(200).json(dispenseDose);
};

export const getNextDose = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (!userId) {
    res.status(400).json({ message: "missing user id" });
    return;
  }

  const userDoses = await prisma.dose.findMany({
    where: { userId },
  });

  if (!userDoses.length) {
    res.status(404).json({ message: "No doses found for this user" });
    return;
  }

  //find latest dose
  const localTime = new Date().toLocaleTimeString("sv-SE", {
    timeZone: "Europe/Stockholm",
    hour: "2-digit",
    minute: "2-digit",
  });
  const [hours, minutes] = localTime.split(":");

  const doseDiffs = userDoses
    .map((dose) => {
      const [doseHours, doseMinutes] = dose.time.split(":");

      const hourDiff = parseInt(doseHours) - parseInt(hours);
      const minuteDiff = parseInt(doseMinutes) - parseInt(minutes);

      const diff = hourDiff + minuteDiff / 60;

      if (dose.espDispensed == false && dose.dispensed == true) {
        return [diff, dose.id];
      }
    })
    .filter((d): d is [number, number] => d !== undefined);

  doseDiffs.sort((a, b) => a[0] - b[0]);

  if (!doseDiffs.length || !doseDiffs[0]) {
    res.status(400).json({ message: "no dose to dispense" });
    return;
  }
  const nextDose = userDoses.find((dose) => dose.id == doseDiffs[0][1]);

  if (!nextDose) {
    res.status(500).json({ message: "server error" });
    return;
  }

  await prisma.dose.update({
    where: { id: doseDiffs[0][1] },
    data: { espDispensed: true },
  });
  res.status(200).json(nextDose);
};
