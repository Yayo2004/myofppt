import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  private resend: Resend;

  constructor(private prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY || '');
  }

  async create(dto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });

    try {
      const { error } = await this.resend.emails.send({
        from: 'myofppt <onboarding@resend.dev>',
        to: ['yahyatirsi935@gmail.com'],
        subject: `[Contact myofppt] ${dto.subject}`,
        html: `
          <h2>Nouveau message depuis myofppt</h2>
          <p><strong>Nom :</strong> ${dto.name}</p>
          <p><strong>Email :</strong> ${dto.email}</p>
          <p><strong>Sujet :</strong> ${dto.subject}</p>
          <hr />
          <p><strong>Message :</strong></p>
          <p>${dto.message.replace(/\n/g, '<br/>')}</p>
        `,
      });
      if (error) {
        this.logger.error(`Failed to forward email: ${error.message}`);
      } else {
        this.logger.log(`Email forwarded for message ${message.id}`);
      }
    } catch (error) {
      this.logger.error(`Failed to forward email: ${(error as Error).message}`);
    }

    return message;
  }

  async findAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async markRead(id: string) {
    return this.prisma.message.update({
      where: { id },
      data: { read: true },
    });
  }

  async getUnreadCount() {
    return this.prisma.message.count({ where: { read: false } });
  }

  async delete(id: string) {
    return this.prisma.message.delete({ where: { id } });
  }
}
