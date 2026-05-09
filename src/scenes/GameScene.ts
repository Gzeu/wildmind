// ── Game Scene ──────────────────────────────────────────────────
import { Container, Graphics, Text, TextStyle, Sprite, Assets, Ticker } from 'pixi.js';
import { Button } from '@pixi/ui';
import { Game } from '../Game';
import { BlurReveal } from '../utils/BlurReveal';
import { buildChoices } from '../data/animals';
import { soundManager } from '../utils/SoundManager';
import { KeyboardHandler } from '../utils/KeyboardHandler';
import { calcImageSize, calcButtonWidth } from '../utils/Responsive';

const REVEAL_DURATION_MS = 9000;

function calcPoints(blurProgress: number, streak: number): number {
  const base = Math.round(100 * (1 - blurProgress));
  const streakBonus = streak > 1 ? streak * 10 : 0;
  return Math.max(10, base) + streakBonus;
}

function makeChoiceButton(
  choice: string,
  btnW: number,
  btnH: number,
  onPress: () => void,
): Button {
  const defaultBg = new Graphics().roundRect(0, 0, btnW, btnH, 10).fill({ color: 0x1a5c36 });
  const hoverBg = new Graphics().roundRect(0, 0, btnW, btnH, 10).fill({ color: 0x2a8c56 });
  const pressedBg = new Graphics().roundRect(0, 0, btnW, btnH, 10).fill({ color: 0x0e6e3a });

  const label = new Text({
    text: choice,
    style: new TextStyle({ fill: '#e8f5e9', fontSize: 18, fontFamily: 'Georgia, serif' }),
  });
  label.anchor.set(0.5);
  label.x = btnW / 2;
  label.y = btnH / 2;
  defaultBg.addChild(label);

  const btn = new Button({ defaultView: defaultBg, hoverView: hoverBg, pressedView: pressedBg });
  btn.onPress.connect(onPress);
  return btn;
}

export class GameScene extends Container {
  private game: Game;
  private blurReveal: BlurReveal | null = null;
  private timerText: Text | null = null;
  private feedbackText: Text | null = null;
  private guessed = false;
  private ticker: ((t: Ticker) => void) | null = null;
  private choiceButtons: Button[] = [];
  private lastTickSec = -1;
  private keyboard: KeyboardHandler | null = null;
  // Store layout refs for timer redraw
  private imgX = 0;
  private imgY = 0;
  private imgSize = 0;

  constructor(game: Game) {
    super();
    this.game = game;
    void this.build();
  }

