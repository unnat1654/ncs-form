import React from "react";
import "react-toastify/dist/ReactToastify.css"; //toast
import { Routes, Route } from "react-router-dom";
import FormCreator from "./admin/FormCreator";
import AllFormList from "./admin/AllFormList";

import Login from "./user/Login";
import ChatBot from "./user/ChatBot";
import Signup from "./user/Signup";
import "./App.css";
import "./user/Login.css";

const App = () => {
  return (
    <Routes>
      <Route path="/create-form" element={<FormCreator />} />
      <Route path="/all-forms" element={<AllFormList />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/form/:id" element={<ChatBot />} />
    </Routes>
  );
};

export default App;
