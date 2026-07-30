import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async create(name: string, icon?: string) {
    const slug = slugify(name);
    return this.prisma.category.create({ data: { name, slug, icon } });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
