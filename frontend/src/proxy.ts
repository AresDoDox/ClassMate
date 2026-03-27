import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy() {
  // BỞI VÌ BẠN ĐÃ CHUYỂN SANG DÙNG LOCAL STORAGE, MÀ SERVER KHÔNG ĐỌC ĐƯỢC LOCAL STORAGE
  // NÊN MIDDLEWARE NÀY SẼ LUÔN TƯỞNG BẠN CHƯA ĐĂNG NHẬP NẾU NÓ TIẾP TỤC DÙNG QUY TẮC CŨ.
  // DO ĐÓ: CHÚNG TA VÔ HIỆU HÓA KIỂM DUYỆT Ở ĐÂY VÀ CHUYỂN VIỆC BẢO VỆ ROUTE SANG PHÍA CLIENT TRONG CÁC TRANG CỤ THỂ.
  
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
