// src/pages/StudentDetailPage.jsx
// Trang chi tiết sinh viên — HĐ3 (0.5đ)

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudentById,
  deleteStudent,
  clearSelectedStudent,
  selectSelectedStudent,
  selectLoading,
  selectError,
} from '../features/students/studentsSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Tính màu và class cho progress bar GPA
 */
function getGpaClass(gpa) {
  if (gpa >= 3.0) return 'progress-gpa-high';
  if (gpa >= 2.0) return 'progress-gpa-mid';
  return 'progress-gpa-low';
}

function getScoreClass(score) {
  if (score >= 7.0) return 'progress-score-high';
  if (score >= 5.0) return 'progress-score-mid';
  return 'progress-score-low';
}

function getAcademicRank(gpa) {
  if (gpa >= 3.6) return { label: 'Xuất sắc', className: 'badge-success' };
  if (gpa >= 3.2) return { label: 'Giỏi', className: 'badge-primary' };
  if (gpa >= 2.5) return { label: 'Khá', className: 'badge-warning' };
  return { label: 'Trung bình', className: 'badge-danger' };
}

function StudentDetailPage() {
  const { id } = useParams();         // Lấy id từ URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector(selectSelectedStudent);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Fetch sinh viên theo id khi component mount
  useEffect(() => {
    dispatch(fetchStudentById(id));

    // Cleanup: xóa selectedStudent khi rời trang
    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch, id]);

  // Xử lý xóa từ trang chi tiết
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sinh viên "${student?.name}"?\nHành động này không thể hoàn tác.`
    );
    if (confirmed) {
      const result = await dispatch(deleteStudent(id));
      if (deleteStudent.fulfilled.match(result)) {
        navigate('/'); // Về trang chủ sau khi xóa
      }
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải thông tin sinh viên..." />;
  if (error) return (
    <div className="page-wrapper">
      <ErrorMessage message={error} onRetry={() => dispatch(fetchStudentById(id))} />
    </div>
  );
  if (!student) return null;

  const rank = getAcademicRank(student.gpa);

  return (
    <main className="page-wrapper" style={{ maxWidth: '800px' }}>
      {/* Nút quay lại */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate('/')}
        id="btn-back-to-list"
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Quay lại danh sách
      </button>

      {/* Card chi tiết */}
      <div className="card fade-in" style={{ padding: '2rem' }}>
        {/* Header: Avatar + Tên + Badge */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <img
            src={student.avatar}
            alt={`Avatar của ${student.name}`}
            className="avatar avatar-xl"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff&size=160`;
            }}
          />
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              {student.name}
            </h1>
            <span className={`badge ${rank.className}`} style={{ fontSize: '0.9rem', padding: '0.3rem 1rem' }}>
              {rank.label}
            </span>
          </div>
        </div>

        <hr className="divider" />

        {/* Thông tin chi tiết */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="info-block">
            <p className="info-label">Mã sinh viên</p>
            <p className="info-value mono" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="16" x2="13" y2="16" />
              </svg>
              {student.studentId}
            </p>
          </div>
          <div className="info-block">
            <p className="info-label">Ngành học</p>
            <p className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {student.major}
            </p>
          </div>
        </div>

        {/* Mô tả */}
        <div className="info-block" style={{ marginBottom: '1.5rem' }}>
          <p className="info-label">Mô tả</p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {student.description}
          </p>
        </div>

        {/* GPA Progress bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div className="progress-bar-wrapper">
            <div className="progress-bar-label">
              <span style={{ fontWeight: '600' }}>GPA tích lũy</span>
              <span className="progress-value">
                {student.gpa.toFixed(1)} / 4.0
              </span>
            </div>
            <div className="progress-bar-track" style={{ height: '8px' }}>
              <div
                className={`progress-bar-fill ${getGpaClass(student.gpa)}`}
                style={{ width: `${(student.gpa / 4.0) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Điểm HK Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="progress-bar-wrapper">
            <div className="progress-bar-label">
              <span style={{ fontWeight: '600' }}>Điểm học kỳ</span>
              <span className="progress-value">
                {student.semesterScore.toFixed(1)} / 10
              </span>
            </div>
            <div className="progress-bar-track" style={{ height: '8px' }}>
              <div
                className={`progress-bar-fill ${getScoreClass(student.semesterScore)}`}
                style={{ width: `${(student.semesterScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(`/students/${student.id}/edit`)}
            id="btn-edit-student"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
            </svg>
            Chỉnh sửa
          </button>
          <button
            className="btn btn-danger btn-lg"
            onClick={handleDelete}
            id="btn-delete-student-detail"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Xóa sinh viên
          </button>
        </div>
      </div>
    </main>
  );
}

export default StudentDetailPage;
