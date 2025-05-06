import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerServiceWorker } from "./utils/notification";

// Đăng ký service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    registerServiceWorker()
      .then((registration) => {
        console.log(
          "Service Worker đã đăng ký thành công với scope:",
          registration?.scope
        );
      })
      .catch((error) => {
        console.error("Đăng ký Service Worker thất bại:", error);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
