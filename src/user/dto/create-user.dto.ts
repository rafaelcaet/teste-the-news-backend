import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  email: string;
}
