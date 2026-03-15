import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Định nghĩa những đuôi đường dẫn (route) nằm trong vùng bảo vệ
const protectedRoutes = ['/dashboard', '/courses', '/schedules', '/profile'];

// Định nghĩa những đường dẫn không nên vào nếu đã đăng nhập
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const currentPath = request.nextUrl.pathname;

  // 1. Kiểm tra xem route hiện tại có nằm trong nhóm cần bảo vệ không
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // 2. Chặn chưa đăng nhập (không token) cố vào Dashboard
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Nếu muốn UX tốt hơn, truyền thêm ?redirect=/dashboard
    loginUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Chặn đã đăng nhập (có token) nhưng lại mò vào /login hoặc /register
  const isAuthRoute = authRoutes.includes(currentPath);
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware này cho những đường dẫn cụ thể, bỏ qua file tính hoặc API
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
