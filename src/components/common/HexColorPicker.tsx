import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Pipette, Check, X, Copy, ClipboardPaste } from 'lucide-react';
import {
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  sanitizeHexInput,
  parseColorToRgba,
  tryParseColorString,
  formatColorOutput,
  formatAlphaDisplay,
  roundAlpha,
  HSV,
  RGB,
} from '../../utils/colorUtils';

export interface HexColorPickerProps {
  label?: string;
  value: string; // Hex "#2848F0" or "rgba(40, 72, 240, 0.5)"
  onChange: (color: string) => void;
  className?: string;
  compact?: boolean;
  onOpen?: () => void;
  onClose?: (applied: boolean) => void;
}

const PRESET_COLORS = [
  '#000000',
  '#18181B',
  '#374151',
  '#6B7280',
  '#9CA3AF',
  '#FFFFFF',
  '#2848F0',
  '#2563EB',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
];

const CHECKERBOARD_BG: React.CSSProperties = {
  backgroundImage:
    'repeating-conic-gradient(#d4d4d8 0% 25%, #ffffff 0% 50%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0',
};

type FocusedField = 'hex' | 'r' | 'g' | 'b' | 'a' | null;

// Shared color clipboard so 1-click Copy -> Paste works across all color pickers even if iframe blocks clipboard.readText
let sharedCopiedColor = '';

function writeTextSafe(text: string): void {
  sharedCopiedColor = text;
  try {
    sessionStorage.setItem('funnel_copied_color', text);
  } catch {
    // Ignore storage restriction
  }

  const fallbackCopy = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.pointerEvents = 'none';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch {
      // Ignore fallback error
    }
  };

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }
}

