import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import { extractTransactionsFromText } from "../../services/pdfExtractor.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // ✅ CommonJS import inside ESM

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer); // ✅ works now

    const extractionResult = await extractTransactionsFromText(pdfData.text);
    fs.unlinkSync(req.file.path);

    if (!extractionResult.success) {
      return res.status(500).json({ error: extractionResult.error });
    }

    res.json({
      message: "Transactions extracted and saved successfully",
      count: extractionResult.count,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Error processing file" });
  }
});

export default router;
