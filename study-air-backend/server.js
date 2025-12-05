import dotenv from "dotenv";
dotenv.config();
import express from "express";
import admin from "firebase-admin";
import Groq from "groq-sdk";
import fs from "fs";
import cors from "cors";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

//-----------------------------------------------------
// Firebase Initialization
//-----------------------------------------------------
let firebaseInitialized = false;
let initializationError = null;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  firebaseInitialized = true;
  console.log("✅ Firebase SDK Successful.");
} catch (error) {
  initializationError = error.message;
  console.error("❌ Failed to initialize Firebase SDK.", error);
}

const db = firebaseInitialized ? admin.firestore() : null;

//-----------------------------------------------------
// Test Endpoint
//-----------------------------------------------------
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

//-----------------------------------------------------
// GROQ QUIZ GENERATION
//-----------------------------------------------------
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/generate-quiz", upload.single("file"), async (req, res) => {
  try {
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

    // ⭐ READ THE UPLOADED FILE
    let notes = "";
    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);
      notes = fs.readFileSync(filePath, "utf-8");
      
      // ⭐ DELETE FILE AFTER READING
      fs.unlinkSync(filePath);
    }

    // ⭐ IMPROVED PROMPT
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

${notes ? `IMPORTANT: Generate questions ONLY from these notes:\n${notes}` : "Generate general knowledge questions."}

Format each question as:

Q1. Question text here
A. option
B. option
C. option
D. option
Correct Answer: X

CRITICAL RULES:
- Generate EXACTLY ${questions} questions, no more, no less
- ${notes ? "Base ALL questions on the provided notes" : ""}
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
    console.error("❌ Quiz generation error:", err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

//-----------------------------------------------------
// Start Server (must be last)
//-----------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});