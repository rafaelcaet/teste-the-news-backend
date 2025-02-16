import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsLetterController } from './news-letter.controller';
import { NewsLetterService } from './news-letter.service';

@Module({
  controllers: [NewsLetterController],
  providers: [NewsLetterService, PrismaService],
})
export class NewsLetterModule {}
