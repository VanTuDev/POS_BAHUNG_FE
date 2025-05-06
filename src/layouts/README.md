# Layouts trong ứng dụng POS Bahung

Ứng dụng POS Bahung sử dụng các layout khác nhau để hiển thị giao diện phù hợp với từng trường hợp sử dụng. Layout giúp tái sử dụng các thành phần giao diện chung như header, footer, sidebar.

## Các layout chính

### 1. MainLayout
Layout chính dành cho người dùng đã đăng nhập, bao gồm:
- Sidebar bên trái chứa menu điều hướng
- Header phía trên cùng chứa thông tin người dùng, thông báo
- Vùng nội dung chính ở giữa
- Responsive: Tự động thích ứng với nhiều kích thước màn hình

### 2. AuthLayout
Layout đơn giản dành cho các trang xác thực (đăng nhập, đăng ký), chỉ bao gồm:
- Logo và tên ứng dụng
- Form xác thực ở giữa
- Footer đơn giản

### 3. LandingLayout
Layout dành cho trang chủ (khi chưa đăng nhập):
- Header với menu và nút đăng nhập/đăng ký
- Vùng nội dung chính
- Footer đầy đủ thông tin

### 4. POSLayout
Layout đặc biệt dành cho màn hình POS bán hàng:
- Tối ưu cho màn hình cảm ứng
- Bố cục chia 3 cột: danh mục sản phẩm, danh sách sản phẩm, giỏ hàng
- Có thể chuyển sang chế độ toàn màn hình
- Hỗ trợ các kích thước màn hình phổ biến: 1024×768 (4:3), 1280×800 (16:10), 1366×768 (16:9)

## Cách sử dụng layout

Để sử dụng layout, chúng ta bọc các component trang bên trong các layout:

```jsx
// Ví dụ sử dụng MainLayout
function ProductsPage() {
  return (
    <MainLayout>
      <div>Nội dung trang sản phẩm</div>
    </MainLayout>
  );
}
```

## Responsive

Tất cả các layout đều được thiết kế để responsive và tối ưu cho từng kích thước màn hình:
- Điện thoại (< 640px)
- Tablet (640px - 1024px)
- Máy tính để bàn (> 1024px)
- Màn hình POS cảm ứng (4:3, 16:10, 16:9)

Mỗi layout sẽ được phát triển và triển khai chi tiết ở các giai đoạn tiếp theo của dự án. 