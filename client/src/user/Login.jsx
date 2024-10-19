import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/user/login`,
        { email, password }
      );
      if (data?.success) {
        setAuth({
          username: data.role?"admin":"user",
          token: data.token,
        });
        localStorage.setItem(
          "form-auth",
          JSON.stringify({
            username: data.role?"admin":"user",
            token: data.token,
          })
        );
        toast.success(data.message);
        navigate("/all-forms");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="login">
      <ToastContainer />
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          value={email}
          onInput={(e) => setEmail(e.target.value)}
          type="email"
          className="login-input"
          placeholder="Enter Email"
          required
        />
        <input
          value={password}
          onInput={(e) => setPassword(e.target.value)}
          type="password"
          className="login-input"
          placeholder="Enter Password"
          required
        />
        <button type="submit" className="login-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
