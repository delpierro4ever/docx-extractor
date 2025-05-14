import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs/promises';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/extract', upload.single('data'), async (req, res) => {
  try {
    const buffer = await fs.readFile(req.file.path);
    const result = await mammoth.extractRawText({ buffer });
    await fs.unlink(req.file.path); // cleanup
    res.json({ text: result.value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Extraction failed.' });
  }
});

app.get('/', (req, res) => {
  res.send('Docx Extractor is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
