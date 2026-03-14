# 📚 Bài học 4: DTO và Entity trong NestJS

Khi dùng lệnh `nest g resource`, bên cạnh Controller và Service, bạn sẽ thấy NestJS tạo ra hai thư mục con là `dto` và `entities`. Vậy chúng là gì và dùng để làm gì?

## 1. DTO (Data Transfer Object)
**DTO** viết tắt của *Data Transfer Object* (Đối tượng truyền dữ liệu).
- **Mục đích chính:** DTO là một cái "bản thiết kế" quy định cấu trúc dữ liệu mà Client (Frontend/Mobile) gửi lên Server (Backend).
- **Ví dụ thực tế:** Nó giống như một "Tờ khai đăng ký". Khi học sinh (Client) muốn tạo tài khoản, họ phải điền tờ khai gồm `email`, `password`, `fullName`. DTO chính là tờ khai đó.

**Tại sao phải dùng DTO?**
Để **Kiểm tra dữ liệu (Validation)** và **Bảo vệ hệ thống**.
Giả sử Client cố tình gửi dữ liệu rác lên để tấn công:
```json
{
  "email": "nhap-linh-tinh", // Sai định dạng email
  "password": "1", // Quá ngắn
  "role": "HACKER_ROLE" // Cố ý gửi thêm trường lạ
}
```
Nhờ có DTO kết hợp với thư viện xác thực (ví dụ `class-validator`), Backend sẽ ngay lập tức chặn Request này lại và báo lỗi *"Email không hợp lệ"* trước khi dữ liệu kịp đi vào `Service` hay `Database`.

*Ví dụ ở file `create-user.dto.ts` sau này chúng ta sẽ viết:*
```typescript
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

## 2. Entity
**Entity** (Thực thể).
- **Mục đích chính:** Nó đại diện cho cấu trúc của một bản ghi thực thụ dưới Database (ví dụ 1 hàng trong bảng MySQL).
- **Sử dụng trong dự án này:** Vì chúng ta đang dùng **Prisma ORM**, Prisma đã tự động sinh ra các Entity cho chúng ta thông qua việc đọc cấu trúc file `schema.prisma` rồi. Do đó, thư mục `entities/` mà NestJS sinh ra tự động có thể chúng ta sẽ không cần dùng nhiều để mô tả DB nữa.
- Thay vào đó, chúng ta có thể tận dụng lớp Entity này để biến đổi dữ liệu trước khi trả về cho Client. (Ví dụ: DB có trả lên `password`, nhưng trong Entity ta sẽ xóa biến `password` đi để không trả mật khẩu về cho Client).

## 3. Sự khác biệt giữa DTO và Entity (Dễ nhầm lẫn)
Nhiều bạn thắc mắc tại sao User lại phải đẻ ra 2-3 kiểu Model, hãy hiểu đơn giản:
- **DTO**: Phục vụ ở đầu **VÀO** (Request). Khi tạo mới một User, Client đâu cần cung cấp `id` hay `createdAt` làm gì, nên DTO không có các trường đó. 
- **Entity**: Phục vụ ở đầu **RA** (Response) và **Database**. Chứa đầy đủ thông tin chuẩn chỉnh nhất của một User.

**Tóm tắt Flow:**
Client nộp Form đăng ký $\rightarrow$ Backend kiểm tra theo đúng mẫu form **DTO** chưa $\rightarrow$ Đưa xuống Database lưu lại và định hình thành **Entity** $\rightarrow$ Trả kết quả về cho Client.
