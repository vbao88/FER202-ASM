// src/components/LoadingSpinner.jsx
// Component hiển thị trạng thái đang tải

function LoadingSpinner({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="spinner-wrapper" role="status" aria-label={message}>
      <div className="spinner" />
      <p className="spinner-text">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
