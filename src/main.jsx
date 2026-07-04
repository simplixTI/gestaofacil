import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(k) {
      const v = localStorage.getItem(k);
      return v == null ? null : { value: v };
    },
    async set(k, v) {
      localStorage.setItem(k, v);
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
