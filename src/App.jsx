import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { FaCog, FaTimes } from "react-icons/fa";
import "./App.css";

import NoteTaker from "./pages/NoteTaker";
import QuizGenerator from "./pages/QuizGenerator";
import StudyRoom from "./pages/StudyRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import { useAuth } from "./contexts/AuthContext";

/* ================= SETTINGS POPUP ================= */

const SettingsPopup = ({ theme, onThemeChange, onClose }) => {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Appearance</h3>
          <button className="icon-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="settings-section">
          <p className="settings-section-title">Theme</p>
          <div className="theme-options">
            <button
              className={`theme-pill ${theme === "light" ? "selected" : ""}`}
              onClick={() => onThemeChange("light")}
            >
              Light
            </button>
            <button
              className={`theme-pill ${theme === "dark" ? "selected" : ""}`}
              onClick={() => onThemeChange("dark")}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= AGENT DROPDOWN ================= */

function AgentDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const agents = [
    { name: "Note Taker", path: "/note-taker" },
    { name: "Quiz Generator", path: "/quiz-generator" },
    { name: "Study Room", path: "/study-room" },
  ];

  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="agent-dropdown">
      <button className="agent-dropdown-btn" onClick={() => setOpen(!open)}>
        AI Agents <span className="arrow" />
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

/* ================= MAIN APP ================= */

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ===== APPLY THEME ===== */
  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ===== SCROLL FUNCTION FOR HOME + ABOUT ===== */
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ===== LOGOUT ===== */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      alert("Failed to log out");
    }
  };

  return (
    <div className="app">
      {/* ================= HEADER ================= */}
      <header className="top-header">
        <h1 className="logo">StudyAir</h1>

        <nav className="nav-buttons">
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home-hero");
            }}
          >
            Home
          </Link>

          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("our-purpose");
            }}
          >
            About
          </Link>

          <AgentDropdown />
        </nav>

        <div className="auth-buttons">
          {currentUser ? (
            <>
              <div className="user-profile-nav">
                <img
                  src={
                    currentUser.photoURL ||
                    "https://ui-avatars.com/api/?name=" +
                      (currentUser.displayName || currentUser.email)
                  }
                  alt="User Icon"
                  className="navbar-user-icon"
                />
                <span className="navbar-username">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>

              <button
                className="login-btn"
                onClick={() => navigate("/settings")}
                style={{
                  background: "linear-gradient(to right, #3333ff, #ff00cc)",
                }}
              >
                Account
              </button>

              <button
                className="login-btn"
                onClick={handleLogout}
                style={{ marginLeft: "8px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}

          <button
            className="user-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Appearance settings"
            title="Appearance settings"
          >
            <FaCog />
          </button>
        </div>
      </header>

      {/* ================= ROUTES ================= */}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <section className="home">
                <div id="home-hero" className="hero">
                  <div className="hero-content">
                    <h2>Welcome to StudyAir</h2>
                    <p>Your AI-powered academic assistant</p>
                  </div>
                  <div className="message msg1">Ready to be a pro?</div>
                  <div className="message msg2">Generating your quiz...</div>
                  <div className="message msg3">Review every day!</div>
                  <div className="message msg4">Study with friends!</div>
                  <div className="message msg5">Yay I passed my exam!</div>
                  <div className="message msg6">AI-powered study tools!</div>
                  <div className="message msg7">Time to focus</div>
                  <div className="message msg8">You got this!</div>
                </div>

                <div id="our-purpose" className="description">
                  <h2>
                    Our purpose: Making learning smarter, faster, and easier with AI-powered tools
                  </h2>
                </div>

                <div id="mission" className="mission">
                  <h2>
                    Mission: We provide AI study assistants that help students practice, organize, and master their coursework effortlessly
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
                      <h4>📅 Plan Study Sessions</h4>
                      <p>Study with peers to enhance retention.</p>
                    </div>
                  </div>

                  <a href="#agents" className="cta-button">
                    Choose Your Agent
                  </a>
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
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/note-taker" element={<NoteTaker />} />
          <Route path="/quiz-generator" element={<QuizGenerator />} />
          <Route path="/study-room" element={<StudyRoom />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
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

      {/* ================= SETTINGS POPUP ================= */}
      {isSettingsOpen && (
        <SettingsPopup
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
