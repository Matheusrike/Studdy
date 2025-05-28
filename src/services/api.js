import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

// Serviços para Professores
export const teacherService = {
    getAll: () => api.get('/admin/teachers'),
    getById: (id) => api.get(`/admin/teachers/${id}`),
    create: (data) => api.post('/admin/teachers', data),
    update: (id, data) => api.put(`/admin/teachers/${id}`, data),
    delete: (id) => api.delete(`/admin/teachers/${id}`),
};

// Serviços para Alunos
export const studentService = {
    getAll: () => api.get('/admin/students'),
    getById: (id) => api.get(`/admin/students/${id}`),
    create: (data) => api.post('/admin/students', data),
    update: (id, data) => api.put(`/admin/students/${id}`, data),
    delete: (id) => api.delete(`/admin/students/${id}`),
}; 