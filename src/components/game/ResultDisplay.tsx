'use client';

import { GameResult } from '@/lib/game/rules';

interface ResultDisplayProps {
  result: GameResult;
  player1Name?: string;
  player2Name?: string;
}

const MOVE_EMOJIS: Record<string, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
  lizard: '🦎',
  spock: '🖖',
};

export default function ResultDisplay({
  result,
  player1Name = 'Player 1',
  player2Name = 'Player 2',
}: ResultDisplayProps) {
  return (
    <div className="mt-8 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-6xl mb-2">{MOVE_EMOJIS[result.winner]}</div>
            <div className="text-sm font-medium capitalize">
              {result.winner}
            </div>
          </div>
          <div className="text-2xl font-bold">VS</div>
          <div className="text-center">
            <div className="text-6xl mb-2">{MOVE_EMOJIS[result.loser]}</div>
            <div className="text-sm font-medium capitalize">{result.loser}</div>
          </div>
        </div>

        {result.isDraw ? (
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            It&apos;s a Draw!
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.winner === result.winner ? player1Name : player2Name}{' '}
              Wins!
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {result.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
