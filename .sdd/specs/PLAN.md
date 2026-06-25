# PLAN.md — Kế hoạch Triển khai Hệ thống Quản lý Sinh viên

## Tổng quan thứ tự

```
PHASE 0: Setup & Foundation
PHASE 1: Data Layer (JSON Server + Axios + Redux)
PHASE 2: Routing & Layout
PHASE 3: Feature — Danh sách sinh viên (HĐ1)
PHASE 4: Feature — Thêm & Xóa sinh viên (HĐ2)
PHASE 5: Feature — Chi tiết & Chỉnh sửa (HĐ3)
PHASE 6: Polish — Styling, Validation, Loading/Error
PHASE 7: Verify & Cleanup
```

---

## PHASE 0 — Setup & Foundation

### P0-1: Cài packages
```bash
npm install react-router-dom axios @reduxjs/toolkit react-redux
npm install -D json-server concurrently
```
**Output:** `node_modules` có đủ 4 packages chính

### P0-2: Cập nhật package.json scripts
**File:** `package.json`
```json
"dev": "vite",
"server": "json-server --watch db.json --port 3001",
"dev:all": "concurrently \"npm run dev\" \"npm run server\""
```

### P0-3: Tạo db.json
**File:** `db.json` (root directory)
- 5 sinh viên mẫu (như đã định nghĩa trong SPEC section 2.3)

### P0-4: Cập nhật index.css
**File:** `src/index.css`
- CSS variables (color palette)
- Google Fonts import (Inter)
- Reset + base styles
- Utility classes dùng chung

---

## PHASE 1 — Data Layer

### P1-1: Tạo Axios API Service
**File:** `src/services/studentApi.js`
- Axios instance với `baseURL: 'http://localhost:3001'`
- 5 functions: fetchStudents, fetchStudentById, addStudent, updateStudent, deleteStudent

### P1-2: Tạo Redux Store
**File:** `src/app/store.js`
- `configureStore` với reducer `students`

### P1-3: Tạo Students Slice
**File:** `src/features/students/studentsSlice.js`
- Initial state: `{ items: [], selectedStudent: null, loading: false, error: null }`
- 5 async thunks (createAsyncThunk)
- extraReducers cho pending/fulfilled/rejected của mỗi thunk
- 4 selectors

### P1-4: Wrap app với Provider
**File:** `src/main.jsx`
- Import store + Provider
- Wrap `<App />` với `<Provider store={store}>`

**Checkpoint ✓:** Redux DevTools hoạt động, không lỗi console

---

## PHASE 2 — Routing & Layout

### P2-1: Cài đặt React Router
**File:** `src/main.jsx`
- Wrap với `<BrowserRouter>`

### P2-2: Tạo cấu trúc thư mục
```
mkdir src/pages
mkdir src/components
mkdir src/app
mkdir src/features/students
mkdir src/services
```

### P2-3: Tạo placeholder pages
**Files:**
- `src/pages/StudentListPage.jsx` — tạm `<div>List</div>`
- `src/pages/StudentDetailPage.jsx` — tạm `<div>Detail</div>`
- `src/pages/StudentEditPage.jsx` — tạm `<div>Edit</div>`
- `src/pages/NotFoundPage.jsx` — 404 page

