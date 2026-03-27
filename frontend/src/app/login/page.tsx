'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

// Redux
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

// Thư viện Validation & Form
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Thư viện UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' }),
});

function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (registered === 'success') {
      setSuccessMsg('Đăng ký thành công! Vui lòng đăng nhập.');
    }
  }, [registered]);

  // 1. Khởi tạo form với Hook Form & Zod
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Xử lý Submit
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Gọi API Login qua Axios
      const response = await api.post('/auth/login', values);

      // Bóc tách lớp vỏ Transform Interceptor của Backend
      const { access_token, user } = response.data.data;

      // Lưu Token vào LocalStorage
      localStorage.setItem('access_token', access_token);

      // Đẩy State lên Redux Store
      dispatch(setCredentials({ user, access_token }));

      // Push Dashboard 
      router.push('/dashboard');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        if (errorResponse.response?.data?.message) {
          setErrorMsg(errorResponse.response.data.message);
          return;
        }
      }
      setErrorMsg('Kết nối thất bại. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-background p-8 rounded-2xl shadow-xl border border-border">
        {/* Tiêu đề */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground tracking-tight">
            Chào mừng trở lại!
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Đăng nhập vào ClassMate
          </p>
        </div>

        {/* Thông báo Thành công/Lỗi */}
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center font-medium border border-green-200">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm text-center font-medium border border-destructive/20">
            {errorMsg}
          </div>
        )}

        {/* Biểu mẫu */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          type="email"
                          placeholder="student@example.com"
                          className="pl-10 h-11"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          className="pl-10 h-11"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-foreground"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            {/* Nút Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium group"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              {!loading && <LogIn className="w-5 h-5 ml-2" />}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Chưa có tài khoản? </span>
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
