import express from "express";
import {
  getAllUsers,
  getUser,
  userLogin,
  newUser,
  updateExpoToken,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/new", newUser);
router.get("/:id", getUser);
router.post("/login", userLogin);
router.post("/expo-token", updateExpoToken);

export default router;
