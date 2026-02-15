import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MoveSelector from '@/components/game/MoveSelector';

describe('MoveSelector', () => {
  const mockOnSelect = vi.fn();

  describe('when rendering', () => {
    it('displays the label', () => {
      render(
        <MoveSelector
          label="Choose Your Move"
          selectedMove={null}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Choose Your Move')).toBeInTheDocument();
    });

    it('renders all five moves', () => {
      render(
        <MoveSelector
          label="Choose"
          selectedMove={null}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('✊')).toBeInTheDocument();
      expect(screen.getByText('✋')).toBeInTheDocument();
      expect(screen.getByText('✌️')).toBeInTheDocument();
      expect(screen.getByText('🦎')).toBeInTheDocument();
      expect(screen.getByText('🖖')).toBeInTheDocument();
    });
  });

  describe('when selecting a move', () => {
    it('calls onSelect with the chosen move', () => {
      render(
        <MoveSelector
          label="Choose"
          selectedMove={null}
          onSelect={mockOnSelect}
        />
      );

      fireEvent.click(screen.getByText('✊'));

      expect(mockOnSelect).toHaveBeenCalledWith('rock');
    });

    it('highlights the selected move', () => {
      const { rerender } = render(
        <MoveSelector
          label="Choose"
          selectedMove={null}
          onSelect={mockOnSelect}
        />
      );

      rerender(
        <MoveSelector
          label="Choose"
          selectedMove="rock"
          onSelect={mockOnSelect}
        />
      );

      const rockButton = screen.getByText('✊').closest('button');
      expect(rockButton).toHaveClass('border-blue-400');
    });
  });

  describe('when disabled', () => {
    it('disables all move buttons', () => {
      render(
        <MoveSelector
          label="Choose"
          selectedMove={null}
          onSelect={mockOnSelect}
          disabled={true}
        />
      );

      const rockButton = screen.getByText('✊').closest('button');
      expect(rockButton).toBeDisabled();
    });
  });
});
