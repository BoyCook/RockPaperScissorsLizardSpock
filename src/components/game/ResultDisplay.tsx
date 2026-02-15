'use client';

import { GameResult } from '@/lib/game/rules';

interface ResultDisplayProps {
  result: GameResult;
  player1Name?: string;
  player2Name?: string;
}

export default function ResultDisplay({
  result,
  player1Name = 'Player 1',
  player2Name = 'Player 2',
}: ResultDisplayProps) {
  const winnerName = result.isDraw
    ? null
    : result.winner === result.winner
      ? player1Name
      : player2Name;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="text-center space-y-6 px-4 max-w-2xl mx-auto">
        {result.isDraw ? (
          <>
            <div className="text-5xl sm:text-7xl font-black text-yellow-400 drop-shadow-2xl animate-bounce-in">
              DRAW!
            </div>
            <div className="text-xl sm:text-2xl text-white font-semibold">
              {result.message}
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 drop-shadow-2xl animate-bounce-in">
              {winnerName} WINS!
            </div>
            <div className="text-xl sm:text-3xl text-white font-bold bg-white/20 px-6 py-3 rounded-2xl border-2 border-white/30 backdrop-blur-sm animate-bounce-in animation-delay-150">
              {result.message}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
