// ── Scene Transition ─────────────────────────────────────────────
// Full-screen fade overlay for smooth scene transitions.

import { Application, Graphics, Ticker } from 'pixi.js';

export class SceneTransition {
  private overlay: Graphics;
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.overlay = new Graphics();
    this.overlay.eventMode = 'none';
  }

  /** Fade out (transparent → black), then call onMidpoint, then fade in (black → transparent) */
  async crossfade(onMidpoint: () => void, durationMs = 300): Promise<void> {
    const W = this.app.screen.width;
    const H = this.app.screen.height;

    this.overlay.clear();
    this.overlay.rect(0, 0, W, H).fill({ color: 0x000000 });
    this.overlay.alpha = 0;
    this.app.stage.addChild(this.overlay);

    await this._animateAlpha(0, 1, durationMs / 2);
    onMidpoint();
    await this._animateAlpha(1, 0, durationMs / 2);

    this.app.stage.removeChild(this.overlay);
  }

  private _animateAlpha(from: number, to: number, durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.alpha = from;
      let elapsed = 0;

      const ticker = new Ticker();
      ticker.add((t) => {
        elapsed += t.deltaMS;
        const p = Math.min(elapsed / durationMs, 1);
        this.overlay.alpha = from + (to - from) * p;
        if (p >= 1) {
          ticker.destroy();
          resolve();
        }
      });
      ticker.start();
    });
  }
}
