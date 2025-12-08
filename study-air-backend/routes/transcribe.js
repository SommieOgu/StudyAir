// study-air-backend/routes/transcribe.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { OpenAI }= require('openai');
const { toFile } = require('openai/uploads');


// In-memory storage so we get the file as a Buffer
const upload = multer({
  storage: multer.memoryStorage(),
});

// Check API key exists at startup
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    " OPENAI_API_KEY is not set. /api/transcribe will fail until you add it to .env1"
  );
}

// Create OpenAI client using your API key from .env
// .env (in study-air-backend) should contain: OPENAI_API_KEY=sk-...
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/transcribe
// Expect: multipart/form-data with a single field "audio"
router.post('/', upload.single('audio'), async (req, res) => {
    console.log('POST /api/transcribe hit');
  
    if (!req.file) {
      console.log('No file on request');
      return res
        .status(400)
        .json({ error: 'No audio file uploaded. Expected field "audio".' });
    }

    console.log('Transcribe route received file:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    try {
    // Build a File object from the in-memory Buffer
    // (OpenAI Node SDK uses a helper internally; this is the equivalent pattern.)
    const audioFile = await toFile(
        req.file.buffer, // The raw Node.js Buffer from Multer's memory storage
        req.file.originalname || 'audio.webm', // The filename for the multipart request
        {
            contentType: req.file.mimetype, // The MIME type
        }
      );

    // Call Whisper transcription API
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1', // Whisper model name
      language: 'en',    // force English
    });

    console.log('Transcription.text:', transcription.text);

    return res.status(200).json({
      success: true,
      text: transcription.text,
    });
  } catch (err) {
    console.error('Error in /api/transcribe:', err);
    return res.status(500).json({
      error: 'Transcription failed',
      details: err.message || String(err),
    });
  }
});

module.exports = router;
