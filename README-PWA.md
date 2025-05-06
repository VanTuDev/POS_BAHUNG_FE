# PWA Demo với Push Notification

Đây là dự án demo Progressive Web App (PWA) có hỗ trợ Push Notification.

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 12.x trở lên
- npm hoặc yarn

### Cài đặt
```bash
# Clone dự án (nếu chưa có)
git clone <đường_dẫn_repository> 


# Cài đặt các dependencies
npm install
```

### Chạy ứng dụng
```bash
# Khởi động server
node server.js
```

Server sẽ chạy tại http://localhost:3000

## Cách sử dụng

1. Mở trình duyệt và truy cập vào http://localhost:3000
2. Bấm nút "Đăng ký nhận thông báo" để cấp quyền push notification
3. Sau khi đăng ký thành công, bạn có thể bấm nút "Gửi thông báo" để test

## Test trên điện thoại di động

Để test PWA trên điện thoại di động, bạn cần:

1. Đảm bảo máy tính và điện thoại kết nối cùng mạng WiFi
2. Tìm địa chỉ IP của máy tính:
   - Windows: Mở Command Prompt và gõ `ipconfig`
   - macOS/Linux: Mở Terminal và gõ `ifconfig` hoặc `ip addr`
3. Trên điện thoại, mở trình duyệt Chrome hoặc Safari và truy cập vào http://<địa_chỉ_IP>:3000

### Cài đặt PWA lên màn hình chính

- Trên Android (Chrome): Bấm vào biểu tượng menu (3 chấm) > Add to Home Screen
- Trên iOS (Safari): Bấm vào biểu tượng Share > Add to Home Screen

## Cấu trúc dự án

```
pwa-demo/
├── public/                  # Frontend
│   ├── icons/               # Các icon cho PWA
│   ├── index.html           # File HTML chính
│   ├── app.js               # JavaScript chính
│   ├── service-worker.js    # Service Worker
│   └── manifest.json        # Manifest file cho PWA
├── server.js                # Backend Node.js
├── package.json             # Dependencies
└── README.md                # Hướng dẫn này
```

## Các công nghệ được sử dụng

- Frontend:
  - HTML, CSS, JavaScript thuần
  - Service Worker API
  - Push API
  - Notification API

- Backend:
  - Node.js
  - Express
  - web-push

## Lưu ý

- PWA chỉ hoạt động trên kết nối HTTPS hoặc localhost
- Trên một số thiết bị, push notification có thể không hoạt động do cài đặt bảo mật
- VAPID keys trong dự án nên được thay đổi khi triển khai thực tế

## Tài nguyên tham khảo

- [Web Push Notifications: Timely, Relevant, and Precise](https://developers.google.com/web/fundamentals/push-notifications)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) 