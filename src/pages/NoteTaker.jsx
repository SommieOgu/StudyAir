// src/pages/NoteTaker.jsx
import React, { useState, useRef } from "react";
import "./NoteTaker.css";
import { firestore } from "../firebaseClient"; // use your frontend Firebase

// 🌐 Backend base URL:
// - In production: set VITE_API_BASE_URL (e.g. https://studyair-backend.onrender.com)
// - In local dev: falls back to http://localhost:3000
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function NoteTaker() {
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcribed, setTranscribed] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");

  const recordingStartRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Handle file upload
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    console.log("[NoteTaker] File selected:", f.name, f.size, "bytes");

    setFile(f);
    setTranscribed(false);
    setTranscriptionText("");
  };

  // Start mic recording
  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("MediaRecorder not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);

      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      recordingStartRef.current = performance.now();

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mr.onstop = async () => {
        try {
          const rawBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const endTime = performance.now();
          const durationMs = endTime - recordingStartRef.current;

          console.log(
            "[NoteTaker] Raw recording blob:",
            rawBlob.size,
            "bytes, duration ~",
            Math.round(durationMs),
            "ms"
          );

          // Use raw blob as File; Whisper can handle it
          const recordedFile = new File([rawBlob], "recording.webm", {
            type: "audio/webm",
          });

          console.log(
            "[NoteTaker] Final recording file:",
            recordedFile.name,
            recordedFile.size,
            "bytes"
          );

          setFile(recordedFile);
          setTranscribed(false);
          setTranscriptionText("");
        } catch (err) {
          console.error("[NoteTaker] Error preparing recorded audio:", err);
        }
      };

      mr.start();
      setRecording(true);
      console.log("[NoteTaker] Recording started...");
    } catch (err) {
      console.error("[NoteTaker] Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((t) => t.stop());
      setRecording(false);
      console.log("[NoteTaker] Recording stopped.");
    }
  };

  // Transcribe using backend -> OpenAI Whisper
  const handleTranscribe = async () => {
    if (!file) return;

    setLoading(true);
    setTranscribed(false);
    setTranscriptionText("");

    console.log(
      "[NoteTaker] Starting transcription for:",
      file.name,
      file.size,
      "bytes"
    );

    try {
      const formData = new FormData();
      formData.append("audio", file); // Multer expects field name "audio"

      console.log(
        `[NoteTaker] Sending POST to ${API_BASE}/api/transcribe...`
      );

      const response = await fetch(`${API_BASE}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(
          "[NoteTaker] Backend /api/transcribe error:",
          response.status,
          errText
        );
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log("[NoteTaker] Backend /api/transcribe response:", data);

      const text =
        data.text ||
        data.transcription ||
        data.transcript ||
        "";

      setTranscriptionText(text || "");
      setTranscribed(true);

      // Save to Firestore from the FRONTEND
      if (text && text.trim().length > 0) {
        try {
          await firestore.collection("notes").add({
            text: text.trim(),
            filename: file.name || null,
            createdAt: new Date().toISOString(),
          });
          console.log("[NoteTaker] Saved note to Firestore (frontend).");
        } catch (saveErr) {
          console.error(
            "[NoteTaker] Failed to save to Firestore:",
            saveErr
          );
        }
      }
    } catch (err) {
      console.error("[NoteTaker] Transcription error:", err);
      alert("Transcription failed: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-taker-page">
      <div className="note-taker-box">
        <h2>Note Taker</h2>
        <p>Upload a lecture recording or record live to generate notes.</p>

        {/* File upload */}
        <div className="file-upload">
          <input
            name="choose"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Recording controls */}
        <div className="record-controls">
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
        </div>

        {/* Transcribe button */}
        <button
          onClick={handleTranscribe}
          className="transcribe-btn"
          disabled={loading || !file}
        >
          {loading ? "Transcribing…" : "Transcribe"}
        </button>

        {/* Audio preview */}
        {file && (
          <div className="audio-preview">
            <p>Preview your audio:</p>
            <audio controls src={URL.createObjectURL(file)} />
          </div>
        )}

        {/* Transcription result */}
        <div className="transcribe-result">
          <h3>Transcription</h3>
          {transcribed ? (
            <p>{transcriptionText || "No text returned by Whisper."}</p>
          ) : (
            <p>Hit “Transcribe” to generate notes.</p>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loader" />
          <p>Transcribing...</p>
        </div>
      )}
    </div>
  );
}

export default NoteTaker;
