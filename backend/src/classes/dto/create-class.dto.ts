import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
  description?: string;
}
