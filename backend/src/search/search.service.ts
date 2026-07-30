import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private meilisearch: any = null;

  constructor(private prisma: PrismaService) {
    this.initMeilisearch();
  }

  private async initMeilisearch() {
    try {
      const MeiliSearch = (await import('meilisearch')).default;
      const client = new MeiliSearch({
        host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
        apiKey: process.env.MEILISEARCH_API_KEY || '',
      });
      // Test connection
      await client.health();
      this.meilisearch = client;
      this.logger.log('Meilisearch connected');
    } catch {
      this.logger.warn('Meilisearch not available, search fallback to Prisma LIKE');
    }
  }

  async syncDocument(doc: any) {
    if (!this.meilisearch) return;
    try {
      const index = this.meilisearch.index('documents');
      await index.addDocuments([doc]);
    } catch {}
  }

  async syncAll() {
    const docs = await this.prisma.document.findMany({
      where: { published: true },
      include: { level: true, filiere: true, module: true, category: true },
    });

    if (this.meilisearch) {
      try {
        const documents = docs.map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          description: d.description,
          fileType: d.fileType,
          year: d.year,
          levelId: d.levelId,
          levelName: d.level.name,
          filiereId: d.filiereId,
          filiereName: d.filiere.name,
          filiereCode: d.filiere.code,
          moduleId: d.moduleId,
          moduleName: d.module?.name ?? null,
          categoryId: d.categoryId,
          categoryName: d.category.name,
          views: d.views,
          downloads: d.downloads,
          createdAt: d.createdAt,
        }));
        const index = this.meilisearch.index('documents');
        await index.addDocuments(documents);
      } catch {}
    }
    return { count: docs.length, searchEngine: this.meilisearch ? 'meilisearch' : 'none' };
  }

  async search(q: string, filters?: Record<string, string>, page = 1, limit = 20) {
    // If Meilisearch is available, use it
    if (this.meilisearch) {
      try {
        const filterParts: string[] = [];
        if (filters) {
          if (filters.levelId) filterParts.push(`levelId = ${filters.levelId}`);
          if (filters.filiereId) filterParts.push(`filiereId = ${filters.filiereId}`);
          if (filters.moduleId) filterParts.push(`moduleId = ${filters.moduleId}`);
          if (filters.categoryId) filterParts.push(`categoryId = ${filters.categoryId}`);
        }

        const result = await this.meilisearch.index('documents').search(q, {
          filter: filterParts.length > 0 ? filterParts : undefined,
          limit,
          offset: (page - 1) * limit,
          sort: ['downloads:desc'],
        });

        return {
          results: result.hits,
          total: result.estimatedTotalHits || 0,
          page,
          totalPages: Math.ceil((result.estimatedTotalHits || 0) / limit),
        };
      } catch {}
    }

    // Fallback: Prisma LIKE search
    const where: any = { published: true };
    if (filters?.levelId) where.levelId = filters.levelId;
    if (filters?.filiereId) where.filiereId = filters.filiereId;
    if (filters?.moduleId) where.moduleId = filters.moduleId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (q) where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];

    const [docs, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { downloads: 'desc' },
        include: { level: true, filiere: true, module: true, category: true },
      }),
      this.prisma.document.count({ where }),
    ]);

    const results = docs.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      description: d.description,
      fileType: d.fileType,
      year: d.year,
      levelId: d.levelId,
      levelName: d.level.name,
      filiereId: d.filiereId,
      filiereName: d.filiere.name,
      filiereCode: d.filiere.code,
      moduleId: d.moduleId,
      moduleName: d.module?.name ?? null,
      categoryId: d.categoryId,
      categoryName: d.category.name,
      views: d.views,
      downloads: d.downloads,
      createdAt: d.createdAt,
    }));

    return { results, total, page, totalPages: Math.ceil(total / limit) };
  }
}
