'use client';

import { Move } from '@/lib/game/rules';

interface MoveSelectorProps {
  label: string;
  selectedMove: Move | null;
  onSelect: (move: Move) => void;
  disabled?: boolean;
}

const MOVES: { value: Move; label: string; emoji: string }[] = [
  { value: 'rock', label: 'Rock', emoji: '✊' },
  { value: 'paper', label: 'Paper', emoji: '✋' },
  { value: 'scissors', label: 'Scissors', emoji: '✌️' },
  { value: 'lizard', label: 'Lizard', emoji: '🦎' },
  { value: 'spock', label: 'Spock', emoji: '🖖' },
];

export default function MoveSelector({
  label,
  selectedMove,
  onSelect,
  disabled = false,
}: MoveSelectorProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center text-white">{label}</h3>
      <div className="flex flex-wrap justify-center gap-15 sm:gap-18">
        {MOVES.map((move) => {
          const isSelected = selectedMove === move.value;
          return (
            <button
              key={move.value}
              onClick={() => onSelect(move.value)}
              disabled={disabled}
              className={`
                group relative flex flex-col items-center justify-center
                w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 transition-all duration-300
                hover:scale-110 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                ${
                  isSelected
                    ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/50 scale-110'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:shadow-xl'
                }
              `}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse" />
              )}
              <span className="relative text-[64px] sm:text-[80px] group-hover:scale-110 transition-transform">
                {move.emoji}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
