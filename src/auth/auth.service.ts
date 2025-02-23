import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as dbSchema from '../database/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof dbSchema>,
  ) {}

  async validateUser(userEmail: string) {
    const result = await this.database.query.users.findFirst({
      where: eq(dbSchema.users.email, userEmail),
    });
    if (!result) return null;
    return result;
  }

  async login(user: User) {
    const payload = { email: user.email };
    const validUser = await this.validateUser(payload.email);
    if (!validUser) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
