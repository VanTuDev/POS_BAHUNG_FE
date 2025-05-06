import { Link } from "react-router-dom";

const MainLanding = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Hệ thống quản lý bán hàng POS Bahung
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Giải pháp quản lý bán hàng toàn diện dành cho các doanh nghiệp vừa
            và nhỏ, được tối ưu cho màn hình cảm ứng và thiết bị di động.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-purple-600 rounded-md font-medium hover:bg-purple-100 transition"
            >
              Dùng thử miễn phí
            </Link>
            <Link
              to="/demo"
              className="px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-purple-700 transition"
            >
              Xem demo
            </Link>
          </div>

          {/* POS Mockup Image */}
          <div className="mt-12 max-w-4xl w-full">
            <div className="relative">
              <div className="bg-gray-800 rounded-xl p-4 shadow-2xl">
                <div className="aspect-[4/3] sm:aspect-[16/9] bg-white rounded-lg overflow-hidden">
                  <img
                    src="https://placehold.co/1024x768/e2e8f0/1e293b?text=POS+Bahung+Demo"
                    alt="POS System Demo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Tính năng nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán dễ dàng</h3>
              <p className="text-gray-600">
                Hỗ trợ đa dạng phương thức thanh toán từ tiền mặt, thẻ tín dụng
                đến ví điện tử.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
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
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Báo cáo chi tiết</h3>
              <p className="text-gray-600">
                Theo dõi doanh thu, hàng tồn và xu hướng khách hàng với báo cáo
                trực quan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý kho hàng</h3>
              <p className="text-gray-600">
                Tự động cập nhật tồn kho, cảnh báo khi hàng sắp hết và đặt hàng
                tự động.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Sẵn sàng nâng cấp hệ thống bán hàng?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để nhận được 14 ngày dùng thử miễn phí và hỗ
            trợ thiết lập từ đội ngũ chuyên gia.
          </p>
          <Link
            to="/signup"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </section>
    </main>
  );
};

export default MainLanding;
