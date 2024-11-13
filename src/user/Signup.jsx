import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Navbar from "../component/Navbar";
import robot from "../assets/robot.svg";

const Signup = () => {
  const [resendTimer, setResendTimer] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [user_id, setUser_id] = useState("");
  const [auth, setAuth] = useAuth({});
  const redirectPath = new URLSearchParams(location.search).get("redirect");
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleBeforeInput = (e) => {
    // Allow only numeric characters
    if (!/^\d*$/.test(e.data)) {
      e.preventDefault();
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/auth/signup`,
        { email, phone, password }
      );
      if (data?.success) {
        toast.success(data.message);
        setUser_id(data.user_id);
        setResendTimer(60);
        setOTPSent(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const reSendOTP = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/auth/resend-otp`,
        { user_id, action: "SIGNUP" }
      );
      if (data?.success) {
        toast.success(data.message);
        setUser_id(data.user_id);
        setResendTimer(60);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/auth/verify-signup-otp`,
        { user_id, otp: +otp }
      );
      if (data?.success) {
        setAuth({
          username: data.role ? "admin" : "user",
          user_id: data.user_id,
          token: data.token,
        });
        localStorage.setItem(
          "form-auth",
          JSON.stringify({
            username: data.role ? "admin" : "user",
            user_id: data.user_id,
            token: data.token,
          })
        );
        toast.success(data.message);
        if (redirectPath) navigate(redirectPath);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="signup-container">
        <div className="signup-left">
          <img src={robot} alt="Robot Logo" className="robot-logo" />
          <h1>Sign up to Emily</h1>
          <p>Emily, your Personal NCS Guide presents herself!</p>
          <p>
            Google forms weren’t cool enough, so we built our own! Emily is a
            conversational chatbot which makes filling forms easy & fun. Also,
            you can use the in-built form builder to create personalized forms.
          </p>
        </div>
        <div className="signup-right">
          <form
            className="signup-form"
            onSubmit={otpSent ? reSendOTP : sendOTP}
          >
            <input
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              type="email"
              className="signup-input"
              placeholder="Enter Email"
              disabled={otpSent}
              required
            />
            <input
              value={phone}
              onInput={(e) => setPhone(e.target.value)}
              onBeforeInput={handleBeforeInput}
              type="tel"
              className="signup-input"
              placeholder="Enter Phone"
              disabled={otpSent}
              required
            />
            <input
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              type="password"
              className="signup-input"
              placeholder="Enter Password"
              disabled={otpSent}
              required
            />
            <Link
              to={`/login${redirectPath ? `?redirect=${redirectPath}` : ""}`}
              className="toggle-link"
            >
              Have an account?
            </Link>
            <button
              type="submit"
              className="sendotp-button"
              disabled={resendTimer}
            >
              {otpSent
                ? `Resend OTP ${resendTimer ? `(${resendTimer}s)` : ""}`
                : "Send OTP"}
            </button>
          </form>
          {otpSent && (
            <form className="otp-form" onSubmit={verifyOTP}>
              <input
                value={otp}
                onInput={(e) => setOtp(e.target.value)}
                onBeforeInput={handleBeforeInput}
                type="text"
                className="signup-input"
                placeholder="Enter OTP"
                disabled={!otpSent}
                required
              />
              <button type="submit" disabled={!otpSent} className="signup-button">
                Verify and Join
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
