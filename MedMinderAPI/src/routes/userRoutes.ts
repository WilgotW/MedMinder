import express from "express";
import {
  getAllUsers,
  getUser,
  userLogin,
  newUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/new", newUser);
router.get("/:id", getUser);
router.post("/login", userLogin);

export default router;
