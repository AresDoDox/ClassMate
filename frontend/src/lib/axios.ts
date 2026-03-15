import axios from 'axios';
import Cookies from 'js-cookie';

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
    // Lấy token từ Cookie do js-cookie quản lý
    const token = Cookies.get('access_token');
    
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
      // Logic xử lý khi token hết hạn hoặc chưa đăng nhập (Optional)
      console.error('Lỗi xác thực: 401 Unauthorized');
      // Thường thì sẽ xóa cookie và redirect về trang login ở đây:
      // Cookies.remove('access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
