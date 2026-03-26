import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ description: 'Tên của lớp học', example: 'Toán Cao Cấp 101' })
  @IsNotEmpty({ message: 'Tên lớp học không được để trống' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết',
    example: 'Lớp học dành cho sinh viên năm nhất',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Môn học', example: 'Toán' })
  @IsNotEmpty({ message: 'Môn học không được để trống' })
  @IsString()
  @MaxLength(100)
  subject: string;
}
