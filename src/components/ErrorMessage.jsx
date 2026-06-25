// src/components/ErrorMessage.jsx
// Component hiển thị thông báo lỗi

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-wrapper" role="alert">
      <div className="error-icon-block">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3 className="error-title">Đã xảy ra lỗi</h3>
      <p className="error-message">{message}</p>
      {/* Hiển thị nút thử lại nếu có callback */}
      {onRetry && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRetry}
          id="btn-retry"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Thử lại
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
