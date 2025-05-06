// =================================================================
// SERVICE WORKER CHO POS BAHUNG
// =================================================================
// File này xử lý:
// 1. Cache và cung cấp nội dung khi offline
// 2. Xử lý Push Notification
// 3. Xử lý Background Sync
// =================================================================

const CACHE_NAME = 'pos-bahung-v1';

// Danh sách tài nguyên cần lưu vào cache để sử dụng offline
// Đây là các tệp quan trọng để ứng dụng khởi động được khi không có mạng
const urlsToCache = [
   '/',
   '/login',
   '/index.html',
   '/logo.svg',
   '/src/main.jsx',
   '/src/App.jsx',
   '/src/pages/auth/LoginPage.jsx',
   '/src/pages/auth/LoginPage.css'
];

// In thông báo khi Service Worker được tải lần đầu
console.log('[ServiceWorker] Script loaded');

// =================================================================
// VÒNG ĐỜI SERVICE WORKER - PHẦN 1: CÀI ĐẶT
// =================================================================
// Sự kiện 'install' được kích hoạt khi Service Worker được cài đặt lần đầu
// hoặc khi có phiên bản mới được triển khai
self.addEventListener('install', (event) => {
   console.log('[ServiceWorker] Install - Dịch vụ đang được cài đặt');

   // waitUntil: đảm bảo Service Worker không được coi là đã cài đặt
   // cho đến khi tất cả các mã bên trong hoàn thành
   event.waitUntil(
      // Mở cache với tên đã định nghĩa
      caches.open(CACHE_NAME)
         .then((cache) => {
            console.log('Lưu cache tài nguyên');
            // Thêm tất cả các URL đã định nghĩa vào cache
            return cache.addAll(urlsToCache);
         })
         .then(() => self.skipWaiting())
      // skipWaiting: Kích hoạt SW mới ngay lập tức, không đợi các tab đóng
   );
});

// =================================================================
// VÒNG ĐỜI SERVICE WORKER - PHẦN 2: KÍCH HOẠT
// =================================================================
// Sự kiện 'activate' được kích hoạt sau khi cài đặt thành công
// Thường dùng để xóa cache cũ từ các phiên bản trước
self.addEventListener('activate', (event) => {
   console.log('[ServiceWorker] Activate - Dịch vụ đã được kích hoạt');

   event.waitUntil(
      // Lấy tất cả cache hiện có
      caches.keys().then((cacheNames) => {
         return Promise.all(
            // Lọc ra các cache không khớp với phiên bản hiện tại
            cacheNames.filter((cacheName) => {
               return cacheName !== CACHE_NAME;
            }).map((cacheName) => {
               // Xóa cache cũ để tiết kiệm dung lượng
               return caches.delete(cacheName);
            })
         );
      }).then(() => self.clients.claim())
      // clients.claim: Cho phép SW mới điều khiển tất cả các client/tab ngay lập tức
   );
});

// =================================================================
// XỬ LÝ REQUEST - OFFLINE CAPABILITY
// =================================================================
// Sự kiện 'fetch' được kích hoạt khi trang web yêu cầu tài nguyên
// Đây là cách chúng ta kiểm soát tài nguyên nào đến từ cache và nào từ mạng
self.addEventListener('fetch', (event) => {
   // Không cache các request đến API
   if (event.request.url.includes('/api/')) {
      return; // Cho phép request đi thẳng đến server
   }

   // Kiểm soát cách phản hồi cho request
   event.respondWith(
      // Kiểm tra xem request có trong cache không
      caches.match(event.request)
         .then((response) => {
            if (response) {
               // Cache hit - trả về response từ cache
               return response;
            }
            // Cache miss - truy cập mạng để lấy tài nguyên
            return fetch(event.request);
         })
         .catch((error) => {
            console.log('Lỗi fetch:', error);
            // Ở đây có thể xử lý trường hợp offline hoàn toàn
            // Ví dụ: trả về trang offline.html
         })
   );
});

// =================================================================
// XỬ LÝ PUSH NOTIFICATION
// =================================================================
// Sự kiện 'push' được kích hoạt khi server gửi thông báo đẩy
self.addEventListener('push', (event) => {
   console.log('Đã nhận push event');
   let notificationData = {};

   try {
      // Cố gắng parse dữ liệu dưới dạng JSON
      notificationData = event.data.json();
   } catch (e) {
      // Fallback nếu dữ liệu không phải JSON
      notificationData = {
         title: 'Thông báo mới',
         body: event.data ? event.data.text() : 'Bạn có thông báo mới',
         icon: '/logo.svg'
      };
   }

   // Cấu hình thông báo với nhiều tùy chọn
   const options = {
      // Nội dung chính của thông báo
      body: notificationData.body || 'Bạn có thông báo mới',
      icon: notificationData.icon || '/logo.svg',
      badge: '/logo.svg',

      // Mẫu rung - [rung (ms), nghỉ (ms), rung, nghỉ...]
      vibrate: [100, 50, 100, 50, 100, 50, 200],

      // Cài đặt âm thanh
      silent: false,

      // Yêu cầu tương tác người dùng - không tự biến mất
      requireInteraction: true,

      // Thêm các nút hành động
      actions: [
         {
            action: 'view',
            title: 'Xem ngay',
            icon: '/logo.svg'
         },
         {
            action: 'close',
            title: 'Đóng',
            icon: '/logo.svg'
         }
      ],

      // Dữ liệu tùy chỉnh gửi kèm thông báo (không hiển thị)
      data: {
         url: notificationData.url || '/',
         dateOfArrival: Date.now(),
         // Màu theme cho thông báo (chỉ hỗ trợ trên Android)
         color: '#4a90e2'
      }
   };

   // Hiển thị thông báo
   event.waitUntil(
      self.registration.showNotification(
         notificationData.title || 'Thông báo từ POS Bahung',
         options
      )
   );
});

