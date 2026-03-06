// ── Menu Scene ─────────────────────────────────────────────────
import { Container, Graphics, Text, TextStyle, Sprite, Assets } from 'pixi.js';
import { Game } from '../Game';

export class MenuScene extends Container {
  private game: Game;

  constructor(game: Game) {
    super();
    this.game = game;
    this.build();
  }

  private build(): void {
    const W = this.game.app.screen.width;
    const H = this.game.app.screen.height;

    // Background gradient effect
    const bg = new Graphics();
    bg.rect(0, 0, W, H).fill({ color: 0x0d2b1e });
    this.addChild(bg);

    // Decorative circles (forest feel)
    for (let i = 0; i < 6; i++) {
      const circle = new Graphics();
      const r = 80 + i * 60;
      circle.circle(W * 0.5, H * 0.4, r)
        .stroke({ color: 0x1a5c36, alpha: 0.15 - i * 0.02, width: 2 });
      this.addChild(circle);
    }

    // Title
    const titleStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 72,
      fontWeight: 'bold',
      fill: '#f5c842',
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
      letterSpacing: 4,
    });
    const title = new Text({ text: 'WildMind', style: titleStyle });
    title.anchor.set(0.5);
    title.x = W / 2;
    title.y = H * 0.28;
    this.addChild(title);

    // Tagline
    const tagStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 22,
      fill: '#a8d5b5',
      fontStyle: 'italic',
    });
    const tagline = new Text({ text: 'How wild is your mind?', style: tagStyle });
    tagline.anchor.set(0.5);
    tagline.x = W / 2;
    tagline.y = H * 0.38;
    this.addChild(tagline);

    // Emoji animals decoration
    const emojis = ['🦁', '🐘', '🦒', '🐧', '🐙'];
    emojis.forEach((emoji, i) => {
      const emojiStyle = new TextStyle({ fontSize: 42 });
      const e = new Text({ text: emoji, style: emojiStyle });
      e.anchor.set(0.5);
      e.x = W * 0.15 + i * (W * 0.175);
      e.y = H * 0.52;
      this.addChild(e);
    });

    // Play button
    const btnBg = new Graphics();
    const btnW = 260;
    const btnH = 68;
    const btnX = W / 2 - btnW / 2;
    const btnY = H * 0.64;

    btnBg.roundRect(btnX, btnY, btnW, btnH, 34)
      .fill({ color: 0xf5c842 });
    btnBg.eventMode = 'static';
    btnBg.cursor = 'pointer';
    btnBg.on('pointerover', () => btnBg.tint = 0xffe080);
    btnBg.on('pointerout', () => btnBg.tint = 0xffffff);
    btnBg.on('pointerdown', () => this.game.startNewGame());
    this.addChild(btnBg);

    const btnStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 26,
      fontWeight: 'bold',
      fill: '#0d2b1e',
    });
    const btnText = new Text({ text: 'Play Now', style: btnStyle });
    btnText.anchor.set(0.5);
    btnText.x = W / 2;
    btnText.y = btnY + btnH / 2;
    this.addChild(btnText);

    // Footer
    const footerStyle = new TextStyle({ fill: '#2d5c3e', fontSize: 12, fontFamily: 'monospace' });
    const footer = new Text({ text: 'WildMind v1.0 · 5 rounds · Guess the animal before the blur clears', style: footerStyle });
    footer.anchor.set(0.5);
    footer.x = W / 2;
    footer.y = H - 30;
    this.addChild(footer);
  }
}
