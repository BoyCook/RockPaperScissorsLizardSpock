'use client';

import { useState } from 'react';
import { Move, playGame, GameResult } from '@/lib/game/rules';
import MoveSelector from '@/components/game/MoveSelector';
import ResultDisplay from '@/components/game/ResultDisplay';

export default function LocalGamePage() {
  const [player1Move, setPlayer1Move] = useState<Move | null>(null);
  const [player2Move, setPlayer2Move] = useState<Move | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const handlePlay = () => {
    if (!player1Move || !player2Move) return;

    const gameResult = playGame(player1Move, player2Move);
    setResult(gameResult);

    if (!gameResult.isDraw) {
      if (gameResult.winner === player1Move) {
        setPlayer1Score((prev) => prev + 1);
      } else {
        setPlayer2Score((prev) => prev + 1);
      }
    }
  };

  const handleReset = () => {
    setPlayer1Move(null);
    setPlayer2Move(null);
    setResult(null);
  };

  const handleNewGame = () => {
    handleReset();
    setPlayer1Score(0);
    setPlayer2Score(0);
  };

  const isPlayDisabled = !player1Move || !player2Move;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Local Game</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Two players on the same device
        </p>
      </div>

      <div className="mb-8 flex justify-center gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{player1Score}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Player 1
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{player2Score}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Player 2
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <MoveSelector
          label="Player 1 - Choose Your Move"
          selectedMove={player1Move}
          onSelect={setPlayer1Move}
          disabled={!!result}
        />

        <div className="border-t-2 border-gray-200 dark:border-gray-700 my-8" />

        <MoveSelector
          label="Player 2 - Choose Your Move"
          selectedMove={player2Move}
          onSelect={setPlayer2Move}
          disabled={!!result}
        />

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
            player1Name="Player 1"
            player2Name="Player 2"
          />
        )}
      </div>
    </div>
  );
}
