import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { BulkUpdateAttendanceDto } from './dto/bulk-attendance.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Attendances (Điểm Danh)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('bulk')
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({ summary: 'Điểm danh hàng loạt cho một buổi học' })
  bulkUpdate(@Body() bulkData: BulkUpdateAttendanceDto, @Request() req: any) {
    return this.attendancesService.bulkUpdate(
      bulkData,
      req.user.sub,
      req.user.role,
    );
  }
}
