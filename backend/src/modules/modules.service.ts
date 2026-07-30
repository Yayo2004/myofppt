import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    filiereId?: string;
    levelId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;
    const { search, filiereId, levelId, status, sortBy, sortOrder } = query;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (filiereId) {
      where.filiereId = filiereId;
    }
    if (levelId) {
      where.filiere = { levelId };
    }
    if (status) {
      where.status = status;
    }

    const orderBy: any = {};
    const validSortFields: Record<string, string> = { code: 'code', name: 'name', hours: 'hours', createdAt: 'createdAt' };
    const field = (sortBy && validSortFields[sortBy]) || 'createdAt';
    orderBy[field] = sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await Promise.all([
      this.prisma.module.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          filiere: {
            select: {
              id: true,
              name: true,
              code: true,
              level: { select: { id: true, name: true } },
            },
          },
          _count: { select: { documents: true } },
        },
      }),
      this.prisma.module.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id },
      include: {
        filiere: {
          select: {
            id: true,
            name: true,
            code: true,
            level: { select: { id: true, name: true } },
          },
        },
        _count: { select: { documents: true } },
      },
    });
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async create(data: {
    name: string;
    code: string;
    hours: number;
    filiereId: string;
    description?: string;
    status?: string;
  }) {
    const filiere = await this.prisma.filiere.findUnique({ where: { id: data.filiereId } });
    if (!filiere) throw new NotFoundException('Filière not found');

    const slug = slugify(data.name);

    return this.prisma.module.create({
      data: { ...data, slug },
      include: {
        filiere: {
          select: {
            id: true,
            name: true,
            code: true,
            level: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      code?: string;
      hours?: number;
      filiereId?: string;
      description?: string;
      status?: string;
    },
  ) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Module not found');

    if (data.filiereId) {
      const filiere = await this.prisma.filiere.findUnique({ where: { id: data.filiereId } });
      if (!filiere) throw new NotFoundException('Filière not found');
    }

    const updateData: any = { ...data };
    if (data.name) updateData.slug = slugify(data.name);

    return this.prisma.module.update({
      where: { id },
      data: updateData,
      include: {
        filiere: {
          select: {
            id: true,
            name: true,
            code: true,
            level: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Module not found');

    await this.prisma.module.delete({ where: { id } });
    return { message: 'Module deleted successfully' };
  }
}
