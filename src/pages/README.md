# Cấu trúc dự án POS Bahung

## Luồng hiển thị và điều hướng

Ứng dụng được xây dựng với React Router DOM với luồng hiển thị như sau:

```
App.jsx (Router)
  ├── / (LandingPage)
  │    ├── HeaderLanding
  │    ├── MainLanding
  │    └── FooterLanding
  ├── /login (Login Page - đang là placeholder)
  └── /signup (Signup Page - đang là placeholder)
```

## Cấu trúc thư mục

```
src/
  ├── components/         # Các component có thể tái sử dụng
  │    ├── HeaderLanding  # Header của Landing Page
  │    ├── MainLanding    # Phần nội dung chính của Landing Page
  │    ├── FooterLanding  # Footer của Landing Page
  │    └── Style.css      # CSS với responsive cho màn hình POS
  │
  ├── pages/              # Các trang của ứng dụng
  │    ├── auth/          # Trang liên quan đến xác thực
  │    │    └── LandingPage.jsx  # Trang chủ cho người chưa đăng nhập
  │    ├── user/          # Trang dành cho người dùng đã đăng nhập
  │    └── admin/         # Trang dành cho quản trị viên
  │
  ├── App.jsx             # Component gốc, cấu hình router
  └── main.jsx            # Entry point của ứng dụng
```

## Responsive

Giao diện được thiết kế responsive cho các kích thước màn hình:
- 5.6 inch: Màn hình điện thoại
- 1024 × 768 (4:3): Màn hình POS cổ điển
- 1280 × 800 (16:10): Màn hình POS hiện đại
- 1366 × 768 (16:9): Màn hình POS hiện đại

Style.css chứa các media query và tối ưu cho màn hình cảm ứng. 