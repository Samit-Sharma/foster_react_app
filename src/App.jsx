import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./api";
import Signup from "./pages/Signup.jsx";
import Otp from "./pages/Otp.jsx";
import Home from "./pages/Home.jsx";
import Item from "./pages/Item.jsx";

function Private({ children }) {
  return getToken() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div className="phone">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/home" element={<Private><Home /></Private>} />
        <Route path="/item" element={<Private><Item /></Private>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
