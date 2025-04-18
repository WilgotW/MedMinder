import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
};

export const newUser = async (req: Request, res: Response): Promise<void> => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "Missing name or password" });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { name },
    });

    if (existing) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }

    //password is not hashed because only the developers will use this program

    const newUser = await prisma.user.create({
      data: { name, password, expoToken: null },
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateExpoToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { expoToken, userId } = req.body;

  if (!expoToken || !userId) {
    res.status(400).json({ message: "Missing expoToken or userId" });
    return;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { expoToken },
    });

    res.status(200).json({ message: "Expo token updated successfully" });
  } catch (err) {
    console.error("Failed to update expoToken:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "Name or password missing" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user || user.password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);

  if (!userId) {
    res.status(400).json({ message: "Missing user id" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  res.status(200).json(user);
};
