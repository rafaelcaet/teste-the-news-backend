import { Injectable } from '@nestjs/common';
import { INewsLetter } from 'src/interfaces/INewsLetter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsLetterService {
  constructor(private prisma: PrismaService) {}

  async create(newsLetter: INewsLetter) {
    await this.prisma.newsletter.create({
      data: { ...newsLetter, sentAt: new Date() },
    });
    return 'created!';
  }
}