export const HexColorPicker: React.FC<HexColorPickerProps> = ({
  label,
  value,
  onChange,
  className = '',
  compact = false,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const alphaSliderRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Original color value on open so Cancel / Escape restores exact color + alpha
  const originalColorRef = useRef<string>('#121111');

  const initialParsed = parseColorToRgba(value, '#121111');

  const [rgb, setRgb] = useState<RGB>({
    r: initialParsed.r,
    g: initialParsed.g,
    b: initialParsed.b,
  });
  const [alpha, setAlpha] = useState<number>(initialParsed.a);
  const [hsv, setHsv] = useState<HSV>(() =>
    rgbToHsv(initialParsed.r, initialParsed.g, initialParsed.b)
  );

  // Focus-safe text buffers for Hex and R, G, B, A inputs
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [hexInputText, setHexInputText] = useState<string>(() =>
    rgbToHex(initialParsed.r, initialParsed.g, initialParsed.b, false)
  );
  const [rInputText, setRInputText] = useState<string>(() => String(initialParsed.r));
  const [gInputText, setGInputText] = useState<string>(() => String(initialParsed.g));
  const [bInputText, setBInputText] = useState<string>(() => String(initialParsed.b));
  const [aInputText, setAInputText] = useState<string>(() =>
    formatAlphaDisplay(initialParsed.a)
  );
  const [copiedMode, setCopiedMode] = useState<'hex' | 'rgba' | null>(null);
  const [pastedMode, setPastedMode] = useState<'hex' | 'rgba' | null>(null);

  // Refs to always access latest state inside event listeners
  const rgbRef = useRef(rgb);
  const alphaRef = useRef(alpha);
  const hsvRef = useRef(hsv);
  rgbRef.current = rgb;
  alphaRef.current = alpha;
  hsvRef.current = hsv;

  // Throttling ref for smooth 60fps dragging
  const throttleTimerRef = useRef<number | null>(null);
  const lastPendingColorRef = useRef<string | null>(null);

  const syncAllFromRgba = useCallback(
    (nextR: number, nextG: number, nextB: number, nextA: number, preserveHue?: number) => {
      const clampR = Math.max(0, Math.min(255, Math.round(nextR)));
      const clampG = Math.max(0, Math.min(255, Math.round(nextG)));
      const clampB = Math.max(0, Math.min(255, Math.round(nextB)));
      const cleanA = roundAlpha(nextA);

      const computedHsv = rgbToHsv(clampR, clampG, clampB);
      if (preserveHue !== undefined && (computedHsv.s === 0 || computedHsv.v === 0)) {
        computedHsv.h = preserveHue;
      }

      setRgb({ r: clampR, g: clampG, b: clampB });
      setAlpha(cleanA);
      setHsv(computedHsv);
      setHexInputText(rgbToHex(clampR, clampG, clampB, false));
      setRInputText(String(clampR));
      setGInputText(String(clampG));
      setBInputText(String(clampB));
      setAInputText(formatAlphaDisplay(cleanA));
    },
    []
  );

  // Sync internal state when external value changes while closed
  useEffect(() => {
    if (!isOpen && value !== undefined) {
      const parsed = parseColorToRgba(value, '#121111');
      syncAllFromRgba(parsed.r, parsed.g, parsed.b, parsed.a);
    }
  }, [value, isOpen, syncAllFromRgba]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = popoverRef.current?.offsetWidth || 296;
    const popoverHeight = popoverRef.current?.offsetHeight || 515;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 8;
    if (top + popoverHeight > viewportHeight - 12) {
      const topAbove = rect.top - popoverHeight - 8;
      if (topAbove >= 12 || rect.top > viewportHeight / 2) {
        top = Math.max(12, topAbove);
      } else {
        top = Math.max(12, viewportHeight - popoverHeight - 12);
      }
    }

    let left = rect.right - popoverWidth;
    if (left < 12) {
      left = Math.max(12, rect.left);
    }
    if (left + popoverWidth > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - popoverWidth - 12);
    }

    setCoords({ top, left });
  }, []);

  const triggerThrottledChange = useCallback(
    (colorStr: string, immediate: boolean = false) => {
      lastPendingColorRef.current = colorStr;

      if (immediate) {
        if (throttleTimerRef.current !== null) {
          window.clearTimeout(throttleTimerRef.current);
          throttleTimerRef.current = null;
        }
        onChange(colorStr);
        return;
      }

      if (throttleTimerRef.current === null) {
        throttleTimerRef.current = window.setTimeout(() => {
          throttleTimerRef.current = null;
          if (lastPendingColorRef.current !== null) {
            onChange(lastPendingColorRef.current);
          }
        }, 35);
      }
    },
    [onChange]
  );

  const handleOpen = () => {
    onOpen?.();
    const parsed = parseColorToRgba(
      value || formatColorOutput(rgb.r, rgb.g, rgb.b, alpha),
      '#121111'
    );
    const formattedInitial =
      value && value.trim()
        ? value.trim()
        : formatColorOutput(parsed.r, parsed.g, parsed.b, parsed.a);
    originalColorRef.current = formattedInitial;
    syncAllFromRgba(parsed.r, parsed.g, parsed.b, parsed.a);
    setFocusedField(null);
    updatePosition();
    setIsOpen(true);
  };

  const resolvePendingInputsAndClose = useCallback(() => {
    let finalR = rgbRef.current.r;
    let finalG = rgbRef.current.g;
    let finalB = rgbRef.current.b;
    let finalA = alphaRef.current;

    if (focusedField === 'hex') {
      if (hexInputText.length === 6) {
        const parsed = parseColorToRgba(`#${hexInputText}`);
        finalR = parsed.r;
        finalG = parsed.g;
        finalB = parsed.b;
      } else if (hexInputText.length === 3) {
        const expanded = hexInputText
          .split('')
          .map((c) => c + c)
          .join('');
        const parsed = parseColorToRgba(`#${expanded}`);
        finalR = parsed.r;
        finalG = parsed.g;
        finalB = parsed.b;
      }
    }

    const finalColor = formatColorOutput(finalR, finalG, finalB, finalA);
    syncAllFromRgba(finalR, finalG, finalB, finalA, hsvRef.current.h);
    setFocusedField(null);
    triggerThrottledChange(finalColor, true);
    setIsOpen(false);
    onClose?.(true);
  }, [focusedField, hexInputText, onClose, syncAllFromRgba, triggerThrottledChange]);

  const handleCancelAndClose = useCallback(() => {
    const orig = originalColorRef.current;
    const parsed = parseColorToRgba(orig, '#121111');
    syncAllFromRgba(parsed.r, parsed.g, parsed.b, parsed.a);
    setFocusedField(null);
    triggerThrottledChange(orig, true);
    setIsOpen(false);
    onClose?.(false);
  }, [onClose, syncAllFromRgba, triggerThrottledChange]);

  // Measure actual rendered height right after mount to clamp inside viewport
  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleWindowChange = () => updatePosition();
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [isOpen, updatePosition]);

  // Close when clicking outside or pressing Escape / Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        resolvePendingInputsAndClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelAndClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        resolvePendingInputsAndClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, resolvePendingInputsAndClose, handleCancelAndClose]);

  // =========================================================================
  // 1. 2D SPECTRUM (Saturation & Value) Drag
  // =========================================================================
  const handleSpectrumMove = (clientX: number, clientY: number, isFinal: boolean = false) => {
    if (!spectrumRef.current) return;
    const rect = spectrumRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    const nextHsv: HSV = { h: hsvRef.current.h, s, v };
    const nextRgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
    const curAlpha = alphaRef.current;

    setHsv(nextHsv);
    setRgb(nextRgb);
    setHexInputText(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, false));
    setRInputText(String(nextRgb.r));
    setGInputText(String(nextRgb.g));
    setBInputText(String(nextRgb.b));

    triggerThrottledChange(formatColorOutput(nextRgb.r, nextRgb.g, nextRgb.b, curAlpha), isFinal);
  };

  const handleSpectrumMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocusedField(null);
    handleSpectrumMove(e.clientX, e.clientY);

    const onMouseMove = (ev: MouseEvent) => {
      ev.preventDefault();
      handleSpectrumMove(ev.clientX, ev.clientY);
    };
    const onMouseUp = (ev: MouseEvent) => {
      handleSpectrumMove(ev.clientX, ev.clientY, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleSpectrumTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setFocusedField(null);
    if (e.touches.length > 0) {
      handleSpectrumMove(e.touches[0].clientX, e.touches[0].clientY);
    }
    const onTouchMove = (ev: TouchEvent) => {
      if (ev.touches.length > 0) {
        handleSpectrumMove(ev.touches[0].clientX, ev.touches[0].clientY);
      }
    };
    const onTouchEnd = (ev: TouchEvent) => {
      if (ev.changedTouches.length > 0) {
        handleSpectrumMove(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY, true);
      }
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // =========================================================================
  // 2. HUE SLIDER Drag (0 - 360)
  // =========================================================================
  const handleHueMove = (clientX: number, isFinal: boolean = false) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const h = Math.round((x / rect.width) * 360) % 360;

    const nextHsv: HSV = { ...hsvRef.current, h };
    const nextRgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
    const curAlpha = alphaRef.current;

    setHsv(nextHsv);
    setRgb(nextRgb);
    setHexInputText(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, false));
    setRInputText(String(nextRgb.r));
    setGInputText(String(nextRgb.g));
    setBInputText(String(nextRgb.b));

    triggerThrottledChange(formatColorOutput(nextRgb.r, nextRgb.g, nextRgb.b, curAlpha), isFinal);
  };

  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocusedField(null);
    handleHueMove(e.clientX);

    const onMouseMove = (ev: MouseEvent) => {
      ev.preventDefault();
      handleHueMove(ev.clientX);
    };
    const onMouseUp = (ev: MouseEvent) => {
      handleHueMove(ev.clientX, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleHueTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setFocusedField(null);
    if (e.touches.length > 0) {
      handleHueMove(e.touches[0].clientX);
    }
    const onTouchMove = (ev: TouchEvent) => {
      if (ev.touches.length > 0) {
        handleHueMove(ev.touches[0].clientX);
      }
    };
    const onTouchEnd = (ev: TouchEvent) => {
      if (ev.changedTouches.length > 0) {
        handleHueMove(ev.changedTouches[0].clientX, true);
      }
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // =========================================================================
  // 3. ALPHA / TRANSPARENCY SLIDER Drag (0 to 1)
  // =========================================================================
  const handleAlphaMove = (clientX: number, isFinal: boolean = false) => {
    if (!alphaSliderRef.current) return;
    const rect = alphaSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const nextAlpha = roundAlpha(x / rect.width);
    const curRgb = rgbRef.current;

    setAlpha(nextAlpha);
    setAInputText(formatAlphaDisplay(nextAlpha));

    triggerThrottledChange(formatColorOutput(curRgb.r, curRgb.g, curRgb.b, nextAlpha), isFinal);
  };

  const handleAlphaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocusedField(null);
    handleAlphaMove(e.clientX);

    const onMouseMove = (ev: MouseEvent) => {
      ev.preventDefault();
      handleAlphaMove(ev.clientX);
    };
    const onMouseUp = (ev: MouseEvent) => {
      handleAlphaMove(ev.clientX, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleAlphaTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setFocusedField(null);
    if (e.touches.length > 0) {
      handleAlphaMove(e.touches[0].clientX);
    }
    const onTouchMove = (ev: TouchEvent) => {
      if (ev.touches.length > 0) {
        handleAlphaMove(ev.touches[0].clientX);
      }
    };
    const onTouchEnd = (ev: TouchEvent) => {
      if (ev.changedTouches.length > 0) {
        handleAlphaMove(ev.changedTouches[0].clientX, true);
      }
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // =========================================================================
  // 4. EYEDROPPER
  // =========================================================================
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          const parsed = parseColorToRgba(result.sRGBHex);
          const nextA = alpha === 0 ? 1 : alpha;
          syncAllFromRgba(parsed.r, parsed.g, parsed.b, nextA);
          triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, nextA), true);
        }
      } catch {
        // User cancelled eyedropper
      }
    }
  };

  // =========================================================================
  // 5. HEXADECIMAL INPUT HANDLERS
  // =========================================================================
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeHexInput(e.target.value, 6);
    setHexInputText(sanitized);

    if (sanitized.length === 6) {
      const parsed = parseColorToRgba(`#${sanitized}`);
      const nextHsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
      setRgb({ r: parsed.r, g: parsed.g, b: parsed.b });
      setHsv(nextHsv);
      setRInputText(String(parsed.r));
      setGInputText(String(parsed.g));
      setBInputText(String(parsed.b));
      triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, alpha), true);
    }
  };

  const handleHexInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();

    // Support pasting rgba(...) or #RRGGBBAA directly into Hex input
    if (/^rgba?\(/i.test(pasted)) {
      const parsed = parseColorToRgba(pasted);
      syncAllFromRgba(parsed.r, parsed.g, parsed.b, parsed.a);
      triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, parsed.a), true);
      return;
    }

    const sanitized8 = sanitizeHexInput(pasted, 8);
    if (sanitized8.length === 8) {
      const parsed = parseColorToRgba(`#${sanitized8}`);
      syncAllFromRgba(parsed.r, parsed.g, parsed.b, parsed.a);
      triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, parsed.a), true);
      return;
    }

    const sanitized6 = sanitized8.slice(0, 6);
    setHexInputText(sanitized6);
    if (sanitized6.length === 6) {
      const parsed = parseColorToRgba(`#${sanitized6}`);
      setRgb({ r: parsed.r, g: parsed.g, b: parsed.b });
      setHsv(rgbToHsv(parsed.r, parsed.g, parsed.b));
      setRInputText(String(parsed.r));
      setGInputText(String(parsed.g));
      setBInputText(String(parsed.b));
      triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, alpha), true);
    }
  };

  const handleHexInputBlur = () => {
    setFocusedField((prev) => (prev === 'hex' ? null : prev));
    if (hexInputText.length === 6) {
      const parsed = parseColorToRgba(`#${hexInputText}`);
      syncAllFromRgba(parsed.r, parsed.g, parsed.b, alpha, hsv.h);
      triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, alpha), true);
    } else if (hexInputText.length === 3) {
      const expanded = hexInputText
        .split('')
        .map((c) => c + c)
        .join('');
      const parsed = parseColorToRgba(`#${expanded}`);
      syncAllFromRgba(parsed.r, parsed.g, parsed.b, alpha, hsv.h);
      triggerThrottledChange(formatColorOutput(parsed.r, parsed.g, parsed.b, alpha), true);
    } else {
      setHexInputText(rgbToHex(rgb.r, rgb.g, rgb.b, false));
    }
  };

  // =========================================================================
  // 6. RGBA INPUT HANDLERS (R, G, B: 0-255 | A: 0-1)
  // =========================================================================
  const handleRgbChannelChange = (channel: 'r' | 'g' | 'b', raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    if (channel === 'r') setRInputText(digitsOnly);
    if (channel === 'g') setGInputText(digitsOnly);
    if (channel === 'b') setBInputText(digitsOnly);

    if (digitsOnly === '') return;

    const clamped = Math.max(0, Math.min(255, parseInt(digitsOnly, 10)));
    if (String(clamped) !== digitsOnly && parseInt(digitsOnly, 10) > 255) {
      if (channel === 'r') setRInputText('255');
      if (channel === 'g') setGInputText('255');
      if (channel === 'b') setBInputText('255');
    }

    const nextRgb: RGB = {
      r: channel === 'r' ? clamped : rgb.r,
      g: channel === 'g' ? clamped : rgb.g,
      b: channel === 'b' ? clamped : rgb.b,
    };
    const nextHsv = rgbToHsv(nextRgb.r, nextRgb.g, nextRgb.b);
    if (nextHsv.s === 0 || nextHsv.v === 0) {
      nextHsv.h = hsv.h;
    }

    setRgb(nextRgb);
    setHsv(nextHsv);
    setHexInputText(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, false));
    triggerThrottledChange(formatColorOutput(nextRgb.r, nextRgb.g, nextRgb.b, alpha), true);
  };

  const handleRgbChannelBlur = (channel: 'r' | 'g' | 'b') => {
    setFocusedField((prev) => (prev === channel ? null : prev));
    setRInputText(String(rgb.r));
    setGInputText(String(rgb.g));
    setBInputText(String(rgb.b));
  };

  const handleRgbChannelKeyDown = (
    channel: 'r' | 'g' | 'b',
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const delta = (e.shiftKey ? 10 : 1) * (e.key === 'ArrowUp' ? 1 : -1);
      const currentVal = rgb[channel];
      const nextVal = Math.max(0, Math.min(255, currentVal + delta));
      handleRgbChannelChange(channel, String(nextVal));
    }
  };

  const handleAlphaInputChange = (raw: string) => {
    // Allow digits and a single dot or comma for decimal typing (e.g. "0.", ".5", "0,5")
    const normalized = raw.replace(',', '.').replace(/[^0-9.]/g, '');
    const dotParts = normalized.split('.');
    const cleanText =
      dotParts.length > 2 ? `${dotParts[0]}.${dotParts.slice(1).join('')}` : normalized;

    setAInputText(cleanText);

    if (cleanText === '' || cleanText === '.' || cleanText === '0.') {
      if (cleanText === '0.') {
        setAlpha(0);
        triggerThrottledChange(formatColorOutput(rgb.r, rgb.g, rgb.b, 0), true);
      }
      return;
    }

    const parsed = parseFloat(cleanText);
    if (Number.isNaN(parsed)) return;

    const clamped = roundAlpha(parsed);
    if (parsed > 1) {
      setAInputText('1');
    }
    setAlpha(clamped);
    triggerThrottledChange(formatColorOutput(rgb.r, rgb.g, rgb.b, clamped), true);
  };

  const handleAlphaInputBlur = () => {
    setFocusedField((prev) => (prev === 'a' ? null : prev));
    setAInputText(formatAlphaDisplay(alpha));
  };

  const handleAlphaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const step = e.shiftKey ? 0.1 : 0.05;
      const delta = e.key === 'ArrowUp' ? step : -step;
      const nextA = roundAlpha(alpha + delta);
      setAlpha(nextA);
      setAInputText(formatAlphaDisplay(nextA));
      triggerThrottledChange(formatColorOutput(rgb.r, rgb.g, rgb.b, nextA), true);
    }
  };

  const handleRgbaInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').trim();
    const parsedFullColor = tryParseColorString(pasted);
    // Intercept paste if user pasted a full Hex or rgba(...) color string into any R/G/B/A box
    if (
      parsedFullColor &&
      (pasted.includes(',') || pasted.startsWith('#') || /^rgba?\(/i.test(pasted) || /^[0-9a-fA-F]{6,8}$/.test(pasted))
    ) {
      e.preventDefault();
      syncAllFromRgba(parsedFullColor.r, parsedFullColor.g, parsedFullColor.b, parsedFullColor.a, hsv.h);
      triggerThrottledChange(
        formatColorOutput(parsedFullColor.r, parsedFullColor.g, parsedFullColor.b, parsedFullColor.a),
        true
      );
    }
  };

  // =========================================================================
  // 7. COPY & PASTE COLOR BUTTON HANDLERS (HEX & RGBA)
  // =========================================================================
  const handleCopyColor = (mode: 'hex' | 'rgba') => {
    const textToCopy =
      mode === 'hex'
        ? rgbToHex(rgb.r, rgb.g, rgb.b, true)
        : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${roundAlpha(alpha)})`;
    writeTextSafe(textToCopy);
    setCopiedMode(mode);
    window.setTimeout(() => {
      setCopiedMode((prev) => (prev === mode ? null : prev));
    }, 1500);
  };

  const handlePasteColor = async (mode: 'hex' | 'rgba') => {
    let parsed = null;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
      try {
        const sysText = await navigator.clipboard.readText();
        parsed = tryParseColorString(sysText);
      } catch {
        // Fallback to shared in-app clipboard if browser blocks readText in iframe
      }
    }

    if (!parsed) {
      let stored = sharedCopiedColor;
      if (!stored) {
        try {
          stored = sessionStorage.getItem('funnel_copied_color') || '';
        } catch {
          stored = '';
        }
      }
      parsed = tryParseColorString(stored);
    }

    if (parsed) {
      syncAllFromRgba(parsed.r, parsed.g, parsed.b, parsed.a, hsvRef.current.h);
      triggerThrottledChange(
        formatColorOutput(parsed.r, parsed.g, parsed.b, parsed.a),
        true
      );
      setPastedMode(mode);
      window.setTimeout(() => {
        setPastedMode((prev) => (prev === mode ? null : prev));
      }, 1200);
    }
  };

  // =========================================================================
  // 8. QUICK PRESET SELECTION
  // =========================================================================
  const handleSelectPreset = (presetHex: string) => {
    const parsed = parseColorToRgba(presetHex);
    syncAllFromRgba(parsed.r, parsed.g, parsed.b, 1);
    triggerThrottledChange(presetHex.toUpperCase(), true);
  };

  const pureHueColor = `hsl(${hsv.h}, 100%, 50%)`;
  const solidHex = rgbToHex(rgb.r, rgb.g, rgb.b, true);
  const rgbaFullString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${roundAlpha(alpha)})`;
  const liveColorOutput = formatColorOutput(rgb.r, rgb.g, rgb.b, alpha);
  const compactBadgeLabel =
    alpha >= 1 ? solidHex : `${solidHex} · ${Math.round(alpha * 100)}%`;

  // Portal Popover rendered in document.body
  const popoverContent =
    isOpen && typeof document !== 'undefined' ? (
      <div
        ref={popoverRef}
        style={{
          position: 'fixed',
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          zIndex: 999999,
        }}
        className="w-[296px] bg-white rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-100 select-none text-zinc-800 font-sans"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Popover Header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-100 bg-zinc-50/70">
          <span className="text-xs font-bold text-zinc-800 tracking-tight truncate pr-2">
            {label ? label.replace(':', '') : 'Selector de Color'}
          </span>
          <button
            type="button"
            onClick={handleCancelAndClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-md transition-colors cursor-pointer shrink-0"
            title="Cerrar sin guardar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. 2D SATURATION & VALUE SPECTRUM (Edge-to-Edge like reference) */}
        <div
          ref={spectrumRef}
          onMouseDown={handleSpectrumMouseDown}
          onTouchStart={handleSpectrumTouchStart}
          className="relative w-full h-36 cursor-crosshair overflow-hidden border-b border-zinc-200/80 touch-none"
          style={{
            backgroundColor: pureHueColor,
            backgroundImage:
              'linear-gradient(to top, #000000, transparent), linear-gradient(to right, #FFFFFF, transparent)',
          }}
        >
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-1 ring-black/25"
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              backgroundColor: solidHex,
            }}
          />
        </div>

        <div className="p-3.5 space-y-3">
          {/* 2. EYEDROPPER + CIRCULAR SWATCH + HUE & TRANSPARENCY SLIDERS */}
          <div className="flex items-center gap-2.5">
            {'EyeDropper' in window && (
              <button
                type="button"
                onClick={handleEyeDropper}
                className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Cuentagotas (Tomar color de pantalla)"
              >
                <Pipette className="w-4 h-4" />
              </button>
            )}

            {/* Circular Color Swatch over Checkerboard */}
            <div
              className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0 overflow-hidden relative"
              style={CHECKERBOARD_BG}
              title={liveColorOutput}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: liveColorOutput }}
              />
            </div>

            {/* Stacked Sliders: Top = Rainbow Hue, Bottom = Alpha Transparency (0 -> 1) */}
            <div className="flex-1 flex flex-col gap-2.5">
              {/* Bar 1: Rainbow Hue */}
              <div
                ref={hueSliderRef}
                onMouseDown={handleHueMouseDown}
                onTouchStart={handleHueTouchStart}
                className="relative w-full h-3 rounded-full cursor-pointer shadow-inner border border-black/10 touch-none"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              >
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border border-zinc-300 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${(hsv.h / 360) * 100}%` }}
                />
              </div>

              {/* Bar 2: Alpha / Transparency (0 to 1) over Checkerboard */}
              <div
                ref={alphaSliderRef}
                onMouseDown={handleAlphaMouseDown}
                onTouchStart={handleAlphaTouchStart}
                className="relative w-full h-3 rounded-full cursor-pointer border border-black/10 touch-none"
                style={CHECKERBOARD_BG}
                title={`Transparencia (Alpha): ${formatAlphaDisplay(alpha)}`}
              >
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 0%, rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) 100%)`,
                  }}
                />
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border border-zinc-300 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${alpha * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. FIRST: HEXADECIMAL INPUT + COPY / PASTE */}
          <div className="pt-2 border-t border-zinc-100 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
              <span>Hexadecimal</span>
              {copiedMode === 'hex' ? (
                <span className="text-[10px] text-emerald-600 font-bold">¡Copiado!</span>
              ) : pastedMode === 'hex' ? (
                <span className="text-[10px] text-emerald-600 font-bold">¡Pegado!</span>
              ) : (
                <span className="text-[10px] text-zinc-400 font-mono">HEX</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center rounded-lg border border-zinc-200 bg-zinc-50 focus-within:bg-white focus-within:border-[#2848F0] focus-within:ring-2 focus-within:ring-[#2848F0]/15 overflow-hidden px-2.5 py-1.5 shadow-2xs">
                <span className="text-zinc-400 font-mono font-bold text-xs select-none pr-1">#</span>
                <input
                  type="text"
                  maxLength={6}
                  value={hexInputText}
                  onFocus={() => setFocusedField('hex')}
                  onChange={handleHexInputChange}
                  onPaste={handleHexInputPaste}
                  onBlur={handleHexInputBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      resolvePendingInputsAndClose();
                    }
                  }}
                  placeholder="2848F0"
                  spellCheck={false}
                  className="w-full bg-transparent font-mono font-semibold text-xs text-zinc-900 tracking-wider uppercase focus:outline-none select-text"
                />
              </div>

              {/* Copy Hex Button */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCopyColor('hex')}
                title={`Copiar Hexadecimal (${solidHex})`}
                className={`w-7 h-[30px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer shrink-0 ${
                  copiedMode === 'hex'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {copiedMode === 'hex' ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Paste Color Button */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePasteColor('hex')}
                title="Pegar color copiado"
                className={`w-7 h-[30px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer shrink-0 ${
                  pastedMode === 'hex'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {pastedMode === 'hex' ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ClipboardPaste className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* 4. SECOND: RGBA INPUTS (R, G, B, A) + COPY / PASTE */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
              <span>RGBA</span>
              {copiedMode === 'rgba' ? (
                <span className="text-[10px] text-emerald-600 font-bold">¡Copiado!</span>
              ) : pastedMode === 'rgba' ? (
                <span className="text-[10px] text-emerald-600 font-bold">¡Pegado!</span>
              ) : null}
            </div>
            <div className="flex items-start gap-1.5">
              <div className="flex-1 grid grid-cols-4 gap-1.5">
                {/* R */}
                <div className="flex flex-col items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rInputText}
                    onFocus={(e) => {
                      setFocusedField('r');
                      e.currentTarget.select();
                    }}
                    onChange={(e) => handleRgbChannelChange('r', e.target.value)}
                    onPaste={handleRgbaInputPaste}
                    onBlur={() => handleRgbChannelBlur('r')}
                    onKeyDown={(e) => handleRgbChannelKeyDown('r', e)}
                    className="w-full py-1.5 px-1 text-center font-mono font-semibold text-xs text-zinc-800 bg-white border border-zinc-300 rounded-md focus:border-[#2848F0] focus:ring-2 focus:ring-[#2848F0]/15 focus:outline-none tabular-nums select-text"
                  />
                  <span className="text-[10px] font-semibold text-zinc-400 select-none">R</span>
                </div>

                {/* G */}
                <div className="flex flex-col items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={gInputText}
                    onFocus={(e) => {
                      setFocusedField('g');
                      e.currentTarget.select();
                    }}
                    onChange={(e) => handleRgbChannelChange('g', e.target.value)}
                    onPaste={handleRgbaInputPaste}
                    onBlur={() => handleRgbChannelBlur('g')}
                    onKeyDown={(e) => handleRgbChannelKeyDown('g', e)}
                    className="w-full py-1.5 px-1 text-center font-mono font-semibold text-xs text-zinc-800 bg-white border border-zinc-300 rounded-md focus:border-[#2848F0] focus:ring-2 focus:ring-[#2848F0]/15 focus:outline-none tabular-nums select-text"
                  />
                  <span className="text-[10px] font-semibold text-zinc-400 select-none">G</span>
                </div>

                {/* B */}
                <div className="flex flex-col items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bInputText}
                    onFocus={(e) => {
                      setFocusedField('b');
                      e.currentTarget.select();
                    }}
                    onChange={(e) => handleRgbChannelChange('b', e.target.value)}
                    onPaste={handleRgbaInputPaste}
                    onBlur={() => handleRgbChannelBlur('b')}
                    onKeyDown={(e) => handleRgbChannelKeyDown('b', e)}
                    className="w-full py-1.5 px-1 text-center font-mono font-semibold text-xs text-zinc-800 bg-white border border-zinc-300 rounded-md focus:border-[#2848F0] focus:ring-2 focus:ring-[#2848F0]/15 focus:outline-none tabular-nums select-text"
                  />
                  <span className="text-[10px] font-semibold text-zinc-400 select-none">B</span>
                </div>

                {/* A (0 to 1) */}
                <div className="flex flex-col items-center gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={aInputText}
                    onFocus={(e) => {
                      setFocusedField('a');
                      e.currentTarget.select();
                    }}
                    onChange={(e) => handleAlphaInputChange(e.target.value)}
                    onPaste={handleRgbaInputPaste}
                    onBlur={handleAlphaInputBlur}
                    onKeyDown={handleAlphaInputKeyDown}
                    className="w-full py-1.5 px-1 text-center font-mono font-semibold text-xs text-zinc-800 bg-white border border-zinc-300 rounded-md focus:border-[#2848F0] focus:ring-2 focus:ring-[#2848F0]/15 focus:outline-none tabular-nums select-text"
                  />
                  <span className="text-[10px] font-semibold text-zinc-400 select-none">A</span>
                </div>
              </div>

              {/* Copy RGBA Button */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCopyColor('rgba')}
                title={`Copiar RGBA (${rgbaFullString})`}
                className={`w-7 h-[30px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer shrink-0 ${
                  copiedMode === 'rgba'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {copiedMode === 'rgba' ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Paste RGBA Button */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePasteColor('rgba')}
                title="Pegar color copiado"
                className={`w-7 h-[30px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer shrink-0 ${
                  pastedMode === 'rgba'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {pastedMode === 'rgba' ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ClipboardPaste className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* 5. THIRD: OUR QUICK COLORS (COLORES RÁPIDOS) */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="text-[10px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Colores rápidos
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {PRESET_COLORS.map((preset) => {
                const isSelected =
                  alpha === 1 && solidHex.toUpperCase() === preset.toUpperCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectPreset(preset)}
                    className="w-6 h-6 rounded-md border border-black/10 shadow-2xs hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: preset }}
                    title={preset}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3 h-3 ${
                          preset === '#FFFFFF' || preset === '#9CA3AF'
                            ? 'text-zinc-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. ACTION FOOTER: CANCELAR & OK */}
          <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelAndClose}
              className="flex-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={resolvePendingInputsAndClose}
              className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-blue-700 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              title="Confirmar color (o pulsa Enter)"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>OK</span>
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className={`relative flex items-center justify-between gap-2 ${className}`}>
      {label && <span className="text-zinc-700 text-xs font-semibold">{label}</span>}

      {compact ? (
        <button
          ref={triggerRef}
          type="button"
          onMouseDown={(e) => {
            // Prevent deselecting text on canvas
            e.preventDefault();
          }}
          onClick={() => (isOpen ? resolvePendingInputsAndClose() : handleOpen())}
          className="flex items-center gap-1 p-0.5 px-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded shadow-2xs transition-all cursor-pointer group"
          title="Cambiar color"
        >
          <div
            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner shrink-0 overflow-hidden"
            style={CHECKERBOARD_BG}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: liveColorOutput }}
            />
          </div>
          <span className="font-mono text-[10px] font-semibold text-zinc-600 group-hover:text-zinc-900 pr-0.5 tabular-nums">
            {compactBadgeLabel}
          </span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => (isOpen ? resolvePendingInputsAndClose() : handleOpen())}
          className="flex items-center gap-1.5 p-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-all cursor-pointer group max-w-[195px]"
          title="Abrir selector de color"
        >
          <div
            className="w-6 h-6 rounded-md border border-black/10 shadow-inner shrink-0 overflow-hidden"
            style={CHECKERBOARD_BG}
          >
            <div
              className="w-full h-full"
              style={{ backgroundColor: liveColorOutput }}
            />
          </div>
          <span className="font-mono text-[11px] font-semibold text-zinc-700 pr-1 group-hover:text-zinc-900 truncate tabular-nums">
            {liveColorOutput}
          </span>
        </button>
      )}

      {isOpen && typeof document !== 'undefined' && createPortal(popoverContent, document.body)}
    </div>
  );
};
