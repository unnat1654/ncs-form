import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
    <HashRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </HashRouter>
    </AuthProvider>
);