### P2-4: Cấu hình Routes
**File:** `src/App.jsx`
```jsx
<Routes>
  <Route path="/" element={<StudentListPage />} />
  <Route path="/students/:id" element={<StudentDetailPage />} />
  <Route path="/students/:id/edit" element={<StudentEditPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### P2-5: Tạo Navbar
**File:** `src/components/Navbar.jsx`
- Logo + tên app
- Link về trang chủ
- Style cố định top

**Checkpoint ✓:** Navigate giữa `/`, `/students/1`, `/students/1/edit` hoạt động

---

## PHASE 3 — Danh sách Sinh viên (HĐ1 — 2 điểm)

### P3-1: Tạo LoadingSpinner component
**File:** `src/components/LoadingSpinner.jsx`
- CSS spinner animation
- Props: `{ message }`

### P3-2: Tạo ErrorMessage component
**File:** `src/components/ErrorMessage.jsx`
- Icon lỗi + message
- Nút "Thử lại" (optional onRetry)

### P3-3: Tạo StudentCard component
**File:** `src/components/StudentCard.jsx`
- Props: `{ student, onDelete }`
- Hiển thị: avatar, tên, mã SV, ngành, mô tả (truncate), GPA progress bar, điểm HK
- Nút "Xem chi tiết" + "Xóa"
- Hover animation

### P3-4: Implement StudentListPage — fetch & display
**File:** `src/pages/StudentListPage.jsx`
- `useDispatch` + `useSelector`
- `useEffect` → `dispatch(fetchStudents())`
- Render: loading → `<LoadingSpinner />`, error → `<ErrorMessage />`, data → grid cards
- Map danh sách → `<StudentCard />`

**Checkpoint ✓:** Danh sách 5 sinh viên hiển thị, loading spinner xuất hiện khi fetch, error state khi tắt JSON Server

---

## PHASE 4 — Thêm & Xóa Sinh viên (HĐ2 — 3 điểm)

### P4-1: Tạo StudentForm component
**File:** `src/components/StudentForm.jsx`
- Props: `{ initialData, onSubmit, onCancel, loading }`
- 7 controlled fields
- Local state cho form values + errors
- Validation logic (validateField function)
- Submit handler: validate all → call onSubmit

### P4-2: Tích hợp form thêm vào StudentListPage
**File:** `src/pages/StudentListPage.jsx`
- State `showForm` (toggle hiển thị form)
- Nút "➕ Thêm Sinh Viên" → toggle form
- Render `<StudentForm />` khi showForm = true
- `handleAddStudent`: dispatch `addStudent(formData)` → đóng form

### P4-3: Tích hợp chức năng xóa
**File:** `src/pages/StudentListPage.jsx`
- `handleDeleteStudent(id)`:
  - `window.confirm("Bạn có chắc muốn xóa?")`
  - dispatch `deleteStudent(id)`
- Truyền `onDelete={handleDeleteStudent}` xuống StudentCard

**Checkpoint ✓:**
- Form thêm hoạt động, sinh viên mới xuất hiện trong danh sách
- Validation hiển thị đúng lỗi
- Xóa sinh viên → biến mất khỏi danh sách ngay lập tức

---

## PHASE 5 — Chi tiết & Chỉnh sửa (HĐ3 — 2 điểm)

### P5-1: Implement StudentDetailPage
**File:** `src/pages/StudentDetailPage.jsx`
- `useParams()` lấy `id`
- `useEffect` → dispatch `fetchStudentById(id)`
- Loading + Error state
- Hiển thị đầy đủ thông tin: avatar lớn, tất cả fields, progress bars
- Nút "← Quay lại" → `navigate('/')`
- Nút "✏️ Chỉnh sửa" → `navigate('/students/:id/edit')`

### P5-2: Implement StudentEditPage
**File:** `src/pages/StudentEditPage.jsx`
- `useParams()` lấy `id`
- `useEffect` → dispatch `fetchStudentById(id)` nếu chưa có
- Render `<StudentForm initialData={selectedStudent} />`
- `handleUpdate(formData)`:
  - dispatch `updateStudent({ id, ...formData })`
  - `.unwrap()` → thành công → `navigate('/students/${id}')`

**Checkpoint ✓:**
- `/students/1` hiển thị chi tiết đúng
- `/students/1/edit` form điền sẵn dữ liệu
- Submit → cập nhật thành công → redirect về detail

---

## PHASE 6 — Polish & Styling

### P6-1: Global CSS Design System
**File:** `src/index.css`
- CSS variables đầy đủ
- Navbar styles
- Card styles (glassmorphism)
- Form + input styles
- Button variants (primary, danger, secondary)
- Grid layout responsive
- Progress bar styles
- Animation keyframes (spin, fadeIn, slideUp)
- Loading spinner
- Error message styles

### P6-2: Responsive Layout
- Mobile: 1 cột
- Tablet (≥ 640px): 2 cột
- Desktop (≥ 1024px): 3 cột

### P6-3: NotFoundPage styling
**File:** `src/pages/NotFoundPage.jsx`
- 404 với emoji + message + link về trang chủ

### P6-4: Kiểm tra tất cả Acceptance Criteria
- AC-01 đến AC-11 (theo SPEC section 9)

---

## PHASE 7 — Verify & Cleanup

### P7-1: Chạy toàn bộ luồng
- Start `npm run dev:all`
- Test CRUD đầy đủ
- Test navigation router
- Test validation
- Test error state (tắt JSON Server)

### P7-2: Code cleanup
- Xóa console.log dư thừa
- Thêm comment giải thích (chuẩn bị vấn đáp)
- Đảm bảo không có unused imports

### P7-3: Cập nhật README.md
- Hướng dẫn cài đặt và chạy project

---

## Sơ đồ phụ thuộc file

```
main.jsx
  └── store.js
  └── App.jsx
        └── Navbar.jsx
        └── StudentListPage.jsx
              └── LoadingSpinner.jsx
              └── ErrorMessage.jsx
              └── StudentCard.jsx
              └── StudentForm.jsx
        └── StudentDetailPage.jsx
              └── LoadingSpinner.jsx
              └── ErrorMessage.jsx
        └── StudentEditPage.jsx
              └── StudentForm.jsx
              └── LoadingSpinner.jsx

