import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

// 添加深色模式支持
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        duration={3000}
        closeButton
      />
    </BrowserRouter>
  </StrictMode>
);
