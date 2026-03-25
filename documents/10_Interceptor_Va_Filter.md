# 🛡️ Chuẩn hóa Định dạng API (Filters & Interceptors)

Tài liệu này giải thích hệ thống "Phễu Giao Thông" của ClassMate, giúp dữ liệu ra vào luôn gọn gàng, đẹp đẽ và nhất quán.

## 1. Exception Filter: Phễu Hứng Lỗi (`http-exception.filter.ts`)
Bình thường khi code bị Lỗi, NestJS ném ra lỗi mỗi cái một kiểu. Có lúc `message: "Not found"`, có lúc `error: "Bad Request"`. 
**Giải pháp**: Bất kỳ lỗi nào (dù là do bạn chủ động `throw new BadRequestException()` hay do App tự crash), nó đều phải đi qua `AllExceptionsFilter`.
Hệ thống này sẽ tái cơ cấu hộp đựng lỗi, và luôn trả ra Front-end đúng một format duy nhất:
```json
{
  "statusCode": 404,
  "timestamp": "2026-03-25T11:28:00Z",
  "path": "/users/999",
  "message": "Không tìm thấy thông tin"
}
```
Front-end từ nay chỉ cần đọc `error.response.data.message` để hiển thị Toast thông báo. Cực nhàn hạ!

## 2. Transform Interceptor: Trạm Kiểm Soát Chuyến Tốt (`transform.interceptor.ts`)
Tương tự như lỗi, nếu bạn code API chuẩn `return user`, Frontend sẽ nhận được duy nhất object thông tin user đó. Hơi cụt lủn và không đồng nhất.
**Giải pháp**: Chặn kết quả của tất cả Controller. Lấy data đó bọc vào một hộp quà thống nhất.
```json
{
  "statusCode": 200,
  "message": "Xử lý thành công",
  "data": { "id": "1", "email": "admin@classmate.com" }
}
```

## 3. Lọc Mật Khẩu Tự Động (`ClassSerializerInterceptor`)
Bình thường khi lấy danh sách Users từ Database (`findMany()`), Password - dù đã băm - vẫn bị dính vào Data ném về trình duyệt. Nếu quên `delete user.password` sẽ rất nguy hiểm.
**Giải pháp**: Dùng Decorator `@Exclude()` của `class-transformer`.
Bằng cách đánh dấu vào `src/users/entities/user.entity.ts`:
```typescript
@Exclude()
password: string;
```
Từ giờ ở API, bạn chỉ cần ném dữ liệu chui qua màng bọc Entity này:
```typescript
const users = await this.prisma.user.findMany();
return users.map((u) => new UserEntity(u)); // Mật khẩu sẽ tự động "bay màu"
```

## 4. Kích hoạt toàn cục
Chúng ta đã gắn toàn bộ các món vũ khí này tại `src/main.ts` bằng lệnh `app.useGlobalFilters(new AllExceptionsFilter())` và `app.useGlobalInterceptors(new TransformInterceptor(), ...)`. Kể từ lúc này, mọi API bạn viết mới tự động được hưởng cơ chế chuẩn hóa này mà không cần code lại! 🎉
