import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../authContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/user/login`,
        { username, password }
      );
      if (data?.success) {
        setAuth({
          username: data.admin.username,
          token: data.admin.token,
        });
        localStorage.setItem(
          "form-auth",
          JSON.stringify({
            username: data.admin.username,
            token: data.admin.token,
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
          value={username}
          onInput={(e) => setUsername(e.target.value)}
          type="text"
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
