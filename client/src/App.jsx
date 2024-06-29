import React from "react";
import 'react-toastify/dist/ReactToastify.css'; //toast
import { Routes, Route } from "react-router-dom";
import FormCreator from "./admin/FormCreator";
import AllFormList from "./admin/AllFormList";
import Signup from "./admin/Signup";
import Login from "./admin/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/create-form" element={<FormCreator/>}/>
      <Route path="/all-forms" element={<AllFormList/>} />
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
};

export default App;
