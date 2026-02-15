export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm text-center">
        <h1 className="text-6xl font-bold mb-8">
          Rock Paper Scissors Lizard Spock
        </h1>
        <p className="text-xl mb-8">
          The game that expands on the classic Rock Paper Scissors
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/play/local"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Play Local
          </a>
          <a
            href="/play/computer"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            vs Computer
          </a>
          <a
            href="/play/remote"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Play Online
          </a>
        </div>
      </div>
    </main>
  );
}
