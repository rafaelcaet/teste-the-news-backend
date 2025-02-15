import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid format: email' })
  email: string;
}
