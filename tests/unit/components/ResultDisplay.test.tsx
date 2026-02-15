import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultDisplay from '@/components/game/ResultDisplay';
import { GameResult } from '@/lib/game/rules';

describe('ResultDisplay', () => {
  describe('when the game is a draw', () => {
    it('displays draw message', () => {
      const DRAW_RESULT: GameResult = {
        winner: 'rock',
        loser: 'rock',
        message: "It's a draw!",
        isDraw: true,
      };

      render(<ResultDisplay result={DRAW_RESULT} />);

      expect(screen.getByText("It's a Draw!")).toBeInTheDocument();
    });
  });

  describe('when there is a winner', () => {
    it('displays the winning message', () => {
      const WIN_RESULT: GameResult = {
        winner: 'rock',
        loser: 'scissors',
        message: 'Rock crushes scissors',
        isDraw: false,
      };

      render(
        <ResultDisplay
          result={WIN_RESULT}
          player1Name="Alice"
          player2Name="Bob"
        />
      );

      expect(screen.getByText('Alice Wins!')).toBeInTheDocument();
      expect(screen.getByText('Rock crushes scissors')).toBeInTheDocument();
    });

    it('displays both moves', () => {
      const WIN_RESULT: GameResult = {
        winner: 'paper',
        loser: 'rock',
        message: 'Paper covers rock',
        isDraw: false,
      };

      render(<ResultDisplay result={WIN_RESULT} />);

      expect(screen.getByText('paper')).toBeInTheDocument();
      expect(screen.getByText('rock')).toBeInTheDocument();
    });
  });

  describe('when using default player names', () => {
    it('displays Player 1 and Player 2', () => {
      const WIN_RESULT: GameResult = {
        winner: 'spock',
        loser: 'scissors',
        message: 'Spock smashes scissors',
        isDraw: false,
      };

      render(<ResultDisplay result={WIN_RESULT} />);

      expect(screen.getByText('Player 1 Wins!')).toBeInTheDocument();
    });
  });
});
