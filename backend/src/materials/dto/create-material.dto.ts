import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaterialType } from '@prisma/client';

export class CreateMaterialDto {
  @ApiProperty({ description: 'ID của Lớp học', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ description: 'Tên tài liệu', example: 'Bài giảng Chương 1' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Mô tả thêm', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Đường dẫn file tĩnh', required: false })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ enum: MaterialType, default: MaterialType.DOCUMENT })
  @IsOptional()
  @IsEnum(MaterialType)
  type?: MaterialType;
}
