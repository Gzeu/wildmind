// ── Responsive Helpers ─────────────────────────────────────────────
// Scale UI values relative to screen dimensions.

export function rw(fraction: number, W: number): number {
  return Math.round(W * fraction);
}

export function rh(fraction: number, H: number): number {
  return Math.round(H * fraction);
}

/** Clamp a font size to min/max based on screen width */
export function responsiveFontSize(base: number, W: number, min = 10, max = 72): number {
  const scale = W / 800;
  return Math.min(max, Math.max(min, Math.round(base * scale)));
}

/** Return image size that fits within available game area */
export function calcImageSize(W: number, H: number): number {
  return Math.min(W * 0.55, H * 0.48, 360);
}

/** Return button width capped for mobile */
export function calcButtonWidth(W: number): number {
  return Math.min(W * 0.82, 420);
}
