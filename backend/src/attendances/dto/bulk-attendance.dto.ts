import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';

export class UpdateAttendanceDto {
  @ApiProperty({ description: 'ID của Sinh viên' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ description: 'Ghi chú thêm', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class BulkUpdateAttendanceDto {
  @ApiProperty({ description: 'ID Buổi học' })
  @IsNotEmpty()
  @IsString()
  scheduleId: string;

  @ApiProperty({
    type: [UpdateAttendanceDto],
    description: 'Danh sách điểm danh',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAttendanceDto)
  attendances: UpdateAttendanceDto[];
}
