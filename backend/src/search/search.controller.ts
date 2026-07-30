import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  searchQuery(
    @Query('q') q: string,
    @Query('levelId') levelId?: string,
    @Query('filiereId') filiereId?: string,
    @Query('moduleId') moduleId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: Record<string, string> = {};
    if (levelId) filters.levelId = levelId;
    if (filiereId) filters.filiereId = filiereId;
    if (moduleId) filters.moduleId = moduleId;
    if (categoryId) filters.categoryId = categoryId;
    return this.searchService.search(q, filters, page ? +page : 1, limit ? +limit : 20);
  }

  @Post('sync')
  @UseGuards(AuthGuard('jwt'))
  syncAll() {
    return this.searchService.syncAll();
  }
}
