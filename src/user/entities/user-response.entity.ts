import { INewsLetter } from 'src/interfaces/INewsLetter';

export class UserResponse {
  email: string;
  dayStreak: number;
  lastLogin: Date;
  newsLetters: INewsLetter[];
}
