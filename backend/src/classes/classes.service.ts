import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  create(createClassDto: CreateClassDto) {
    // Similarly, remove "as any" and map fields or rely on matched DTO type
    return this.prisma.class.create({
      data: createClassDto as Prisma.ClassCreateInput,
    });
  }

  findAll() {
    return this.prisma.class.findMany();
  }

  findOne(id: string) {
    return this.prisma.class.findUnique({ where: { id } });
  }

  update(id: string, updateClassDto: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id },
      data: updateClassDto as Prisma.ClassUpdateInput,
    });
  }

  remove(id: string) {
    return this.prisma.class.delete({ where: { id } });
  }
}
