import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './entities/user-response.entity';
import { IUserResponse } from 'src/interfaces/IUserResponse';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Insert a user at the database
   * @param createUserDto CreateUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    await this.prisma.users.create({ data: { email } });
    return 'user created!';
  }

  /**
   * Return a user from database
   * @param email string
   * @returns User
   */
  async getOne(userEmail: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { email: userEmail },
    });
    if (!user) throw new UnprocessableEntityException('User Not found');
    return { email: user.email, dayStreak: user.dayStreak };
  }

  /**
   * Return all users from database
   * @returns User
   */
  async getAll(): Promise<any> {
    return await this.prisma.users.findMany({
      select: {
        email: true,
        dayStreak: true,
        lastLogin: true,
        newsletters: true,
      },
    });
  }

  /**
   * Increment user day streak by email
   * @param userEmail string
   * @returns
   */
  async updateUserStreak(userEmail: string) {
    const user = await this.prisma.users.findUnique({
      where: { email: userEmail },
    });

    // lastest newsletter opening by user Id
    const latestOpenings = await this.prisma.userNewsletter.findMany({
      where: { userId: user.id },
      orderBy: { openedAt: 'desc' },
      take: 2,
    });

    // days to verify
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      latestOpenings.length > 1 &&
      new Date(latestOpenings[1].openedAt).toDateString() ===
        yesterday.toDateString()
    ) {
      await this.prisma.users.update({
        where: { email: userEmail },
        data: { dayStreak: user.dayStreak + 1, lastLogin: new Date() },
      });
    } else {
      await this.prisma.users.update({
        where: { email: userEmail },
        data: { dayStreak: 1, lastLogin: new Date() },
      });
    }
  }
}
