// src/App.jsx
// Root component — cấu hình React Router và layout chung

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import StudentEditPage from './pages/StudentEditPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      {/* Thanh điều hướng cố định */}
      <Navbar />

      {/* Định nghĩa các routes */}
      <Routes>
        {/* Trang chủ: Danh sách + Thêm/Xóa sinh viên */}
        <Route path="/" element={<StudentListPage />} />

        {/* Trang chi tiết sinh viên */}
        <Route path="/students/:id" element={<StudentDetailPage />} />

        {/* Trang chỉnh sửa sinh viên */}
        <Route path="/students/:id/edit" element={<StudentEditPage />} />

        {/* Trang 404 cho mọi route không hợp lệ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
