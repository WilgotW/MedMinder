import express from "express";
import { getAllUsers, getUser, newUser } from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/new", newUser);
router.get("/:id", getUser);

export default router;
