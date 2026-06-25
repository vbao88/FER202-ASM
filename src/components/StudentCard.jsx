// src/components/StudentCard.jsx
// Card hiển thị thông tin tóm tắt của 1 sinh viên trong danh sách

import { useNavigate } from 'react-router-dom';

/**
 * Tính class màu cho progress bar dựa trên giá trị GPA
 * GPA: 0-4.0 → thấp (<2), trung bình (<3), cao (>=3)
 */
function getGpaClass(gpa) {
  if (gpa >= 3.0) return 'progress-gpa-high';
  if (gpa >= 2.0) return 'progress-gpa-mid';
  return 'progress-gpa-low';
}

/**
 * Tính class màu cho progress bar dựa trên điểm học kỳ
 * Score: 0-10 → thấp (<5), trung bình (<7), cao (>=7)
 */
function getScoreClass(score) {
  if (score >= 7.0) return 'progress-score-high';
  if (score >= 5.0) return 'progress-score-mid';
  return 'progress-score-low';
}

/**
 * Tính badge xếp loại học lực
 */
function getAcademicRank(gpa) {
  if (gpa >= 3.6) return { label: 'Xuất sắc', className: 'badge-success' };
  if (gpa >= 3.2) return { label: 'Giỏi', className: 'badge-primary' };
  if (gpa >= 2.5) return { label: 'Khá', className: 'badge-warning' };
  return { label: 'Trung bình', className: 'badge-danger' };
}

function StudentCard({ student, onDelete }) {
  const navigate = useNavigate();
  const rank = getAcademicRank(student.gpa);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      {/* Avatar + Tên + Mã SV */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
        <img
          src={student.avatar}
          alt={`Avatar của ${student.name}`}
          className="avatar avatar-md"
          onError={(e) => {
            // Fallback nếu ảnh lỗi (sử dụng màu accent --accent-dark/light thay vì AI-purple)
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff&size=80`;
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.2rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {student.name}
          </h3>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="7" y1="16" x2="13" y2="16" />
            </svg>
            {student.studentId}
          </p>
          <span className={`badge ${rank.className}`}>{rank.label}</span>
        </div>
      </div>

      {/* Ngành học */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--accent-light)',
          fontWeight: '600',
          marginBottom: '0.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.8 }}
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {student.major}
        </p>
        {/* Mô tả — giới hạn 2 dòng */}
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.5',
        }}>
          {student.description}
        </p>
      </div>

      {/* GPA Progress bar */}
      <div className="progress-bar-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        <div className="progress-bar-label">
          <span>GPA tích lũy</span>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
            {student.gpa.toFixed(1)} / 4.0
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${getGpaClass(student.gpa)}`}
            style={{ width: `${(student.gpa / 4.0) * 100}%` }}
          />
        </div>
      </div>

      {/* Điểm HK Progress bar */}
      <div className="progress-bar-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        <div className="progress-bar-label">
          <span>Điểm học kỳ</span>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
            {student.semesterScore.toFixed(1)} / 10
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${getScoreClass(student.semesterScore)}`}
            style={{ width: `${(student.semesterScore / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 1, marginTop: 'auto' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1, gap: '0.35rem' }}
          onClick={() => navigate(`/students/${student.id}`)}
          id={`btn-view-${student.id}`}
          aria-label={`Xem chi tiết ${student.name}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Xem chi tiết
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(student.id)}
          id={`btn-delete-${student.id}`}
          aria-label={`Xóa ${student.name}`}
          title="Xóa sinh viên"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
