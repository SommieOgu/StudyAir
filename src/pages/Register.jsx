import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

  const uname = username.trim();
  if (!uname) {
  return setError("Username cannot be empty");
  }

  if (uname.length < 3 || uname.length > 20) {
  return setError("Username must be between 3 and 20 characters");
  }

  for (let i = 0; i < uname.length; i++) {
    const char = uname[i];
    const isLetter = (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    const isNumber = char >= '0' && char <= '9';
    const isUnderscore = char === '_';

    if (!isLetter && !isNumber && !isUnderscore) {
    return setError("Username can only contain letters, numbers, or underscores");
      }
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password, uname);
      navigate("/");
    } catch (error) {
      setError("Failed to create an account: " + error.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for StudyAir</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. study_fan123"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} type="submit" className="auth-submit-btn">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
