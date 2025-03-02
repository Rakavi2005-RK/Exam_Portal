import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import useWindowSize from "./useWindowSize";
import "./ResetPassword.css";
import axios from "axios";

const ResetPassword = () => {
  const { width }=useWindowSize();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // Password Strength Checker (1 Uppercase, 1 Lowercase, 1 Special Character, Min 6 Chars)
  const isPasswordValid = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleResetPassword = async(e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("⚠️ All fields are required.");
      setShowPopup(true);
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setMessage(
        "⚠️ Password must contain at least one uppercase, one lowercase, one special character, and be at least 6 characters long."
      );
      setShowPopup(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setShowPopup(true);
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:5000/reset-password", {
        email:email,
        password: newPassword,
      },{ headers: { "Content-Type": "application/json" } });

      if (response.status === 200) {
        setMessage("✅ Password reset successfully! Redirecting to login...");
        setShowPopup(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(response.data.message);
        setShowPopup(true);
      }
    } catch (error) {
      setMessage("❌ Password reset failed. Please try again.");
      setShowPopup(true);
    }
    
  };

  return (
    <div className="signup-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        <p>Enter your new password.</p>
        <form onSubmit={handleResetPassword}>
          {/* New Password Input */}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >

            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
            </span>
          </div>

          <button type="submit">Reset Password</button>
        </form>

        {/* Popup Message */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>{message}</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
