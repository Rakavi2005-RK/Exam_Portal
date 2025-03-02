
import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = ({ onRegisterSuccess, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Basic validation
    if (!username || !password || !role) {
      setError('All fields are required');
      return;
    }

    // Call the register success handler
    onRegisterSuccess();
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <button className="register-button" onClick={handleRegister}>
        Register
      </button>

      <div className="login-link">
        <p>Already have an account? 
          <button onClick={onLoginClick} className="login-link-button">Login here</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

