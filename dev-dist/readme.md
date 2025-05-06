# Thư mục dev-dist trong dự án POS_BAHUNG_FE

## Giới thiệu

Thư mục `dev-dist` là một thành phần quan trọng được tạo ra tự động bởi plugin `vite-plugin-pwa` khi ứng dụng chạy trong môi trường phát triển (development mode). Thư mục này chứa các file cần thiết để hỗ trợ chức năng Progressive Web App (PWA) trong quá trình phát triển.

## Cấu trúc thư mục

Thư mục `dev-dist` chứa các file sau:

- **sw.js**: Service Worker dành cho môi trường phát triển, sử dụng Workbox
- **workbox-[hash].js**: Thư viện Workbox đã được bundle
- **registerSW.js**: Script nhỏ để đăng ký Service Worker
- **readme.md**: File này - tài liệu hướng dẫn về thư mục dev-dist

## Mục đích sử dụng

Thư mục `dev-dist` phục vụ các mục đích sau:

1. **Hỗ trợ phát triển PWA**:
   - Cho phép kiểm tra các tính năng PWA trong quá trình phát triển
   - Cho phép dùng hot-reload cùng với Service Worker

2. **Kiểm tra chức năng offline**:
   - Cung cấp Service Worker giả lập môi trường production
   - Kiểm tra chiến lược cache và offline experience

3. **Thử nghiệm Push Notification**:
   - Cho phép test Push API mà không cần build production
   - Hỗ trợ việc gỡ lỗi các vấn đề liên quan đến thông báo

## Lưu ý khi sử dụng

1. **Không chỉnh sửa trực tiếp**:
   - Thư mục `dev-dist` được tạo lại mỗi khi khởi động dev server
   - Mọi thay đổi thủ công sẽ bị mất

2. **Khác biệt với production**:
   - Service Worker trong `dev-dist` có cấu hình khác với production
   - Một số tính năng có thể hoạt động khác trong môi trường production

3. **Cách thay đổi cấu hình**:
   - Để thay đổi cấu hình PWA, hãy chỉnh sửa trong `vite.config.js`
   - Các thay đổi sẽ được áp dụng tự động vào thư mục `dev-dist`

## Đăng ký Service Worker

Trong môi trường phát triển, Service Worker được đăng ký tự động thông qua file `registerSW.js`. Tuy nhiên, để kiểm soát tốt hơn, bạn có thể sử dụng đoạn mã sau trong file chính của ứng dụng:

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    })
      .then(registration => {
        console.log('POS_BAHUNG_FE Service Worker đăng ký thành công:', registration.scope);
      })
      .catch(error => {
        console.error('POS_BAHUNG_FE Service Worker đăng ký thất bại:', error);
      });
  });
}
```

## Push Notification trong môi trường phát triển

Để test Push Notification, bạn có thể sử dụng các phương thức trong `notification.js` như:

- `simulatePushNotification()`: Mô phỏng thông báo push
- `showNotification()`: Hiển thị thông báo thông thường
- `requestNotificationPermission()`: Yêu cầu quyền thông báo

## Kết luận

Thư mục `dev-dist` là công cụ hỗ trợ quan trọng cho việc phát triển PWA trong dự án POS_BAHUNG_FE. Mặc dù tự động được tạo ra và quản lý bởi Vite, việc hiểu rõ về cấu trúc và mục đích của nó sẽ giúp quá trình phát triển hiệu quả hơn.
