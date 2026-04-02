import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Schedules (Lịch Học)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({ summary: 'Tạo một buổi học mới' })
  create(@Body() createScheduleDto: CreateScheduleDto, @Request() req: any) {
    return this.schedulesService.create(
      createScheduleDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các buổi học của một Lớp' })
  @ApiQuery({ name: 'classId', required: true })
  findAll(@Query('classId') classId: string) {
    return this.schedulesService.findAllByClass(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một buổi học' })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({ summary: 'Sửa thông tin buổi học' })
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({ summary: 'Xóa buổi học' })
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
