export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Rock Paper Scissors
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Lizard Spock
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            The legendary game invented by Sam Kass and Karen Bryla,
            <br className="hidden sm:block" />
            popularized by The Big Bang Theory
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <a
            href="/play/local"
            className="group relative p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-white mb-2">Local Game</h3>
            <p className="text-gray-300">Two players, same device</p>
          </a>

          <a
            href="/play/computer"
            className="group relative p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
          >
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-2">vs Computer</h3>
            <p className="text-gray-300">Test your luck against AI</p>
          </a>

          <a
            href="/play/remote"
            className="group relative p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 sm:col-span-2 lg:col-span-1"
          >
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Online
              <span className="ml-2 text-xs px-2 py-1 bg-purple-500/30 rounded-full">
                Soon
              </span>
            </h3>
            <p className="text-gray-300">Challenge players worldwide</p>
          </a>
        </div>

        {/* Rules Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Game Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm sm:text-base">
            {[
              '✂️ Scissors cuts Paper',
              '📄 Paper covers Rock',
              '🪨 Rock crushes Lizard',
              '🦎 Lizard poisons Spock',
              '🖖 Spock smashes Scissors',
              '✂️ Scissors decapitates Lizard',
              '🦎 Lizard eats Paper',
              '📄 Paper disproves Spock',
              '🖖 Spock vaporizes Rock',
              '🪨 Rock crushes Scissors',
            ].map((rule, i) => (
              <div
                key={i}
                className="text-gray-300 bg-white/5 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
              >
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
