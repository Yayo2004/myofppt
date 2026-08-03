import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ThumbnailService } from '../thumbnails/thumbnail.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(
    private docs: DocumentsService,
    private supabase: SupabaseService,
    private thumbnails: ThumbnailService,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('levelId') levelId?: string,
    @Query('filiereId') filiereId?: string,
    @Query('moduleId') moduleId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
    @Query('sort') sort?: string,
  ) {
    return this.docs.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      levelId, filiereId, moduleId, categoryId, q, sort,
    });
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string) {
    return this.docs.getPopular(limit ? +limit : 10);
  }

  @Get('latest')
  getLatest(@Query('limit') limit?: string) {
    return this.docs.getLatest(limit ? +limit : 10);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.docs.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
  }))
  async create(@Body() dto: CreateDocumentDto, @UploadedFile() file: Express.Multer.File) {
    const storageUrl = await this.supabase.upload(file.buffer, file.originalname, file.mimetype);

    let thumbnailUrl: string | null = null;
    if (file.mimetype.includes('pdf')) {
      thumbnailUrl = await this.thumbnails.generateAndUpload(file.buffer, file.originalname);
    }

    return this.docs.create(dto, file, storageUrl, thumbnailUrl);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.docs.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.docs.delete(id);
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.docs.findRelated(id, limit ? +limit : 4);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.docs.incrementView(id);
  }

  @Post(':id/download')
  incrementDownload(@Param('id') id: string) {
    return this.docs.incrementDownload(id);
  }
}
