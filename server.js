import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

import { analyzeInterview } from "./analysis/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ensure uploads dir exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

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

    fs.unlinkSync(req.file.path);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
