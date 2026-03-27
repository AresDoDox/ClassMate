import axios from 'axios';

// Cấu hình Base URL mặc định là port 3001 (Backend NestJS)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// THÊM INTERCEPTOR: Tự động đính kèm Token trước khi Request bay đi
api.interceptors.request.use(
  (config) => {
    // Đọc token độc quyền từ localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    // Nếu có token thì nhét vào header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Bắt lỗi toàn cục khi Response trả về (Vd: Token hết hạn => đá về Login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Lỗi xác thực: 401 Unauthorized');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
