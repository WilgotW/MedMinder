import express, { Request, Response } from "express";
import prisma from "../lib/prisma";
import { runDoseCheck } from "../scheduler/doseCheck";

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

export async function triggerDoseCheck(req: Request, res: Response) {
  try {
    await runDoseCheck();
    res.status(200).json({ message: "Dose check completed" });
  } catch (error) {
    console.error("Error running dose check:", error);
    res.status(500).json({ error: "Failed to check doses" });
  }
}
