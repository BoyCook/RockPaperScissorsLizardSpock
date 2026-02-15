import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-20 max-w-6xl">
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-black leading-tight">
              ROCK PAPER
              <br />
              SCISSORS
            </h1>
            <div
              className="text-5xl sm:text-6xl md:text-8xl font-black"
              style={{
                background:
                  'linear-gradient(to right, #60a5fa, #a78bfa, #f87171)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LIZARD SPOCK
            </div>
          </div>

          {/* Emoji Row */}
          <div className="flex justify-center items-center gap-4 sm:gap-8 text-6xl sm:text-8xl md:text-9xl py-8">
            <span className="animate-bounce-ready">✊</span>
            <span className="animate-bounce-ready animation-delay-150">✋</span>
            <span className="animate-bounce-ready animation-delay-300">✌️</span>
            <span className="hidden sm:inline animate-bounce-ready">🦎</span>
            <span className="hidden sm:inline animate-bounce-ready animation-delay-150">
              🖖
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 font-medium max-w-3xl mx-auto">
            The legendary 5-move variant popularized by{' '}
            <span className="font-black text-black">The Big Bang Theory</span>
          </p>
        </div>
      </div>

      {/* Game Mode Cards */}
      <div className="container mx-auto px-4 pb-16 sm:pb-24 max-w-5xl">
        <h2 className="text-4xl sm:text-5xl font-black text-center text-black mb-12">
          CHOOSE YOUR MODE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Local Game */}
          <Link
            href="/play/local"
            className="group relative bg-black rounded-3xl p-8 sm:p-12 hover:scale-105 transition-transform duration-300"
          >
            <div className="space-y-6">
              <div className="text-8xl sm:text-9xl">👥</div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-3">
                  LOCAL GAME
                </h3>
                <p className="text-lg sm:text-xl text-gray-400 font-medium">
                  Two players on the same device
                </p>
              </div>
              <div
                className="inline-block px-6 py-3 rounded-full font-black text-lg border-2"
                style={{ borderColor: '#60a5fa', color: '#60a5fa' }}
              >
                PLAY NOW →
              </div>
            </div>
          </Link>

          {/* vs Computer */}
          <Link
            href="/play/computer"
            className="group relative bg-black rounded-3xl p-8 sm:p-12 hover:scale-105 transition-transform duration-300"
          >
            <div className="space-y-6">
              <div className="text-8xl sm:text-9xl">🤖</div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-3">
                  VS COMPUTER
                </h3>
                <p className="text-lg sm:text-xl text-gray-400 font-medium">
                  Test your luck against AI
                </p>
              </div>
              <div
                className="inline-block px-6 py-3 rounded-full font-black text-lg border-2"
                style={{ borderColor: '#f87171', color: '#f87171' }}
              >
                PLAY NOW →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Rules Section */}
      <div className="bg-black py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl sm:text-5xl font-black text-center text-white mb-12">
            HOW IT WORKS
          </h2>

          {/* The 5 Moves */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 mb-16 max-w-4xl mx-auto">
            {[
              { emoji: '✊', name: 'ROCK' },
              { emoji: '✋', name: 'PAPER' },
              { emoji: '✌️', name: 'SCISSORS' },
              { emoji: '🦎', name: 'LIZARD' },
              { emoji: '🖖', name: 'SPOCK' },
            ].map((move) => (
              <div
                key={move.name}
                className="bg-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-6xl sm:text-7xl mb-3">{move.emoji}</div>
                <div className="text-sm sm:text-base font-black text-white">
                  {move.name}
                </div>
              </div>
            ))}
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              'Scissors cuts Paper',
              'Paper covers Rock',
              'Rock crushes Lizard',
              'Lizard poisons Spock',
              'Spock smashes Scissors',
              'Scissors decapitates Lizard',
              'Lizard eats Paper',
              'Paper disproves Spock',
              'Spock vaporizes Rock',
              'Rock crushes Scissors',
            ].map((rule, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl px-6 py-4 text-white font-medium text-base sm:text-lg"
              >
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-12 border-t-2 border-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">
            Game invented by{' '}
            <span className="font-black text-black">
              Sam Kass & Karen Bryla
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
