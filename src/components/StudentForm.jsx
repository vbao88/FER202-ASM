// src/components/StudentForm.jsx
// Form thêm/chỉnh sửa sinh viên — có validation + upload ảnh từ máy (Controlled Component)

import { useState, useRef } from 'react';

// Giá trị mặc định cho form trống
const emptyForm = {
  name: '',
  studentId: '',
  major: '',
  description: '',
  avatar: '',
  gpa: '',
  semesterScore: '',
};

/**
 * Validate từng field — trả về thông báo lỗi hoặc chuỗi rỗng nếu hợp lệ
 */
function validateField(name, value) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Họ và tên không được để trống';
      if (value.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
      if (value.trim().length > 100) return 'Họ và tên không được quá 100 ký tự';
      return '';

    case 'studentId':
      if (!value.trim()) return 'Mã sinh viên không được để trống';
      if (!/^[A-Z]{2}\d{6}$/.test(value.trim()))
        return 'Mã SV phải có dạng: 2 chữ hoa + 6 số (VD: SE180001)';
      return '';

    case 'major':
      if (!value.trim()) return 'Ngành học không được để trống';
      if (value.trim().length < 2) return 'Ngành học phải có ít nhất 2 ký tự';
      return '';

    case 'description':
      if (!value.trim()) return 'Mô tả không được để trống';
      if (value.trim().length < 10) return 'Mô tả phải có ít nhất 10 ký tự';
      return '';

    case 'avatar':
      if (!value.trim()) return 'Ảnh đại diện không được để trống';
      // Chấp nhận cả URL http/https và data URL từ file upload
      if (!/^(https?:\/\/.+|data:image\/.+)/.test(value.trim()))
        return 'Vui lòng nhập URL hợp lệ (http/https) hoặc chọn ảnh từ máy';
      return '';

    case 'gpa': {
      const num = parseFloat(value);
      if (value === '' || value === null) return 'GPA không được để trống';
      if (isNaN(num)) return 'GPA phải là số';
      if (num < 0 || num > 4.0) return 'GPA phải trong khoảng 0.0 – 4.0';
      return '';
    }

    case 'semesterScore': {
      const num = parseFloat(value);
      if (value === '' || value === null) return 'Điểm học kỳ không được để trống';
      if (isNaN(num)) return 'Điểm học kỳ phải là số';
      if (num < 0 || num > 10) return 'Điểm học kỳ phải trong khoảng 0 – 10';
      return '';
    }

    default:
      return '';
  }
}

/**
 * Validate toàn bộ form — trả về object errors
 */
function validateAll(formData) {
  const errors = {};
  Object.keys(emptyForm).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) errors[key] = error;
  });
  return errors;
}

/**
 * StudentForm Component
 * @param {Object} initialData - Dữ liệu ban đầu (null = form trống, có data = chỉnh sửa)
 * @param {Function} onSubmit - Callback khi submit thành công
 * @param {Function} onCancel - Callback khi hủy
 * @param {boolean} loading - Đang xử lý (disable nút submit)
 */
function StudentForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const fileInputRef = useRef(null);

  // Tab chọn kiểu nhập ảnh: 'upload' | 'url' — mặc định 'url' nếu ảnh ban đầu là link http
  const [avatarMode, setAvatarMode] = useState(
    initialData?.avatar?.startsWith('http') ? 'url' : 'upload'
  );

  // State form — nếu có initialData thì điền sẵn (pre-populate cho trang Edit)
  // Lưu ý: StudentEditPage truyền key={student.id} nên form sẽ remount khi đổi sinh viên
  const [formData, setFormData] = useState(
    initialData
      ? { ...initialData, gpa: String(initialData.gpa), semesterScore: String(initialData.semesterScore) }
      : emptyForm
  );

  // State lỗi validation
  const [errors, setErrors] = useState({});

  // State theo dõi field nào đã được touch (onBlur)
  const [touched, setTouched] = useState({});

  // Xử lý thay đổi input — cập nhật giá trị và validate ngay nếu đã touched
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Khi rời khỏi field — đánh dấu touched và validate
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  /**
   * Nén ảnh bằng Canvas API trước khi chuyển sang base64
   * Giá trị tối đa: 300x300px, JPEG 75% => thường 10-40KB
   */
  const compressImage = (file, maxSize = 300, quality = 0.75) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl); // giải phóng bộ nhớ
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down nếu ảnh lớn hơn maxSize
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height / width) * maxSize);
            width = maxSize;
          } else {
            width = Math.round((width / height) * maxSize);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = objectUrl;
    });
  };

  /**
   * Xử lý khi người dùng chọn file ảnh từ máy
   * Nén ảnh trước khi chuyển đổi thành base64 dữ liệu URL
   */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatar: 'File phải là ảnh (jpg, png, gif, webp...)' }));
      return;
    }

    // Kiểm tra kích thước file (giới hạn 5MB trước khi nén)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'Kích thước ảnh không được vượt quá 5MB' }));
      return;
    }

    try {
      // Nén ảnh xuống tối đa 300x300px, JPEG 75%
      const compressed = await compressImage(file, 300, 0.75);
      setFormData((prev) => ({ ...prev, avatar: compressed }));
      setErrors((prev) => ({ ...prev, avatar: '' }));
      setTouched((prev) => ({ ...prev, avatar: true }));
    } catch {
      setErrors((prev) => ({ ...prev, avatar: 'Không thể đọc file ảnh' }));
    }
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Đánh dấu tất cả fields là touched
    const allTouched = Object.keys(emptyForm).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validate toàn bộ
    const allErrors = validateAll(formData);
    setErrors(allErrors);

    // Nếu có lỗi thì dừng
    if (Object.values(allErrors).some((e) => e !== '')) return;

    // Chuyển đổi kiểu dữ liệu trước khi gửi
    const payload = {
      ...formData,
      name: formData.name.trim(),
      studentId: formData.studentId.trim(),
      major: formData.major.trim(),
      description: formData.description.trim(),
      avatar: formData.avatar.trim(),
      gpa: parseFloat(formData.gpa),
      semesterScore: parseFloat(formData.semesterScore),
    };

    onSubmit(payload);
  };

  const isEditMode = Boolean(initialData);

  // Ảnh preview hiện tại (Teal accent background 0ea5e9 thay cho 6366f1)
  const avatarPreview = formData.avatar
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'SV')}&background=0ea5e9&color=fff&size=90`;

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* === AVATAR UPLOAD === */}
      <div className="form-group">
        <label className="form-label">Ảnh đại diện *</label>

        {/* Preview ảnh hiện tại */}
        <div className="avatar-upload-wrapper">
          <div
            className="avatar-upload-preview"
            onClick={() => avatarMode === 'upload' && fileInputRef.current?.click()}
            title={avatarMode === 'upload' ? 'Nhấn để chọn ảnh' : ''}
          >
            <img
              src={avatarPreview}
              alt="Preview ảnh đại diện"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'SV')}&background=0ea5e9&color=fff&size=90`;
              }}
            />
            {avatarMode === 'upload' && (
              <div className="avatar-upload-overlay">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Tab chọn kiểu nhập */}
        <div className="avatar-tabs">
          <button
            type="button"
            className={`avatar-tab ${avatarMode === 'upload' ? 'active' : ''}`}
            onClick={() => setAvatarMode('upload')}
            id="tab-upload-file"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Chọn từ máy
          </button>
          <button
            type="button"
            className={`avatar-tab ${avatarMode === 'url' ? 'active' : ''}`}
            onClick={() => setAvatarMode('url')}
            id="tab-enter-url"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Nhập URL
          </button>
        </div>

        {/* Input ẩn để chọn file */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="avatar-file-input"
          onChange={handleFileChange}
          id="avatar-file-input"
        />

        {/* Hiển thị theo tab */}
        {avatarMode === 'upload' ? (
          <button
            type="button"
            className="avatar-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            id="btn-choose-file"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Chọn ảnh từ máy tính
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              (JPG, PNG, GIF — tối đa 5MB)
            </span>
          </button>
        ) : (
          <input
            id="avatar-url"
            name="avatar"
            type="url"
            className={`form-input ${errors.avatar && touched.avatar ? 'error' : ''}`}
            value={formData.avatar.startsWith('data:') ? '' : formData.avatar}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://i.pravatar.cc/150?img=1"
          />
        )}

        {errors.avatar && touched.avatar && (
          <span className="form-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.avatar}
          </span>
        )}
      </div>

      {/* Row 1: Họ tên + Mã SV */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Họ và tên *</label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nguyễn Văn An"
          />
          {errors.name && touched.name && (
            <span className="form-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="studentId" className="form-label">Mã sinh viên *</label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            className={`form-input ${errors.studentId && touched.studentId ? 'error' : ''}`}
            value={formData.studentId}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="SE180001"
          />
          {errors.studentId && touched.studentId && (
            <span className="form-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.studentId}
            </span>
          )}
        </div>
      </div>

      {/* Ngành học */}
      <div className="form-group">
        <label htmlFor="major" className="form-label">Ngành học *</label>
        <input
          id="major"
          name="major"
          type="text"
          className={`form-input ${errors.major && touched.major ? 'error' : ''}`}
          value={formData.major}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Software Engineering"
        />
        {errors.major && touched.major && (
          <span className="form-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.major}
          </span>
        )}
      </div>

      {/* Mô tả */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">Mô tả *</label>
        <textarea
          id="description"
          name="description"
          className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Mô tả ngắn về sinh viên..."
          rows={3}
        />
        {errors.description && touched.description && (
          <span className="form-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.description}
          </span>
        )}
      </div>

      {/* GPA + Điểm học kỳ */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="gpa" className="form-label">GPA tích lũy * (0.0 – 4.0)</label>
          <input
            id="gpa"
            name="gpa"
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            className={`form-input ${errors.gpa && touched.gpa ? 'error' : ''}`}
            value={formData.gpa}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="3.5"
          />
          {errors.gpa && touched.gpa && (
            <span className="form-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.gpa}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="semesterScore" className="form-label">Điểm học kỳ * (0 – 10)</label>
          <input
            id="semesterScore"
            name="semesterScore"
            type="number"
            step="0.1"
            min="0"
            max="10"
            className={`form-input ${errors.semesterScore && touched.semesterScore ? 'error' : ''}`}
            value={formData.semesterScore}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="8.5"
          />
          {errors.semesterScore && touched.semesterScore && (
            <span className="form-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.semesterScore}
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
          id="btn-cancel-form"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          id={isEditMode ? 'btn-update-student' : 'btn-add-student'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          {loading ? (
            <>
              <svg className="spinner-compact" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 0.75s linear infinite', marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
              Đang xử lý...
            </>
          ) : isEditMode ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Lưu thay đổi
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Thêm sinh viên
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
