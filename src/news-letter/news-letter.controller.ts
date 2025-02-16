import { Body, Controller, Post } from '@nestjs/common';
import { NewsLetterService } from './news-letter.service';
import { INewsLetter } from 'src/interfaces/INewsLetter';

@Controller('news-letter')
export class NewsLetterController {
  constructor(private readonly newsLetterService: NewsLetterService) {}

  @Post()
  async create(@Body() newsLetterReq: INewsLetter) {
    return this.newsLetterService.create(newsLetterReq);
  }
}
