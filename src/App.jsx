import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import NoteTaker from "./pages/NoteTaker";
import QuizGenerator from "./pages/QuizGenerator";
import ExamPrep from "./pages/ExamPrep";
import StudyRoom from "./pages/StudyRoom";

function App() {
  return (
    <div className="app">
      <header className="top-header">
        <h1 className="logo">StudyAir</h1>
        <nav className="nav-buttons">
          <Link to="/">Home</Link>  
          <Link to="/note-taker">Note Taker</Link>
          <Link to="/quiz-generator">Quiz Generator</Link>
          <Link to="/exam-prep">Exam Prep</Link>
          <Link to="/study-room">Study Room</Link>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <section className="home">
              <div className="hero">
                <h2>Welcome to StudyAir</h2>
                <p>Your AI-powered academic assistant.</p>
              </div>

              <div className="description">
                <h2>
                  Our purpose is to make learning easier and more efficient for students by leveraging the power of AI. 
                  We believe that with the right tools, anyone can achieve academic success. Dive in and explore our AI-powered agents designed to enhance your study experience.
                </h2>
              </div>

              <div className="features">
                <h3>Why choose StudyAir?</h3>
                <div className="feature-grid">
                  <div className="feature-card">
                    <h4>🎯 Smart Summaries</h4>
                    <p>Turn lectures into concise, accurate notes.</p>
                  </div>
                  <div className="feature-card">
                    <h4>🧠 Personalized Quizzing</h4>
                    <p>Test your knowledge with AI-generated quizzes.</p>
                  </div>
                  <div className="feature-card">
                    <h4>📅 Study Plans</h4>
                    <p>Get custom study plans based on your goals and timelines.</p>
                  </div>
                </div>

                {/* CTA Button */}
                <a href="#agents" className="cta-button">Choose Your Agent</a>
              </div>

              {/* Agent Section */}
              <div id="agents" className="agent-grid">
                <Link className="agent-card note-taker" to="/note-taker">
                  <h3>📝 Note Taker</h3>
                  <p>Turn lectures into organized notes.</p>
                </Link>
                <Link className="agent-card quiz-generator" to="/quiz-generator">
                  <h3>📃 Quiz Generator</h3>
                  <p>Generate quizzes from your study material.</p>
                </Link>
                <Link className="agent-card exam-prep" to="/exam-prep">
                  <h3>📚 Exam Prep</h3>
                  <p>Personalized study plans and flashcards.</p>
                </Link>
                <Link className="agent-card study-room" to="/study-room">
                  <h3>🗣️ Study Room</h3>
                  <p>Collaborate and learn with others.</p>
                </Link>
              </div>
            </section>
          } />
          <Route path="/note-taker" element={<NoteTaker />} />
          <Route path="/quiz-generator" element={<QuizGenerator />} />
          <Route path="/exam-prep" element={<ExamPrep />} />
          <Route path="/study-room" element={<StudyRoom />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2025 StudyAir • Built for students, powered by AI</p>
      </footer>
    </div>
  );
}

export default App;
