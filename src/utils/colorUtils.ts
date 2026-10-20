/**
 * Color Utilities for High-Performance Hex, HSV, and RGB Conversions
 */

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

/**
 * Normalizes any hex string into a standard 6-digit hex uppercase (e.g. "2848F0" or "#2848F0" -> "2848F0")
 */
export function sanitizeHexInput(raw: string): string {
  if (!raw) return '';
  // Strip any leading # or whitespace
  let clean = raw.trim().replace(/^#+/, '');
  // Keep only valid hex characters
  clean = clean.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  return clean.slice(0, 6);
}

/**
 * Validates if a string is a 6-digit or 3-digit hex color
 */
export function isValidHex(raw: string): boolean {
  const clean = sanitizeHexInput(raw);
  return clean.length === 6 || clean.length === 3;
}

/**
 * Converts a hex string to RGB
 */
export function hexToRgb(rawHex: string): RGB {
  let hex = sanitizeHexInput(rawHex);
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }
  if (hex.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB to 6-digit uppercase Hex (with optional leading #)
 */
export function rgbToHex(r: number, g: number, b: number, withHash: boolean = true): string {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  const hex = ((1 << 24) + (clampR << 16) + (clampG << 8) + clampB)
    .toString(16)
    .slice(1)
    .toUpperCase();
  return withHash ? `#${hex}` : hex;
}

/**
 * Converts Hex to HSV
 */
export function hexToHsv(rawHex: string): HSV {
  const { r, g, b } = hexToRgb(rawHex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / delta) % 6);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / delta + 2);
    } else {
      h = 60 * ((rNorm - gNorm) / delta + 4);
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
}

/**
 * Converts HSV to 6-digit uppercase Hex
 */
export function hsvToHex(h: number, s: number, v: number, withHash: boolean = true): string {
  const hClamped = Math.max(0, Math.min(360, h));
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const vNorm = Math.max(0, Math.min(100, v)) / 100;

  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((hClamped / 60) % 2) - 1));
  const m = vNorm - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hClamped >= 0 && hClamped < 60) {
    rPrime = c;
    gPrime = x;
    bPrime = 0;
  } else if (hClamped >= 60 && hClamped < 120) {
    rPrime = x;
    gPrime = c;
    bPrime = 0;
  } else if (hClamped >= 120 && hClamped < 180) {
    rPrime = 0;
    gPrime = c;
    bPrime = x;
  } else if (hClamped >= 180 && hClamped < 240) {
    rPrime = 0;
    gPrime = x;
    bPrime = c;
  } else if (hClamped >= 240 && hClamped < 300) {
    rPrime = x;
    gPrime = 0;
    bPrime = c;
  } else {
    rPrime = c;
    gPrime = 0;
    bPrime = x;
  }

  const r = Math.round((rPrime + m) * 255);
  const g = Math.round((gPrime + m) * 255);
  const b = Math.round((bPrime + m) * 255);

  return rgbToHex(r, g, b, withHash);
}
