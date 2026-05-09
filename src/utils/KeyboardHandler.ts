// ── Keyboard Handler ─────────────────────────────────────────────
// Manages keyboard shortcuts and cleans up on destroy.

type KeyMap = Record<string, () => void>;

export class KeyboardHandler {
  private map: KeyMap;
  private listener: (e: KeyboardEvent) => void;

  constructor(map: KeyMap) {
    this.map = map;
    this.listener = (e: KeyboardEvent) => {
      const handler = this.map[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener('keydown', this.listener);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.listener);
  }
}
