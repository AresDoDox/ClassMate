# 🏫 Quản lý Lớp học (Tích hợp Fullstack)

Trong Phase 14 này, chúng ta đã chính thức kết nối những kỹ năng Backend tinh hoa nhất (NestJS) sang Giao diện tương tác (Next.js) để tạo ra tính năng nghiệp vụ lõi đầu tiên: **Hệ thống Quản lý Lớp học**.

## 1. Về phía Backend
- **Prisma & Quan hệ dữ liệu**: `ClassesService` tương tác với bảng `Class` và `Enrollment`, tự động đếm sĩ số và join (lấy thông tin Giảng viên).
- **Phân quyền (RBAC)**: Kẻ xấu không thể dùng Postman spam tạo lớp nhờ Guard `@Roles(Role.TUTOR, Role.ADMIN)` gắn đè lên API `POST /classes`. Bắt buộc tài khoản truyền Token lên phải là Giáo viên.
- **Tính năng Ghi danh**: API `POST /classes/:id/enroll` xử lý việc "nhét" Học sinh vào lớp. Nếu học sinh đó cố bấm "Tham gia" lần 2, hệ thống quét lỗi trùng lặp `P2002` của Prisma và văng Exception từ chối ngay lập tức.

## 2. Về phía Frontend (Bảng điều khiển)
- Tích hợp 4 block giao diện cao cấp từ **Shadcn UI**: `Card`, `Dialog`, `Textarea`, `Form`.
- Xây dựng Modal tạo lớp (`CreateClassDialog.tsx`) chạy bằng siêu động cơ `react-hook-form` mượt mà, kết hợp với chốt chặn kiểm duyệt `Zod` bắt buộc độ dài Tên lớp phải > 3 kí tự.
- **Tương tác tức thì**: Khi Giáo viên nhấn Tạo lớp hoặc Khi Học sinh nhấn Tham gia, giao diện không hề bị chớp nháy Reset, mà hàm `loadClasses()` gọi chạy ngầm để lấy số Sĩ số mới nhất đổ lên UI (Single Page Application chuẩn mực).
- **Bẻ hướng UI qua Token**: Nhờ vào `user.role` lưu trong Redux sau khi đăng nhập, hệ thống tự động nhận dạng bạn là AI. Nếu là `STUDENT`, Cửa sổ tạo lớp sẽ bị tàng hình. Nếu là `TUTOR`, nút "Tham gia lớp" sẽ bị ẩn và nhường chỗ cho nút "Xem chi tiết".

**Hãy thử Start cả hai máy chủ và tận hưởng nhé! 🎉**
