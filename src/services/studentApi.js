// src/services/studentApi.js
// Axios instance và các hàm gọi API tới JSON Server

import axios from 'axios';

// Tạo axios instance với baseURL trỏ tới JSON Server
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Lấy toàn bộ danh sách sinh viên
 * GET /students
 */
export const fetchStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

/**
 * Lấy thông tin chi tiết 1 sinh viên theo id
 * GET /students/:id
 */
export const fetchStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

/**
 * Thêm sinh viên mới
 * POST /students
 */
export const addStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

/**
 * Cập nhật toàn bộ thông tin sinh viên
 * PUT /students/:id
 */
export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

/**
 * Xóa sinh viên theo id
 * DELETE /students/:id
 */
export const deleteStudent = async (id) => {
  await api.delete(`/students/${id}`);
  return id; // Trả về id để Redux cập nhật state
};
