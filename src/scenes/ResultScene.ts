// ── Result Scene ─────────────────────────────────────────────────
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Game } from '../Game';

function getRank(score: number, total: number): { label: string; emoji: string; color: string } {
  const pct = score / (total * 100);
  if (pct >= 0.9) return { label: 'WildMind Master', emoji: '🏆', color: '#f5c842' };
  if (pct >= 0.7) return { label: 'Safari Expert', emoji: '🦁', color: '#4caf50' };
  if (pct >= 0.5) return { label: 'Nature Explorer', emoji: '🌿', color: '#2196f3' };
  if (pct >= 0.3) return { label: 'Curious Mind', emoji: '🐧', color: '#ff9800' };
  return { label: 'Wild Rookie', emoji: '🌱', color: '#a8d5b5' };
}

export class ResultScene extends Container {
  private game: Game;

  constructor(game: Game) {
    super();
    this.game = game;
    this.build();
  }

  private build(): void {
    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;
    const { score, totalRounds } = this.game.state;
    const rank = getRank(score, totalRounds);

    // BG
    const bg = new Graphics();
    bg.rect(0, 0, W, H).fill({ color: 0x0d2b1e });
    this.addChild(bg);

    // Decorative circles
    for (let i = 0; i < 5; i++) {
      const c = new Graphics();
      c.circle(W / 2, H * 0.38, 70 + i * 55)
        .stroke({ color: 0x1a5c36, alpha: 0.12 - i * 0.02, width: 2 });
      this.addChild(c);
    }

    // Rank emoji
    const emojiStyle = new TextStyle({ fontSize: 72 });
    const rankEmoji = new Text({ text: rank.emoji, style: emojiStyle });
    rankEmoji.anchor.set(0.5);
    rankEmoji.x = W / 2;
    rankEmoji.y = H * 0.2;
    this.addChild(rankEmoji);

    // Rank label
    const rankStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 32,
      fontWeight: 'bold',
      fill: rank.color,
    });
    const rankLabel = new Text({ text: rank.label, style: rankStyle });
    rankLabel.anchor.set(0.5);
    rankLabel.x = W / 2;
    rankLabel.y = H * 0.34;
    this.addChild(rankLabel);

    // Score
    const scoreStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 56,
      fontWeight: 'bold',
      fill: '#f5c842',
    });
    const scoreTxt = new Text({ text: `${score}`, style: scoreStyle });
    scoreTxt.anchor.set(0.5);
    scoreTxt.x = W / 2;
    scoreTxt.y = H * 0.46;
    this.addChild(scoreTxt);

    const scoreLabel = new Text({
      text: 'points',
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 18, fontFamily: 'Georgia, serif' })
    });
    scoreLabel.anchor.set(0.5);
    scoreLabel.x = W / 2;
    scoreLabel.y = H * 0.54;
    this.addChild(scoreLabel);

    // Play Again button
    const btnW = 260;
    const btnH = 62;
    const btnX = W / 2 - btnW / 2;
    const btnY = H * 0.64;

    const btnBg = new Graphics();
    btnBg.roundRect(btnX, btnY, btnW, btnH, 31).fill({ color: 0xf5c842 });
    btnBg.eventMode = 'static';
    btnBg.cursor = 'pointer';
    btnBg.on('pointerover', () => btnBg.tint = 0xffe080);
    btnBg.on('pointerout', () => btnBg.tint = 0xffffff);
    btnBg.on('pointerdown', () => this.game.startNewGame());
    this.addChild(btnBg);

    const btnTxt = new Text({
      text: 'Play Again',
      style: new TextStyle({ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 'bold', fill: '#0d2b1e' })
    });
    btnTxt.anchor.set(0.5);
    btnTxt.x = W / 2;
    btnTxt.y = btnY + btnH / 2;
    this.addChild(btnTxt);

    // Menu button
    const menuBtnW = 180;
    const menuBtnX = W / 2 - menuBtnW / 2;
    const menuBtnY = H * 0.76;
    const menuBtn = new Graphics();
    menuBtn.roundRect(menuBtnX, menuBtnY, menuBtnW, 44, 22)
      .stroke({ color: 0xa8d5b5, width: 2 });
    menuBtn.eventMode = 'static';
    menuBtn.cursor = 'pointer';
    menuBtn.on('pointerdown', () => this.game.goTo('menu'));
    this.addChild(menuBtn);

    const menuTxt = new Text({
      text: 'Main Menu',
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 16, fontFamily: 'Georgia, serif' })
    });
    menuTxt.anchor.set(0.5);
    menuTxt.x = W / 2;
    menuTxt.y = menuBtnY + 22;
    this.addChild(menuTxt);

    // WildMind watermark
    const wm = new Text({
      text: 'WildMind — How wild is your mind?',
      style: new TextStyle({ fill: '#1a5c36', fontSize: 11, fontFamily: 'monospace' })
    });
    wm.anchor.set(0.5);
    wm.x = W / 2;
    wm.y = H - 24;
    this.addChild(wm);
  }
}
