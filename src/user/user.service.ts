import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as dbSchema from '../database/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, gte, lt } from 'drizzle-orm';

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

  async promoteToAdmin(adminEmail: string, userEmail: string): Promise<string> {
    const admin = await this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, adminEmail),
    });
    const user = await this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, userEmail),
    });

    if (!admin) throw new HttpException('Action not authorized', 401);
    if (!user) throw new HttpException('User Not found', 409);

    await this.database
      .update(dbSchema.users)
      .set({ isAdmin: 1 } as any)
      .where(eq(dbSchema.users.email, userEmail));
    return `${userEmail} has been promoted to Admin`;
  }

  async demoteToAdmin(adminEmail: string, userEmail: string): Promise<string> {
    const admin = await this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, adminEmail),
    });
    const user = await this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, userEmail),
    });

    if (!admin) throw new HttpException('Action not authorized', 401);
    if (!user) throw new HttpException('User Not found', 409);

    await this.database
      .update(dbSchema.users)
      .set({ isAdmin: 0 } as any)
      .where(eq(dbSchema.users.email, userEmail));
    return `${userEmail} has been demoted to Admin`;
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
      await this.database.query.userNewsLetter.findFirst({
        where: and(
          eq(dbSchema.userNewsLetter.userId, user.id),
          eq(dbSchema.userNewsLetter.newsLetterId, newsletterId),
          gte(dbSchema.userNewsLetter.openAt, startOfDay.toISOString()),
          lt(dbSchema.userNewsLetter.openAt, endOfDay.toISOString()),
        ),
      });

    if (!alreadyOpenedToday) {
      // Registrar abertura da newsletter
      await this.database.insert(dbSchema.userNewsLetter).values({
        userId: user.id,
        newsLetterId: newsletterId,
        openAt: new Date().toISOString(),
      });
      // Atualizar streak
      await this.database
        .update(dbSchema.users)
        .set({
          dayStreak: user.dayStreak + 1,
          lastLogin: new Date(),
        } as any) // Apliquei Any após apanhar muito pra entender que deveria tipar isso 🥹
        .where(eq(dbSchema.users.id, user.id));
    }
  }
}
