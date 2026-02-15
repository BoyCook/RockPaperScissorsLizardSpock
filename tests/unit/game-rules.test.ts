import { describe, it, expect } from 'vitest';
import { playGame, getRandomMove, GAME_RULES } from '@/lib/game/rules';

describe('Game Rules', () => {
  describe('playGame', () => {
    it('should return draw when both players choose the same move', () => {
      const result = playGame('rock', 'rock');

      expect(result.isDraw).toBe(true);
      expect(result.message).toBe("It's a draw!");
    });

    it('should determine rock crushes scissors', () => {
      const result = playGame('rock', 'scissors');

      expect(result.winner).toBe('rock');
      expect(result.loser).toBe('scissors');
      expect(result.message).toBe('Rock crushes scissors');
      expect(result.isDraw).toBe(false);
    });

    it('should determine scissors cuts paper', () => {
      const result = playGame('scissors', 'paper');

      expect(result.winner).toBe('scissors');
      expect(result.loser).toBe('paper');
      expect(result.message).toBe('Scissors cuts paper');
      expect(result.isDraw).toBe(false);
    });

    it('should determine paper covers rock', () => {
      const result = playGame('paper', 'rock');

      expect(result.winner).toBe('paper');
      expect(result.loser).toBe('rock');
      expect(result.message).toBe('Paper covers rock');
      expect(result.isDraw).toBe(false);
    });

    it('should determine lizard poisons spock', () => {
      const result = playGame('lizard', 'spock');

      expect(result.winner).toBe('lizard');
      expect(result.loser).toBe('spock');
      expect(result.message).toBe('Lizard poisons Spock');
      expect(result.isDraw).toBe(false);
    });

    it('should determine spock vaporizes rock', () => {
      const result = playGame('spock', 'rock');

      expect(result.winner).toBe('spock');
      expect(result.loser).toBe('rock');
      expect(result.message).toBe('Spock vaporizes rock');
      expect(result.isDraw).toBe(false);
    });

    it('should work in reverse order', () => {
      const result = playGame('paper', 'scissors');

      expect(result.winner).toBe('scissors');
      expect(result.loser).toBe('paper');
      expect(result.isDraw).toBe(false);
    });
  });

  describe('getRandomMove', () => {
    it('should return a valid move', () => {
      const validMoves = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
      const move = getRandomMove();

      expect(validMoves).toContain(move);
    });

    it('should return different moves over multiple calls', () => {
      const moves = new Set();
      for (let i = 0; i < 20; i++) {
        moves.add(getRandomMove());
      }

      expect(moves.size).toBeGreaterThan(1);
    });
  });

  describe('GAME_RULES', () => {
    it('should have 10 rules', () => {
      expect(GAME_RULES).toHaveLength(10);
    });

    it('should have all required properties', () => {
      GAME_RULES.forEach((rule) => {
        expect(rule).toHaveProperty('winner');
        expect(rule).toHaveProperty('loser');
        expect(rule).toHaveProperty('message');
      });
    });
  });
});
