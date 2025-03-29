import express from "express";
import {
  addDose,
  deleteDose,
  dispenseDose,
  getAllDoses,
} from "../controllers/doseController";

const router = express.Router();

router.get("/", getAllDoses);
router.post("/add", addDose);
router.delete("/delete/:id", deleteDose);
router.put("/dispense/:id", dispenseDose);

export default router;
