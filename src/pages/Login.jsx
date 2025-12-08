import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to log in: " + error.message);
    }

    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      return setError("Please enter your email address first.");
    }
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your inbox for further instructions.");
    } catch (error) {
      setError("Failed to reset password: " + error.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to StudyAir</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button disabled={loading} type="submit" className="auth-submit-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

    <div className="auth-footer">
      <button 
        onClick={handleForgotPassword} 
        disabled={loading}
        style={{ background: 'none', border: 'none', color: '#ff00cc', cursor: 'pointer', fontWeight: '600' }}
      >
        Forgot Password?
        </button>
    </div>

    <div className="auth-footer">
      Need an account? <Link to="/register">Register</Link>
    </div>
  </div>
</div>
  );
}

export default Login;
