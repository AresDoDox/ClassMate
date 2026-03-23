# 🛡️ Tính năng Phân Quyền (Role-Based Access Control) trong NestJS

Chào mừng bạn đến với bước tiến tiếp theo trên con đường trở thành Fullstack Developer. Tài liệu này sẽ giải thích cách hệ thống phân quyền (RBAC) của ClassMate hoạt động.

## 1. Cơ sở dữ liệu (Prisma)
Prisma Schema của chúng ta đã được định nghĩa sẵn một Enum cho chức vụ:
```prisma
enum Role {
  ADMIN
  TUTOR
  STUDENT
}
```
Mặc định khi một người dùng đăng ký, họ sẽ có quyền `STUDENT`.

## 2. Các thành phần tham gia Phân quyền

### 1️⃣ Token JWT (auth.service.ts)
Khi đăng nhập thành công, thay vì chỉ nhét Email vào Token, chúng ta đã thêm `role: user.role`:
```typescript
const payload = { sub: user.id, email: user.email, role: user.role };
const access_token = await this.jwtService.signAsync(payload);
```
Trình duyệt sẽ nhận được Token này. Toàn bộ thông tin này đều nằm gọn trong JWT (có thể giải mã nhưng không thể làm giả).

### 2️⃣ Trang bị Quyền (roles.decorator.ts)
Để một API nói lên tiếng nói: "Tôi cần quyền Admin", ta dùng một Metadata Decorator `@Roles(Role.ADMIN)` cắm mốc lên đầu hàm API đó.
Ví dụ trong `users.controller.ts`:
```typescript
@Get()
@Roles(Role.ADMIN) 
findAll() { ... }
```

### 3️⃣ Cửa ải Bảo vệ (roles.guard.ts)
Controller không thực sự chặn bạn lại, mà là `RolesGuard`.
Guard này hoạt động như một bảo vệ đứng cửa:
1. Nhìn vào cửa xem có biển báo `@Roles` không? (Sử dụng `Reflector`).
2. Nếu không có biển báo -> Cho qua.
3. Nếu có biển báo -> Bắt người dùng đưa `request.user` (đã được Guard Jwt giải mã từ Token lúc trước).
4. So sánh `user.role` với biển báo. Nếu khớp -> Đi tiếp. Nếu không khớp -> Ném ra lỗi `403 Forbidden` (Bạn không có quyền!).

## 3. Cách Áp dụng vào Thực tế
Trong file `users.controller.ts`, chúng ta đã bảo vệ Controller bằng 2 Guard cùng lúc:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController { ... }
```
- Phải Đăng nhập hợp lệ (JwtAuthGuard quét).
- Mới đến lượt xét Duyệt quyền (RolesGuard quét).

Từ bây giờ, bất cứ API nào muốn cấm Học sinh, cho phép Giáo viên, bạn chỉ cần ném `@Roles(Role.TUTOR, Role.ADMIN)` lên đầu hàm đó là xong! Siêu đơn giản và tái sử dụng 100%. Mọi thứ đã hoàn tất! 🎉
