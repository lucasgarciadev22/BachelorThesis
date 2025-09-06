import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import WizardPage from "./pages/WizardPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WizardPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
