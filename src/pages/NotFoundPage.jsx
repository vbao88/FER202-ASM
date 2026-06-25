// src/pages/NotFoundPage.jsx
// Trang 404 — hiển thị khi không tìm thấy route

import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      textAlign: 'center',
      gap: '1.5rem',
      padding: '2rem',
    }}>
      <div style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 16px var(--accent-glow))', marginBottom: '0.5rem' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      </div>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
        letterSpacing: '-0.04em',
      }}>
        404
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
        Không tìm thấy trang này
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0' }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển sang địa chỉ khác.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => navigate('/')}
        id="btn-go-home"
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Về trang chủ
      </button>
    </div>
  );
}

export default NotFoundPage;
