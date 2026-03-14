# 📚 Bài học 5: Validation và Document (Swagger)

Ở các bước trước chúng ta đã sinh ra file DTO trống trơn. Nếu cứ thế mà sử dụng, Client có thể gửi bất kì rác nào lên và làm treo hệ thống. Để ngăn chặn việc đó, NestJS cung cấp một vũ khí gọi là **ValidationPipe**.

## 1. Validation (class-validator)
Hãy xem lại file `main.ts`, đoạn code này kích hoạt chức năng bảo vệ toàn cục cho toàn bộ API của bạn:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // Xóa các trường thừa thãi (vd: gửi lên 'admin': true mà trong DTO không có, sẽ bị cắt đi)
  forbidNonWhitelisted: true, // Không cho phép gửi rác lên (Báo lỗi 400 Bad Request ngay lập tức)
  transform: true, // Ép kiểu dữ liệu (tự chuyển '1' thành số 1)
}));
```

Đi đôi với nó, chúng ta dùng các `Decorator` của bộ thư viện `class-validator` gắn vào DTO:
Ví dụ trong file `create-user.dto.ts`:
- `@IsEmail()`: Bắt buộc chuỗi phải là định dạng email (vd: abc@domain.com)
- `@IsNotEmpty()`: Không được để trống.
- `@MinLength(6)`: Bắt buộc dài ít nhất 6 ký tự.
- `@IsEnum(Role)`: Chỉ được điền 1 trong 3 quyền `ADMIN`, `TUTOR`, `STUDENT`.

## 2. Swagger API Documentation (@nestjs/swagger)
Ngoài ra, sau khi viết API xong, lập trình viên Frontend sẽ cần một bảng "Hướng dẫn sử dụng" API. Hãy quên Postman hay file Excel đi, **Swagger** sinh ra để làm việc đó hoàn toàn tự động!

Ở file `main.ts`, chúng ta đã thiết lập giao diện Swagger ở đường dẫn `/api`:
```typescript
SwaggerModule.setup('api', app, documentFactory);
```

Để Swagger hiểu được các DTO của chúng ta yêu cầu tham số gì, chúng ta phải gắn `@ApiProperty()` vào từng thuộc tính trong DTO.
Ví dụ:
```typescript
@ApiProperty({ description: 'Mật khẩu bảo mật', example: '123456', minLength: 6 })
password: string;
```

**Cách xem kết quả:**
Khi bạn chạy dự án backend bằng lệnh `npm run start:dev`, bạn chỉ cần mở trình duyệt và truy cập: **`http://localhost:3001/api`**. Bạn sẽ thấy một giao diện cực kỳ hoành tráng liệt kê mọi thông tin về API, cho phép bạn test gọi API ngay trên trình duyệt mà không cần cài Postman!
