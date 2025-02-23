import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* public routes */
  @Post()
  async createUser(@Body() createUserDto: { email: string }) {
    return this.userService.createUser({
      email: createUserDto.email,
    });
  }

  /* private routes */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getUser(@Request() req: any) {
    const userEmail = req.user.email;
    return this.userService.getUser(userEmail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile/streak')
  async updateDayStreak(
    @Request() req: any,
    @Query('newsletterId') newsletterId: string,
  ) {
    const userEmail = req.user.email;
    return this.userService.createUserAccess(userEmail, newsletterId);
  }
}
