import { Module } from '@nestjs/common';
import { NewsLetterController } from './news-letter.controller';
import { NewsLetterService } from './news-letter.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsLetterController],
  providers: [NewsLetterService],
})
export class NewsLetterModule {}
