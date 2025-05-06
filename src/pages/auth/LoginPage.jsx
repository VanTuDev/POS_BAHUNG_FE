import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
  BellOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  isNotificationSupported,
  requestNotificationPermission,
  showNotification,
  simulatePushNotification,
} from "../../utils/notification";
import {
  authenticateUser,
  saveAuthToken,
  saveUserInfo,
} from "../../utils/mockAuth";
import {
  checkServiceWorkerStatus,
  checkNotificationStatus,
  showTestNotification,
} from "../../utils/debug";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});

  // Kiểm tra trạng thái quyền thông báo khi component được tải
  useEffect(() => {
    if (isNotificationSupported()) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("not-supported");
    }
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Xác thực form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý đăng nhập với tài khoản cứng
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Sử dụng hàm xác thực với tài khoản cứng
      const authResult = authenticateUser(formData.username, formData.password);

      if (authResult.success) {
        // Lưu token và thông tin người dùng
        saveAuthToken(authResult.token, formData.remember);
        saveUserInfo(authResult.user);

        // Hiển thị thông báo thành công trong UI
        message.success(authResult.message);

        // Hiển thị thông báo push nếu được cấp quyền - thêm delay 500ms
        if (Notification.permission === "granted") {
          // Hiển thị thông báo push đăng nhập thành công
          setTimeout(() => {
            // Sử dụng mô phỏng push thay vì show thông báo thông thường
            simulatePushNotification(
              "Đăng nhập thành công",
              `Xin chào ${authResult.user.fullName}, bạn đã đăng nhập thành công.`,
              "/dashboard"
            );
          }, 500); // Đợi 500ms để tránh xung đột
        }

        // Chuyển hướng đến trang chính - thêm delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // Hiển thị thông báo lỗi
        message.error(authResult.message);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      message.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Demo đăng nhập tự động với tài khoản có sẵn
  const handleAutoLogin = (username) => {
    setFormData({
      username: username,
      password: "123456",
      remember: true,
    });

    // Auto submit sau 0.5 giây
    setLoading(true);
    setTimeout(() => {
      const authResult = authenticateUser(username, "123456");

      if (authResult.success) {
        saveAuthToken(authResult.token, true);
        saveUserInfo(authResult.user);

        message.success(authResult.message);

        // Hiển thị thông báo push nếu được cấp quyền - thêm delay
        if (Notification.permission === "granted") {
          // Sử dụng mô phỏng push thay vì show thông báo thông thường
          setTimeout(() => {
            simulatePushNotification(
              "Đăng nhập nhanh thành công",
              `Xin chào ${authResult.user.fullName}, bạn đã đăng nhập với tài khoản ${username}.`,
              "/dashboard"
            );
          }, 500);
        }

        // Chuyển hướng đến trang chính - thêm delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        message.error(authResult.message);
        setLoading(false);
      }
    }, 500);
  };

  // Xử lý nút thông báo đa năng
  const handleNotificationButton = async () => {
    // Kiểm tra trạng thái thông báo
    if (Notification.permission === "granted") {
      // Nếu đã cấp quyền, hiển thị thông báo test
      handleTestNotification();
    } else {
      // Nếu chưa cấp quyền, yêu cầu quyền
      try {
        const result = await requestNotificationPermission();
        setNotificationPermission(result.permission);

        if (result.permission === "granted") {
          message.success("Bạn đã cấp quyền hiển thị thông báo!");

          // Hiển thị thông báo thử nghiệm ngay sau khi được cấp quyền
          setTimeout(() => {
            simulatePushNotification(
              "Đã kích hoạt thông báo!",
              "Bạn sẽ nhận được các thông báo quan trọng từ hệ thống.",
              "/login"
            );
          }, 500);
        } else if (result.permission === "denied") {
          message.error("Bạn đã từ chối nhận thông báo từ hệ thống.");
        } else {
          message.info("Bạn chưa quyết định về quyền thông báo.");
        }
      } catch (error) {
        console.error("Lỗi khi yêu cầu quyền thông báo:", error);
        message.error("Có lỗi khi yêu cầu quyền thông báo.");
      }
    }
  };

  // Xử lý thử thông báo trực tiếp cho nút "Thử gửi thông báo"
  const handleTestNotification = () => {
    // Thử cả hai cách
    showTestNotification(); // Thử trực tiếp qua API Notification

    // Thử mô phỏng push notification
    simulatePushNotification(
      "Thông báo thử nghiệm",
      "Đây là thông báo thử nghiệm dạng PUSH. Thông báo này được thiết kế đặc biệt cho thiết bị di động!",
      "/login"
    );

    // Kiểm tra trạng thái
    checkServiceWorkerStatus().then((status) => {
      console.log("Trạng thái Service Worker:", status);
    });

    const notifStatus = checkNotificationStatus();
    console.log("Trạng thái Notification:", notifStatus);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-400 p-5">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="text-center p-6 pt-8 pb-6 bg-gray-50 border-b border-gray-200">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-20 h-20 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800 m-0">
            POS Bahung
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Hệ thống quản lý bán hàng
          </p>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên đăng nhập
            </label>
            <div
              className={`flex items-center w-full border ${
                errors.username ? "border-red-500" : "border-gray-200"
              } rounded-md transition-all focus-within:border-blue-500 focus-within:shadow-sm focus-within:shadow-blue-200`}
            >
              <UserOutlined className="text-gray-400 text-lg px-3" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                className="flex-1 p-3 border-none text-base outline-none bg-transparent"
              />
            </div>
            {errors.username && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.username}
              </span>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu
            </label>
            <div
              className={`flex items-center w-full border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-md transition-all focus-within:border-blue-500 focus-within:shadow-sm focus-within:shadow-blue-200`}
            >
              <LockOutlined className="text-gray-400 text-lg px-3" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="flex-1 p-3 border-none text-base outline-none bg-transparent"
              />
              <button
                type="button"
                className="p-3 border-none bg-transparent cursor-pointer text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="flex justify-between mb-5 sm:flex-row flex-col sm:space-y-0 space-y-2 sm:items-center items-start">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-blue-500 font-medium hover:text-blue-700 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-base font-medium transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed opacity-70"
                : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
            } text-white mb-3`}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="my-4">
            <p className="text-sm text-gray-700 text-center mb-2">
              Đăng nhập nhanh:
            </p>
            <div className="flex space-x-3 sm:flex-row flex-col sm:space-y-0 space-y-2">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-md text-sm font-medium bg-blue-500 text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => handleAutoLogin("admin")}
                disabled={loading}
              >
                Admin
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-md text-sm font-medium bg-teal-500 text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => handleAutoLogin("user")}
                disabled={loading}
              >
                User
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-md text-sm font-medium bg-purple-500 text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => handleAutoLogin("staff")}
                disabled={loading}
              >
                Staff
              </button>
            </div>
          </div>

          {/* Nút thông báo */}
          <button
            type="button"
            className="w-full py-3 rounded-md text-base font-medium bg-red-400 text-white flex items-center justify-center my-4 shadow-sm hover:bg-red-500 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all"
            onClick={handleNotificationButton}
          >
            <BellOutlined className="mr-2 text-lg" />
            {notificationPermission === "granted"
              ? "Gửi thông báo thử nghiệm"
              : "Bật thông báo cho thiết bị này"}
          </button>

          {/* Nút PUSH đặc biệt */}
          {notificationPermission === "granted" && (
            <button
              type="button"
              className="w-full py-3 rounded-md text-base font-bold bg-red-500 text-white flex items-center justify-center mt-2.5 animate-pulse-custom hover:bg-red-400 transition-colors"
              onClick={() =>
                simulatePushNotification(
                  "Thông báo quan trọng",
                  "Đây là thông báo đẩy (PUSH) đặc biệt dành cho thiết bị di động!",
                  "/login"
                )
              }
            >
              <BellOutlined className="mr-2 text-lg text-red-100" /> Gửi thông
              báo PUSH đặc biệt
            </button>
          )}

          {/* Trạng thái thông báo */}
          {notificationPermission === "granted" && (
            <div className="flex items-center justify-center bg-green-100 text-green-800 p-3 rounded-md mt-4 border border-green-200">
              <BellOutlined className="mr-2" /> Thông báo đã được kích hoạt
            </div>
          )}
        </form>

        <div className="text-center p-6 pt-0">
          <p className="text-gray-700 text-sm mb-2.5">
            Chưa có tài khoản?{" "}
            <a
              href="/signup"
              className="text-blue-500 font-medium hover:text-blue-700 hover:underline transition-colors"
            >
              Đăng ký ngay
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-5">
            © 2024 POS Bahung. Bản quyền thuộc về công ty TNHH Bahung.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
