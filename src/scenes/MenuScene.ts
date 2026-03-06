// ── Menu Scene ──────────────────────────────────────────────────
Import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Button } from '@pixi/ui';
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

    // Background
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
    const emojis = ['\u{1F981}', '\u{1F418}', '\u{1F992}', '\u{1F427}', '\u{1F419}'];
    emojis.forEach((emoji, i) => {
      const emojiStyle = new TextStyle({ fontSize: 42 });
      const e = new Text({ text: emoji, style: emojiStyle });
      e.anchor.set(0.5);
      e.x = W * 0.15 + i * (W * 0.175);
      e.y = H * 0.52;
      this.addChild(e);
    });

    // ── Play Button via @pixi/ui ──
    const btnW = 260;
    const btnH = 68;

    // Default state background
    const defaultBg = new Graphics()
      .roundRect(0, 0, btnW, btnH, 34)
      .fill({ color: 0xf5c842 });

    // Hover state background
    const hoverBg = new Graphics()
      .roundRect(0, 0, btnW, btnH, 34)
      .fill({ color: 0xffe080 });

    // Pressed state background
    const pressedBg = new Graphics()
      .roundRect(0, 0, btnW, btnH, 34)
      .fill({ color: 0xe0b030 });

    const playBtn = new Button({
      defaultView: defaultBg,
      hoverView: hoverBg,
      pressedView: pressedBg,
    });

    const btnLabel = new Text({
      text: 'Play Now',
      style: new TextStyle({
        fontFamily: 'Georgia, serif',
        fontSize: 26,
        fontWeight: 'bold',
        fill: '#0d2b1e',
      }),
    });
    btnLabel.anchor.set(0.5);
    btnLabel.x = btnW / 2;
    btnLabel.y = btnH / 2;
    defaultBg.addChild(btnLabel);

    playBtn.x = W / 2 - btnW / 2;
    playBtn.y = H * 0.64;
    playBtn.onPress.connect(() => this.game.startNewGame());
    this.addChild(playBtn);

    // Footer
    const footerStyle = new TextStyle({ fill: '#2d5c3e', fontSize: 12, fontFamily: 'monospace' });
    const footer = new Text({ text: 'WildMind v1.0 · 5 rounds · Guess the animal before the blur clears', style: footerStyle });
    footer.anchor.set(0.5);
    footer.x = W / 2;
    footer.y = H - 30;
    this.addChild(footer);
  }
}
