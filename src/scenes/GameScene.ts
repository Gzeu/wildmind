// ── Game Scene ──────────────────────────────────────────────────
import { Container, Graphics, Text, TextStyle, Sprite, Assets } from 'pixi.js';
import { Button } from '@pixi/ui';
import { Game } from '../Game';
import { BlurReveal } from '../utils/BlurReveal';
import { buildChoices } from '../data/animals';

// Points system: more points for guessing early (less revealed)
function calcPoints(blurProgress: number, streak: number): number {
  const base = Math.round(100 * (1 - blurProgress));
  const streakBonus = streak > 1 ? streak * 10 : 0;
  return Math.max(10, base) + streakBonus;
}

// Helper: create a choice button using @pixi/ui Button
function makeChoiceButton(
  choice: string,
  btnW: number,
  btnH: number,
  defaultColor: number,
  onPress: () => void
): Button {
  const defaultBg = new Graphics()
    .roundRect(0, 0, btnW, btnH, 10)
    .fill({ color: defaultColor });
  const hoverBg = new Graphics()
    .roundRect(0, 0, btnW, btnH, 10)
    .fill({ color: 0x2a8c56 });
  const pressedBg = new Graphics()
    .roundRect(0, 0, btnW, btnH, 10)
    .fill({ color: 0x0e6e3a });

  const label = new Text({
    text: choice,
    style: new TextStyle({ fill: '#e8f5e9', fontSize: 18, fontFamily: 'Georgia, serif' }),
  });
  label.anchor.set(0.5);
  label.x = btnW / 2;
  label.y = btnH / 2;
  defaultBg.addChild(label);

  const btn = new Button({
    defaultView: defaultBg,
    hoverView: hoverBg,
    pressedView: pressedBg,
  });
  btn.onPress.connect(onPress);
  return btn;
}

export class GameScene extends Container {
  private game: Game;
  private blurReveal: BlurReveal | null = null;
  private animalSprite: Sprite | null = null;
  private timerText: Text | null = null;
  private feedbackText: Text | null = null;
  private guessed: boolean = false;
  private ticker: ((t: any) => void) | null = null;
  // Keep refs to disable buttons after guess
  private choiceButtons: Button[] = [];

  constructor(game: Game) {
    super();
    this.game = game;
    this.build();
  }

  private async build(): Promise<void> {
    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;
    const animal = this.game.currentAnimal;

    // BG
    const bg = new Graphics();
    bg.rect(0, 0, W, H).fill({ color: 0x0d2b1e });
    this.addChild(bg);

    // Round indicator
    const roundStyle = new TextStyle({ fill: '#a8d5b5', fontSize: 14, fontFamily: 'monospace' });
    const roundText = new Text({
      text: `Round ${this.game.state.round + 1} / ${this.game.state.totalRounds}   ★ Score: ${this.game.state.score}`,
      style: roundStyle
    });
    roundText.x = 20;
    roundText.y = 16;
    this.addChild(roundText);

    // Streak indicator
    if (this.game.state.streak > 1) {
      const streakStyle = new TextStyle({ fill: '#f5c842', fontSize: 14, fontFamily: 'monospace' });
      const streakText = new Text({ text: `\uD83D\uDD25 Streak x${this.game.state.streak}`, style: streakStyle });
      streakText.x = W - 140;
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
      style: new TextStyle({ fill: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' })
    });
    diffText.anchor.set(0.5);
    diffText.x = W / 2;
    diffText.y = 24;
    this.addChild(diffText);

    // Image area
    const imgSize = Math.min(W * 0.55, H * 0.48);
    const imgX = W / 2 - imgSize / 2;
    const imgY = H * 0.1;

    const imgBg = new Graphics();
    imgBg.roundRect(imgX, imgY, imgSize, imgSize, 16)
      .fill({ color: 0x1a5c36, alpha: 0.4 });
    this.addChild(imgBg);

    // Load image
    try {
      const texture = await Assets.load(animal.imageUrl);
      if (this.destroyed) return;

      const sprite = new Sprite(texture);
      sprite.width = imgSize;
      sprite.height = imgSize;
      sprite.x = imgX;
      sprite.y = imgY;
      this.addChild(sprite);
      this.animalSprite = sprite;

      this.blurReveal = new BlurReveal(sprite, {
        initialBlur: 38,
        duration: 9000,
        onRevealComplete: () => {
          if (!this.guessed) this.handleTimeout();
        },
      });

      this.ticker = (ticker) => {
        if (!this.guessed) {
          this.blurReveal?.update(ticker.deltaMS);
          this.updateTimer();
        }
      };
      this.game.app.ticker.add(this.ticker);
    } catch {
      const errStyle = new TextStyle({ fill: '#ff6666', fontSize: 14, fontFamily: 'monospace' });
      const errText = new Text({ text: 'Image unavailable — using fallback', style: errStyle });
      errText.anchor.set(0.5);
      errText.x = W / 2;
      errText.y = imgY + imgSize / 2;
      this.addChild(errText);
    }

    // Timer bar
    const timerBg = new Graphics();
    timerBg.roundRect(imgX, imgY + imgSize + 10, imgSize, 8, 4)
      .fill({ color: 0x1a5c36 });
    timerBg.name = 'timerBg';
    this.addChild(timerBg);

    const timerFill = new Graphics();
    timerFill.name = 'timerFill';
    this.addChild(timerFill);

    const timerText = new Text({
      text: '9s',
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 12, fontFamily: 'monospace' })
    });
    timerText.x = imgX + imgSize + 8;
    timerText.y = imgY + imgSize + 4;
    this.addChild(timerText);
    this.timerText = timerText;

