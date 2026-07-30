import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilieresService } from './filieres.service';

@Controller('filieres')
export class FilieresController {
  constructor(private service: FilieresService) {}

  @Get()
  findAll(@Query('levelId') levelId?: string) { return this.service.findAll(levelId); }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: { name: string; code: string; icon?: string; levelId?: string }) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: { name?: string; code?: string; icon?: string; levelId?: string }) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
