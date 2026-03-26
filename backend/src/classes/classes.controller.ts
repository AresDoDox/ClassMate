import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(Role.TUTOR, Role.ADMIN) // Chỉ Tutor và Admin tạo lớp được
  @ApiOperation({ summary: 'Tạo lớp học mới (Dành cho Giáo viên)' })
  @Post()
  create(@Request() req: any, @Body() createClassDto: CreateClassDto) {
    // Trích xuất ID cửa người gửi JWT Token
    return this.classesService.create(createClassDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Lấy tất cả lớp học' })
  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @ApiOperation({ summary: 'Lấy chi tiết lớp học' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Roles(Role.TUTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Sửa lớp học' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Roles(Role.TUTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Xoá lớp học' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  @Roles(Role.STUDENT, Role.TUTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Ghi danh tham gia lớp học' })
  @Post(':id/enroll')
  enroll(@Param('id') classId: string, @Request() req: any) {
    return this.classesService.enroll(classId, req.user.sub);
  }
}
