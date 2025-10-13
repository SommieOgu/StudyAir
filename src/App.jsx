import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import NoteTaker from "./pages/NoteTaker";
import QuizGenerator from "./pages/QuizGenerator";
import ExamPrep from "./pages/ExamPrep";
import StudyRoom from "./pages/StudyRoom";

function App() {
  return (
    <div>
      <header className="top-header">
        <h1>StudyAir</h1>
        <nav className="nav-buttons">
          <Link to="/">Home</Link>  
          <Link to="/note-taker">Note Taker</Link>
          <Link to="/quiz-generator">Quiz Generator</Link>
          <Link to="/exam-prep">Exam Prep</Link>
          <Link to="/study-room">Study Room</Link>
        </nav>
      </header>

      <main>
        <Routes>
          {/* Main page with the four agent boxes */}
          <Route path="/" element={
            <div>
              <p>Welcome to StudyAir! Start exploring your AI agents.</p>
              <div className="agent-row">
                <Link className="agent-card" to="/note-taker">Note Taker</Link>
                <Link className="agent-card" to="/quiz-generator">Quiz Generator</Link>
                <Link className="agent-card" to="/exam-prep">Exam Prep</Link>
                <Link className="agent-card" to="/study-room">Study Room</Link>
              </div>
            </div>
          } />

          {/* Other pages */}
          <Route path="/note-taker" element={<NoteTaker />} />
          <Route path="/quiz-generator" element={<QuizGenerator />} />
          <Route path="/exam-prep" element={<ExamPrep />} />
          <Route path="/study-room" element={<StudyRoom />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
