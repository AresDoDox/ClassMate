import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Cấu trúc Dữ liệu người dùng
interface User {
  id: number;
  email: string;
  fullName: string;
}

// Cấu trúc State của Slice Auth
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Lấy thông tin khởi tạo từ LocalStorage (nếu có để render lần đầu)
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action khi Đăng nhập thành công
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access_token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    // Action khi Đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      // Token Cookie sẽ được xoá riêng ở component xử lý Logout
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
