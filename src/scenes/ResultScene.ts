// ── Result Scene ─────────────────────────────────────────────────
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Button } from '@pixi/ui';
import { Game } from '../Game';
import { saveHighScore, getHighScore } from '../services/HighScore';
import { soundManager } from '../utils/SoundManager';

function getRank(score: number): { label: string; emoji: string; color: string } {
  if (score >= 450) return { label: 'WildMind Master', emoji: '🏆', color: '#f5c842' };
  if (score >= 300) return { label: 'Safari Expert', emoji: '🦁', color: '#4caf50' };
  if (score >= 200) return { label: 'Nature Explorer', emoji: '🌿', color: '#2196f3' };
  if (score >= 100) return { label: 'Curious Mind', emoji: '🐧', color: '#ff9800' };
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
    const { score } = this.game.state;
    const rank = getRank(score);
    const isNewRecord = saveHighScore(score);
    const highScore = getHighScore();

    soundManager.playFanfare();

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

    // New record banner
    if (isNewRecord) {
      const newRecordStyle = new TextStyle({
        fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 'bold',
        fill: '#f5c842', fontStyle: 'italic',
      });
      const newRecord = new Text({ text: '🎉 New Personal Record!', style: newRecordStyle });
      newRecord.anchor.set(0.5);
      newRecord.x = W / 2;
      newRecord.y = H * 0.09;
      this.addChild(newRecord);
    }

    // Rank emoji
    const rankEmoji = new Text({ text: rank.emoji, style: new TextStyle({ fontSize: 72 }) });
    rankEmoji.anchor.set(0.5);
    rankEmoji.x = W / 2;
    rankEmoji.y = H * 0.2;
    this.addChild(rankEmoji);

    // Rank label
    const rankLabel = new Text({
      text: rank.label,
      style: new TextStyle({ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 'bold', fill: rank.color }),
    });
    rankLabel.anchor.set(0.5);
    rankLabel.x = W / 2;
    rankLabel.y = H * 0.34;
    this.addChild(rankLabel);

    // Score
    const scoreTxt = new Text({
      text: `${score}`,
      style: new TextStyle({ fontFamily: 'Georgia, serif', fontSize: 56, fontWeight: 'bold', fill: '#f5c842' }),
    });
    scoreTxt.anchor.set(0.5);
    scoreTxt.x = W / 2;
    scoreTxt.y = H * 0.46;
    this.addChild(scoreTxt);

    const scoreLabel = new Text({
      text: 'points',
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 18, fontFamily: 'Georgia, serif' }),
    });
    scoreLabel.anchor.set(0.5);
    scoreLabel.x = W / 2;
    scoreLabel.y = H * 0.54;
    this.addChild(scoreLabel);

    // High score
    const hsTxt = new Text({
      text: `🏆 Best: ${highScore} pts`,
      style: new TextStyle({ fill: '#f5c842', fontSize: 13, fontFamily: 'monospace' }),
    });
    hsTxt.anchor.set(0.5);
    hsTxt.x = W / 2;
    hsTxt.y = H * 0.6;
    this.addChild(hsTxt);

    // ── Play Again button ──
    const btnW = 260;
    const btnH = 62;

    const playDefaultBg = new Graphics().roundRect(0, 0, btnW, btnH, 31).fill({ color: 0xf5c842 });
    const playHoverBg = new Graphics().roundRect(0, 0, btnW, btnH, 31).fill({ color: 0xffe080 });
    const playPressedBg = new Graphics().roundRect(0, 0, btnW, btnH, 31).fill({ color: 0xe0b030 });
    const playBtn = new Button({ defaultView: playDefaultBg, hoverView: playHoverBg, pressedView: playPressedBg });
    const playLabel = new Text({
      text: 'Play Again',
      style: new TextStyle({ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 'bold', fill: '#0d2b1e' }),
    });
    playLabel.anchor.set(0.5);
    playLabel.x = btnW / 2;
    playLabel.y = btnH / 2;
    playDefaultBg.addChild(playLabel);
    playBtn.x = W / 2 - btnW / 2;
    playBtn.y = H * 0.66;
    playBtn.onPress.connect(() => this.game.startNewGame());
    this.addChild(playBtn);

    // ── Menu button ──
    const menuW = 180;
    const menuH = 44;
    const menuDefaultBg = new Graphics().roundRect(0, 0, menuW, menuH, 22).stroke({ color: 0xa8d5b5, width: 2 });
    const menuHoverBg = new Graphics().roundRect(0, 0, menuW, menuH, 22).fill({ color: 0x1a5c36 }).stroke({ color: 0xa8d5b5, width: 2 });
    const menuPressedBg = new Graphics().roundRect(0, 0, menuW, menuH, 22).fill({ color: 0x0e3d22 }).stroke({ color: 0xa8d5b5, width: 2 });
    const menuBtn = new Button({ defaultView: menuDefaultBg, hoverView: menuHoverBg, pressedView: menuPressedBg });
    const menuLabel = new Text({
      text: 'Main Menu',
      style: new TextStyle({ fill: '#a8d5b5', fontSize: 16, fontFamily: 'Georgia, serif' }),
    });
    menuLabel.anchor.set(0.5);
    menuLabel.x = menuW / 2;
    menuLabel.y = menuH / 2;
    menuDefaultBg.addChild(menuLabel);
    menuBtn.x = W / 2 - menuW / 2;
    menuBtn.y = H * 0.78;
    menuBtn.onPress.connect(() => this.game.goTo('menu'));
    this.addChild(menuBtn);

    // Watermark
    const wm = new Text({
      text: 'WildMind — How wild is your mind?',
      style: new TextStyle({ fill: '#1a5c36', fontSize: 11, fontFamily: 'monospace' }),
    });
    wm.anchor.set(0.5);
    wm.x = W / 2;
    wm.y = H - 24;
    this.addChild(wm);
  }
}
