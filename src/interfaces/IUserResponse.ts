import { INewsLetter } from './INewsLetter';

export interface IUserResponse {
  email: string;
  dayStreak: number;
  lastLogin: Date;
  newsLetters: INewsLetter[];
}
