/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

// API
import { fetchClasses, enrollClass, ClassItem } from '@/lib/api/classes';

// UI
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { ClassCard } from '@/components/classes/class-card';
import { CreateClassDialog } from '@/components/classes/create-class-dialog';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClasses(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách lớp học:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initDashboard = async () => {
      // Giả lập độ trễ tránh cảnh báo setState Component Update NextJS 15
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (!user) {
        const localUser = localStorage.getItem('user');
        if (!localUser) {
          router.push('/login');
          return; // Dừng lại nếu chưa đăng nhập
        }
      }

      await loadClasses();

      if (mounted) {
        setLoading(false);
      }
    };

    initDashboard();

    return () => {
      mounted = false;
    };
  }, [user, router]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    dispatch(logout());
    router.push('/login');
  };

  const handleEnroll = async (classId: string) => {
    try {
      await enrollClass(classId);
      // Tải lại danh sách lớp để cập nhật sĩ số tăng lên từ Backend
      await loadClasses();
    } catch (error: unknown) {
      alert((error as any)?.response?.data?.message || 'Đăng ký tham gia thất bại');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-semibold text-lg text-primary animate-pulse">Đang tải bảng điều khiển...</div>;
  }

  // Phân quyền (RBAC) hiển thị - UI ẩn nếu không phải người có thẩm quyền
  const isTeacherGroup = user?.role === 'ADMIN' || user?.role === 'TUTOR';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Menu */}
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">ClassMate</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
              <User className="h-4 w-4" />
              <span>
                Xin chào, <strong className="text-foreground">{user?.fullName || 'Học viện'}</strong>
                <span className="ml-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{user?.role}</span>
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-3xl font-bold text-foreground tracking-tight">Thư viện Lớp học</h2>
             <p className="text-muted-foreground mt-1">Khám phá và tham gia các khóa học chất lượng.</p>
          </div>
          
          {/* Cửa sổ Modal Tạo Lớp học dành cho Giáo viên */}
          {isTeacherGroup && <CreateClassDialog onCreated={loadClasses} />}
        </div>

        {classes.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center bg-card/50">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Chưa có lớp học nào</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Hiện tại hệ thống chưa có lớp học nào. {isTeacherGroup && "Bấm 'Tạo lớp học' ở trên để khởi tạo lớp đầu tiên."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <ClassCard
                key={cls.id}
                data={cls}
                isStudent={!isTeacherGroup}
                enrolled={false} // Mặc định hiển thị nút tham gia, backend cản P2002 tự động văng lỗi toast
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Bổ sung icon phụ cho Empty State
import { BookOpen } from 'lucide-react';
