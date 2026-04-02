import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createScheduleDto: CreateScheduleDto,
    userId: string,
    role: string,
  ) {
    if (role === Role.TUTOR) {
      const cls = await this.prisma.class.findUnique({
        where: { id: createScheduleDto.classId },
      });
      if (!cls || cls.tutorId !== userId) {
        throw new ForbiddenException(
          'Bạn không có quyền lên lịch cho lớp học này!',
        );
      }
    }

    return this.prisma.schedule.create({
      data: createScheduleDto,
    });
  }

  findAllByClass(classId: string) {
    return this.prisma.schedule.findMany({
      where: { classId },
      orderBy: { date: 'asc' },
      include: {
        attendances: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: {
        attendances: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
      },
    });
  }

  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    return this.prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
    });
  }

  remove(id: string) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