// =================================================================
// XỬ LÝ TƯƠNG TÁC VỚI THÔNG BÁO
// =================================================================
// Sự kiện 'notificationclick' được kích hoạt khi người dùng nhấp vào thông báo
self.addEventListener('notificationclick', (event) => {
   console.log('Notification được click');

   // Đóng thông báo khi click
   event.notification.close();

   // Xử lý hành động khi click vào thông báo
   event.waitUntil(
      // Tìm tất cả các cửa sổ/tab của ứng dụng đang mở
      clients.matchAll({ type: 'window' })
         .then((clientList) => {
            // Kiểm tra xem có cửa sổ nào đang mở không
            for (let i = 0; i < clientList.length; i++) {
               const client = clientList[i];
               // Nếu có cửa sổ đang mở và có thể focus, thì focus
               if ('focus' in client) {
                  return client.focus();
               }
            }
            // Nếu không có cửa sổ đang mở, mở cửa sổ mới
            if (clients.openWindow) {
               // Mở URL từ dữ liệu thông báo hoặc trang chủ nếu không có
               return clients.openWindow(event.notification.data.url || '/');
            }
         })
   );
});

// =================================================================
// XỬ LÝ MESSAGE TỪ TRANG WEB
// =================================================================
// Sự kiện 'message' được kích hoạt khi trang web gửi dữ liệu đến Service Worker
self.addEventListener('message', (event) => {
   console.log('[ServiceWorker] Đã nhận message', event.data);

   try {
      // XỬ LÝ THÔNG BÁO THÔNG THƯỜNG
      if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
         console.log('[ServiceWorker] Hiển thị thông báo', event.data);

         // Tạo options cho thông báo
         const options = {
            body: event.data.body || 'Bạn có thông báo mới!',
            icon: event.data.icon || '/logo.svg',
            badge: '/logo.svg',
            tag: 'notification-' + Date.now(), // Đảm bảo mỗi thông báo có tag riêng
            timestamp: event.data.timestamp || Date.now(),
            vibrate: [200, 100, 200], // Mẫu rung mạnh hơn
            renotify: true, // Thông báo lại ngay cả khi có cùng tag
            requireInteraction: false, // Tự đóng sau một thời gian
            silent: false, // Không im lặng
            actions: [
               {
                  action: 'view',
                  title: 'Xem ngay'
               },
               {
                  action: 'close',
                  title: 'Đóng'
               }
            ],
            data: {
               url: event.data.url || '/',
               dateOfArrival: Date.now(),
               primaryKey: Date.now(),
               color: '#4a90e2'
            }
         };

         // Hiển thị thông báo và in ra log dù thành công hay thất bại
         self.registration.showNotification(
            event.data.title || 'Thông báo từ POS Bahung',
            options
         ).then(() => {
            console.log('[ServiceWorker] Thông báo đã được hiển thị thành công');
         }).catch(error => {
            console.error('[ServiceWorker] Lỗi khi hiển thị thông báo:', error);
         });
      }

      // XỬ LÝ MÔ PHỎNG PUSH NOTIFICATION
      else if (event.data && event.data.type === 'SIMULATE_PUSH') {
         console.log('[ServiceWorker] Mô phỏng push event', event.data);

         try {
            // Parse dữ liệu từ payload
            const payload = JSON.parse(event.data.payload);

            // Tạo options cho thông báo
            const options = {
               body: payload.body || 'Bạn có thông báo mới!',
               icon: payload.icon || '/logo.svg',
               badge: '/logo.svg',
               tag: 'push-' + Date.now(),
               timestamp: payload.timestamp || Date.now(),
               vibrate: [300, 100, 300], // Mẫu rung mạnh hơn cho push
               requireInteraction: true, // Yêu cầu tương tác
               silent: false,
               actions: [
                  {
                     action: 'view',
                     title: 'Xem chi tiết'
                  },
                  {
                     action: 'close',
                     title: 'Đóng'
                  }
               ],
               data: {
                  url: payload.url || '/',
                  dateOfArrival: Date.now(),
                  primaryKey: Date.now(),
                  color: '#4a90e2'
               }
            };

            // Hiển thị thông báo
            self.registration.showNotification(
               payload.title || 'Thông báo từ POS Bahung',
               options
            ).then(() => {
               console.log('[ServiceWorker] Thông báo mô phỏng hiển thị thành công');
            }).catch(error => {
               console.error('[ServiceWorker] Lỗi khi hiển thị thông báo mô phỏng:', error);
            });
         } catch (error) {
            console.error('[ServiceWorker] Lỗi xử lý payload thông báo mô phỏng:', error);
         }
      }
   } catch (error) {
      console.error('[ServiceWorker] Lỗi xử lý message:', error);
   }
});

// =================================================================
// BACKGROUND SYNC
// =================================================================
// Sự kiện 'sync' được kích hoạt khi trình duyệt phát hiện kết nối trở lại
// hoặc khi ứng dụng đăng ký một sync task
self.addEventListener('sync', function (event) {
   console.log('[ServiceWorker] Background Sync event fired', event.tag);

   // Xử lý theo tag của sync event
   if (event.tag === 'test-notification') {
      event.waitUntil(
         // Hiển thị một thông báo thử nghiệm
         self.registration.showNotification('Test Background Sync', {
            body: 'Notification from background sync',
            icon: '/logo.svg'
         })
      );
   }

   // Có thể thêm các tag sync khác ở đây
   // Ví dụ: sync dữ liệu, upload hình ảnh khi có mạng, v.v.
}); 