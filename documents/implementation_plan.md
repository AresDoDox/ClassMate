# Kế hoạch phát triển dự án ClassMate

## Goal Description
Dự án ClassMate là hệ thống quản lý giáo dục toàn diện. Trước tiên, chúng ta cần thiết lập cấu trúc cơ bản của dự án bao gồm `frontend` (Next.js) và `backend` (NestJS) như được định nghĩa trong README. 

## Proposed Changes

### Setup Framework
- **Frontend**: Hoàn tất khởi tạo.
- **Backend**: Hoàn tất khởi tạo, đổi port thành `3001`.

### Thiết lập Database (Backend)
- Cài đặt `prisma` và `@prisma/client`.
- Khởi tạo Prisma ORM.
- Thiết kế Schema `User`, `Class`, `Schedule`, `Attendance`, `Material`, `Submission`.
- Tạo tài liệu học tập trong `@documents/01_Prisma_Va_Database_Modeling.md`.

### Cài đặt API CRUD cơ bản (Backend)
- Tích hợp Prisma vào thư viện NestJS (`PrismaService`).
- Tạo cấu trúc Module cho bảng `Users`.
- Tạo cấu trúc Module cho bảng `Classes`.
- Viết tài liệu học tập NestJS cơ bản trong thư mục `documents`.

### Các bước thực hiện (Phase 3)
1. Tạo thư mục `prisma` trong NestJS module và cấu hình `PrismaService`.
2. Dùng Nest CLI tạo tài nguyên CRUD tự động: `npx nest g resource users` và `npx nest g resource classes`.
3. Sửa cấu trúc API logic: Kết nối `Service` với `Prisma`.
4. Viết tài liệu giải thích kiến trúc Controller - Service - Module vào `documents/03_Kien_Truc_NestJS.md`.

### Cài đặt Validation & Swagger (Phase 4)
- **Validation**: Cài đặt `class-validator` và `class-transformer` để kiểm tra DTO đầu vào. Bật `ValidationPipe` toàn cục cho NextJS.
- **Swagger**: Cài đặt `@nestjs/swagger` để tự động hóa việc viết tài liệu API.
- Cập nhật các DTO (ví dụ `CreateUserDto`) với các class decorators (như `@IsEmail()`, `@ApiProperty()`) để Swagger và Validator hoạt động song song.
- Viết tài liệu `documents/05_Validation_Va_Swagger.md` để giải thích cho người dùng.

### Xây dựng chức năng Authentication (Phase 5)
- **Mã hóa mật khẩu**: Cài đặt `bcrypt` để băm mật khẩu khi đăng ký tài khoản mới trong `UsersModule`.
- **Đăng ký (Register)**: Viết logic tạo user mới đảm bảo an toàn.
- **Đăng nhập (Login)**: Cài đặt `@nestjs/jwt` để tạo chuỗi mã hóa Token (JWT) trả về cho người dùng khi login thành công.
- **Bảo mật API (Guard)**: Tạo `AuthGuard` kiểm tra JWT Token ở các API cần bảo mật (ví dụ: Tạo, sửa, xóa Class).
- Tích hợp Bearer Token vào Swagger UI để test.
- Viết tài liệu `documents/06_Authentication_JWT.md`.

### Phát triển Giao diện người dùng Frontend (Phase 6)
- **Cấu hình UI Base**: Thiết lập Tailwind CSS, Google Fonts và CSS Variables để làm giao diện đẹp và hiện đại.
- **Tích hợp API**: Cài đặt `axios` và tạo Axios Instance chặn request để tự động gắn Bearer Token (`src/lib/axios.ts`).
- **Trang Đăng ký / Đăng nhập**: Xây dựng UI cho trang Login và Register (`/login`, `/register`). Tương tác với Backend thông qua các API: `POST /auth/login` và `POST /auth/register`.
- **Lưu trữ Token**: Sử dụng `js-cookie` (hoặc localStorage) để lưu trữ JWT Token an toàn phía Client.
- **Trang chủ Dashboard cơ bản**: Trang tổng quan cơ bản hiển thị sau khi user login thành công. Dùng `middleware.ts` của Next.js để bảo vệ các route (nếu chưa login -> đẩy về `/login`).

### Cải tiến UI & Quản lý State (Phase 7 - Theo yêu cầu)
- **Shadcn/UI & Theme**: Cài đặt `shadcn-ui` (chuẩn Tailwind v4), cấu hình `next-themes` để hỗ trợ chế độ xem Dark/Light.
- **React Hook Form & Zod**: Áp dụng thư viện này vào form `/login` và `/register` để quản lý state form mượt mà và validate dữ liệu ngay tại Frontend bằng `zod` schema trước khi gọi API.
- **Redux Toolkit**: Cài đặt `@reduxjs/toolkit` và `react-redux`. Khởi tạo Redux Store (`src/store`) với một số Slice cơ bản như `authSlice` (lưu trạng thái login của user, token) thay vì dựa hoàn toàn vào localStorage.

### Tính năng Phân Quyền Base (Phase 11 - RBAC)
- Kiểm tra JWT Token, cài đặt Decorator `@Roles` và xử lý chặn truy cập bằng `RolesGuard`.
- Viết tài liệu hướng dẫn RBAC tại `documents`.

### Tính năng Upload File & Static Files (Phase 12 - Hoàn tất)
- Cấu hình Multer, lưu trữ DiskStorage tự động đổi tên mã hóa.
- Public thư mục `uploads` thành URL tĩnh bằng `ServeStaticModule`.
- Viết tài liệu hướng dẫn `documents/09_Xu_Ly_File_Multer.md`.

### Chuẩn hóa Dữ liệu API (Phase 13)
- **Global Exception Filter**: Viết bộ lọc lỗi toàn cục. Khi hệ thống sập hoặc quăng các lỗi vặt, Filter sẽ gói gọn chúng thành định dạng chung `{ statusCode, timestamp, path, message }` để Frontend dễ đọc.
- **Transform Interceptor**: Áp dụng Interceptor đánh chặn phản hồi để chuẩn hóa định dạng kết quả thành `{ statusCode, data, message }` cho mọi API (thành công).
- **Auto Exclude Password**: Áp dụng cơ chế `@Exclude()` của `class-transformer` để Backend tự cắt bỏ mật khẩu trả về, thay vì phải gõ tay lọc từng trường mỗi khi Select Query từ Prisma.
- Viết tài liệu lưu tại `documents/10_Interceptor_Va_Filter.md`.

## Verification Plan
- Chạy thử cả hai project `frontend` và `backend` để đảm bảo chúng khởi động thành công trên các port mặc định (frontend: 3000, backend: 3001).
- Kiểm tra tính năng chuyển đổi Dark/Light mode hoạt động trơn tru.
- Thử nghiệm Submit form bằng Hook Form báo lỗi Validation realtime trước khi gọi API.
- Xác nhận dữ liệu được ghi vào Redux dev tool thành công.
- API Upload File hoạt động, trả về link tải file chính xác và tải thành công trên trình duyệt.
