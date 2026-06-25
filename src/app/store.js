// src/app/store.js
// Redux Store — cấu hình global state cho toàn bộ ứng dụng

import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from '../features/students/studentsSlice';

const store = configureStore({
  reducer: {
    // Tất cả state sinh viên được quản lý bởi studentsSlice
    students: studentsReducer,
  },
});

export default store;
