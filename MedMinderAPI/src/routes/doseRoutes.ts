import express from "express";
import {
  addDose,
  deleteDose,
  dispenseDose,
  getAllDoses,
  getUserDoses,
} from "../controllers/doseController";

const router = express.Router();

router.get("/", getAllDoses);
router.get("/:id", getUserDoses);
router.post("/add", addDose);
router.delete("/delete/:id", deleteDose);
router.put("/dispense/:id", dispenseDose);
// router.get("/check", triggerDoseCheck);

export default router;
