# 📖 Hướng dẫn khởi chạy dự án ClassMate

Dự án này sử dụng mô hình Frontend-Backend riêng biệt (Monorepo bằng folder). 

## 1. Khởi chạy Backend (NestJS)

Backend chạy trên cổng mặc định là **3001** (đã được cấu hình tự động tránh xung đột).

```bash
cd backend
npm run start:dev
```

## 2. Khởi chạy Frontend (Next.js)

Frontend chạy trên cổng mặc định là **3000**. Mở terminal mới:

```bash
cd frontend
npm run dev
```

---
💡 **Lưu ý:**
- Cả hai terminal cần phải chạy song song khi bạn phát triển.
- Frontend có thể truy cập qua `http://localhost:3000`
- Backend API nằm ở `http://localhost:3001`
