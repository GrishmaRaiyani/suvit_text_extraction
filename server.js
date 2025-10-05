import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./api/routes/uploadRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

//  Serve the upload form at GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//  Register the upload route
app.use("/", uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));