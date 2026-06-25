// src/features/students/studentsSlice.js
// Redux slice quản lý state sinh viên với async thunks

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as studentApi from '../../services/studentApi';

// ============================================================
// ASYNC THUNKS — Gọi API bất đồng bộ
// ============================================================

/**
 * Thunk: Lấy toàn bộ danh sách sinh viên
 */
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApi.fetchStudents();
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể tải danh sách sinh viên');
    }
  }
);

/**
 * Thunk: Lấy 1 sinh viên theo id
 */
export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await studentApi.fetchStudentById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể tải thông tin sinh viên');
    }
  }
);

/**
 * Thunk: Thêm sinh viên mới
 */
export const addStudent = createAsyncThunk(
  'students/add',
  async (studentData, { rejectWithValue }) => {
    try {
      return await studentApi.addStudent(studentData);
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể thêm sinh viên');
    }
  }
);

/**
 * Thunk: Cập nhật sinh viên
 */
export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, ...studentData }, { rejectWithValue }) => {
    try {
      return await studentApi.updateStudent(id, studentData);
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể cập nhật sinh viên');
    }
  }
);

/**
 * Thunk: Xóa sinh viên
 */
export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await studentApi.deleteStudent(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể xóa sinh viên');
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  items: [],              // Danh sách tất cả sinh viên
  selectedStudent: null,  // Sinh viên đang xem chi tiết / chỉnh sửa
  loading: false,         // Trạng thái đang tải
  error: null,            // Thông báo lỗi
};

// ============================================================
// SLICE
// ============================================================

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    // Xóa sinh viên đang được chọn (khi rời trang detail)
    clearSelectedStudent(state) {
      state.selectedStudent = null;
    },
    // Xóa thông báo lỗi
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---- fetchStudents ----
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---- fetchStudentById ----
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---- addStudent ----
    builder
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Thêm sinh viên mới vào danh sách
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---- updateStudent ----
    builder
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật sinh viên trong danh sách (so sánh id an toàn theo kiểu)
        const index = state.items.findIndex((s) => String(s.id) === String(action.payload.id));
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedStudent = action.payload;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---- deleteStudent ----
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa sinh viên khỏi danh sách theo id (so sánh an toàn theo kiểu)
        state.items = state.items.filter((s) => String(s.id) !== String(action.payload));
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================
export const { clearSelectedStudent, clearError } = studentsSlice.actions;

// ============================================================
// SELECTORS — Lấy dữ liệu từ Redux state
// ============================================================
export const selectAllStudents = (state) => state.students.items;
export const selectSelectedStudent = (state) => state.students.selectedStudent;
export const selectLoading = (state) => state.students.loading;
export const selectError = (state) => state.students.error;

export default studentsSlice.reducer;
