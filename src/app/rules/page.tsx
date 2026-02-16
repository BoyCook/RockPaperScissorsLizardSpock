import NavBar from '@/components/NavBar';

const rules = [
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
];

export default function RulesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl w-full text-center space-y-12">
        <NavBar variant="dark" />
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Game Rules
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Each choice beats two others and loses to two others.
            <br className="hidden sm:block" />
            Can you remember them all?
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center text-sm sm:text-base">
            {rules.map((rule, i) => (
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
