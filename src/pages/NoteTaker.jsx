import React, { useState } from 'react';
import './NoteTaker.css';

function NoteTaker() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcribed, setTranscribed] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscribed(false);
  };

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
      <h2>Note Taker</h2>
      <p>Upload a lecture recording to generate notes.</p>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="file-input"
      />

      <button
        onClick={handleTranscribe}
        className="transcribe-btn"
        disabled={loading}
      >
        Transcribe
      </button>

      {transcribed && (
        <div className="transcribe-result">
          <p> Transcription complete! (just a placeholder)</p>
        </div>
      )}

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
