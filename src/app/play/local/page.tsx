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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <a
            href="/"
            className="inline-block text-white/60 hover:text-white mb-4 transition-colors"
          >
            ← Back to Home
          </a>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Local Game
          </h1>
          <p className="text-lg text-gray-300">
            Two players on the same device
          </p>
        </div>

        {/* Score Board */}
        <div className="mb-8 flex justify-center gap-4 sm:gap-12">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-blue-400/50 min-w-[140px]">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {player1Score}
            </div>
            <div className="text-sm font-semibold text-white">Player 1</div>
          </div>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white/40">VS</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-red-400/50 min-w-[140px]">
            <div className="text-5xl font-bold text-red-400 mb-2">
              {player2Score}
            </div>
            <div className="text-sm font-semibold text-white">Player 2</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="space-y-8 bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
          <MoveSelector
            label="Player 1 - Choose Your Move"
            selectedMove={player1Move}
            onSelect={setPlayer1Move}
            disabled={!!result}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 text-xl font-bold text-white/40">
                VS
              </span>
            </div>
          </div>

          <MoveSelector
            label="Player 2 - Choose Your Move"
            selectedMove={player2Move}
            onSelect={setPlayer2Move}
            disabled={!!result}
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {!result ? (
              <button
                onClick={handlePlay}
                disabled={isPlayDisabled}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg rounded-2xl font-bold
                         hover:from-green-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/50 disabled:hover:scale-100"
              >
                Play!
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg rounded-2xl font-bold
                           hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
                >
                  Play Again
                </button>
                <button
                  onClick={handleNewGame}
                  className="px-8 py-4 bg-white/10 text-white text-lg rounded-2xl font-bold border border-white/20
                           hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
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
    </div>
  );
}
