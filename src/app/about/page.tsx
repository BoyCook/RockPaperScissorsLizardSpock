import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            About the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Game
            </span>
          </h1>
        </div>

        {/* Origin Story */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto text-left space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">The Origin</h2>
          <p className="text-gray-300 leading-relaxed">
            Rock Paper Scissors Lizard Spock was invented by{' '}
            <span className="text-white font-semibold">Sam Kass</span> and{' '}
            <span className="text-white font-semibold">Karen Bryla</span> as an
            expansion of the classic Rock Paper Scissors. The problem with the
            original game? When played between people who know each other well,
            it tends to end in a tie 75&ndash;80% of the time.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By adding two extra moves &mdash; Lizard and Spock &mdash; each choice now
            beats two others and loses to two others, reducing the chance of a
            draw and making the game far more unpredictable and fun.
          </p>
        </div>

        {/* Big Bang Theory */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto text-left space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            The Big Bang Theory
          </h2>
          <p className="text-gray-300 leading-relaxed">
            The game was popularized by{' '}
            <span className="text-white font-semibold">Sheldon Cooper</span> in
            the hit TV show <em>The Big Bang Theory</em>. It first appeared in
            Season 2, Episode 8 &mdash; &ldquo;The Lizard-Spock Expansion&rdquo; &mdash; where
            Sheldon introduces it to settle a dispute about what to watch on TV.
          </p>
          <p className="text-gray-300 leading-relaxed">
            The show later gave proper credit to Sam Kass in Season 5, Episode 17
            &mdash; &ldquo;The Rothman Disintegration&rdquo; &mdash; when Sheldon acknowledges
            Kass as the game&apos;s creator.
          </p>
        </div>

        {/* YouTube Video */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Sheldon Explains It Best
          </h2>
          <iframe
            className="w-full aspect-video rounded-xl"
            src="https://www.youtube.com/embed/iapcKVn7DdY"
            title="Rock Paper Scissors Lizard Spock - The Big Bang Theory"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto text-left space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">How It Works</h2>
          <p className="text-gray-300 leading-relaxed">
            As Sheldon puts it: &ldquo;It&apos;s very simple. Scissors cuts paper, paper
            covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes
            scissors, scissors decapitates lizard, lizard eats paper, paper
            disproves Spock, Spock vaporizes rock, and as it always has, rock
            crushes scissors.&rdquo;
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
