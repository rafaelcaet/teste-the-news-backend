import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* public routes */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /* private routes */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getUser(@Request() req: any) {
    const userEmail = req.user.email;
    return this.userService.getOne(userEmail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile/streak')
  async updateDayStreak(@Request() req: any) {
    const userEmail = req.user.email;
    return this.userService.updateUserStreak(userEmail);
  }
}
