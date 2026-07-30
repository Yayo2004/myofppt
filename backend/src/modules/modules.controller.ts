import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ModulesService } from './modules.service';

@Controller('modules')
export class ModulesController {
  constructor(private service: ModulesService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('filiereId') filiereId?: string,
    @Query('levelId') levelId?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.service.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      filiereId,
      levelId,
      status,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body()
    dto: {
      name: string;
      code: string;
      hours: number;
      filiereId: string;
      description?: string;
      status?: string;
    },
  ) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      code?: string;
      hours?: number;
      filiereId?: string;
      description?: string;
      status?: string;
    },
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
