// src/pages/StudentListPage.jsx
// Trang chính: Danh sách sinh viên + Thêm + Xóa
// Bao gồm: HĐ1 (2đ) + HĐ2 (3đ)

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudents,
  addStudent,
  deleteStudent,
  clearError,
  selectAllStudents,
  selectLoading,
  selectError,
} from '../features/students/studentsSlice';
import StudentCard from '../components/StudentCard';
import StudentForm from '../components/StudentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function StudentListPage() {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const students = useSelector(selectAllStudents);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // State local: hiển thị/ẩn modal form thêm
  const [showForm, setShowForm] = useState(false);

  // Lỗi riêng cho thao tác add/delete (không che toàn bộ danh sách)
  const [actionError, setActionError] = useState(null);

  // HĐ1: Gọi API lấy danh sách sinh viên khi component mount
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Xóa actionError sau 4 giây tự động
  useEffect(() => {
    if (!actionError) return;
    const timer = setTimeout(() => setActionError(null), 4000);
    return () => clearTimeout(timer);
  }, [actionError]);

  // HĐ2: Xử lý thêm sinh viên mới
  const handleAddStudent = async (formData) => {
    setActionError(null);
    dispatch(clearError()); // Xóa lỗi cũ trong Redux
    const result = await dispatch(addStudent(formData));
    if (addStudent.fulfilled.match(result)) {
      setShowForm(false); // Đóng form nếu thành công
    } else {
      // Hiển thị lỗi nhỏ bên trong modal, không che danh sách
      setActionError(result.payload || 'Không thể thêm sinh viên. Vui lòng thử lại.');
    }
  };

  // HĐ2: Xử lý xóa sinh viên
  const handleDeleteStudent = (id) => {
    const student = students.find((s) => String(s.id) === String(id));
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sinh viên "${student?.name}"?\nHành động này không thể hoàn tác.`
    );
    if (confirmed) {
      dispatch(deleteStudent(id));
    }
  };

  // Chỉ là lần đầu load (chưa có data gì)
  const isInitialLoading = loading && students.length === 0;
  // Lỗi fetch ban đầu (chưa có data nào)
  const isFetchError = error && students.length === 0;

  return (
    <main className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh sách Sinh viên</h1>
          <p className="page-subtitle">Quản lý hồ sơ và thông tin học tập của sinh viên</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Badge số lượng sinh viên */}
          {students.length > 0 && (
            <span className="student-count-badge">
              {students.length} sinh viên
            </span>
          )}
          {/* Nút mở form thêm sinh viên */}
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(true); setActionError(null); }}
            id="btn-open-add-form"
            aria-label="Mở form thêm sinh viên"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm sinh viên
          </button>
        </div>
      </div>

      {/* HĐ1: Hiển thị danh sách hoặc trạng thái loading/error */}
      {isInitialLoading ? (
        // Loading lần đầu (chưa có data)
        <LoadingSpinner message="Đang tải danh sách sinh viên..." />
      ) : isFetchError ? (
        // Lỗi fetch (chưa có data) — hiển thị toàn màn hình error
        <ErrorMessage
          message={error}
          onRetry={() => { dispatch(clearError()); dispatch(fetchStudents()); }}
        />
      ) : students.length === 0 ? (
        // Danh sách trống
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <h3 className="empty-state-title">Danh sách trống</h3>
          <p className="empty-state-desc">Chưa có sinh viên nào. Hãy thêm sinh viên đầu tiên!</p>
        </div>
      ) : (
        // HĐ1: Render danh sách dùng map()
        <div className="student-grid">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDeleteStudent}
            />
          ))}
        </div>
      )}

      {/* HĐ2: Modal form thêm sinh viên */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box slide-up">
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="17" y1="11" x2="23" y2="11" />
                </svg>
                Thêm sinh viên mới
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Đóng form"
                id="btn-close-form"
              >
                ✕
              </button>
            </div>

            {/* Thông báo lỗi khi add thất bại — hiển thị trong modal */}
            {actionError && (
              <div className="alert-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {actionError}
              </div>
            )}

            <StudentForm
              initialData={null}
              onSubmit={handleAddStudent}
              onCancel={() => setShowForm(false)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default StudentListPage;
