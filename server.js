import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

import { analyzeInterview } from "./analysis/index.js";

const app = express();

// 🔹 REQUIRED for Render / Vercel
const PORT = process.env.PORT || 5000;

app.use(cors());

// 🔹 Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔹 Multer config
const upload = multer({ dest: uploadDir });

app.post("/analyze", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file missing" });
    }

    const duration = Number(req.body.duration);
    if (!duration) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Duration missing" });
    }

    const result = await analyzeInterview(req.file.path, duration);

    // cleanup
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (err) {
    console.error(err);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 This is REQUIRED and CORRECT
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
