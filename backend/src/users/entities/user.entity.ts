import { Exclude } from 'class-transformer';
import { User as PrismaUser, Role } from '@prisma/client';

export class UserEntity implements PrismaUser {
  id: string;
  email: string;

  @Exclude() // 👈 Decorator chặn tuyệt đối trường này khỏi JSON trả về
  password: string;

  fullName: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
