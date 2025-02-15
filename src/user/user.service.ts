import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './entities/user-response.entity';

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
  async getOne(userEmail: string): Promise<UserResponse> {
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
  async getAll(): Promise<UserResponse[]> {
    return await this.prisma.users.findMany({
      select: {
        email: true,
        dayStreak: true,
      },
    });
  }
}
