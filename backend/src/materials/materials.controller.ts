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
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
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

@ApiTags('Materials (Tài liệu học tập)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({
    summary: 'Tạo tài liệu mới (Dành cho Giáo viên tải thư mục)',
  })
  create(@Body() createMaterialDto: CreateMaterialDto, @Request() req: any) {
    return this.materialsService.create(
      createMaterialDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách PDF/Video tài liệu theo ID Lớp học' })
  @ApiQuery({
    name: 'classId',
    required: true,
    description: 'ID Lớp học cần truy xuất',
  })
  findAll(@Query('classId') classId: string) {
    return this.materialsService.findAll(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 Document' })
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({ summary: 'Sửa nội dung tài liệu' })
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TUTOR)
  @ApiOperation({ summary: 'Xóa tài liệu khỏi hệ thống' })
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}
