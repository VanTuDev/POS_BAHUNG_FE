import { useState } from "react";
import { Link } from "react-router-dom";

const HeaderLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold">POS Bahung</h1>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-purple-200 transition">
            Trang chủ
          </Link>
          <Link to="/features" className="hover:text-purple-200 transition">
            Tính năng
          </Link>
          <Link to="/pricing" className="hover:text-purple-200 transition">
            Bảng giá
          </Link>
          <Link to="/contact" className="hover:text-purple-200 transition">
            Liên hệ
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/login"
            className="px-3 py-1.5 text-white hover:text-purple-200 transition"
          >
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 bg-white text-purple-600 rounded-md hover:bg-purple-100 transition"
          >
            Đăng ký
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-700">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link to="/" className="block py-2 hover:text-purple-200">
              Trang chủ
            </Link>
            <Link to="/features" className="block py-2 hover:text-purple-200">
              Tính năng
            </Link>
            <Link to="/pricing" className="block py-2 hover:text-purple-200">
              Bảng giá
            </Link>
            <Link to="/contact" className="block py-2 hover:text-purple-200">
              Liên hệ
            </Link>
            <div className="flex space-x-3 py-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-white hover:text-purple-200 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 bg-white text-purple-600 rounded-md hover:bg-purple-100 transition"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderLanding;
