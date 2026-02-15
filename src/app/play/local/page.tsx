'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Move, playGame, GameResult } from '@/lib/game/rules';
import MoveSelector from '@/components/game/MoveSelector';
import HandBattle from '@/components/game/HandBattle';

export default function LocalGamePage() {
  const [player1Move, setPlayer1Move] = useState<Move | null>(null);
  const [player2Move, setPlayer2Move] = useState<Move | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);

  // Auto-play with countdown when both moves are selected
  useEffect(() => {
    if (player1Move && player2Move && !result && !isCountdown) {
      // Start countdown animation
      setIsCountdown(true);

      // Reveal after countdown (2 seconds)
      setTimeout(() => {
        const gameResult = playGame(player1Move, player2Move);
        setResult(gameResult);
        setIsCountdown(false);

        if (!gameResult.isDraw) {
          if (gameResult.winner === player1Move) {
            setPlayer1Score((prev) => prev + 1);
          } else {
            setPlayer2Score((prev) => prev + 1);
          }
        }
      }, 2000);
    }
  }, [player1Move, player2Move, result, isCountdown]);

  // Auto-reset after showing result for 2 seconds
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        handleReset();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleReset = () => {
    setPlayer1Move(null);
    setPlayer2Move(null);
    setResult(null);
    setIsCountdown(false);
  };

  const handleNewGame = () => {
    handleReset();
    setPlayer1Score(0);
    setPlayer2Score(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-white/60 hover:text-white mb-4 transition-colors"
          >
            ← Back to Home
          </Link>
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

        {/* Hand Battle Display */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
          <HandBattle
            player1Move={player1Move}
            player2Move={player2Move}
            showResult={!!result}
            isCountdown={isCountdown}
            player1Label="Player 1"
            player2Label="Player 2"
            result={result}
          />
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
          {result && (
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={handleNewGame}
                className="px-8 py-4 bg-white/10 text-white text-lg rounded-2xl font-bold border border-white/20
                         hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
              >
                New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
