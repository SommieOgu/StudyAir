import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import './App.css';
import NoteTaker from "./pages/NoteTaker";
import QuizGenerator from "./pages/QuizGenerator";
import ExamPrep from "./pages/ExamPrep";
import StudyRoom from "./pages/StudyRoom";

function AgentDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const agents = [
    { name: "Note Taker", path: "/note-taker" },
    { name: "Quiz Generator", path: "/quiz-generator" },
    { name: "Exam Prep", path: "/exam-prep" },
    { name: "Study Room", path: "/study-room" },
  ];

  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="agent-dropdown">
      <button className="agent-dropdown-btn" onClick={() => setOpen(!open)}>
        AI Agents
        <span className="arrow" />
      </button>
      {open && (
        <ul className="agent-dropdown-menu">
          {agents.map((agent) => (
            <li
              key={agent.path}
              className="agent-dropdown-item"
              onClick={() => handleSelect(agent.path)}
            >
              {agent.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header className="top-header">
        <h1 className="logo">StudyAir</h1>
        <nav className="nav-buttons">
          <Link to="/">Home</Link>  
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>
          <AgentDropdown />
        </nav>

        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <section className="home">
              <div className="hero">
               <div class="hero-content">
                    <h2> Welcome to StudyAir</h2>
                    <p> Your AI-powered academic assistant</p>
               </div>
                <div className="message msg1"> Ready to be a pro?</div> 
                <div className="message msg2"> Generating your quiz...</div>
                <div className="message msg3"> Review every day!</div>
                <div className="message msg4"> Study with friends!</div>
                <div className="message msg5"> Yay I passed my exam!</div>
                <div className="message msg6"> AI-powered study tools!</div>
                <div className="message msg7"> Time to focus</div>
                <div className="message msg8"> You got this!</div>

              </div>

              <div className="description">
                <h2>
                  Our purpose: Making learning smarter, faster, and easier with AI-powered tools
                </h2>
              </div>

              <div className="mission">
                <h2>Mission: We provide AI study assistants that help students practice, organize, and master their coursework effortlessly</h2>
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
                    <h4>📅 Plan Study Sessions</h4>
                    <p> Study with peers to enhance retention.</p>
                  </div>
                </div>

                <a href="#agents" className="cta-button">Choose Your Agent</a>
              </div>

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

              <div className="testimonials">
                <h3>What Students Are Saying</h3>
                <div className="testimonial-grid">
                  <div className="testimonial-card">
                    <p>“StudyAir turned my messy notes into study gold. Can’t study without it now!”</p>
                    <h4>— Anna, Psychology Major</h4>
                  </div>
                  <div className="testimonial-card">
                    <p>“I passed my finals thanks to the Quiz Generator. It’s scary good.”</p>
                    <h4>— Sam, Engineering Student</h4>
                  </div>
                  <div className="testimonial-card">
                    <p>“The Study Room feature is amazing — it's like having a virtual study group.”</p>
                    <h4>— Devin, Business Admin</h4>
                  </div>
                </div>
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
  <div className="footer-container">
    <div className="footer-section">
      <p>© 2025 StudyAir</p>
      <p>Built for students, powered by AI</p>
    </div>
    <div className="footer-section">
      <p>Contact Us:</p>
      <p>Email: studyair@gmail.com</p>
      <p>Phone: +1 (443)-900-4558</p>
    </div>
    <div className="footer-section">
      <p>Follow Us: @studyair</p>
      <p>Twitter | Facebook | Instagram</p>
    </div>
  </div>
</footer>
    </div>
  );
}

export default App;
