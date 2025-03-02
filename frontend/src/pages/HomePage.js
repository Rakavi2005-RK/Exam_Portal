
import React from 'react';
import './HomePage.css';

const HomePage = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="home-container">
      <h1 >Welcome to the Exam Portal</h1>
      <div className="home-buttons">
        <button onClick={onLoginClick} className="home-button">Login</button>
        <button onClick={onRegisterClick} className="home-button">Register</button>
      </div>
    </div>
  );
};

export default HomePage;