  private async build(): Promise<void> {
    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;
    const animal = this.game.currentAnimal;

    // BG
    const bg = new Graphics();
    bg.rect(0, 0, W, H).fill({ color: 0x0d2b1e });
    this.addChild(bg);

    // Mute toggle
    const muteTxt = new Text({ text: '🔊', style: new TextStyle({ fontSize: 20 }) });
    muteTxt.x = W - 44;
    muteTxt.y = 12;
    muteTxt.eventMode = 'static';
    muteTxt.cursor = 'pointer';
    muteTxt.on('pointerdown', () => {
      const muted = soundManager.toggleMute();
      muteTxt.text = muted ? '🔇' : '🔊';
    });
    this.addChild(muteTxt);

    // Round / score header
    const roundText = new Text({
      text: `Round ${this.game.state.round + 1} / ${this.game.state.totalRounds}   ★ Score: ${this.game.state.score}`,
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 14, fontFamily: 'monospace' }),
    });
    roundText.x = 20;
    roundText.y = 16;
    this.addChild(roundText);

    // Streak
    if (this.game.state.streak > 1) {
      const streakText = new Text({
        text: `\uD83D\uDD25 Streak x${this.game.state.streak}`,
        style: new TextStyle({ fill: '#f5c842', fontSize: 14, fontFamily: 'monospace' }),
      });
      streakText.x = W - 150;
      streakText.y = 16;
      this.addChild(streakText);
    }

    // Difficulty badge
    const diffColors: Record<string, number> = { easy: 0x4caf50, medium: 0xff9800, hard: 0xf44336 };
    const diffBadge = new Graphics();
    diffBadge.roundRect(W / 2 - 40, 10, 80, 28, 14).fill({ color: diffColors[animal.difficulty] });
    this.addChild(diffBadge);
    const diffText = new Text({
      text: animal.difficulty.toUpperCase(),
      style: new TextStyle({ fill: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' }),
    });
    diffText.anchor.set(0.5);
    diffText.x = W / 2;
    diffText.y = 24;
    this.addChild(diffText);

    // Image area layout
    this.imgSize = calcImageSize(W, H);
    this.imgX = W / 2 - this.imgSize / 2;
    this.imgY = H * 0.1;

    const imgBg = new Graphics();
    imgBg.roundRect(this.imgX, this.imgY, this.imgSize, this.imgSize, 16)
      .fill({ color: 0x1a5c36, alpha: 0.4 });
    this.addChild(imgBg);

    // Load image
    try {
      const texture = await Assets.load(animal.imageUrl);
      if (this.destroyed) return;

      const sprite = new Sprite(texture);
      sprite.width = this.imgSize;
      sprite.height = this.imgSize;
      sprite.x = this.imgX;
      sprite.y = this.imgY;
      this.addChild(sprite);

      this.blurReveal = new BlurReveal(sprite, {
        initialBlur: 38,
        duration: REVEAL_DURATION_MS,
        onRevealComplete: () => {
          if (!this.guessed) this.handleTimeout();
        },
      });

      this.ticker = (t) => {
        if (!this.guessed) {
          this.blurReveal?.update(t.deltaMS);
          this.updateTimer();
        }
      };
      this.game.app.ticker.add(this.ticker);
    } catch {
      if (this.destroyed) return;
      const errText = new Text({
        text: 'Image unavailable — skipping round',
        style: new TextStyle({ fill: '#ff6666', fontSize: 14, fontFamily: 'monospace' }),
      });
      errText.anchor.set(0.5);
      errText.x = W / 2;
      errText.y = this.imgY + this.imgSize / 2;
      this.addChild(errText);
      setTimeout(() => {
        if (!this.destroyed) { this.game.onWrongGuess(); this.game.nextRound(); }
      }, 2000);
      return;
    }

    if (this.destroyed) return;

    // Timer bar
    const timerBg = new Graphics();
    timerBg.roundRect(this.imgX, this.imgY + this.imgSize + 10, this.imgSize, 8, 4)
      .fill({ color: 0x1a5c36 });
    timerBg.name = 'timerBg';
    this.addChild(timerBg);

    const timerFill = new Graphics();
    timerFill.name = 'timerFill';
    this.addChild(timerFill);

    const timerText = new Text({
      text: `${REVEAL_DURATION_MS / 1000}s`,
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 12, fontFamily: 'monospace' }),
    });
    timerText.x = this.imgX + this.imgSize + 8;
    timerText.y = this.imgY + this.imgSize + 4;
    this.addChild(timerText);
    this.timerText = timerText;

    // Choice buttons
    const choices = buildChoices(animal);
    const btnH = 52;
    const btnGap = 12;
    const totalBtnH = choices.length * (btnH + btnGap) - btnGap;
    const startY = H - totalBtnH - 30;
    const btnW = calcButtonWidth(W);

    choices.forEach((choice, i) => {
      const btn = makeChoiceButton(choice, btnW, btnH, () => {
        this.handleGuess(choice, btn, animal.name);
      });
      btn.x = W / 2 - btnW / 2;
      btn.y = startY + i * (btnH + btnGap);
      this.addChild(btn);
      this.choiceButtons.push(btn);
    });

    // Keyboard shortcuts: 1-4 for choice buttons
    const keyMap: Record<string, () => void> = {};
    choices.forEach((_, i) => {
      keyMap[String(i + 1)] = () => {
        if (!this.guessed && this.choiceButtons[i]) {
          this.choiceButtons[i].onPress.emit();
        }
      };
    });
    this.keyboard = new KeyboardHandler(keyMap);

    // Feedback text
    const feedbackText = new Text({
      text: '',
      style: new TextStyle({ fill: '#f5c842', fontSize: 22, fontFamily: 'Georgia, serif', fontWeight: 'bold' }),
    });
    feedbackText.anchor.set(0.5);
    feedbackText.x = W / 2;
    feedbackText.y = H * 0.07;
    this.addChild(feedbackText);
    this.feedbackText = feedbackText;

    // Keyboard hint
    const hintText = new Text({
      text: 'Press 1–4 to guess',
      style: new TextStyle({ fill: '#2d5c3e', fontSize: 11, fontFamily: 'monospace' }),
    });
    hintText.anchor.set(0.5);
    hintText.x = W / 2;
    hintText.y = H - 12;
    this.addChild(hintText);
  }

  private updateTimer(): void {
    if (!this.blurReveal) return;
    const progress = this.blurReveal.progress;
    const secsLeft = Math.ceil((REVEAL_DURATION_MS / 1000) * (1 - progress));

    if (secsLeft <= 3 && secsLeft !== this.lastTickSec && secsLeft > 0) {
      this.lastTickSec = secsLeft;
      soundManager.playTick();
    }

    if (this.timerText) this.timerText.text = `${secsLeft}s`;

    const fill = this.getChildByName('timerFill') as Graphics | null;
    if (!fill) return;
    fill.clear();
    const fillW = this.imgSize * (1 - progress);
    if (fillW > 0) {
      const color = progress < 0.5 ? 0x4caf50 : progress < 0.8 ? 0xff9800 : 0xf44336;
      fill.roundRect(this.imgX, this.imgY + this.imgSize + 10, fillW, 8, 4).fill({ color });
    }
  }

  private handleGuess(choice: string, btn: Button, correctName: string): void {
    if (this.guessed) return;
    this.guessed = true;
    this.choiceButtons.forEach(b => (b.enabled = false));

    const isCorrect = choice === correctName;
    const blurProgress = this.blurReveal?.progress ?? 1;

    if (isCorrect) {
      const pts = calcPoints(blurProgress, this.game.state.streak);
      this.game.onCorrectGuess(pts);
      (btn.defaultView as Graphics).tint = 0x4caf50;
      if (this.feedbackText) {
        this.feedbackText.text = `+${pts} pts! ${this.game.currentAnimal.emoji}`;
        (this.feedbackText.style as TextStyle).fill = '#4caf50';
      }
      soundManager.playCorrect();
    } else {
      this.game.onWrongGuess();
      (btn.defaultView as Graphics).tint = 0xf44336;
      if (this.feedbackText) {
        this.feedbackText.text = `It was ${correctName} ${this.game.currentAnimal.emoji}`;
        (this.feedbackText.style as TextStyle).fill = '#f44336';
      }
      soundManager.playWrong();
    }

    this.blurReveal?.reveal();

    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;
    const fact = new Text({
      text: `💡 ${this.game.currentAnimal.funFact}`,
      style: new TextStyle({
        fill: '#a8d5b5', fontSize: 13, fontFamily: 'Georgia, serif',
        fontStyle: 'italic', wordWrap: true, wordWrapWidth: W * 0.72,
      }),
    });
    fact.anchor.set(0.5);
    fact.x = W / 2;
    fact.y = H * 0.13;
    this.addChild(fact);

    setTimeout(() => { if (!this.destroyed) this.game.nextRound(); }, 2200);
  }

  private handleTimeout(): void {
    this.guessed = true;
    this.choiceButtons.forEach(b => (b.enabled = false));
    this.game.onWrongGuess();
    soundManager.playWrong();
    if (this.feedbackText) {
      this.feedbackText.text = `⏰ Time's up! It was ${this.game.currentAnimal.name} ${this.game.currentAnimal.emoji}`;
      (this.feedbackText.style as TextStyle).fill = '#ff9800';
    }
    setTimeout(() => { if (!this.destroyed) this.game.nextRound(); }, 2200);
  }

  override destroy(options?: Parameters<Container['destroy']>[0]): void {
    if (this.ticker) {
      this.game.app.ticker.remove(this.ticker);
      this.ticker = null;
    }
    this.keyboard?.destroy();
    super.destroy(options);
  }
}
