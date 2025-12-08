// 1. Load environment variables from .env
require("dotenv").config({ path: ".env1" });

const express = require("express");
const admin = require("firebase-admin");
const Groq = require("groq-sdk");         // if you use Groq quiz endpoint
const fs = require("fs");
const cors = require("cors");
const serviceAccount = require("./serviceAccountKey.json");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// CORS – allow your Vite dev servers
// 6) CORS – allow your Vite dev servers
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser clients (curl, Postman, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://studyair-e4d78.web.app", // your deployed frontend
        "http://localhost:5173",          // Vite dev
        "http://localhost:5174",          // (optional) other dev ports
      ];

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false, // you’re not using cookies, so this can be false
  })
);

app.get("/api/check-env", (req, res) => {
  res.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    // DON'T send the real key back!
  });
});


// ----------------------
// Firebase initialization
// ----------------------
let firebaseInitialized = false;
let initializationError = null;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  firebaseInitialized = true;
  console.log("Firebase SDK Successful.");
} catch (error) {
  initializationError = error.message;
  console.error("Failed to initialize Firebase SDK.", error);
}

const db = firebaseInitialized ? admin.firestore() : null;

// ----------------------
// Test endpoint
// ----------------------
app.get("/api", (req, res) => {
  const firebaseStatus = firebaseInitialized
    ? "Connected"
    : `Connection Failed: ${initializationError}`;

  res.status(200).json({
    message: "Backend API is running!",
    serverTime: new Date().toISOString(),
    firebaseStatus,
  });
});

// Multer for file uploads (quiz notes, etc.)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ----------------------
// GROQ quiz generation
// ----------------------
// 10) Groq client – OPTION 2 (SAFE):
//     Only create client if GROQ_API_KEY is set.
//     Otherwise, /api/generate-quiz will return 503 instead of crashing.
const groqKey = process.env.GROQ_API_KEY;

// 2) Only create the client if the key exists
let groq = null;
if (groqKey) {
  groq = new Groq({ apiKey: groqKey });
  console.log("Groq client initialized ✅");
} else {
  console.warn(
    "⚠️ No GROQ_API_KEY found in .env1 – /api/generate-quiz will NOT work until you add it."
  );
}

app.post("/api/generate-quiz", upload.single("file"), async (req, res) => {
  try {
    // If groq isn't configured, return a clear error
    if (!groq) {
      return res.status(503).json({
        error:
          "Quiz generation is temporarily unavailable (missing GROQ_API_KEY on server).",
      });
    }
    const {
      name,
      className,
      topic,
      questions,
      questionType,
      difficulty,
      shuffle,
      timeLimit,
    } = req.body;

    let notes = "";
    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);
      notes = fs.readFileSync(filePath, "utf-8");
      fs.unlinkSync(filePath); // clean up
    }

    const prompt = `
You are an AI quiz generator for the StudyAir app.

Generate EXACTLY ${questions} questions based on the following settings:

Name: ${name}
Class: ${className}
Topic: ${topic || "General"}
Number of Questions: ${questions} (MUST BE EXACTLY THIS MANY)
Question Type: ${questionType}
Difficulty: ${difficulty}
Shuffle Questions: ${shuffle}
Time Limit: ${timeLimit} minutes

${
  notes
    ? `IMPORTANT: Generate questions ONLY from these notes:\n${notes}`
    : "Generate general knowledge questions."
}

Format each question as:

Q1. Question text here
A. option
B. option
C. option
D. option
Correct Answer: X

CRITICAL RULES:
- Generate EXACTLY ${questions} questions, no more, no less
- ${
   notes
     ? "Base ALL questions on the provided notes"
     : "Use general knowledge appropriate to the topic"
 }
- Include the correct answer for each question
- Number questions from 1 to ${questions}

Return ONLY the quiz questions, nothing else.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    res.json({ quiz: completion.choices[0].message.content });
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

// ----------------------
// Whisper transcription route
// ----------------------
const transcribeRouter = require("./routes/transcribe");
app.use("/api/transcribe", transcribeRouter);

// ----------------------
// Notes route (optional)
// ----------------------
try {
  const notesRouter = require("./routes/notes");
  app.use("/api/notes", notesRouter);
} catch (err) {
  console.warn(
    "routes/notes.js not found or failed to load. /api/notes will be unavailable.",
    err.message
  );
}

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
