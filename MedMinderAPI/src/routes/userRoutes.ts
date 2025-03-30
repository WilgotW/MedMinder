import express from "express";
import { getAllUsers, newUser } from "../controllers/userController";

const router = express.Router();

router.use("/", getAllUsers);
router.use("/new", newUser);

export default router;
