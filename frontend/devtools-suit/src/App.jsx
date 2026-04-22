import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PasswordPage from "./pages/PasswordPage";
import Base64Page from "./pages/Base64Page";
import UnicodePage from "./pages/UnicodePage";
import CronPage from "./pages/CronPage";
import ChmodPage from "./pages/ChmodPage";
import JSONPage from "./pages/JSONPage";
import ASCIIPage from "./pages/ASCIIPage";
import ColorPage from "./pages/ColorPage";
import CasePage from "./pages/CasePage";

function App() {
  return (
    <Router>
      <div style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        width: "100vw",
      }}>
        <div style={{
          width: "250px",
          flexShrink: 0,
        }}>
          <Sidebar />
        </div>

        <main style={{
          flex: 1,
          backgroundColor: "#f5f6fa",
          height: "100vh",
          overflowY: "auto",
          padding: "0",
          width: "calc(100vw - 250px)",
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/password" replace />} />
            <Route path="/password" element={<PasswordPage />} />
            <Route path="/base64" element={<Base64Page />} />
            <Route path="/unicode" element={<UnicodePage />} />
            <Route path="/cron-generator" element={<CronPage />} />
            <Route path="/chmod" element={<ChmodPage />} />
            <Route path="/json" element={<JSONPage />} />
            <Route path="/ascii" element={<ASCIIPage />} />
            <Route path="/color" element={<ColorPage />} />
            <Route path="/case" element={<CasePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
