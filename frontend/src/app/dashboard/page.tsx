'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

// UI
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Lấy state user từ Redux Store
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // Giả lập một tí độ trễ để tránh NextJS cảnh báo synchronous setState
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (!user) {
         const localUser = localStorage.getItem('user');
         if (!localUser) {
           router.push('/login');
         }
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, router]);

  const handleLogout = () => {
    // 1. Xoá Token Cookie
    Cookies.remove('access_token');
    
    // 2. Clear Redux State & LocalStorage thông qua Action Logout
    dispatch(logout());

    // 3. Đẩy về trang Login
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Navbar đơn giản */}
      <header className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">ClassMate</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
               <User className="h-4 w-4" />
               <span>Xin chào, <strong className="text-foreground">{user?.fullName || 'Học viên'}</strong></span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Tổng quan học tập</h2>
          <p className="text-muted-foreground">
            Chào mừng bạn đến với hệ thống quản lý học tập ClassMate. Các khóa học và lịch học của bạn sẽ hiển thị ở đây.
          </p>
          
          <div className="mt-8 p-8 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
               <LayoutDashboard className="h-8 w-8 text-primary" />
             </div>
             <h3 className="text-lg font-medium text-foreground">Khu vực đang phát triển</h3>
             <p className="text-sm text-muted-foreground mt-1 max-w-sm">
               Tính năng hiển thị bài giảng và tiến độ học tập sẽ ra mắt trong phiên bản tới.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
