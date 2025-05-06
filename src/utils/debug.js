// Hàm kiểm tra trạng thái Service Worker
export const checkServiceWorkerStatus = async () => {
   if (!('serviceWorker' in navigator)) {
      console.log('Service Worker không được hỗ trợ trong trình duyệt này');
      return 'not-supported';
   }

   try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length === 0) {
         console.log('Không có Service Worker nào được đăng ký');
         return 'not-registered';
      }

      const registration = registrations[0];

      if (registration.installing) {
         console.log('Service Worker đang được cài đặt');
         return 'installing';
      }

      if (registration.waiting) {
         console.log('Service Worker đang chờ kích hoạt');
         return 'waiting';
      }

      if (registration.active) {
         console.log('Service Worker đang hoạt động với scope:', registration.scope);
         return 'active';
      }

      return 'unknown';
   } catch (error) {
      console.error('Lỗi khi kiểm tra Service Worker:', error);
      return 'error';
   }
};

// Hàm kiểm tra trạng thái thông báo
export const checkNotificationStatus = () => {
   if (!('Notification' in window)) {
      console.log('Notification API không được hỗ trợ trong trình duyệt này');
      return 'not-supported';
   }

   console.log('Trạng thái quyền Notification:', Notification.permission);
   return Notification.permission;
};

// Hàm yêu cầu quyền thông báo đơn giản
export const requestPermission = async () => {
   if (!('Notification' in window)) {
      console.log('Notification API không được hỗ trợ trong trình duyệt này');
      return false;
   }

   try {
      const permission = await Notification.requestPermission();
      console.log('Đã yêu cầu quyền thông báo, kết quả:', permission);
      return permission === 'granted';
   } catch (error) {
      console.error('Lỗi khi yêu cầu quyền thông báo:', error);
      return false;
   }
};

// Hàm hiển thị thông báo nhanh (để test)
export const showTestNotification = () => {
   if (!('Notification' in window)) {
      console.log('Notification API không được hỗ trợ trong trình duyệt này');
      return false;
   }

   if (Notification.permission !== 'granted') {
      console.log('Không có quyền hiển thị thông báo');
      return false;
   }

   try {
      // Hiển thị thông báo trực tiếp (không qua Service Worker)
      const notification = new Notification('Thông báo thử nghiệm', {
         body: 'Đây là thông báo kiểm tra trực tiếp từ API',
         icon: '/logo.svg',
         tag: 'test-notification',
         timestamp: Date.now(),
         vibrate: [100, 50, 100]
      });

      notification.onclick = () => {
         console.log('Đã nhấp vào thông báo');
         notification.close();
      };

      console.log('Đã hiển thị thông báo thử nghiệm');
      return true;
   } catch (error) {
      console.error('Lỗi khi hiển thị thông báo thử nghiệm:', error);
      return false;
   }
}; 