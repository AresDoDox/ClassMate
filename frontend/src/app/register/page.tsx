'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

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
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

// Khai báo Schema Check Validation Realtime
const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Tên phải dài ít nhất 2 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Khởi tạo form với Hook Form & Zod
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  // 2. Xử lý Submit
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setErrorMsg('');

    try {
      // Gọi API đăng ký qua Axios
      await api.post('/auth/register', values);
      // Đăng ký thành công -> Đẩy sang trang Login
      router.push('/login?registered=success');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string | string[] } } };
        if (errorResponse.response?.data?.message) {
          const messages = errorResponse.response.data.message;
          setErrorMsg(Array.isArray(messages) ? messages[0] : messages);
          return;
        }
      }
      setErrorMsg('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
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
            ClassMate
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Tạo tài khoản học tập mới
          </p>
        </div>

        {/* Thông báo Lỗi từ API */}
        {errorMsg && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm text-center font-medium border border-destructive/20">
            {errorMsg}
          </div>
        )}

        {/* Biểu mẫu sử dụng Shadcn Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              {/* Họ và tên */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          placeholder="Vd: Nguyễn Văn A"
                          className="pl-10 h-11"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Mật khẩu */}
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
                          placeholder="Tối thiểu 6 ký tự"
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

            {/* Nút Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium group"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
              {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              {!loading && (
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Bạn đã có tài khoản? </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