store.js
  └── studentsSlice.js
        └── studentApi.js
```

---

## Thứ tự tạo file (có phụ thuộc)

| Thứ tự | File | Lý do |
|--------|------|-------|
| 1 | `db.json` | JSON Server cần trước |
| 2 | `src/services/studentApi.js` | Redux thunks gọi hàm này |
| 3 | `src/features/students/studentsSlice.js` | store cần slice |
| 4 | `src/app/store.js` | Provider cần store |
| 5 | `src/index.css` | Design system trước khi build UI |
| 6 | `src/main.jsx` | Wrap Provider + BrowserRouter |
| 7 | `src/components/Navbar.jsx` | Layout cần trước pages |
| 8 | `src/App.jsx` | Routing |
| 9 | `src/components/LoadingSpinner.jsx` | Pages dùng |
| 10 | `src/components/ErrorMessage.jsx` | Pages dùng |
| 11 | `src/components/StudentCard.jsx` | List page dùng |
| 12 | `src/components/StudentForm.jsx` | List + Edit page dùng |
| 13 | `src/pages/StudentListPage.jsx` | HĐ1 + HĐ2 |
| 14 | `src/pages/StudentDetailPage.jsx` | HĐ3 |
| 15 | `src/pages/StudentEditPage.jsx` | HĐ3 |
| 16 | `src/pages/NotFoundPage.jsx` | 404 |

---

## Ước tính

| Phase | Files | Độ ưu tiên |
|-------|-------|-----------|
| P0: Setup | 3 files | 🔴 Bắt buộc đầu tiên |
| P1: Data Layer | 3 files | 🔴 Bắt buộc |
| P2: Routing | 6 files | 🔴 Bắt buộc |
| P3: HĐ1 List | 4 files | 🔴 2 điểm |
| P4: HĐ2 Add/Delete | 1 file (update) | 🔴 3 điểm |
| P5: HĐ3 Detail/Edit | 2 files | 🔴 2 điểm |
| P6: Polish | CSS + cleanup | 🟡 Quan trọng cho vấn đáp |
| P7: Verify | Testing | 🟡 |

