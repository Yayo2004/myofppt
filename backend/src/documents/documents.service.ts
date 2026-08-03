import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/create-document.dto';
import { slugify } from '../common/utils';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    levelId?: string;
    filiereId?: string;
    moduleId?: string;
    categoryId?: string;
    q?: string;
    sort?: string;
  }) {
    const { page = 1, limit = 20, levelId, filiereId, moduleId, categoryId, q, sort } = params;
    const skip = (page - 1) * limit;

    const where: any = { published: true };
    if (levelId) where.levelId = levelId;
    if (filiereId) where.filiereId = filiereId;
    if (moduleId) where.moduleId = moduleId;
    if (categoryId) where.categoryId = categoryId;
    if (q) where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];

    const orderBy: any = sort === 'popular' ? { downloads: 'desc' } : { createdAt: 'desc' };

    const [docs, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { level: true, filiere: true, module: true, category: true },
      }),
      this.prisma.document.count({ where }),
    ]);

    return { docs, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const doc = await this.prisma.document.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { level: true, filiere: true, module: true, category: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async findRelated(docId: string, limit = 5) {
    const doc = await this.prisma.document.findUnique({
      where: { id: docId },
      select: { filiereId: true },
    });
    if (!doc || !doc.filiereId) return [];
    return this.prisma.document.findMany({
      where: { filiereId: doc.filiereId, id: { not: docId }, published: true },
      take: limit,
      orderBy: { downloads: 'desc' },
      include: { level: true, filiere: true, module: true, category: true },
    });
  }

  async create(dto: CreateDocumentDto, file: Express.Multer.File, storageUrl: string, thumbnailUrl?: string | null) {
    const baseSlug = slugify(dto.title);
    const uniqueSlug = `${baseSlug}-${uuid().slice(0, 8)}`;

    return this.prisma.document.create({
      data: {
        title: dto.title,
        slug: uniqueSlug,
        description: dto.description,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype.includes('pdf') ? 'pdf' : file.mimetype.includes('zip') ? 'zip' : 'other',
        storageUrl,
        thumbnailUrl: thumbnailUrl ?? null,
        year: dto.year,
        levelId: dto.levelId,
        filiereId: dto.filiereId,
        moduleId: dto.moduleId && dto.moduleId.trim() ? dto.moduleId : null,
        categoryId: dto.categoryId,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
        published: dto.published ?? true,
      },
      include: { level: true, filiere: true, module: true, category: true },
    });
  }

  async update(id: string, dto: UpdateDocumentDto) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    return this.prisma.document.update({
      where: { id },
      data: dto,
      include: { level: true, filiere: true, module: true, category: true },
    });
  }

  async delete(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    await this.prisma.document.delete({ where: { id } });
    return doc;
  }

  async incrementView(id: string) {
    return this.prisma.document.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async incrementDownload(id: string) {
    return this.prisma.document.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  }

  async getPopular(limit = 10) {
    return this.prisma.document.findMany({
      where: { published: true },
      orderBy: { downloads: 'desc' },
      take: limit,
      include: { level: true, filiere: true, module: true, category: true },
    });
  }

  async getLatest(limit = 10) {
    return this.prisma.document.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { level: true, filiere: true, module: true, category: true },
    });
  }
}
