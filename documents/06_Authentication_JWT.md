# 📚 Bài học 6: Tính năng Authentication (Xác thực với JWT)

Trong bất kỳ hệ thống nào, việc người dùng Đăng ký (Register) và Đăng nhập (Login) là vô cùng quan trọng. Bạn không thể để ai cũng được phép thêm/xóa/sửa Lớp học được. Ở ClassMate, chúng ta sử dụng **JWT (JSON Web Token)** để làm thẻ thông hành.

## 1. Flow Đăng ký (Register)
- Lập trình viên không bao giờ được lưu mật khẩu của khách hàng dạng "chữ thô" (123456) vào Database.
- ClassMate sử dụng thư viện `bcrypt` để **Băm (Hash)** mật khẩu.
- Khi người dùng gửi API tạo tài khoản `POST /auth/register`, hệ thống sẽ băm mật khẩu thành một chuỗi nhằng nhịt (Vd: `$2b$10$w0f5u/1mJz4qGz9...`) rồi mới lưu xuống Database.

## 2. Flow Đăng nhập (Login)
- Khi gọi API `POST /auth/login` và nhập đúng `Email + Mật khẩu`, Server sẽ dùng `bcrypt.compare` để kiểm tra.
- Nếu chính xác, Server lấy thông tin người dùng (user_id, email, role) rồi tự động **Ký (Sign)** lại bằng một chữ ký bí mật `JWT_SECRET`.
- Quá trình "Ký" này tạo ra một chuỗi cực dài gọi là **Mã thông hành (Access Token)** gửi về cho Frontend. Thẻ này thường có hạn sử dụng (ví dụ 1 ngày).

## 3. Bảo vệ API bằng JwtAuthGuard
- Để bắt buộc người dùng "phải trình thẻ thông hành" thì mới cho tạo Lớp học, tạo Học sinh... NestJS có chức năng **Guard (Vệ binh)**.
- Khi ta gắn cú pháp `@UseGuards(JwtAuthGuard)` trên đầu một Controller, các "vệ binh" sẽ ngay lập tức yêu cầu Token.
- Frontend muốn gọi API thành công, phải đính kèm Token này vào `Header Authorization`. Nếu không có Token hoặc Token giả mạo/hết hạn, vệ binh sẽ vứt lỗi `401 Unauthorized` ngay lập tức.

> [!TIP]
> Bạn có thể chạy lên `http://localhost:3001/api` để Test 2 tính năng Register và Login. Sau khi Login lấy được Token, bạn bấm nút **"Authorize (Ổ khóa)"** trên cùng bên phải giao diện Swagger, dán Token vào rồi hãy gọi các API khác nhé!
