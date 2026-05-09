// ── WildMind — Entry Point ───────────────────────────────────────────
import { Application } from 'pixi.js';
import { Game } from './Game';

(async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    background: '#0d2b1e',
  });

  document.body.appendChild(app.canvas);

  const game = new Game(app);
  game.goTo('menu');

  // Rebuild current scene on window resize for correct layout
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      game.rebuildCurrentScene();
    }, 150);
  });
})();
