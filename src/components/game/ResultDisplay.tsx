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
    <div className="mt-8 p-8 rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="text-center space-y-6">
        {/* Moves Display */}
        <div className="flex items-center justify-center gap-6 sm:gap-12">
          <div className="text-center transform hover:scale-110 transition-transform">
            <div className="text-7xl sm:text-8xl mb-3 drop-shadow-lg animate-bounce-in">
              {MOVE_EMOJIS[result.winner]}
            </div>
            <div className="text-base sm:text-lg font-semibold capitalize text-white bg-white/10 px-4 py-2 rounded-full">
              {result.winner}
            </div>
          </div>

          <div className="text-3xl sm:text-4xl font-bold text-white/40">VS</div>

          <div className="text-center transform hover:scale-110 transition-transform">
            <div className="text-7xl sm:text-8xl mb-3 drop-shadow-lg animate-bounce-in animation-delay-150">
              {MOVE_EMOJIS[result.loser]}
            </div>
            <div className="text-base sm:text-lg font-semibold capitalize text-white bg-white/10 px-4 py-2 rounded-full">
              {result.loser}
            </div>
          </div>
        </div>

        {/* Result Message */}
        <div className="pt-4 border-t border-white/20">
          {result.isDraw ? (
            <div className="space-y-2 animate-in slide-in-from-bottom duration-500">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 drop-shadow-lg">
                It&apos;s a Draw!
              </div>
              <div className="text-lg text-gray-300">Try again!</div>
            </div>
          ) : (
            <div className="space-y-3 animate-in slide-in-from-bottom duration-500">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-lg">
                {result.winner === result.winner ? player1Name : player2Name}{' '}
                Wins!
              </div>
              <div className="text-lg sm:text-xl text-gray-300 font-medium bg-white/5 px-6 py-3 rounded-full inline-block">
                {result.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
