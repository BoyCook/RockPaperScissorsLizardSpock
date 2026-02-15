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
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">{label}</h3>
      <div className="grid grid-cols-5 gap-4">
        {MOVES.map((move) => (
          <button
            key={move.value}
            onClick={() => onSelect(move.value)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center
              p-4 rounded-lg border-2 transition-all
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                selectedMove === move.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
              }
            `}
          >
            <span className="text-4xl mb-2">{move.emoji}</span>
            <span className="text-sm font-medium">{move.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
