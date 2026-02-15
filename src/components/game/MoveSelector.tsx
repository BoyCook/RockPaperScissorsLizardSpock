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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {MOVES.map((move) => {
          const isSelected = selectedMove === move.value;
          return (
            <button
              key={move.value}
              onClick={() => onSelect(move.value)}
              disabled={disabled}
              className={`
                group relative flex flex-col items-center justify-center
                p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300
                hover:scale-105 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                ${
                  isSelected
                    ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/50 scale-105'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:shadow-xl'
                }
              `}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse" />
              )}
              <span className="relative text-5xl sm:text-6xl mb-3 group-hover:scale-110 transition-transform">
                {move.emoji}
              </span>
              <span className="relative text-sm sm:text-base font-semibold text-white">
                {move.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
