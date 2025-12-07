import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Settings() {
  const { 
    currentUser, 
    logout, 
    updateUserProfile, 
    updateUserPassword 
  } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser.displayName || "");
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to log out");
    }
  };

  async function handleUpdate(e) {
    e.preventDefault();

    const updates = [];
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;

    setError("");
    setMessage("");

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    if (password && password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }
    
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

    if (username !== currentUser.displayName) {
      updates.push(updateUserProfile(currentUser, username));
    }

    if (password) {
      updates.push(updateUserPassword(password).catch(e => {
        if (e.code === 'auth/requires-recent-login') {
             throw new Error("Password update requires recent login. Please logout and login again.");
        }
        throw e;
      }));
    }

    if (updates.length === 0) {
      return setError("No changes detected.");
    }

    setLoading(true);
    try {
      await Promise.all(updates);
      setMessage("Profile successfully updated!");
      passwordRef.current.value = "";
      passwordConfirmRef.current.value = "";
    } catch (e) {
      setError("Failed to update profile: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Account Settings</h2>
       
        <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '20px' }}>
          Logged in as: <strong>{currentUser.email}</strong>
        </p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password (Leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              placeholder="New password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              ref={passwordConfirmRef}
              placeholder="Confirm new password"
            />
          </div>

          <button disabled={loading} type="submit" className="auth-submit-btn">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        
        <div className="auth-footer" style={{ marginTop: '30px' }}>
          <button 
            className="auth-submit-btn" 
            onClick={handleLogout} 
            style={{ 
                background: '#ff4081', 
                boxShadow: '0 0 12px rgba(255, 64, 129, 0.3)', 
                marginTop: '10px' 
            }}
          >
            Logout
          </button>
          <div style={{ marginTop: '20px' }}>
              <Link to="/">Go Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;