import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

// Enum tương ứng trong schema.prisma
export enum Role {
  ADMIN = 'ADMIN',
  TUTOR = 'TUTOR',
  STUDENT = 'STUDENT',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email sinh viên',
    example: 'student@example.com',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  @Transform(({ value }) => value.toLowerCase()) // Tự động convert email thành chữ thường
  email: string;

  @ApiProperty({
    description: 'Mật khẩu bảo mật',
    example: '123456',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải dài tối thiểu 6 ký tự' })
  password: string;

  @ApiProperty({
    description: 'Phân quyền người dùng',
    enum: Role,
    default: Role.STUDENT,
  })
  @IsEnum(Role, {
    message: 'Role không hợp lệ. Chỉ chấp nhận ADMIN, TUTOR hoặc STUDENT',
  })
  role: Role;
}
