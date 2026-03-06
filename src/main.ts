// ── WildMind — Entry Point ─────────────────────────────────────────────
import { Application } from 'pixi.js';
import { Game } from './Game';

(async () => {
  // Create and init PixiJS application
  const app = new Application();
  await app.init({
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    background: '#0d2b1e',
  });

  document.body.appendChild(app.canvas);

  // Create game and start at menu
  const game = new Game(app);
  game.goTo('menu');

  // Handle resize
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
})();
