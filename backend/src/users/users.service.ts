import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    // Because Prisma expects precise types, we temporarily use Prisma.UserCreateInput
    // if DTO is not detailed enough, but let's try mapping directly without any first
    // In a real app we'd map fields individually
    return this.prisma.user.create({
      data: createUserDto as Prisma.UserCreateInput,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto as Prisma.UserUpdateInput,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
