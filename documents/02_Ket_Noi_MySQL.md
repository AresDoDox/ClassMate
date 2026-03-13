# 📚 Bài học 2: Kết nối MySQL và Khởi tạo Database thực tế (Migrate)

Tuyệt vời! Bạn đã có MySQL. Để Prisma có thể giao tiếp với MySQL, chúng ta cung cấp cho nó một chuỗi kết nối gọi là `DATABASE_URL` bên trong file `.env`.

## 1. Hiểu về biến môi trường `.env`

File `.env` là nơi chứa các cài đặt "mật" như mật khẩu database, khóa bảo mật (API keys), cổng server, v.v. Nó **không bao giờ** được đưa lên Github (chúng ta đã chặn trong `.gitignore`).

Trong file `backend/.env`, tôi đã đặt cấu hình như sau:

```env
DATABASE_URL="mysql://root:@localhost:3306/classmate"
```

**Cấu trúc chuỗi kết nối:**
`mysql://[TÊN_ĐĂNG_NHẬP]:[MẬT_KHẨU]@[HOST]:[CỔNG]/[TÊN_DATABASE]`

- Tên đăng nhập thường mặc định là `root`.
- Mật khẩu: mặc định của XAMPP thường là *rỗng* (để trống sau dấu hai chấm), một số hệ thống đòi hỏi mật khẩu (ví dụ `root` hoặc `123456`). Nếu MySQL của bạn có mật khẩu, hãy điền vào sau dấu `:` nhé.
- Host: `localhost` (máy tính của bạn).
- Cổng MySQL: Mặc định là `3306`.
- Tên database: `classmate` (đây là cơ sở dữ liệu chúng ta sẽ sử dụng).

---

## 2. Bước quan trọng: Chạy Migration

(Migration có nghĩa là ta đem cấu trúc đã vẽ trong `schema.prisma` sang xây thành các Bảng thực tế trên giao diện MySQL Workbench hoặc phpMyAdmin).

**Hãy mở Terminal lên và chạy lệnh sau (đảm bảo đang đứng ở thư mục `backend`):**

```bash
cd backend
npx prisma migrate dev --name init
```

*Điều gì sẽ xảy ra?*
1. Prisma sẽ tự động dò tìm `DATABASE_URL` của bạn.
2. Nếu database tên `classmate` chưa tồn tại trong MySQL, Prisma sẽ hỏi bạn: *"Cơ sở dữ liệu classmate chưa tồn tại, bạn có muốn tạo nó không?"*, bạn hãy bấm **Y** (Yes).
3. Prisma tạo lần lượt các bảng `User`, `Class`, v.v. và các khóa ngoại liên kết (Foreign Keys).
4. Đồng thời, nó sinh ra thư viện TypeScript `@prisma/client` để chúng ta dùng code query database.

---

## 3. Khám phá Prisma Studio

Prisma cung cấp một Giao diện Trực quan (GUI) mạnh mẽ chạy trên trình duyệt để bạn quản lý database của mình ngay tức khắc mà không cần mở MySQL Workbench hay phpMyAdmin.

Chạy lệnh này trong Terminal (`backend`):

```bash
npx prisma studio
```

Máy tính sẽ tự mở trình duyệt lên (ở cổng 5555), bạn sẽ thấy toàn bộ Database của ClassMate đã sẵn sàng! Bạn có thể thêm sửa xóa dữ liệu trực tiếp trong đó.

**Nhiệm vụ:**
1. Hãy kiểm tra lại mật khẩu MySQL của bạn. Nếu có mật khẩu, hãy sửa file `backend/.env` cho đúng.
2. Thử chạy dòng lệnh `npx prisma migrate dev --name init` xem mọi thứ có xanh 🟢 (thành công) không nhé!
3. Mở `npx prisma studio` để ngắm thành quả kiến trúc của bạn!
