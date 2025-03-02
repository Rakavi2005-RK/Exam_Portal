import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import SignUp from "./Signup";
import ForgotPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import VerifyOTP from "./VerifyOTP"; // Import VerifyOTP
import Upload from "./upload.js";
import UploadPDF from "./Uploadpdf.js"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} /> {/* New Route */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/Uploadpdf" element={<UploadPDF />} />
      </Routes>
    </Router>
  );
}

export default App;