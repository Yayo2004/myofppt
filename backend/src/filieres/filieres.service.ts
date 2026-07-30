import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils';

@Injectable()
export class FilieresService {
  constructor(private prisma: PrismaService) {}

  async findAll(levelId?: string) {
    return this.prisma.filiere.findMany({
      where: levelId ? { levelId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        level: { select: { id: true, name: true } },
        _count: { select: { modules: true, documents: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const f = await this.prisma.filiere.findUnique({
      where: { slug },
      include: {
        level: { select: { id: true, name: true } },
        modules: { orderBy: { name: 'asc' } },
        _count: { select: { documents: true } },
      },
    });
    if (!f) throw new NotFoundException('Filière not found');
    return f;
  }

  async create(data: { name: string; code: string; icon?: string; levelId?: string }) {
    const slug = slugify(data.name);
    return this.prisma.filiere.create({
      data: { ...data, slug },
      include: {
        level: { select: { id: true, name: true } },
        _count: { select: { modules: true, documents: true } },
      },
    });
  }

  async update(id: string, data: { name?: string; code?: string; icon?: string; levelId?: string }) {
    const updateData: any = { ...data };
    if (data.name) updateData.slug = slugify(data.name);
    return this.prisma.filiere.update({
      where: { id },
      data: updateData,
      include: {
        level: { select: { id: true, name: true } },
        _count: { select: { modules: true, documents: true } },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.filiere.delete({ where: { id } });
  }
}
