# 📚 Bài học 1: Prisma và Database Modeling cơ bản

Chào bạn! Chúc mừng bạn đã bước vào thế giới Backend. Một trong những phần quan trọng nhất của Backend là **Cơ sở dữ liệu (Database)** và cách hệ thống giao tiếp với nó. Hôm nay chúng ta sẽ tìm hiểu về **Prisma ORM**.

## 1. ORM là gì? Tại sao lại dùng Prisma?

**ORM (Object-Relational Mapping)** là một kỹ thuật lập trình giúp chuyển đổi dữ liệu giữa các hệ thống không tương thích (như Database quan hệ: MySQL, PostgreSQL) thành các "Object" (đối tượng) trong ngôn ngữ lập trình của bạn (TypeScript/JavaScript).

Thay vì phải viết các câu lệnh SQL thuần tẻ nhạt và dễ sai sót như:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```
Với Prisma, bạn chỉ cần gọi một hàm JavaScript:
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' }
});
```

**Tại sao chọn Prisma cho ClassMate?**
- **Type-Safe**: Vì Prisma sinh ra các Type tương ứng với Schema của bạn, khi bạn code bằng TypeScript, IDE sẽ tự động gợi ý code (autocomplete) và bắt lỗi ngay lập tức nếu bạn truy vấn sai tên trường (field).
- **Dễ hiểu**: Khai báo Cấu trúc dữ liệu (Schema) của Prisma cực kì trong sáng và dễ đọc.
- **Migration dễ dàng**: Tự động tạo và áp dụng các thay đổi database.

## 2. Cấu trúc Prisma (Prisma Schema)

File quan trọng nhất của Prisma là `prisma/schema.prisma`. File này gồm 3 phần chính:

1. **Datasource**: Khai báo loại Database (MySQL, PostgreSQL, MongoDB...) và đường dẫn (URL) tới cơ sở dữ liệu đó.
2. **Generator**: Khai báo công cụ sinh code (mặc định là `prisma-client-js`).
3. **Data Model**: Định nghĩa các bảng, các trường dữ liệu và mối quan hệ giữa chúng.

### Ví dụ về Schema của ClassMate

Chúng ta sẽ thiết kế một số bảng cơ bản như sau:

#### Model `User`
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  fullName  String
  role      Role     @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  TUTOR
  STUDENT
}
```
*Giải thích:*
- `@id`: Đánh dấu khóa chính (Primary Key).
- `@default(uuid())`: Tự động sinh một chuỗi ID duy nhất (UUID) thay vì số tăng dần, giúp hệ thống bảo mật hơn.
- `@unique`: Đảm bảo không có 2 user nào trùng email.

#### Model `Class`
Một giáo viên có thể tạo nhiều lớp, một học sinh có thể tham gia nhiều lớp.

```prisma
model Class {
  id          String   @id @default(uuid())
  name        String
  description String?  // Dấu hỏi (?) nghĩa là trường này có thể rỗng (optional)
  subject     String
  tutorId     String
  
  // Quan hệ: Mỗi lớp học thuộc về 1 giáo viên (User)
  tutor       User     @relation("ClassesTaught", fields: [tutorId], references: [id])
}
```

## 3. Các bước làm việc với Prisma

Mỗi khi bạn thay đổi file `schema.prisma`, bạn cần làm 2 việc:
1. **Tạo Migration (`npx prisma migrate dev`)**: Lệnh này sẽ dịch cấu trúc Prisma của bạn thành các câu lệnh SQL (CREATE TABLE, ALTER TABLE...) và áp dụng nó vào MySQL.
2. **Tạo Client (`npx prisma generate`)**: Lệnh này sẽ tạo ra thư viện `@prisma/client` để bạn import vào Node.js và sử dụng. (Thường chạy tự động sau lệnh migrate).

## 4. Bài tập thực hành tiếp theo

Hãy xem qua file `prisma/schema.prisma` trong thư mục `backend` mà tôi vừa tạo. Trong đó tôi đã cài đặt sẵn các bảng:
- `User`: Lưu thông tin học sinh, giáo viên.
- `Class`: Lớp học.
- `Schedule`: Lịch học của mỗi lớp.
- `Attendance`: Điểm danh.
- `Material`, `Submission`: Tài liệu và Nộp bài.

Bạn hãy thử đọc lướt qua xem có hiểu được các mối quan hệ (1-nhiều) giữa các bảng không nhé! Sau đó, chúng ta sẽ bắt đầu cài đặt MySQL (hướng dẫn tải XAMPP hoặc Docker) để chạy Migration.
