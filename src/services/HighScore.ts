// ── High Score Service ─────────────────────────────────────────────
// Persists best score in localStorage.

const KEY = 'wildmind_highscore';

export function getHighScore(): number {
  return parseInt(localStorage.getItem(KEY) ?? '0', 10);
}

export function saveHighScore(score: number): boolean {
  const prev = getHighScore();
  if (score > prev) {
    localStorage.setItem(KEY, String(score));
    return true; // new record
  }
  return false;
}

export function clearHighScore(): void {
  localStorage.removeItem(KEY);
}
