import express from "express";
import dotenv from "dotenv";
import doseRoutes from "./routes/doseRoutes";
import userRoutes from "./routes/userRoutes";
import "./scheduler/doseCheck";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/doses", doseRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
