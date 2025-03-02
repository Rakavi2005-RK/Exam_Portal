import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import useWindowSize from "./useWindowSize";

const SignUp = () => {
  const { width }=useWindowSize();
  const isMobile= width<768;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please enter all the fields");
      setIsError(true);
      setShowPopup(true);
      return;
    }
    if (!formData.email.includes("@")) {
      setMessage("Please add '@' to your email");
      setIsError(true);
      setShowPopup(true);
      return;
    }
    if (formData.password.length < 6) {
      setMessage("Your password should have more than 6 characters");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/Signup",
        {
          fullname: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setMessage(response.data.error);
        setIsError(false);
        setShowPopup(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          setShowPopup(false);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.log("Full error object:", error);
    
      if (error.response) {
        console.log("Full error response:", error.response);
        console.log("Error data:", error.response.data);
        console.log("Error message:", error.response.data?.error);
      } else {
        console.log("No response from server.");
      }
    
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);  // Show Flask error message
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    
      setIsError(true);
      setShowPopup(true);
    }
    
  };

  return (
    <div className={'signup-container ${isMobile ? "mobile" : ""}'}>
      <div className="login-wrapper">
       {!isMobile && <div className="image-section"></div>}

        <div className="signup-form">
          <h2>Create an Account</h2>
          <p>Join us and manage your exams effortlessly.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter Username"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter E-mail"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                
              </span>
            </div>
            <button type="submit" className="signup-button">
              Sign up
            </button>
          </form>

          <p>
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </div>

      {/* Success or Error Popup */}
      {showPopup && (
        <div className={`popup ${isError ? "error-popup" : "success-popup"}`}>
          <div className="popup-content">
            <h3>{isError ? "Error" : "Success"}</h3>
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
 