import { Inject, Injectable } from '@nestjs/common';
import * as dbSchema from '../database/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, gte, lt } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof dbSchema>,
  ) {}

  async getUsers() {
    return this.database.query.users.findMany();
  }

  async createUser(user: typeof dbSchema.users.$inferInsert) {
    await this.database.insert(dbSchema.users).values(user);
  }

  async getUser(userEmail: string) {
    return this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, userEmail),
      columns: { id: true, email: true, dayStreak: true, lastLogin: true },
    });
  }

  async createUserAccess(userEmail: string, newsletterId: string) {
    // Buscar usuário pelo email
    const user = await this.getUser(userEmail);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Verificar se o usuário já abriu a newsletter hoje
    const alreadyOpenedToday =
      await this.database.query.userNewsletters.findFirst({
        where: and(
          eq(dbSchema.userNewsletters.userId, user.id),
          eq(dbSchema.userNewsletters.newsletterId, newsletterId),
          gte(dbSchema.userNewsletters.openedAt, startOfDay),
          lt(dbSchema.userNewsletters.openedAt, endOfDay),
        ),
      });

    if (!alreadyOpenedToday) {
      // Registrar abertura da newsletter
      await this.database.insert(dbSchema.userNewsletters).values({
        userId: user.id,
        newsletterId: newsletterId,
        openedAt: new Date(),
      });

      // Atualizar streak
      // await this.database
      //   .update(dbSchema.users)
      //   .set({
      //     dayStreak: user.dayStreak + 1,
      //     lastLogin: new Date(),
      //   })
      //   .where(eq(dbSchema.users.id, user.id));
    }
  }
}
