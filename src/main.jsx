import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
);
