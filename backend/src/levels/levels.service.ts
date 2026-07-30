import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.level.findMany({ orderBy: { order: 'asc' } });
  }

  async create(name: string, order: number) {
    return this.prisma.level.create({ data: { name, order } });
  }

  async delete(id: string) {
    return this.prisma.level.delete({ where: { id } });
  }
}
