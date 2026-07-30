import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LevelsService } from './levels.service';

@Controller('levels')
export class LevelsController {
  constructor(private service: LevelsService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: { name: string; order: number }) {
    return this.service.create(dto.name, dto.order);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
