import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/stream.css";
import "./styles/themes/dark.css";
import "./styles/themes/neon.css";
import "./styles/themes/minimal.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
