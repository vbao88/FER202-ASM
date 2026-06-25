# CONTEXT.md — Hệ thống Quản lý Sinh viên (FER202 Assignment)

## 1. Tổng quan dự án

| Thông tin | Chi tiết |
|-----------|----------|
| **Môn học** | FER202 — Front-End with React |
| **Loại bài tập** | Bài tập lớn (Assignment) |
| **Chủ đề** | Hệ thống Quản lý Sinh viên (Student Management System) |
| **Mục tiêu điểm** | Full điểm: 7 (phần I) + 1 (Redux bonus) + 2 (vấn đáp) = 10 điểm |

---

## 2. Yêu cầu học thuật

### Phần I — Phát triển ứng dụng (7 điểm)

#### Hoạt động 1: Hiển thị danh sách sinh viên (2 điểm)
- Lấy dữ liệu từ JSON Server (REST API local)
- Hiển thị danh sách sinh viên với các thông tin:
  - Ảnh đại diện (avatar)
  - Tên sinh viên
  - Mô tả / Ngành học
  - Điểm GPA (tương đương "giá gốc")
  - Điểm trung bình học kỳ (tương đương "giá hiện tại")
- Xử lý loading state và error state

#### Hoạt động 2: Thêm và Xóa sinh viên (3 điểm)
- Form thêm sinh viên (Controlled Components):
  - Tên, Mã sinh viên, Ngành học, GPA, Điểm học kỳ
- Sau submit: cập nhật danh sách ngay lập tức
- Mỗi sinh viên có nút Delete
- Sau xóa: danh sách tự động refresh

#### Hoạt động 3: Chi tiết & Chỉnh sửa sinh viên (2 điểm)
- Trang chi tiết (Product Detail): xem đầy đủ thông tin
- Trang chỉnh sửa (Edit): pre-populate form → PUT request → redirect về chi tiết
- Điều hướng bằng React Router

### Phần II — Điểm thưởng Redux (1 điểm)
- Redux Toolkit + Async Thunks
- Global state cho toàn bộ danh sách sinh viên
- Actions: fetch, add, update, delete

### Phần III — Vấn đáp (2 điểm)
- Nắm vững toàn bộ code đã viết

---

## 3. Tech Stack

| Công nghệ | Phiên bản / Ghi chú |
|-----------|---------------------|
| **Runtime** | Node.js (hiện có) |
| **Framework** | React 19.2.6 |
| **Build Tool** | Vite 8.0.12 |
| **Routing** | React Router DOM v6 (cần cài) |
| **HTTP Client** | Axios (cần cài) |
| **State Management** | Redux Toolkit + React-Redux (cần cài) |
| **Mock API** | JSON Server (cần cài — global hoặc devDependency) |
| **Styling** | Vanilla CSS (index.css + module CSS) |
| **Linting** | ESLint (đã có) |

---

## 4. Môi trường hiện tại

```
FER202-ASM/
├── index.html
├── package.json          ← React 19, Vite 8, chưa có router/redux/axios
├── vite.config.js
├── eslint.config.js
├── src/
│   ├── main.jsx          ← Entry point
│   ├── App.jsx           ← Root component (cần refactor)
│   ├── App.css
│   └── index.css
├── public/
├── node_modules/
└── yeu-cau-du-an.md
```

**Packages cần cài thêm:**
```bash
npm install react-router-dom axios @reduxjs/toolkit react-redux
npm install -D json-server
```

---

## 5. Data Model — Sinh viên

```json
{
  "students": [
    {
      "id": 1,
      "name": "Nguyễn Văn An",
      "studentId": "SE180001",
      "major": "Software Engineering",
      "description": "Sinh viên năm 3, chuyên ngành Kỹ thuật phần mềm",
      "avatar": "https://i.pravatar.cc/150?img=1",
      "gpa": 3.5,
      "semesterScore": 8.2
    }
  ]
}
```

| Field | Tương đương đề bài | Kiểu |
|-------|-------------------|------|
| `id` | ID định danh | number |
| `name` | Tên sinh viên | string |
| `studentId` | Mã sinh viên | string |
| `major` | Ngành học | string |
| `description` | Mô tả | string |
| `avatar` | Hình ảnh | string (URL) |
| `gpa` | Giá gốc → GPA tích lũy | number |
| `semesterScore` | Giá hiện tại → Điểm học kỳ | number |

---

## 6. API Endpoints (JSON Server — port 3001)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/students` | Lấy toàn bộ danh sách |
| GET | `/students/:id` | Lấy chi tiết 1 sinh viên |
| POST | `/students` | Thêm sinh viên mới |
| PUT | `/students/:id` | Cập nhật toàn bộ thông tin |
| DELETE | `/students/:id` | Xóa sinh viên |

**Base URL:** `http://localhost:3001`

---

## 7. Cấu trúc thư mục đích

```
src/
├── main.jsx                  ← Entry point + Redux Provider
├── App.jsx                   ← Router setup
├── index.css                 ← Global styles
│
├── app/
│   └── store.js              ← Redux store
│
├── features/
│   └── students/
│       └── studentsSlice.js  ← Redux slice (actions + reducers + thunks)
│
├── pages/
│   ├── StudentListPage.jsx   ← HĐ1 + HĐ2: Danh sách + Thêm/Xóa
│   ├── StudentDetailPage.jsx ← HĐ3: Chi tiết
│   └── StudentEditPage.jsx   ← HĐ3: Chỉnh sửa
│
├── components/
│   ├── StudentCard.jsx       ← Card hiển thị 1 sinh viên
│   ├── StudentForm.jsx       ← Form thêm sinh viên (tái sử dụng ở Edit)
│   ├── LoadingSpinner.jsx    ← Loading state component
│   └── ErrorMessage.jsx      ← Error state component
│
├── services/
│   └── studentApi.js         ← Axios instance + API functions
│
└── db.json                   ← (hoặc để ở root) JSON Server database
```

---

## 8. Routes

| Path | Component | Mô tả |
|------|-----------|-------|
| `/` | `StudentListPage` | Trang chính: danh sách + form thêm |
| `/students/:id` | `StudentDetailPage` | Chi tiết sinh viên |
| `/students/:id/edit` | `StudentEditPage` | Chỉnh sửa sinh viên |

---

## 9. Ràng buộc & Ghi chú

- **JSON Server** chạy song song với Vite Dev Server (2 terminal)
- **Vite** chạy port `5173`, **JSON Server** chạy port `3001`
- Dùng **Axios** (không dùng Fetch thuần) để nhất quán
- **Redux Toolkit** quản lý toàn bộ state sinh viên (không dùng local useState cho data)
- **Form validation**: bắt buộc tên, mã SV, ngành học; GPA trong khoảng 0.0–4.0; Điểm học kỳ 0–10
- Code phải clean, có comment rõ ràng (chuẩn bị cho vấn đáp)
- Styling: hiện đại, responsive, không dùng Tailwind

---

## 10. Thứ tự thực hiện (preview cho bước PLAN)

1. Cài dependencies
2. Tạo `db.json` + khởi động JSON Server
3. Tạo Redux store + studentsSlice
4. Tạo studentApi service (Axios)
5. Cấu hình React Router
6. Build StudentListPage (HĐ1: fetch + display)
7. Build StudentCard component
8. Build StudentForm + thêm/xóa (HĐ2)
9. Build StudentDetailPage + StudentEditPage (HĐ3)
10. Polish: Loading/Error states, Form validation, Styling

---

*Tạo bởi: CONTEXT step — FER202 Assignment Workflow*
*Ngày: 2026-06-20*
