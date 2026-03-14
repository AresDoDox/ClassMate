# 📚 Bài học 3: Kiến trúc NestJS (Controller - Service - Module)

Bạn vừa trải qua quá trình dùng lệnh `nest g resource` để tạo tự động các API cho `Users` và `Classes`. Vậy cấu trúc bên trong thư mục vừa tạo là gì?

NestJS sử dụng cấu trúc **Module-based** bắt nguồn từ kiến trúc của Angular. Một chức năng (Resource) thường bao gồm 3 file chính:

## 1. Controller (`.controller.ts`)
**Nhiệm vụ:** Là người tiếp tân. Nhận Request (yêu cầu) từ Client (Browser, Mobile App) và trả về Response (Kết quả).
**Hoạt động:**
- Lắng nghe các Rest API route như: `GET /users`, `POST /users`, `PATCH /users/:id`.
- Nó KHÔNG xử lý logic nghiệp vụ hay lấy dữ liệu Database. Thay vào đó, nó **gọi Service** để nhờ làm việc này.
- Ví dụ:
```typescript
@Get()
findAll() {
  return this.usersService.findAll(); // Nhờ Service lấy danh sách
}
```

## 2. Service (`.service.ts`)
**Nhiệm vụ:** Là những chuyên viên xử lý nghiệp vụ (Business Logic).
**Hoạt động:**
- Tương tác với Database (trong dự án này là thông qua `PrismaService`).
- Chứa các thuật toán xử lý dữ liệu trước khi ném lại cho Controller.
- Ví dụ:
```typescript
findAll() {
  return this.prisma.user.findMany(); // Gọi DB thông qua Prisma
}
```

## 3. Module (`.module.ts`)
**Nhiệm vụ:** Là người quản lý đóng gói chức năng.
**Hoạt động:**
- Gom `Controller` và `Service` lại thành một khối.
- Khai báo nó xài thêm công cụ nào từ bên ngoài (ví dụ, ta phải khai báo `imports: [PrismaModule]` để Service có thể xài được cái `this.prisma...`).

---

## 4. Tổng Kết Luồng Xử Lý (Data Flow)
Khi có 1 tính năng **Hiển thị danh sách học sinh**:
1. Client gọi **GET /users**.
2. **UsersController** nhìn thấy đường dẫn trùng khớp, nhận Request $\rightarrow$ gọi tới hàm `findAll()` trong **UsersService**.
3. **UsersService** gọi hàm `findMany()` của **PrismaService**.
4. **PrismaService** truy vấn vào MySQL để kéo dữ liệu lên.
5. Dữ liệu chạy ngược từ: **Prisma $\rightarrow$ Service $\rightarrow$ Controller $\rightarrow$ Client**.

Mô hình này có vẻ hơi dài lúc đầu, nhưng khi dự án lớn (như ClassMate), nó sẽ giúp file code cực kì rành mạch, không bị rối rắm, dễ bảo trì!
