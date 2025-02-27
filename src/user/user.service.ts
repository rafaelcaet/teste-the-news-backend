import {
  HttpException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as dbSchema from '../database/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, gte, lt } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof dbSchema>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Return all users from database
   * @returns
   */
  async getUsers() {
    return this.database.query.users.findMany();
  }

  /**
   * Create a new user to database and generate a JWT for the user
   * @param user
   * @returns
   */
  async createUser(user: {
    name: string;
    email: string;
  }): Promise<{ email: string; token: string }> {
    try {
      await this.database.insert(dbSchema.users).values(user);
      const token = await this.authService.login({ email: user.email } as User);
      return { email: user.email, token: token.access_token };
    } catch (err: any) {
      if (err.code === '23505')
        throw new HttpException('User already exists', 409);
      throw new HttpException('Unexpected error', 422);
    }
  }

  /**
   *  Promote a user to admin by email
   * @param adminEmail
   * @param userEmail
   * @returns
   */
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

  /**
   *  Demote user from admin by email
   * @param adminEmail
   * @param userEmail
   * @returns
   */
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

  /**
   * Get a user by email
   * @param userEmail
   * @returns
   */
  async getUser(userEmail: string) {
    return this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, userEmail),
      columns: {
        id: true,
        name: true,
        email: true,
        dayStreak: true,
        lastLogin: true,
      },
    });
  }

  /**
   * Create a new user newslatter`s access to database
   * @param userEmail
   * @param newsletterId
   */
  async createUserAccess(userEmail: string, newsletterId: string) {
    if (!newsletterId)
      throw new UnprocessableEntityException('Newsletter não encontrada');

    const user = await this.getUser(userEmail);
    if (!user) throw new UnprocessableEntityException('Usuário não encontrado');

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

  /**
   * Get all newsletters opened by a specific user
   * @param userEmail
   * @returns Array of newsletters
   */
  async getUserNewsletters(userEmail: string) {
    const result = await this.database
      .select({
        id: dbSchema.newsLetter.id,
        url: dbSchema.newsLetter.url,
        title: dbSchema.newsLetter.title,
        sentAt: dbSchema.newsLetter.sentAt,
        openAt: dbSchema.userNewsLetter.openAt,
      })
      .from(dbSchema.users)
      .innerJoin(
        dbSchema.userNewsLetter,
        eq(dbSchema.users.id, dbSchema.userNewsLetter.userId),
      )
      .innerJoin(
        dbSchema.newsLetter,
        eq(dbSchema.userNewsLetter.newsLetterId, dbSchema.newsLetter.id),
      )
      .where(eq(dbSchema.users.email, userEmail));

    if (!result.length) {
      throw new HttpException('No newsletters found for this user', 404);
    }

    return result;
  }
}
