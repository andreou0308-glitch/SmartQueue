import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StaffDashboard from "./StaffDashboard.jsx";

const isStaffPage = window.location.href.includes("staff");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isStaffPage ? <StaffDashboard /> : <App />}
  </StrictMode>
);
