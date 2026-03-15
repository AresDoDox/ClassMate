# 🏗️ Kiến trúc Frontend ClassMate: Shadcn UI, Redux Toolkit & Next.js 15

Tài liệu này tổng hợp các kiến thức quan trọng về việc xây dựng và tái cấu trúc hệ thống Frontend cho dự án ClassMate.

## 1. Tổng quan các công nghệ (Tech Stack)

| Công nghệ | Vai trò |
| :--- | :--- |
| **Next.js 15 (App Router)** | Framework nền tảng, quản lý Routing và Server-side Rendering. |
| **Tailwind CSS v4** | Framework CSS sử dụng biến (CSS Variables) để tối ưu hiệu suất và giao diện. |
| **Shadcn UI** | Bộ thư viện UI Component (Accessible, Customizable). |
| **Redux Toolkit** | Quản lý trạng thái toàn cục (Global State Management). |
| **React Hook Form** | Quản lý trạng thái Form mượt mà, không gây re-render dư thừa. |
| **Zod** | Schema Validation - Kiểm tra tính hợp lệ của dữ liệu đầu vào. |

---

## 2. Kiến trúc luồng dữ liệu (Data Flow)

### 🔑 Luồng Xác thực (Authentication Flow)
1. **Lưu trữ**: 
   - JWT Token được lưu vào **Cookies** để Middleware (Server) có thể đọc.
   - User Info được lưu vào **LocalStorage** để Client hiển thị nhanh.
2. **Middleware (`proxy.ts`)**: Kiểm tra Token ở "cửa ngõ". Nếu không có Token khi vào `/dashboard`, server sẽ redirect về `/login` ngay lập tức.
3. **Redux Store**: Giữ trạng thái `isAuthenticated` và thông tin `user` để các component dùng chung.

### 🔄 Giải quyết lỗi Hydration Mismatch
Trong Next.js, HTML được render ở Server trước. Nếu chúng ta đọc `localStorage` ngay khi khởi tạo trang sẽ gây lệch dữ liệu (Server không có localStorage).
- **Giải pháp**: Tạo `AuthInitializer`. Component này chỉ chạy sau khi trang đã "mount" ở trình duyệt (Client-side), sau đó mới đẩy dữ liệu từ localStorage vào Redux.

---

## 3. Quản lý Giao diện (Theming)

Sử dụng `next-themes` kết hợp với biến CSS của Tailwind v4:
- Màu sắc được định nghĩa theo định dạng HSL trong `globals.css`.
- Khi đổi sang **Dark Mode**, ta chỉ cần thay đổi giá trị của các biến CSS này thay vì viết lại các class CSS mới.
- Thêm `suppressHydrationWarning` vào thẻ `html` và `body` để tránh lỗi do các tiện ích trình duyệt (Extensions) chèn thuộc tính lạ vào code.

---

## 4. Quy trình xây dựng Form (Form Workflow)

Để tạo một Form chuẩn trong ClassMate, chúng ta đi theo 4 bước:
1. **Define Schema**: Dùng Zod định nghĩa các trường và quy tắc (VD: `z.string().email()`).
2. **Initialize Form**: Dùng `useForm` với `zodResolver`.
3. **UI Binding**: Sử dụng các component của Shadcn như `<FormField>`, `<FormItem>`, `<FormControl>`.
4. **Handle Submit**: Gọi API thông qua Axios và cập nhật kết quả vào Redux hoặc hiển thị Toast thông báo.

---

## 📝 Ghi chú ôn tập
- **Shadcn UI** không phải là thư viện cài đặt qua npm, mà là code mẫu bạn sở hữu. Hãy thoải mái sửa file trong `components/ui`.
- **Axios Interceptor** trong `src/lib/axios.ts` là nơi cấu hình tự động đính kèm Token vào mỗi yêu cầu gửi lên Backend.
- Luôn sử dụng `--turbo` khi chạy `npm run dev` để có tốc độ phát triển nhanh nhất.

---
*Tài liệu này được tạo vào ngày 15/03/2026 cho dự án ClassMate.*
