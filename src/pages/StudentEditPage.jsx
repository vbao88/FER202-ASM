// src/pages/StudentEditPage.jsx
// Trang chỉnh sửa sinh viên — HĐ3 (1đ: Edit + PUT + navigate)

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudentById,
  updateStudent,
  selectSelectedStudent,
  selectLoading,
  selectError,
} from '../features/students/studentsSlice';
import StudentForm from '../components/StudentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function StudentEditPage() {
  const { id } = useParams();       // Lấy id từ URL: /students/:id/edit
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector(selectSelectedStudent);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Fetch thông tin sinh viên nếu chưa có trong store
  useEffect(() => {
    if (!student || String(student.id) !== String(id)) {
      dispatch(fetchStudentById(id));
    }
  }, [dispatch, id, student]);

  // Xử lý submit form chỉnh sửa — gửi PUT request
  const handleUpdate = async (formData) => {
    const result = await dispatch(updateStudent({ id, ...formData }));

    // Nếu cập nhật thành công → chuyển về trang chi tiết
    if (updateStudent.fulfilled.match(result)) {
      navigate(`/students/${id}`);
    }
  };

  if (loading && !student) return <LoadingSpinner message="Đang tải thông tin sinh viên..." />;

  if (error) return (
    <div className="page-wrapper">
      <ErrorMessage message={error} onRetry={() => dispatch(fetchStudentById(id))} />
    </div>
  );

  if (!student) return null;

  return (
    <main className="page-wrapper" style={{ maxWidth: '700px' }}>
      {/* Nút quay lại trang chi tiết */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(`/students/${id}`)}
        id="btn-back-to-detail"
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Quay lại chi tiết
      </button>

      {/* Card chỉnh sửa */}
      <div className="card fade-in" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="page-title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
            </svg>
            Chỉnh sửa Sinh Viên
          </h1>
          <p className="page-subtitle">
            Cập nhật thông tin cho: <strong style={{ color: 'var(--accent-light)' }}>{student.name}</strong>
          </p>
        </div>

        <hr className="divider" />

        {/* Form điền sẵn dữ liệu sinh viên hiện tại (pre-populate) */}
        <StudentForm
          key={student.id}
          initialData={student}
          onSubmit={handleUpdate}
          onCancel={() => navigate(`/students/${id}`)}
          loading={loading}
        />
      </div>
    </main>
  );
}

export default StudentEditPage;
