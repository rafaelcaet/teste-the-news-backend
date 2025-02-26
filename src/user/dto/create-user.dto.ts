import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid format: email' })
  email: string;

  @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
    message: 'Name cannot contain numbers or special characters',
  })
  name: string;
}
