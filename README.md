# WildMind

> **How wild is your mind?** A progressive animal guessing puzzle game built with PixiJS 8 & TypeScript.

## Overview

WildMind is a browser-based game where players are shown a progressively revealed (blur-to-clear) image of an animal and must guess what it is before the image fully unblurs. The faster you guess, the higher your score!

## Features

- Progressive blur reveal using PixiJS 8 filters
- Animal image fetching via external Animal API
- Multiple game scenes: Menu, Game, Result
- Score tracking and difficulty progression
- Fully typed with TypeScript

## Tech Stack

- [PixiJS 8](https://pixijs.com) — 2D rendering engine
- TypeScript — type-safe game logic
- Vite — fast bundler and dev server

## Project Structure

```
wildmind/
├── src/
│   ├── data/          # Static animal data
│   ├── scenes/        # Game scenes (Menu, Game, Result)
│   ├── services/      # API services (AnimalAPI)
│   ├── utils/         # Utility helpers (BlurReveal, etc.)
│   ├── Game.ts        # Core game controller
│   └── main.ts        # Entry point
├── index.html
└── package.json
```

## Getting Started

```bash
npm install
npm run dev
```

## License

MIT
