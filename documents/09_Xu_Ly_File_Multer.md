# 📂 Xử lý File Upload trong NestJS (Multer + ServeStatic)

Tính năng này giúp học sinh và giáo viên gửi tài liệu (PDF, Word, Ảnh) lên Server ClassMate.

## 1. Cơ chế hoạt động

- **Nhận File**: Sử dụng thư viện `Multer` thông qua module tích hợp sẵn của NestJS `@nestjs/platform-express`.
- **Lưu Trữ (DiskStorage)**: File gửi lên sẽ KHÔNG lưu nội dung trực tiếp vào Cơ sở dữ liệu. Thay vào đó, nó lưu thẳng xuống thư mục `/uploads` nằm ở thư mục gốc của Backend.
- **Tôn trọng tính toàn vẹn (Đổi tên)**: Mọi file tải lên đều bị đổi tên thành một dải mã Hex ngẫu nhiên dài 32 ký tự tại file `multer.config.ts`. Điều này ngăn chặn lỗi "ghi đè" khi 2 người cùng tải lên file tên là `bai_tap.pdf`.
- **Kiểm duyệt (FileFilter)**: Chỉ cấp thẻ xanh cho file hình ảnh (jpg, png) hoặc tài liệu (pdf, docx) dưới 5MB. Những file hack (ví dụ .exe) sẽ bị văng mã lỗi 400 Bad Request.
- **Xuất bản**: Thư viện `@nestjs/serve-static` biến thư mục `/uploads` thành Public. Trình duyệt có thể gọi file dễ dàng qua Link URL.

## 2. API đã thiết lập
- **Đường dẫn**: `POST /upload`
- **Body**: dạng `multipart/form-data`, đính kèm key `file`.
- **Bảo mật**: API được che chắn bởi `JwtAuthGuard` - buộc người dùng phải đăng nhập mới được upload.
- **Kết quả trả về mẫu**:
```json
{
  "message": "Upload file thành công!",
  "fileUrl": "http://localhost:3001/uploads/1a2b3c4d...8x9y.png",
  "fileName": "hinh-nen.png",
  "size": 1048576
}
```

## 3. Cách sử dụng ở Frontend (React/NextJS)
Để tận dụng API này trên màn hình Giao diện, flow hoạt động như sau:
1. JS bắt sự kiện User chọn File.
2. Gói file vào `const formData = new FormData(); formData.append('file', selectedFile);`
3. Fetch/Axios gửi `formData` lên `POST /upload`. Backend xử lý và trả về `fileUrl`.
4. JS lấy `fileUrl` đó ném tiếp vào lệnh gọi API Tạo Giao Chuyên đề (Ví dụ: `POST /materials { title: "Chuyên đề 1", fileUrl: "..." }`) để CSDL lưu lại liên kết tài liệu. Xong! 🚀
