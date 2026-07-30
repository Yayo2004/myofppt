import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.service.findAll();
  }

  @Get('unread-count')
  @UseGuards(AuthGuard('jwt'))
  unreadCount() {
    return this.service.getUnreadCount();
  }

  @Post(':id/read')
  @UseGuards(AuthGuard('jwt'))
  markRead(@Param('id') id: string) {
    return this.service.markRead(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
