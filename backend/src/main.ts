import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình Validation toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field (thuộc tính) không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu Client cố tình gửi lên field rác
      transform: true, // Tự động convert kiểu dữ liệu (vd: string url param '1' thành number 1)
    }),
  );

  // 2. Kích hoạt CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: true, // Cho phép tất cả origin hoặc liệt kê cụ thể ['http://localhost:3000']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Cấu hình Swagger API Document
  const config = new DocumentBuilder()
    .setTitle('ClassMate API')
    .setDescription(
      'Hệ thống API quản lý dự án ClassMate (Học tập & Giảng dạy)',
    )
    .setVersion('1.0')
    .addBearerAuth() // Cho phép nhập Token vào Swagger
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // Khởi tạo giao diện Swagger UI ở đường dẫn: /api
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error('Error starting server', err);
});
