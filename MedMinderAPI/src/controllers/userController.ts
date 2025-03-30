import express, { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
};

export const newUser = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  if (!name || password) {
    res.status(400).json({ message: "Missing name or password" });
  }

  try {
    const newUser = prisma.user.create({
      data: {
        name,
        password,
      },
    });
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).send({ message: "Server error: ", err });
  }
};
