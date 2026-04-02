import { Injectable, ForbiddenException } from '@nestjs/common';
import { BulkUpdateAttendanceDto } from './dto/bulk-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  async bulkUpdate(
    bulkData: BulkUpdateAttendanceDto,
    userId: string,
    role: string,
  ) {
    // 1. Kiểm tra Schedule có tồn tại không
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: bulkData.scheduleId },
      include: { class: true },
    });

    if (!schedule) {
      throw new ForbiddenException('Buổi học không tồn tại');
    }

    // 2. Bảo vệ quyền Tutor
    if (role === Role.TUTOR && schedule.class.tutorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền điểm danh lớp này!');
    }

    // 3. Xử lý Upsert từng bản ghi điểm danh
    const upsertPromises = bulkData.attendances.map((att) => {
      return this.prisma.attendance.upsert({
        where: {
          scheduleId_studentId: {
            scheduleId: bulkData.scheduleId,
            studentId: att.studentId,
          },
        },
        update: {
          status: att.status,
          note: att.note,
        },
        create: {
          scheduleId: bulkData.scheduleId,
          studentId: att.studentId,
          status: att.status,
          note: att.note,
        },
      });
    });

    await Promise.all(upsertPromises);
    return { message: 'Cập nhật điểm danh thành công!' };
  }
}
