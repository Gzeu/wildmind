# WildMind

> **How wild is your mind?** A progressive animal guessing puzzle game built with PixiJS 8 & TypeScript.

## Live Demo

Deploys automatically to GitHub Pages on every push to `main`.

## Overview

WildMind is a browser-based game where players are shown a progressively revealed (blur-to-clear) image of an animal and must guess what it is before the image fully unblurs. The faster you guess, the higher your score!

## Features

- 🔮 **Progressive blur reveal** — ease-out animation over 9 seconds
- 🎥 **20 animals** across Easy / Medium / Hard difficulty, stratified per round
- ⌨️ **Keyboard shortcuts** — press `1`–`4` to select answers
- 🏆 **High score persistence** — localStorage, shown on Menu and Results
- 🔥 **Streak bonuses** — consecutive correct guesses multiply your score
- 🎉 **Scene transitions** — smooth black crossfade between all scenes
- 🔊 **Procedural sound effects** — correct, wrong, tick, fanfare via Web Audio API
- 📱 **Responsive** — rebuilds layout on window resize
- ✅ **Fully typed** with strict TypeScript
- 🚀 **CI/CD** — auto-deploy to GitHub Pages via GitHub Actions

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
- TypeScript 5 (strict mode)
- Vite 5
- Web Audio API — procedural sound, no external files

## Project Structure

```
wildmind/
├── .github/workflows/
│   └── deploy.yml           # CI/CD → GitHub Pages
├── src/
│   ├── data/
│   │   └── animals.ts           # 20 animals, stratified shuffle
│   ├── scenes/
│   │   ├── MenuScene.ts
│   │   ├── GameScene.ts
│   │   └── ResultScene.ts
│   ├── services/
│   │   ├── AnimalAPI.ts         # Wikipedia fetcher (future use)
│   │   └── HighScore.ts         # localStorage persistence
│   ├── utils/
│   │   ├── BlurReveal.ts
│   │   ├── KeyboardHandler.ts   # 1–4 keyboard shortcuts
│   │   ├── Responsive.ts        # Layout scale helpers
│   │   ├── SceneTransition.ts
│   │   └── SoundManager.ts
│   ├── Game.ts              # State + scene router + resize rebuild
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

```bash
npm install
npm run dev      # localhost:3000
npm run build    # → dist/
npm run preview  # preview production build
```

## Deploy

Push to `main` → GitHub Actions builds and deploys automatically to GitHub Pages.

For manual deploy to Vercel / Netlify: point the build command to `npm run build` and the publish directory to `dist`.

## License

MIT
