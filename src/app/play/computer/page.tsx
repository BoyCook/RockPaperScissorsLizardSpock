'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Move, playGame, GameResult, getRandomMove } from '@/lib/game/rules';
import MoveSelector from '@/components/game/MoveSelector';
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

      // Reveal after countdown (2 seconds)
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
      }, 2000);
    }
  }, [playerMove, result, isCountdown]);

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
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Score Board */}
        <div className="mb-8 flex justify-around items-center max-w-5xl mx-auto">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-10 py-8 border-2 min-w-[180px]" style={{ borderColor: '#60a5fa' }}>
            <div className="text-3xl font-black mb-4" style={{ color: '#60a5fa' }}>YOU</div>
            <div className="text-8xl font-black" style={{ color: '#60a5fa' }}>
              {playerScore}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-white/60">VS</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-10 py-8 border-2 min-w-[180px]" style={{ borderColor: '#f87171' }}>
            <div className="text-3xl font-black mb-4" style={{ color: '#f87171' }}>COMPUTER 🤖</div>
            <div className="text-8xl font-black" style={{ color: '#f87171' }}>
              {computerScore}
            </div>
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
            result={result}
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
