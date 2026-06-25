// src/components/Navbar.jsx
// Thanh điều hướng cố định phía trên

import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo + Tên ứng dụng */}
        <div
          className="navbar-brand"
          onClick={() => navigate('/')}
          role="button"
          aria-label="Về trang chủ"
        >
          <div className="navbar-brand-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <span className="navbar-brand-text">
            Student <span>Manager</span>
          </span>
        </div>

        {/* Navigation links */}
        <div className="navbar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg>
            Danh sách sinh viên
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
