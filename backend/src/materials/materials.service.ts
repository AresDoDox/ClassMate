import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createMaterialDto: CreateMaterialDto,
    userId: string,
    role: string,
  ) {
    // Nếu là TUTOR, đảm bảo họ chỉ được post tài liệu vào Lớp CỦA HỌ
    if (role === Role.TUTOR) {
      const cls = await this.prisma.class.findUnique({
        where: { id: createMaterialDto.classId },
      });
      if (!cls || cls.tutorId !== userId) {
        throw new ForbiddenException(
          'Bạn không có quyền đăng tải tài liệu vào lớp học này!',
        );
      }
    }

    return this.prisma.material.create({
      data: createMaterialDto,
    });
  }

  findAll(classId: string) {
    // Trả về danh sách tài liệu của lớp cụ thể
    return this.prisma.material.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.material.findUnique({ where: { id } });
  }

  update(id: string, updateMaterialDto: UpdateMaterialDto) {
    return this.prisma.material.update({
      where: { id },
      data: updateMaterialDto,
    });
  }

  remove(id: string) {
    return this.prisma.material.delete({ where: { id } });
  }
}
