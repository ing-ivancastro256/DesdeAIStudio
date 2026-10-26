/**
 * Color Utilities for High-Performance Hex, RGB, RGBA, and HSV Conversions
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

export interface RGBA extends RGB {
  a: number; // 0 - 1
}

/**
 * Clamps and rounds alpha to at most 2 decimal places in [0, 1]
 */
export function roundAlpha(a: number): number {
  if (!Number.isFinite(a)) return 1;
  const clamped = Math.max(0, Math.min(1, a));
  return Math.round(clamped * 100) / 100;
}

/**
 * Formats alpha cleanly for display in the A input (e.g. 1 -> "1", 0.50 -> "0.5", 0 -> "0")
 */
export function formatAlphaDisplay(a: number): string {
  return String(roundAlpha(a));
}

/**
 * Normalizes any hex string into uppercase hex characters (up to 8 chars if alpha hex is pasted, or 6 by default)
 */
export function sanitizeHexInput(raw: string, maxLen: 6 | 8 = 6): string {
  if (!raw) return '';
  let clean = raw.trim().replace(/^#+/, '');
  clean = clean.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  return clean.slice(0, maxLen);
}

/**
 * Validates if a string is a 6-digit or 3-digit hex color
 */
export function isValidHex(raw: string): boolean {
  const clean = sanitizeHexInput(raw, 8);
  return clean.length === 6 || clean.length === 3 || clean.length === 8 || clean.length === 4;
}

/**
 * Converts a hex string to RGB
 */
export function hexToRgb(rawHex: string): RGB {
  let hex = sanitizeHexInput(rawHex, 8);
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .slice(0, 3)
      .split('')
      .map((char) => char + char)
      .join('');
  } else if (hex.length === 8) {
    hex = hex.slice(0, 6);
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
 * Converts RGB (0-255) to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rNorm = Math.max(0, Math.min(255, r)) / 255;
  const gNorm = Math.max(0, Math.min(255, g)) / 255;
  const bNorm = Math.max(0, Math.min(255, b)) / 255;

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
    h: Math.round(h) % 360,
    s: Math.round(s),
    v: Math.round(v),
  };
}

/**
 * Converts Hex to HSV
 */
export function hexToHsv(rawHex: string): HSV {
  const { r, g, b } = hexToRgb(rawHex);
  return rgbToHsv(r, g, b);
}

/**
 * Converts HSV to RGB (0-255)
 */
export function hsvToRgb(h: number, s: number, v: number): RGB {
  const hClamped = ((h % 360) + 360) % 360;
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

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

/**
 * Converts HSV to 6-digit uppercase Hex
 */
export function hsvToHex(h: number, s: number, v: number, withHash: boolean = true): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b, withHash);
}

/**
 * Parses any CSS Hex (#RGB, #RGBA, #RRGGBB, #RRGGBBAA), rgb(...), rgba(...), or 'transparent' into RGBA
 */
export function parseColorToRgba(input?: string, fallbackHex: string = '#121111'): RGBA {
  if (!input || !input.trim()) {
    const fb = hexToRgb(fallbackHex);
    return { ...fb, a: 1 };
  }

  const trimmed = input.trim();

  if (trimmed.toLowerCase() === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // Match rgb(...) or rgba(...) with comma or space/slash syntax
  const rgbaMatch = trimmed.match(
    /^rgba?\(\s*([0-9.]+)\s*(?:,|\s)\s*([0-9.]+)\s*(?:,|\s)\s*([0-9.]+)(?:\s*(?:,|\/)\s*([0-9.]+%?))?\s*\)$/i
  );
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, Math.round(parseFloat(rgbaMatch[1]) || 0)));
    const g = Math.max(0, Math.min(255, Math.round(parseFloat(rgbaMatch[2]) || 0)));
    const b = Math.max(0, Math.min(255, Math.round(parseFloat(rgbaMatch[3]) || 0)));
    let a = 1;
    if (rgbaMatch[4] !== undefined) {
      const rawA = rgbaMatch[4].trim();
      if (rawA.endsWith('%')) {
        a = roundAlpha((parseFloat(rawA) || 0) / 100);
      } else {
        a = roundAlpha(parseFloat(rawA));
      }
    }
    return { r, g, b, a };
  }

  // Hex formats (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
  const hex = sanitizeHexInput(trimmed, 8);
  if (hex.length === 8) {
    const num = parseInt(hex.slice(0, 6), 16);
    const alphaByte = parseInt(hex.slice(6, 8), 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      a: roundAlpha(alphaByte / 255),
    };
  }
  if (hex.length === 4) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    const alphaByte = parseInt(hex[3] + hex[3], 16);
    return {
      r,
      g,
      b,
      a: roundAlpha(alphaByte / 255),
    };
  }
  if (hex.length === 6) {
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      a: 1,
    };
  }
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return { r, g, b, a: 1 };
  }

  const fb = hexToRgb(fallbackHex);
  return { ...fb, a: 1 };
}

/**
 * Strictly attempts to parse a string as a color (Hex with or without #, rgb(), rgba(), or "r, g, b[, a]").
 * Returns null if the string is not a recognizable color format.
 */
export function tryParseColorString(input?: string): RGBA | null {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();

  if (trimmed.toLowerCase() === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // rgb(...) or rgba(...)
  const rgbaMatch = trimmed.match(
    /^rgba?\(\s*([0-9.]+)\s*(?:,|\s)\s*([0-9.]+)\s*(?:,|\s)\s*([0-9.]+)(?:\s*(?:,|\/)\s*([0-9.]+%?))?\s*\)$/i
  );
  if (rgbaMatch) {
    return parseColorToRgba(trimmed);
  }

  // Plain comma-separated "133, 133, 133" or "133, 133, 133, 0.5"
  const tupleMatch = trimmed.match(
    /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+%?))?$/
  );
  if (tupleMatch) {
    const r = Math.max(0, Math.min(255, parseInt(tupleMatch[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(tupleMatch[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(tupleMatch[3], 10)));
    let a = 1;
    if (tupleMatch[4] !== undefined) {
      const rawA = tupleMatch[4].trim();
      a = rawA.endsWith('%')
        ? roundAlpha((parseFloat(rawA) || 0) / 100)
        : roundAlpha(parseFloat(rawA));
    }
    return { r, g, b, a };
  }

  // Strict Hex (#RGB, #RGBA, #RRGGBB, #RRGGBBAA, or without #)
  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (hexMatch) {
    return parseColorToRgba(`#${hexMatch[1]}`);
  }

  return null;
}

/**
 * Formats RGBA into clean CSS string:
 * - Returns "#RRGGBB" when alpha >= 1
 * - Returns "rgba(r, g, b, a)" when alpha < 1
 */
export function formatColorOutput(r: number, g: number, b: number, a: number): string {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  const cleanA = roundAlpha(a);

  if (cleanA >= 1) {
    return rgbToHex(clampR, clampG, clampB, true);
  }
  return `rgba(${clampR}, ${clampG}, ${clampB}, ${cleanA})`;
}
