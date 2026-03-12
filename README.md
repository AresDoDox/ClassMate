# 🎓 ClassMate - All-in-one Tutoring Management System

**ClassMate** là một nền tảng quản lý giáo dục toàn diện được thiết kế đặc biệt cho giáo viên dạy kèm và gia sư tại nhà. Ứng dụng giúp số hóa toàn bộ quy trình từ quản lý lịch dạy, điểm danh, bài tập cho đến việc tổ chức lớp học trực tuyến, giúp giáo viên tối ưu hóa thời gian và nâng cao tính chuyên nghiệp.

---

## 🚀 Tính năng cốt lõi (Core Features)

### 👨‍🏫 Dành cho Giáo viên (Admin/Tutor)
* **Quản lý Lớp học:** Khởi tạo lớp theo môn học, khối lớp. Quản lý danh sách học sinh và thông tin liên hệ phụ huynh.
* **Thời khóa biểu thông minh:** Giao diện Calendar trực quan, hỗ trợ xếp lịch lặp lại, đổi lịch dạy linh hoạt.
* **Phòng Live-Class:** Tích hợp phòng học trực tuyến (Whiteboard, Screen Share) cho các trường hợp không thể dạy trực tiếp.
* **Điểm danh & Theo dõi học phí:** Tự động tính học phí dựa trên số buổi thực tế, theo dõi trạng thái đóng phí của từng học sinh.
* **Quản lý Bài tập:** Giao bài tập, đặt deadline và chấm điểm trực tiếp trên hệ thống.

### 👶 Dành cho Học sinh (Student)
* **Bảng điều khiển cá nhân:** Xem lịch học hàng tuần, nhận thông báo nhắc lịch tự động trước 30-60 phút.
* **Nộp bài dễ dàng:** Chụp ảnh bài tập về nhà và upload trực tiếp qua ứng dụng.
* **Kho tài liệu:** Truy cập tài liệu bài giảng, đề thi và xem lại video các buổi học cũ (Recordings).
* **Theo dõi tiến độ:** Xem biểu đồ điểm số và nhận xét từ giáo viên sau mỗi buổi học.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng trên mô hình Full-stack hiện đại:

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), Tailwind CSS, Shadcn UI.
* **Backend:** [NestJS](https://nestjs.com/) (Node.js framework), TypeScript.
* **Database:** MySQL (Lưu trữ dữ liệu quan hệ).
* **ORM:** [Prisma](https://www.prisma.io/) (Quản lý schema và truy vấn dữ liệu).
* **Real-time:** Socket.io (Thông báo & Chat), WebRTC/Agora (Video call).
* **Authentication:** JWT (JSON Web Token) & NextAuth.js.

---

## 📂 Cấu trúc Cơ sở dữ liệu (Database Schema)

Dữ liệu được tổ chức chặt chẽ thông qua Prisma:
* `User`: Lưu trữ thông tin chung (Teacher, Student, Admin).
* `Class`: Thông tin chi tiết về các lớp học.
* `Schedule`: Quản lý các ca dạy, giờ dạy và trạng thái dạy (Online/Offline).
* `Attendance`: Lưu vết điểm danh hàng ngày.
* `Material & Submission`: Quản lý tài liệu học tập và luồng nộp bài của học sinh.

---

## 📈 Lộ trình phát triển (Roadmap)

- [ ] **Giai đoạn 1 (MVP):** Hoàn thiện hệ thống quản lý lớp, lịch dạy và điểm danh.
- [ ] **Giai đoạn 2:** Xây dựng tính năng nộp bài tập và kho lưu trữ tài liệu.
- [ ] **Giai đoạn 3:** Tích hợp phòng Live-stream trực tuyến và thông báo tự động (Push Notification).
- [ ] **Giai đoạn 4:** Hệ thống báo cáo tài chính và Dashboard phân tích tiến độ học sinh cho phụ huynh.

---

## 💻 Cài đặt dự án
...
   
