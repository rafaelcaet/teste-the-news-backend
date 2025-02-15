import { Injectable } from '@nestjs/common';
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
    const { email, dayStreak } = await this.prisma.users.findUnique({
      where: { email: userEmail },
    });
    return { email, dayStreak };
  }
}
