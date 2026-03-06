// ── BlurReveal Utility ─────────────────────────────────────────────
// Animates a PixiJS Sprite's blur filter from high to zero,
// revealing the animal progressively over time.

import { Sprite, filters } from 'pixi.js';

export interface BlurRevealOptions {
  /** Starting blur strength (default: 40) */
  initialBlur?: number;
  /** Duration in milliseconds to fully reveal (default: 8000) */
  duration?: number;
  /** Steps of blur reduction per tick (default: auto from duration) */
  onRevealComplete?: () => void;
}

export class BlurReveal {
  private blurFilter: filters.BlurFilter;
  private sprite: Sprite;
  private initialBlur: number;
  private currentBlur: number;
  private duration: number;
  private elapsed: number = 0;
  private complete: boolean = false;
  private onComplete?: () => void;

  constructor(sprite: Sprite, options: BlurRevealOptions = {}) {
    this.sprite = sprite;
    this.initialBlur = options.initialBlur ?? 40;
    this.currentBlur = this.initialBlur;
    this.duration = options.duration ?? 8000;
    this.onComplete = options.onRevealComplete;

    this.blurFilter = new filters.BlurFilter();
    this.blurFilter.strength = this.currentBlur;
    this.sprite.filters = [this.blurFilter];
  }

  /** Call every ticker tick. deltaMS = milliseconds elapsed since last frame */
  update(deltaMS: number): void {
    if (this.complete) return;

    this.elapsed += deltaMS;
    const progress = Math.min(this.elapsed / this.duration, 1);

    // Ease-out: blur decreases faster at start
    const eased = 1 - Math.pow(1 - progress, 2);
    this.currentBlur = this.initialBlur * (1 - eased);
    this.blurFilter.strength = this.currentBlur;

    if (progress >= 1) {
      this.complete = true;
      this.blurFilter.strength = 0;
      this.onComplete?.();
    }
  }

  /** Instantly reveal (e.g. on correct guess) */
  reveal(): void {
    this.complete = true;
    this.blurFilter.strength = 0;
    this.onComplete?.();
  }

  /** Reset to full blur */
  reset(): void {
    this.complete = false;
    this.elapsed = 0;
    this.currentBlur = this.initialBlur;
    this.blurFilter.strength = this.currentBlur;
  }

  get isComplete(): boolean {
    return this.complete;
  }

  get progress(): number {
    return Math.min(this.elapsed / this.duration, 1);
  }
}
