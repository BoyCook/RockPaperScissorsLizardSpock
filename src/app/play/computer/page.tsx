'use client';

import { useState } from 'react';
import { Move, playGame, GameResult, getRandomMove } from '@/lib/game/rules';
import MoveSelector from '@/components/game/MoveSelector';
import ResultDisplay from '@/components/game/ResultDisplay';

export default function ComputerGamePage() {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const handlePlay = () => {
    if (!playerMove) return;

    const cpuMove = getRandomMove();
    setComputerMove(cpuMove);

    const gameResult = playGame(playerMove, cpuMove);
    setResult(gameResult);

    if (!gameResult.isDraw) {
      if (gameResult.winner === playerMove) {
        setPlayerScore((prev) => prev + 1);
      } else {
        setComputerScore((prev) => prev + 1);
      }
    }
  };

  const handleReset = () => {
    setPlayerMove(null);
    setComputerMove(null);
    setResult(null);
  };

  const handleNewGame = () => {
    handleReset();
    setPlayerScore(0);
    setComputerScore(0);
  };

  const isPlayDisabled = !playerMove;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">vs Computer</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Test your luck against the AI
        </p>
      </div>

      <div className="mb-8 flex justify-center gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{playerScore}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">You</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{computerScore}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Computer
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <MoveSelector
          label="Choose Your Move"
          selectedMove={playerMove}
          onSelect={setPlayerMove}
          disabled={!!result}
        />

        {computerMove && (
          <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Computer chose:
            </p>
            <p className="text-2xl font-bold capitalize">{computerMove}</p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!result ? (
            <button
              onClick={handlePlay}
              disabled={isPlayDisabled}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold
                       hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all hover:scale-105 active:scale-95"
            >
              Play!
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold
                         hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
              >
                Play Again
              </button>
              <button
                onClick={handleNewGame}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold
                         hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
              >
                New Game
              </button>
            </>
          )}
        </div>

        {result && (
          <ResultDisplay
            result={result}
            player1Name="You"
            player2Name="Computer"
          />
        )}
      </div>
    </div>
  );
}
