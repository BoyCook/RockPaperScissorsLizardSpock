export type Move = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export interface GameRule {
  winner: Move;
  loser: Move;
  message: string;
}

export const GAME_RULES: GameRule[] = [
  { winner: 'scissors', loser: 'paper', message: 'Scissors cuts paper' },
  { winner: 'paper', loser: 'rock', message: 'Paper covers rock' },
  { winner: 'rock', loser: 'lizard', message: 'Rock crushes lizard' },
  { winner: 'lizard', loser: 'spock', message: 'Lizard poisons Spock' },
  { winner: 'spock', loser: 'scissors', message: 'Spock smashes scissors' },
  {
    winner: 'scissors',
    loser: 'lizard',
    message: 'Scissors decapitates lizard',
  },
  { winner: 'lizard', loser: 'paper', message: 'Lizard eats paper' },
  { winner: 'paper', loser: 'spock', message: 'Paper disproves Spock' },
  { winner: 'spock', loser: 'rock', message: 'Spock vaporizes rock' },
  { winner: 'rock', loser: 'scissors', message: 'Rock crushes scissors' },
];

export interface GameResult {
  winner: Move;
  loser: Move;
  message: string;
  isDraw: boolean;
}

export function playGame(move1: Move, move2: Move): GameResult {
  if (move1 === move2) {
    return {
      winner: move1,
      loser: move2,
      message: "It's a draw!",
      isDraw: true,
    };
  }

  const rule = GAME_RULES.find((r) => r.winner === move1 && r.loser === move2);

  if (rule) {
    return { ...rule, isDraw: false };
  }

  const reverseRule = GAME_RULES.find(
    (r) => r.winner === move2 && r.loser === move1
  );

  return reverseRule
    ? { ...reverseRule, isDraw: false }
    : { winner: move1, loser: move2, message: 'Unknown result', isDraw: false };
}

export function getRandomMove(): Move {
  const moves: Move[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  return moves[Math.floor(Math.random() * moves.length)];
}
