import React, { useState, useRef } from 'react';
import './NoteTaker.css';
// used chat to help create the note taker page
// asked chat to help use media recorder api for live recording
// asked chat to help create loading overlay during transcription
// needs backend integration for actual transcription
function NoteTaker() {
  const [file, setFile] = useState(null);          // Uploaded or recorded file
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcribed, setTranscribed] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscribed(false);
  };

  // Start live recording
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('MediaRecorder not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setFile(new File([audioBlob], 'recording.webm'));
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Simulate transcription
  const handleTranscribe = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTranscribed(true);
    }, 2000);
  };

  return (
    <div className="note-taker-page">
      <div className="note-taker-box">
        <h2>Note Taker</h2>
        <p>Upload a lecture recording or record live to generate notes.</p>

        {/* File Upload */}
        <div className="file-upload">
          <input type="file" accept="audio/*" onChange={handleFileChange} />
        </div>

        {/* Live Recording Controls */}
        <div className="record-controls">
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
        </div>

        {/* Transcribe Button */}
        <button
          onClick={handleTranscribe}
          className="transcribe-btn"
          disabled={loading || !file}
        >
          Transcribe
        </button>

        {/* Audio Preview */}
        {file && (
          <div className="audio-preview">
            <p>Preview your audio:</p>
            <audio controls src={URL.createObjectURL(file)} />
          </div>
        )}

        {/* Transcription Result */}
        {transcribed && (
          <div className="transcribe-result">
            <p>Transcription complete! (placeholder text)</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
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
