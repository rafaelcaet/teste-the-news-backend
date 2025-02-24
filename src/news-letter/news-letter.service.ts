import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as dbSchema from '../database/schema';
@Injectable()
export class NewsLetterService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof dbSchema>,
  ) {}

  /**
   *  Create a new newsletter to database
   * @param newsletter
   */
  async createNewsletter(newsletter: typeof dbSchema.newsLetter.$inferInsert) {
    await this.database.insert(dbSchema.newsLetter).values(newsletter);
  }

  async getAll() {
    return this.database.query.newsLetter.findMany();
  }
}
