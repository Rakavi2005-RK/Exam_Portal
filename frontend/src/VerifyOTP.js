
import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import useWindowSize from "./useWindowSize";
const VerifyOTP = () => {
  const { width }=useWindowSize();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerifyOTP = async(e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("⚠️ Please enter the OTP.");
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/verify-otp", { email:email, otp:otp });

      if (response.status === 200) {
        setMessage("✅ OTP verified successfully! Redirecting...");
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
          navigate("/reset-password", { state: { email } });
        }, 2000);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setMessage("❌ Invalid OTP. Please try again.");
      setShowPopup(true);
    }
  };

  return (
    <div className="signup-container">
      <div className="reset-box">
        <h2>Verify OTP</h2>
        <p>Enter the OTP sent to your email.</p>
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />
          <button type="submit" disabled={!otp}>
            Verify OTP
          </button>
        </form>

        <button
          className="resend-button"
          onClick={() => setMessage("🔄 OTP resent!")}
        >
          Resend OTP
        </button>

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

export default VerifyOTP;