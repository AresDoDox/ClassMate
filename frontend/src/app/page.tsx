import { redirect } from 'next/navigation';

export default function Home() {
  // Thay vì hiện page trống ở trang chủ gốc (localhost:3000)
  // Tính năng Next.js sẽ chuyển luồng trực tiếp đến trang Đăng nhập hoặc hiển thị Dashboard (nếu đã đăng nhập do có middleware bọc)
  redirect('/dashboard');
}
