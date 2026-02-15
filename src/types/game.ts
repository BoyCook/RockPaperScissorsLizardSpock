import type { Move } from '@/lib/game/rules';

export interface Challenge {
  key: string;
  challenger: string;
  challengee: string;
  challengerMove?: Move;
  challengeeMove?: Move;
  winner?: string;
  date: string;
}

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type GameMode = 'local' | 'computer' | 'remote';
