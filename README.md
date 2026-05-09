# WildMind

> **How wild is your mind?** A progressive animal guessing puzzle game built with PixiJS 8 & TypeScript.

## Overview

WildMind is a browser-based game where players are shown a progressively revealed (blur-to-clear) image of an animal and must guess what it is before the image fully unblurs. The faster you guess, the higher your score!

## Features

- 🔮 **Progressive blur reveal** — PixiJS 8 filters with ease-out animation over 9 seconds
- 🎥 **14 animals** across Easy / Medium / Hard difficulty, stratified per round
- 🏆 **High score persistence** — localStorage, visible on Menu and Results screen
- 🔥 **Streak bonuses** — consecutive correct guesses multiply your score
- 🎉 **Scene transitions** — smooth black crossfade between all scenes
- 🔊 **Procedural sound effects** — correct, wrong, tick, and fanfare via Web Audio API (no assets)
- 📱 **Responsive** — resizes to any screen size
- ✅ **Fully typed** with strict TypeScript

## Rank System

| Score | Rank |
|-------|------|
| 450+  | 🏆 WildMind Master |
| 300+  | 🦁 Safari Expert |
| 200+  | 🌿 Nature Explorer |
| 100+  | 🐧 Curious Mind |
| < 100 | 🌱 Wild Rookie |

## Tech Stack

- [PixiJS 8](https://pixijs.com) — 2D rendering engine
- [@pixi/ui](https://github.com/pixijs/ui) — interactive Button components
- TypeScript 5 (strict mode) — type-safe game logic
- Vite 5 — fast bundler and dev server
- Web Audio API — procedural sound (no external files)

## Project Structure

```
wildmind/
├── src/
│   ├── data/
│   │   └── animals.ts          # 14 animals, stratified shuffle, choice builder
│   ├── scenes/
│   │   ├── MenuScene.ts        # Title screen + high score display
│   │   ├── GameScene.ts        # Core gameplay: blur reveal, timer, choices
│   │   └── ResultScene.ts      # Score, rank, new record banner, replay
│   ├── services/
│   │   ├── AnimalAPI.ts        # Wikipedia image fetcher (optional/future)
│   │   └── HighScore.ts        # localStorage high score persistence
│   ├── utils/
│   │   ├── BlurReveal.ts       # Blur filter animation utility
│   │   ├── SceneTransition.ts  # Crossfade between scenes
│   │   └── SoundManager.ts     # Procedural Web Audio sound effects
│   ├── Game.ts             # State manager + scene router
│   └── main.ts             # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

Output is in `dist/` — deploy to any static host (Vercel, Netlify, GitHub Pages).

## License

MIT
