import React, { useState } from "react";
import "./Login.css";
import useWindowSize from "./useWindowSize";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { width }=useWindowSize();
  const isMobile=width<768;
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate=useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userName === "" || password === "") {
      setMessage("Please fill in all fields!");
      setIsError(true);
      setShowPopUp(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        { username: userName, password: password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setMessage("Login successful!");
        setIsError(false);
        setShowPopUp(true);
        navigate("/upload")
      } 
      else {
        setMessage(response.data.error || "Invalid login credentials");
        setIsError(true);
        setShowPopUp(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed. Try again.");
      setIsError(true);
      setShowPopUp(true);
    }
  };

  return (
    <div className={'container ${isMobile ? "mobile" : ""}'}>
      <div className="auth-container">
        { !isMobile && <div className="auth-left">
          <img
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGtub3dsZWRnwwfHwwfHx8MA%3D%3D"
            alt="Sign In"
            className="auth-image"
          />
        </div>}
        <div className="auth-right">
          <h2>Welcome to Exam Portal</h2>
          <p>Your gateway to seamless online examinations.</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/forgot-password">Forgot Password?</Link>
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      {showPopUp && (
        <div className={`popup ${isError ? "error-popup" : "success-popup"}`}>
          <div className="popup-content">
            <h3>{isError ? "Error" : "Success"}</h3>
            <p>{message}</p>
            <button onClick={() => setShowPopUp(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
