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

### Chuẩn hóa Dữ liệu API (Phase 13 - Hoàn tất)
- Global Exception Filter: Đã áp dụng `AllExceptionsFilter`.
- Transform Interceptor: Đã đóng gói Response chuẩn `{ statusCode, data, message }`.
- Auto Exclude Password: Đã bảo vệ User Entity bằng `@Exclude()`.

### Phát triển Nghiệp vụ: Quản lý Lớp học (Phase 14 - Hoàn tất)
- Tích hợp 100% Fullstack API và React UI cho tính năng tạo lớp, tham gia lớp học. Đã phân quyền ẩn/hiện logic.

### Cấp phát Tài khoản Admin & Dữ liệu mẫu (Phase 15 - Hoàn tất)
- Tự động sinh dữ liệu cơ bản (Admin, Tutor, Student, Sample Class) bằng Prisma Seed. Khắc phục vấn đề trắng dữ liệu đăng nhập.

### Tính năng Không gian Lớp học & Tài liệu (Phase 16 - Hoàn tất)
- Áp dụng cấu trúc **Dynamic Routing** của Next.js để tạo trang chi tiết `/dashboard/class/[classId]`.
- Phân quyền Upload tài nguyên cho Tutor, hiển thị danh sách cho Student. Giao diện UX/UI hai Tab (Tài nguyên và Lớp học).

### Tính năng Bài tập & Chấm Bài (Phase 17 - ĐÃ BỎ QUA)
- Nhằm tối ưu thời lượng khóa học, Phase này đã được đánh dấu là *Bỏ qua* theo yêu cầu của học viên dự án.

### Quản lý Lịch học & Điểm danh (Phase 18)
- **Mục tiêu**: Giáo viên quản lý các buổi học thực tế (Schedules) và điểm danh vắng, trễ (Attendances) cho từng học sinh. Học sinh theo dõi được lịch học sắp tới.
- **Backend (Schedules & Attendances)**:
  - Khởi tạo thư mục CRUD `Schedules` (`npx nest g resource schedules --no-spec`) và `Attendances`.
  - API `POST /schedules`: Cho phép TUTOR tạo buổi học mới (Chứa `title`, `date`, `startTime`, `endTime`, `type`).
  - API `GET /classes/:classId/schedules`: Lấy toàn bộ lịch học của lớp kèm thông tin điểm danh.
  - API `POST /attendances/bulk`: API chịu trách nhiệm nhận Array điểm danh của cả lớp (Upsert `status` là `PRESENT/ABSENT/LATE` kèm `note`) cho một `scheduleId`.
- **Frontend**:
  - **Class Detail Page**: Thêm một Tab `Lịch học & Điểm danh` ngay bên cạnh Tab Tài liệu và Sinh viên.
  - **Tutor View**: Gồm Nút `Tạo Lịch Học` (Dùng React Hook Form để nhập ngày/giờ). Click vào mỗi thẻ Lịch Học sẽ mở modal `Bảng Điểm Danh` cho phép xổ Dropdown chỉnh trạng thái của từng sinh viên trong lớp.
  - **Student View**: Giản lược các nút thao tác. Học sinh chỉ nhìn thấy Lịch học và dòng Badge trạng thái điểm danh của cá nhân mình.

## User Review Required
> [!IMPORTANT]
> Đây là Phase xương sống của việc học tập tương tác! Sẽ cần bổ sung quan hệ Model thông qua Redux Toolkit hoặc Component trực tiếp. Bạn vui lòng xem qua và đồng ý để chúng ta bắt đầu triển khai ngay!

## Verification Plan
- Chạy thử cả hai project `frontend` và `backend` để đảm bảo chúng khởi động thành công trên các port mặc định (frontend: 3000, backend: 3001).
- Kiểm tra tính năng chuyển đổi Dark/Light mode hoạt động trơn tru.
- Thử nghiệm Submit form bằng Hook Form báo lỗi Validation realtime trước khi gọi API.
- Xác nhận dữ liệu được ghi vào Redux dev tool thành công.
- API Upload File hoạt động, trả về link tải file chính xác và tải thành công trên trình duyệt.
