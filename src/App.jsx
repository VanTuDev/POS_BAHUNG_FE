import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/auth/LandingPage";
import UserDashboard from "./pages/user/UserDashboard";
import "./components/Style.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Trang trước khi đăng nhập */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Trang sau khi đăng nhập */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/pos" element={<POS />} />
        <Route path="/user/inventory" element={<Inventory />} />
        <Route path="/user/reports" element={<Reports />} />

        {/* Trang admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

// Placeholder components
const Login = () => <div>Trang đăng nhập</div>;
const Signup = () => <div>Trang đăng ký</div>;
const POS = () => <div>Trang bán hàng POS</div>;
const Inventory = () => <div>Trang quản lý kho</div>;
const Reports = () => <div>Trang báo cáo</div>;
const Admin = () => <div>Trang quản trị viên</div>;
