import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Basic validation
    if (!username || !password || !role) {
      setError('All fields are required');
      return;
    }

    // Simulated login logic for demonstration
    if (username === 'admin' && password === 'admin123' && role === 'admin') {
      onLoginSuccess('admin'); // Pass role to navigate to admin dashboard
    } else if (username === 'student' && password === 'student123' && role === 'student') {
      onLoginSuccess('student'); // Navigate to home for students
    } else if (username === 'teacher' && password === 'teacher123' && role === 'teacher') {
      onLoginSuccess('teacher'); // Navigate to home for teachers
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

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

      <button className="login-button" onClick={handleLogin}>
        Login
      </button>

      <div className="register-link">
        <p>Don't have an account? 
          <button onClick={onRegisterClick} className="register-link-button">Register here</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
