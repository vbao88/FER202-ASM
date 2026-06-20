# 🎓 Student Manager — FER202 Assignment

Hệ thống Quản lý Sinh viên xây dựng bằng **ReactJS + Redux Toolkit + JSON Server**.

## 🚀 Cài đặt & Chạy

### 1. Cài dependencies
```bash
npm install
```

### 2. Chạy cả 2 server cùng lúc (khuyến nghị)
```bash
npm run dev:all
```

Hoặc chạy riêng lẻ trong 2 terminal:
```bash
# Terminal 1 — Vite dev server (React app)
npm run dev

# Terminal 2 — JSON Server (REST API)
npm run server
```

### 3. Mở trình duyệt
- **React App:** http://localhost:5173
- **JSON Server API:** http://localhost:3001/students

---

## 📁 Cấu trúc dự án

```
src/
├── main.jsx                          # Entry point (Provider + BrowserRouter)
├── App.jsx                           # Routes setup
├── index.css                         # Global Design System
│
├── app/
│   └── store.js                      # Redux Store
│
├── features/students/
│   └── studentsSlice.js              # Redux Slice (Thunks + Reducers + Selectors)
│
├── services/
│   └── studentApi.js                 # Axios API functions
│
├── components/
│   ├── Navbar.jsx                    # Thanh điều hướng
│   ├── StudentCard.jsx               # Card sinh viên
│   ├── StudentForm.jsx               # Form thêm/chỉnh sửa
│   ├── LoadingSpinner.jsx            # Loading state
│   └── ErrorMessage.jsx             # Error state
│
└── pages/
    ├── StudentListPage.jsx           # Trang chủ: danh sách + thêm + xóa
    ├── StudentDetailPage.jsx         # Chi tiết sinh viên
    ├── StudentEditPage.jsx           # Chỉnh sửa sinh viên
    └── NotFoundPage.jsx             # Trang 404

db.json                               # JSON Server database
```

---

## 🛠️ Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19 | UI Framework |
| Vite | 8 | Build Tool |
| React Router DOM | 6 | Client-side Routing |
| Redux Toolkit | 2 | Global State Management |
| React Redux | 9 | React-Redux bindings |
| Axios | 1 | HTTP Client |
| JSON Server | 1 | Mock REST API |

---

## ✨ Tính năng

### Phần I — Phát triển ứng dụng (7 điểm)
- **HĐ1** ✅ Hiển thị danh sách sinh viên từ API (Loading + Error state)
- **HĐ2** ✅ Thêm sinh viên (form có validation) + Xóa sinh viên
- **HĐ3** ✅ Trang chi tiết + Chỉnh sửa (PUT request + React Router)

### Phần II — Điểm thưởng (1 điểm)
- **Redux Toolkit** ✅ Global state, Async Thunks, Actions, Reducers, Selectors

### Tính năng bổ sung
- Upload ảnh từ máy tính (nén tự động bằng Canvas API)
- Dark mode với Glassmorphism design
- Responsive layout (3 → 2 → 1 cột)
- Form validation inline (real-time)
- GPA progress bar màu động
- Academic rank badge (Xuất sắc / Giỏi / Khá / Trung bình)

---

## 🗺️ Routes

| URL | Trang |
|-----|-------|
| `/` | Danh sách sinh viên |
| `/students/:id` | Chi tiết sinh viên |
| `/students/:id/edit` | Chỉnh sửa sinh viên |
| `*` | 404 Not Found |

---

## 📡 API Endpoints (JSON Server)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/students` | Lấy toàn bộ danh sách |
| GET | `/students/:id` | Lấy 1 sinh viên |
| POST | `/students` | Thêm sinh viên mới |
| PUT | `/students/:id` | Cập nhật sinh viên |
| DELETE | `/students/:id` | Xóa sinh viên |

---

*FER202 — Front-End with React | Assignment*
