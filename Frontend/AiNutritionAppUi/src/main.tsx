import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { PlanProvider } from "./providers/PlanProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PlanProvider>
        <Toaster position="top-center" closeButton richColors theme="dark" />
        <App />
      </PlanProvider>
    </BrowserRouter>
  </StrictMode>,
);
