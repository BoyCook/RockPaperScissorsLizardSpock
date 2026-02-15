'use client';

import { Move, GameResult } from '@/lib/game/rules';

interface HandBattleProps {
  player1Move: Move | null;
  player2Move: Move | null;
  showResult: boolean;
  isCountdown?: boolean;
  player1Label?: string;
  player2Label?: string;
  result?: GameResult | null;
}

const MOVE_EMOJIS: Record<Move, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
  lizard: '🦎',
  spock: '🖖',
};

export default function HandBattle({
  player1Move,
  player2Move,
  showResult,
  isCountdown = false,
  player1Label = 'Player 1',
  player2Label = 'Player 2',
  result = null,
}: HandBattleProps) {
  const getDisplayEmoji = (move: Move | null) => {
    // During countdown, always show fists
    if (isCountdown) return '✊';
    if (!move) return '✊';
    return MOVE_EMOJIS[move];
  };

  const winnerName =
    result && !result.isDraw
      ? result.winner === player1Move
        ? player1Label
        : player2Label
      : null;

  return (
    <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
      {/* Player 1 Hand - Left */}
      <div
        className={`flex-1 flex flex-col items-center justify-center transition-opacity duration-300 ${result ? 'opacity-20' : 'opacity-100'}`}
      >
        <div className="text-sm font-semibold text-white/60 mb-4">
          {player1Label}
        </div>
        <div style={{ transform: 'rotate(90deg) scaleX(-1)' }}>
          <div
            className={`
              text-[144px] sm:text-[192px] transition-all duration-500
              ${isCountdown ? 'animate-countdown-shake' : showResult ? 'animate-shake-reveal' : 'animate-bounce-ready'}
              ${player1Move || isCountdown ? 'scale-100' : 'scale-75 opacity-50'}
            `}
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
            }}
          >
            {getDisplayEmoji(player1Move)}
          </div>
        </div>
      </div>

      {/* VS Divider */}
      <div
        className={`flex flex-col items-center justify-center px-4 sm:px-8 transition-opacity duration-300 ${result ? 'opacity-0' : 'opacity-100'}`}
      >
        <div
          className={`
            text-4xl sm:text-5xl font-bold transition-all duration-300
            ${showResult ? 'text-white scale-110' : 'text-white/40'}
          `}
        >
          VS
        </div>
        {!showResult && (
          <div className="text-sm text-white/60 mt-2 animate-pulse">
            {isCountdown
              ? 'Shoot!'
              : player1Move && player2Move
                ? 'Ready!'
                : 'Choose moves...'}
          </div>
        )}
      </div>

      {/* Player 2 Hand - Right */}
      <div
        className={`flex-1 flex flex-col items-center justify-center transition-opacity duration-300 ${result ? 'opacity-20' : 'opacity-100'}`}
      >
        <div className="text-sm font-semibold text-white/60 mb-4">
          {player2Label}
        </div>
        <div style={{ transform: 'rotate(-90deg)' }}>
          <div
            className={`
              text-[144px] sm:text-[192px] transition-all duration-500
              ${isCountdown ? 'animate-countdown-shake animation-delay-150' : showResult ? 'animate-shake-reveal animation-delay-150' : 'animate-bounce-ready animation-delay-300'}
              ${player2Move || isCountdown ? 'scale-100' : 'scale-75 opacity-50'}
            `}
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
            }}
          >
            {getDisplayEmoji(player2Move)}
          </div>
        </div>
      </div>

      {/* Animated Background Effect on Reveal */}
      {showResult && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
        </div>
      )}

      {/* Result Overlay */}
      {result && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center space-y-6 px-4 max-w-2xl">
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
      )}
    </div>
  );
}
