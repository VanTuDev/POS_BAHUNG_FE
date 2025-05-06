// Kiểm tra xem trình duyệt có hỗ trợ thông báo không
export const isNotificationSupported = () => {
   return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

// VAPID Keys cho Web Push - Thêm mới
const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

// Chuyển đổi base64 sang Uint8Array - Thêm mới
function urlBase64ToUint8Array(base64String) {
   const padding = '='.repeat((4 - base64String.length % 4) % 4);
   const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

   const rawData = window.atob(base64);
   const outputArray = new Uint8Array(rawData.length);

   for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
   }
   return outputArray;
}

// Đăng ký Service Worker
export const registerServiceWorker = async () => {
   if (!isNotificationSupported()) {
      console.warn('Trình duyệt không hỗ trợ thông báo hoặc service worker');
      return null;
   }

   try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker đã đăng ký thành công:', registration);
      return registration;
   } catch (error) {
      console.error('Đăng ký Service Worker thất bại:', error);
      return null;
   }
};

// Đăng ký nhận thông báo push - Thêm mới
export const subscribeToPushNotifications = async () => {
   try {
      const registration = await navigator.serviceWorker.ready;

      // Kiểm tra subscription hiện tại
      let subscription = await registration.pushManager.getSubscription();

      // Nếu chưa có, đăng ký mới
      if (!subscription) {
         console.log('Đang đăng ký nhận thông báo push...');

         const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

         subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
         });

         console.log('Đăng ký nhận thông báo push thành công:', subscription);

         // Đây là nơi bạn sẽ gửi subscription lên server nếu có backend
         // Hiện tại chỉ lưu vào localStorage
         localStorage.setItem('push_subscription', JSON.stringify(subscription));
      } else {
         console.log('Đã đăng ký nhận thông báo push trước đó:', subscription);
      }

      return subscription;
   } catch (error) {
      console.error('Lỗi khi đăng ký nhận thông báo push:', error);
      return null;
   }
};

// Yêu cầu quyền hiển thị thông báo
export const requestNotificationPermission = async () => {
   if (!isNotificationSupported()) {
      return { permission: 'denied', reason: 'not-supported' };
   }

   try {
      const permission = await Notification.requestPermission();
      console.log('Quyền thông báo:', permission);

      // Thêm mới: Nếu được cấp quyền, đăng ký nhận push notification
      if (permission === 'granted') {
         await subscribeToPushNotifications();
      }

      return { permission };
   } catch (error) {
      console.error('Lỗi khi yêu cầu quyền thông báo:', error);
      return { permission: 'denied', reason: 'error', error };
   }
};

// Hiển thị thông báo - đã tối ưu cho điện thoại
export const showNotification = async ({ title, body, icon, url }) => {
   if (!isNotificationSupported()) {
      console.warn('Trình duyệt không hỗ trợ thông báo');
      return false;
   }

   console.log('Hiển thị thông báo:', { title, body, icon, url });

   try {
      // Kiểm tra permission
      if (Notification.permission !== 'granted') {
         const { permission } = await requestNotificationPermission();
         if (permission !== 'granted') {
            console.warn('Người dùng không cho phép hiển thị thông báo');
            return false;
         }
      }

      // Android và desktop - ưu tiên dùng Service Worker
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
         console.log('Hiển thị thông báo qua ServiceWorker controller');
         navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: title || 'Thông báo từ POS Bahung',
            body: body || 'Bạn có thông báo mới!',
            icon: icon || '/logo.svg',
            url: url || '/',
            timestamp: Date.now()
         });
      }

      // Cách 2: Qua registration (dự phòng)
      setTimeout(async () => {
         try {
            const registration = await navigator.serviceWorker.ready;
            if (registration && registration.active) {
               console.log('Hiển thị thông báo qua ServiceWorker registration');
               registration.active.postMessage({
                  type: 'SHOW_NOTIFICATION',
                  title: title || 'Thông báo từ POS Bahung',
                  body: body || 'Bạn có thông báo mới!',
                  icon: icon || '/logo.svg',
                  url: url || '/',
                  timestamp: Date.now()
               });
            }
         } catch (err) {
            console.error('Lỗi khi gửi thông qua registration:', err);
         }
      }, 100);

      // Cách 3: Hiển thị trực tiếp (iOS và trường hợp khác)
      setTimeout(() => {
         try {
            console.log('Hiển thị thông báo trực tiếp qua API');
            new Notification(title || 'Thông báo từ POS Bahung', {
               body: body || 'Bạn có thông báo mới!',
               icon: icon || '/logo.svg',
               tag: 'notification-' + Date.now(),
               timestamp: Date.now(),
               vibrate: [200, 100, 200]
            });
         } catch (err) {
            console.error('Lỗi khi hiển thị thông báo trực tiếp:', err);
         }
      }, 200);

      return true;
   } catch (error) {
      console.error('Lỗi khi hiển thị thông báo:', error);
      return false;
   }
};

// Mô phỏng gửi thông báo push từ server - Thêm mới
export const simulatePushNotification = async (title, body, url) => {
   if (Notification.permission !== 'granted') {
      console.warn('Không thể gửi thông báo: chưa được cấp quyền');
      return false;
   }

   try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) {
         console.warn('Không thể gửi thông báo: Service Worker không hoạt động');
         return false;
      }

      // Tạo một sự kiện push giả lập
      registration.active.postMessage({
         type: 'SIMULATE_PUSH',
         payload: JSON.stringify({
            title: title || 'Thông báo mới',
            body: body || 'Đây là thông báo từ hệ thống',
            icon: '/logo.svg',
            url: url || '/',
            timestamp: Date.now()
         })
      });

      return true;
   } catch (error) {
      console.error('Lỗi khi mô phỏng thông báo push:', error);
      return false;
   }
}; 