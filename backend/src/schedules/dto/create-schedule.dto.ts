import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleType } from '@prisma/client';

export class CreateScheduleDto {
  @ApiProperty({ description: 'ID Lớp học', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: 'Tên/Tiêu đề buổi học',
    required: false,
    example: 'Buổi 1: Ôn tập',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Ngày học (ISO 8601)',
    example: '2026-04-10T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Giờ bắt đầu', example: '08:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'Giờ kết thúc', example: '10:00' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ enum: ScheduleType, default: ScheduleType.OFFLINE })
  @IsOptional()
  @IsEnum(ScheduleType)
  type?: ScheduleType;
}
