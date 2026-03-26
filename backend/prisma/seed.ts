import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const dbUrl = new URL(process.env.DATABASE_URL as string);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bắt đầu quá trình nạp dữ liệu mẫu (Seeding)...');
  const password = await bcrypt.hash('123456', 10);

  // 1. Tạo Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@classmate.com' },
    update: {},
    create: {
      email: 'admin@classmate.com',
      fullName: 'Quản trị viên Hệ thống',
      password,
      role: Role.ADMIN,
    },
  });

  // 2. Tạo Giáo viên
  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@classmate.com' },
    update: {},
    create: {
      email: 'tutor@classmate.com',
      fullName: 'Giáo viên Demo',
      password,
      role: Role.TUTOR,
    },
  });

  // 3. Tạo Học sinh
  const student = await prisma.user.upsert({
    where: { email: 'student@classmate.com' },
    update: {},
    create: {
      email: 'student@classmate.com',
      fullName: 'Học sinh Demo',
      password,
      role: Role.STUDENT,
    },
  });

  console.log('Tạo tài khoản thành công!');

  // 4. Tạo Lớp học mẫu do Tutor nắm giữ
  // Kiểm tra xem đã có lớp học "Toán Cao Cấp 101" chưa
  const existingClass = await prisma.class.findFirst({
    where: { name: 'Toán Cao Cấp 101' },
  });

  if (!existingClass) {
    const sampleClass = await prisma.class.create({
      data: {
        name: 'Toán Cao Cấp 101',
        subject: 'Toán học',
        description:
          'Lớp học ví dụ tự động sinh ra từ quá trình Seeding. Dành cho sinh viên năm nhất.',
        tutorId: tutor.id,
      },
    });
    console.log(`Đã tạo lớp mẫu: ${sampleClass.name}`);
  }

  console.log('🌱 Đã thiết lập Dữ liệu Mẫu thành công!');
  console.log('------------------------------------------------');
  console.log(`Admin   - email: ${admin.email}`);
  console.log(`Tutor   - email: ${tutor.email}`);
  console.log(`Student - email: ${student.email}`);
  console.log(`Mật khẩu chung cho tất cả là: 123456`);
  console.log('------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
