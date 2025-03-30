import express, { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllDoses = async (req: Request, res: Response) => {
  const doses = await prisma.dose.findMany();
  res.json(doses);
};

export const addDose = async (req: Request, res: Response) => {
  const { time, medicine, userId } = req.body;

  if (!time || !medicine) {
    res.status(400).json({ message: "Missing time or medicin" });
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
  }

  const dispenseDose = await prisma.dose.update({
    where: { id },
    data: { dispensed: true },
  });

  res.status(200).json(dispenseDose);
};
