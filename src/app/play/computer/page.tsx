'use client';

import { useState, useEffect } from 'react';
import { Move, playGame, GameResult, getRandomMove } from '@/lib/game/rules';
import MoveSelector from '@/components/game/MoveSelector';
import ResultDisplay from '@/components/game/ResultDisplay';
import HandBattle from '@/components/game/HandBattle';

export default function ComputerGamePage() {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);

  // Auto-play with countdown when player selects a move
  useEffect(() => {
    if (playerMove && !result && !isCountdown) {
      const cpuMove = getRandomMove();
      setComputerMove(cpuMove);

      // Start countdown animation
      setIsCountdown(true);

      // Reveal after countdown (1 second)
      setTimeout(() => {
        const gameResult = playGame(playerMove, cpuMove);
        setResult(gameResult);
        setIsCountdown(false);

        if (!gameResult.isDraw) {
          if (gameResult.winner === playerMove) {
            setPlayerScore((prev) => prev + 1);
          } else {
            setComputerScore((prev) => prev + 1);
          }
        }
      }, 1000);
    }
  }, [playerMove, result, isCountdown]);

  const handleReset = () => {
    setPlayerMove(null);
    setComputerMove(null);
    setResult(null);
    setIsCountdown(false);
  };

  const handleNewGame = () => {
    handleReset();
    setPlayerScore(0);
    setComputerScore(0);
  };

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
            vs Computer
          </h1>
          <p className="text-lg text-gray-300">Test your luck against the AI</p>
        </div>

        {/* Score Board */}
        <div className="mb-8 flex justify-center gap-4 sm:gap-12">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-blue-400/50 min-w-[140px]">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {playerScore}
            </div>
            <div className="text-sm font-semibold text-white">You</div>
          </div>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white/40">VS</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-red-400/50 min-w-[140px]">
            <div className="text-5xl font-bold text-red-400 mb-2">
              {computerScore}
            </div>
            <div className="text-sm font-semibold text-white">Computer 🤖</div>
          </div>
        </div>

        {/* Hand Battle Display */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
          <HandBattle
            player1Move={playerMove}
            player2Move={computerMove}
            showResult={!!result}
            isCountdown={isCountdown}
            player1Label="You"
            player2Label="Computer 🤖"
          />
        </div>

        {/* Game Area */}
        <div className="space-y-8 bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
          <MoveSelector
            label="Choose Your Move"
            selectedMove={playerMove}
            onSelect={setPlayerMove}
            disabled={!!result}
          />

          {/* Action Buttons */}
          {result && (
            <div className="flex justify-center gap-4 pt-4">
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
            </div>
          )}

          {result && (
            <ResultDisplay
              result={result}
              player1Name="You"
              player2Name="Computer"
            />
          )}
        </div>
      </div>
    </div>
  );
}
