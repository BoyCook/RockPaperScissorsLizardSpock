# Rock Paper Scissors Lizard Spock - Next.js Edition

[![CI](https://github.com/BoyCook/RockPaperScissorsLizardSpock/actions/workflows/ci.yml/badge.svg)](https://github.com/BoyCook/RockPaperScissorsLizardSpock/actions/workflows/ci.yml)

A modern implementation of Rock Paper Scissors Lizard Spock built with Next.js, TypeScript, and real-time multiplayer support.

## Features

- 🎮 Three game modes: Local, vs Computer, Online Multiplayer
- 🔐 User authentication with NextAuth.js
- ⚡ Real-time multiplayer with Socket.IO
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🧪 Comprehensive test coverage
- 🚀 Server-Side Rendering (SSR)

## The Rules

- Scissors cuts paper
- Paper covers rock
- Rock crushes lizard
- Lizard poisons Spock
- Spock smashes scissors
- Scissors decapitates lizard
- Lizard eats paper
- Paper disproves Spock
- Spock vaporizes rock
- Rock crushes scissors

## Getting Started

### Prerequisites

- Node.js 20+
- Redis (local or Upstash)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm test` - Run tests in watch mode
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # React components
├── lib/                  # Core business logic
│   ├── game/            # Game rules and engine
│   ├── redis/           # Redis client and operations
│   └── auth/            # Authentication configuration
├── hooks/               # Custom React hooks
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
docker-compose up
```

## Legacy Codebase

The original Express.js + Backbone.js implementation is preserved in the `legacy` branch.

## License

See LICENSE file for details.

## Author

Craig Cook - [http://craigcook.co.uk](http://craigcook.co.uk)
