'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Chỉ chạy ở Client sau khi mount
    const userStr = localStorage.getItem('user');
    const token = Cookies.get('access_token');

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, access_token: token }));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}