    // ── Choice Buttons via @pixi/ui Button ──
    const choices = buildChoices(animal);
    const btnH = 52;
    const btnGap = 12;
    const totalH = choices.length * (btnH + btnGap) - btnGap;
    const startY = H - totalH - 30;
    const btnW = Math.min(W * 0.8, 420);

    choices.forEach((choice, i) => {
      const btn = makeChoiceButton(choice, btnW, btnH, 0x1a5c36, () => {
        this.handleGuess(choice, btn, animal.name);
      });
      btn.x = W / 2 - btnW / 2;
      btn.y = startY + i * (btnH + btnGap);
      this.addChild(btn);
      this.choiceButtons.push(btn);
    });

    // Feedback text
    const feedbackText = new Text({
      text: '',
      style: new TextStyle({ fill: '#f5c842', fontSize: 22, fontFamily: 'Georgia, serif', fontWeight: 'bold' })
    });
    feedbackText.anchor.set(0.5);
    feedbackText.x = W / 2;
    feedbackText.y = H * 0.07;
    this.addChild(feedbackText);
    this.feedbackText = feedbackText;
  }

  private updateTimer(): void {
    if (!this.blurReveal) return;
    const progress = this.blurReveal.progress;
    const secsLeft = Math.ceil(9 * (1 - progress));
    if (this.timerText) this.timerText.text = `${secsLeft}s`;

    const fill = this.getChildByName('timerFill') as Graphics | null;
    if (!fill) return;
    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;
    const imgSize = Math.min(W * 0.55, H * 0.48);
    const imgX = W / 2 - imgSize / 2;
    const imgY = H * 0.1;

    fill.clear();
    const fillW = imgSize * (1 - progress);
    if (fillW > 0) {
      const color = progress < 0.5 ? 0x4caf50 : progress < 0.8 ? 0xff9800 : 0xf44336;
      fill.roundRect(imgX, imgY + imgSize + 10, fillW, 8, 4).fill({ color });
    }
  }

  private handleGuess(choice: string, btn: Button, correctName: string): void {
    if (this.guessed) return;
    this.guessed = true;

    // Disable all buttons after guess
    this.choiceButtons.forEach(b => (b.enabled = false));

    const isCorrect = choice === correctName;
    const blurProgress = this.blurReveal?.progress ?? 1;

    if (isCorrect) {
      const pts = calcPoints(blurProgress, this.game.state.streak);
      this.game.onCorrectGuess(pts);
      // Tint correct button green
      (btn.defaultView as Graphics).tint = 0x4caf50;
      if (this.feedbackText) {
        this.feedbackText.text = `+${pts} pts! ${this.game.currentAnimal.emoji}`;
        this.feedbackText.style.fill = '#4caf50';
      }
    } else {
      this.game.onWrongGuess();
      (btn.defaultView as Graphics).tint = 0xf44336;
      if (this.feedbackText) {
        this.feedbackText.text = `It was ${correctName} ${this.game.currentAnimal.emoji}`;
        this.feedbackText.style.fill = '#f44336';
      }
    }

    this.blurReveal?.reveal();

    // Fun fact
    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;
    const factStyle = new TextStyle({
      fill: '#a8d5b5', fontSize: 13, fontFamily: 'Georgia, serif',
      fontStyle: 'italic', wordWrap: true, wordWrapWidth: W * 0.7
    });
    const fact = new Text({ text: `Fun fact: ${this.game.currentAnimal.funFact}`, style: factStyle });
    fact.anchor.set(0.5);
    fact.x = W / 2;
    fact.y = H * 0.13;
    this.addChild(fact);

    setTimeout(() => {
      if (!this.destroyed) this.game.nextRound();
    }, 2200);
  }

  private handleTimeout(): void {
    this.guessed = true;
    this.choiceButtons.forEach(b => (b.enabled = false));
    this.game.onWrongGuess();
    if (this.feedbackText) {
      this.feedbackText.text = `Time's up! It was ${this.game.currentAnimal.name} ${this.game.currentAnimal.emoji}`;
      this.feedbackText.style.fill = '#ff9800';
    }
    setTimeout(() => {
      if (!this.destroyed) this.game.nextRound();
    }, 2200);
  }

  override destroy(options?: any): void {
    if (this.ticker) {
      this.game.app.ticker.remove(this.ticker);
      this.ticker = null;
    }
    super.destroy(options);
  }
}
