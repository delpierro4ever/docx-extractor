import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import fs from "fs/promises";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/extract", upload.single("data"), async (req, res) => {
  // Changed 'file' to 'data'
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Received file:", req.file); // Log the uploaded file

    const buffer = await fs.readFile(req.file.path);
    const result = await mammoth.extractRawText({ buffer });

    await fs.unlink(req.file.path);
    res.json({ text: result.value });
  } catch (err) {
    console.error("SERVER ERROR:", err); // Detailed logging
    res.status(500).json({
      error: "Processing failed",
      details: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Docx Extractor is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
