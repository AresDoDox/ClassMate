import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto, tutorId: string) {
    return this.prisma.class.create({
      data: {
        ...createClassDto,
        tutor: {
          connect: { id: tutorId }, // Liên kết lớp này với Giáo viên tạo ra nó
        },
      },
      include: {
        tutor: { select: { fullName: true, email: true } },
      },
    });
  }

  findAll() {
    return this.prisma.class.findMany({
      include: {
        tutor: { select: { fullName: true, email: true } },
        _count: { select: { students: true } }, // Đếm số học sinh trong lớp
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        tutor: { select: { fullName: true, email: true } },
        _count: { select: { students: true } },
        students: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true, role: true },
            },
          },
        },
        materials: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!classData) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }
    return classData;
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id },
      data: updateClassDto,
    });
  }

  remove(id: string) {
    return this.prisma.class.delete({ where: { id } });
  }

  async enroll(classId: string, studentId: string) {
    // Kiểm tra tồn tại
    await this.findOne(classId);

    try {
      await this.prisma.enrollment.create({
        data: {
          classId,
          studentId,
        },
      });
      return { message: 'Đăng ký tham gia lớp học thành công!' };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Bạn đã tham gia lớp học này rồi!');
      }
      throw error;
    }
  }
}
