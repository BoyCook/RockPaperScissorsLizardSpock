'use client';

import { Move } from '@/lib/game/rules';

interface HandBattleProps {
  player1Move: Move | null;
  player2Move: Move | null;
  showResult: boolean;
  isCountdown?: boolean;
  player1Label?: string;
  player2Label?: string;
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
}: HandBattleProps) {
  const getDisplayEmoji = (move: Move | null) => {
    // During countdown, always show fists
    if (isCountdown) return '✊';
    if (!move) return '✊';
    return MOVE_EMOJIS[move];
  };

  return (
    <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
      {/* Player 1 Hand - Left */}
      <div className="flex-1 flex flex-col items-center justify-center">
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
      <div className="flex flex-col items-center justify-center px-4 sm:px-8">
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
      <div className="flex-1 flex flex-col items-center justify-center">
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
    </div>
  );
}
