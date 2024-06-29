import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/user/signup`,
        { username, password }
      );
      if (data?.success) {
        toast.success(data?.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="signup">
      <ToastContainer />
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          value={username}
          onInput={(e) => setUsername(e.target.value)}
          type="text"
          className="signup-input"
          placeholder="Enter Email"
          required
        />
        <input
          value={password}
          onInput={(e) => setPassword(e.target.value)}
          type="password"
          className="signup-input"
          placeholder="Enter Password"
          required
        />
        <button type="submit" className="signup-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
