import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import useWindowSize from "./useWindowSize";
const ForgotPassword = () => {
  const { width }=useWindowSize();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/send-otp",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setMessage(`✅ OTP has been sent to ${email}`);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/verify-otp", { state: { email } });
        }, 2000);
      } else {
        setMessage(`❌ ${response.data.message}`);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("❌ Failed to send OTP. Please try again.");
      setShowPopup(true);
    }
  };

  return (
    <div className="signup-container">
      <div className="reset-box">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive an OTP.</p>

        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Login
        </button>

        {/* ✅ Popup Box for Success & Error Messages */}
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

export default ForgotPassword;
