import express from "express";
import { getAllDoses } from "../controllers/doseController";

const router = express.Router();

router.get("/", getAllDoses);
router.post("/add", addDose);
router.delete("/delete/:id", deleteDose);
router.post("/dispense/:id", despenseDose);

export default router;
