# **BÀI TẬP LỚN REACTJS**

## **Mục tiêu**
Mục đích của bài tập này là đánh giá khả năng phát triển ứng dụng web sử dụng ReactJS của sinh viên. Sinh viên được yêu cầu áp dụng các khái niệm đã học trong suốt khóa học, bao gồm React Components, Quản lý State (State Management), React Hooks, Biểu mẫu (Forms), Tích hợp API và React Router.

Sau khi hoàn thành bài tập này, sinh viên cần có khả năng:
- Xây dựng các component React có thể tái sử dụng.
- Quản lý state của ứng dụng bằng React Hooks.
- Tiêu thụ REST API sử dụng Fetch API hoặc Axios.
- Triển khai các thao tác CRUD (Thêm, Đọc, Sửa, Xóa).
- Tạo và quản lý các biểu mẫu trong React.
- Sử dụng React Router để điều hướng giữa các trang.
- Tổ chức và cấu trúc một ứng dụng React theo các thực tiễn tốt nhất.

## **PHẦN I. PHÁT TRIỂN ỨNG DỤNG (7 ĐIỂM)**

### **Hoạt động 1: Hiển thị danh sách sản phẩm từ một API (2 Điểm)**
**Yêu cầu:** Phát triển một trang Danh sách Sản phẩm lấy dữ liệu từ một REST API hoặc JSON Server và hiển thị lên giao diện người dùng. Mỗi sản phẩm cần hiển thị:
- Hình ảnh sản phẩm
- Tên sản phẩm
- Mô tả sản phẩm
- Giá gốc
- Giá hiện tại

Ứng dụng cũng phải xử lý các lỗi API và trạng thái tải (loading states) một cách phù hợp.

**Yêu cầu Kỹ thuật:** Functional Components, Hooks, Fetch API hoặc Axios, Render danh sách sử dụng map().

| Yêu cầu | Điểm |
| :--- | :--- |
| Lấy dữ liệu thành công từ API | 0.75 |
| Hiển thị danh sách sản phẩm chính xác | 0.75 |
| Xử lý trạng thái tải (loading) và lỗi (error) | 0.50 |

### **Hoạt động 2: Thêm và Xóa Sản phẩm (3 Điểm)**
**Yêu cầu:** Triển khai chức năng thêm và xóa sản phẩm.

**Thêm Sản phẩm:** Tạo một biểu mẫu bao gồm: Tên sản phẩm, Mô tả, Giá gốc, Giá hiện tại.
Sau khi gửi (submit):
- Một sản phẩm mới sẽ được thêm vào danh sách.
- Giao diện người dùng phải được cập nhật ngay lập tức.

**Xóa Sản phẩm:** Mỗi sản phẩm cần có một nút Xóa (Delete).
Khi được nhấp:
- Sản phẩm đã chọn sẽ bị xóa.
- Danh sách sản phẩm phải tự động làm mới.

**Yêu cầu Kỹ thuật:** Controlled Components, Xử lý Form, Xử lý Sự kiện (Event Handling), Cập nhật State.

| Yêu cầu | Điểm |
| :--- | :--- |
| Triển khai form sản phẩm | 0.50 |
| Chức năng thêm sản phẩm | 1.25 |
| Chức năng xóa sản phẩm | 1.00 |
| Cập nhật UI chính xác sau khi thay đổi | 0.25 |

### **Hoạt động 3: Chi tiết Sản phẩm và Chỉnh sửa Sản phẩm (2 Điểm)**
**Trang Chi tiết Sản phẩm:** Tạo một trang riêng biệt hiển thị thông tin chi tiết về một sản phẩm được chọn. Thông tin hiển thị bao gồm: Hình ảnh sản phẩm, Tên sản phẩm, Mô tả, Giá gốc, Giá hiện tại.

**Chỉnh sửa Sản phẩm:** Cung cấp một nút Chỉnh sửa (Edit) để điều hướng người dùng đến trang Chỉnh sửa Sản phẩm.
Trang chỉnh sửa cần:
- Điền sẵn (pre-populate) thông tin sản phẩm hiện tại.
- Cho phép người dùng cập nhật thông tin chi tiết của sản phẩm.
- Gửi các cập nhật thông qua request PUT.
- Chuyển hướng trở lại trang Chi tiết Sản phẩm sau khi cập nhật thành công.

**Yêu cầu Kỹ thuật:** React Router, useParams, useNavigate, Request PUT sử dụng Axios hoặc Fetch.

| Yêu cầu | Điểm |
| :--- | :--- |
| Cấu hình React Router | 0.50 |
| Triển khai trang Chi tiết Sản phẩm | 0.50 |
| Chức năng Chỉnh sửa Sản phẩm | 0.50 |
| Request PUT và điều hướng | 0.50 |

## **PHẦN II. ĐIỂM THƯỞNG (1 ĐIỂM)**
**Tích hợp Redux / Redux Toolkit:** Sinh viên có thể kiếm thêm một điểm bằng cách triển khai quản lý state toàn cục (global state) sử dụng Redux hoặc Redux Toolkit.

**Yêu cầu:** Tạo Redux Store, Quản lý dữ liệu sản phẩm qua Redux, Sử dụng Actions và Reducers, Sử dụng Redux Toolkit và Async Thunks (được khuyến khích).

| Yêu cầu | Điểm |
| :--- | :--- |
| Triển khai hợp lệ Redux / Redux Toolkit | 1.00 |

## **PHẦN III. HỎI ĐÁP / CHỦ ĐỀ THAY THẾ (2 ĐIỂM)**
Sinh viên có thể chọn một trong các chủ đề dự án sau đây. Tất cả các chủ đề đều tuân theo cùng một tiêu chí chấm điểm và yêu cầu kỹ thuật.

| Chủ đề | Mô tả |
| :--- | :--- |
| Hệ thống Quản lý Sinh viên | Quản lý hồ sơ, thông tin cá nhân và học tập của sinh viên |
| Hệ thống Quản lý Sách | Quản lý sách, tác giả và thông tin giá cả |
| Hệ thống Quản lý Phim | Quản lý phim, thể loại, đánh giá và mô tả |
| Hệ thống Quản lý Nhân viên | Quản lý thông tin nhân viên và phòng ban |
| Hệ thống Quản lý Khóa học | Quản lý các khóa đào tạo và giảng viên |
| Hệ thống Quản lý Sự kiện | Quản lý sự kiện, lịch trình và địa điểm |
| Hệ thống Quản lý Thư viện | Quản lý sách và thông tin mượn trả |
| Hệ thống Quản lý Công thức nấu ăn | Quản lý công thức, nguyên liệu và hướng dẫn nấu |
| Hệ thống Quản lý Điểm đến Du lịch | Quản lý các điểm đến và thông tin du lịch |
| Hệ thống Quản lý Công việc (To-Do) | Quản lý công việc, mức độ ưu tiên và trạng thái hoàn thành |

**Yêu cầu Chung cho Tất cả Chủ đề:** Mỗi dự án phải triển khai:
- Hiển thị dữ liệu từ API
- Tạo các bản ghi mới
- Xóa các bản ghi hiện tại
- Xem thông tin chi tiết
- Cập nhật các bản ghi hiện tại
- Điều hướng React Router
- Xác thực biểu mẫu (Form validation)
- Xử lý lỗi (Error handling)
- Cấu trúc dự án sạch