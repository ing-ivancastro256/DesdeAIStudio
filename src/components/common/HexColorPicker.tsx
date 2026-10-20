import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Pipette, Check, X, RotateCcw } from 'lucide-react';
import {
  hexToHsv,
  hsvToHex,
  sanitizeHexInput,
  HSV,
} from '../../utils/colorUtils';

export interface HexColorPickerProps {
  label?: string;
  value: string; // Hex string e.g. "#121111" or "#2848F0"
  onChange: (hex: string) => void;
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

  // Position coordinates for fixed portal
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Store the original hex when the picker opened so user can cancel/revert
  const originalHexRef = useRef<string>('#121111');

  // Normalize initial value
  const normalizeHex = (v?: string) => {
    if (!v) return '#121111';
    return (v.startsWith('#') ? v : `#${v}`).toUpperCase();
  };

  const [currentHex, setCurrentHex] = useState<string>(() => normalizeHex(value));
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(normalizeHex(value)));
  const [hexInputText, setHexInputText] = useState<string>(() =>
    sanitizeHexInput(normalizeHex(value))
  );

  // Throttling ref for dragging so parent doesn't freeze the UI
  const throttleTimerRef = useRef<number | null>(null);
  const lastPendingHexRef = useRef<string | null>(null);

  // Sync internal state when external value changes and picker is closed
  useEffect(() => {
    if (!isOpen && value) {
      const clean = normalizeHex(value);
      setCurrentHex(clean);
      setHexInputText(sanitizeHexInput(clean));
      setHsv(hexToHsv(clean));
    }
  }, [value, isOpen]);

  // Calculate position when opening or on scroll/resize
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 440;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Vertical positioning: default below trigger
    let top = rect.bottom + 8;
    // If popover goes off the bottom of the screen, place it above
    if (top + popoverHeight > viewportHeight - 12) {
      const topAbove = rect.top - popoverHeight - 8;
      if (topAbove >= 12 || rect.top > viewportHeight / 2) {
        top = Math.max(12, topAbove);
      } else {
        top = Math.max(12, viewportHeight - popoverHeight - 12);
      }
    }

    // Horizontal positioning: align to right edge of trigger, or clamp into view
    let left = rect.right - popoverWidth;
    if (left < 12) {
      left = Math.max(12, rect.left);
    }
    if (left + popoverWidth > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - popoverWidth - 12);
    }

    setCoords({ top, left });
  }, []);

  const handleOpen = () => {
    onOpen?.();
    const clean = normalizeHex(value || currentHex);
    originalHexRef.current = clean;
    setCurrentHex(clean);
    setHexInputText(sanitizeHexInput(clean));
    setHsv(hexToHsv(clean));
    updatePosition();
    setIsOpen(true);
  };

  const handleApplyAndClose = () => {
    let finalHex = currentHex;
    // Validate hex input text in case user typed but didn't blur
    if (hexInputText.length === 6) {
      finalHex = `#${hexInputText}`;
    } else if (hexInputText.length === 3) {
      const expanded = hexInputText.split('').map((c) => c + c).join('');
      finalHex = `#${expanded}`;
    }
    setCurrentHex(finalHex);
    onChange(finalHex);
    setIsOpen(false);
    onClose?.(true);
  };

  const handleCancelAndClose = () => {
    const orig = originalHexRef.current;
    setCurrentHex(orig);
    setHexInputText(sanitizeHexInput(orig));
    setHsv(hexToHsv(orig));
    onChange(orig);
    setIsOpen(false);
    onClose?.(false);
  };

  // Keep popover attached on window resize or scroll
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleWindowChange = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [isOpen, updatePosition]);

  // Close when clicking outside or pressing Escape/Enter
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
        handleApplyAndClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelAndClose();
      } else if (e.key === 'Enter') {
        // If Enter pressed anywhere while picker is open, confirm & close
        e.preventDefault();
        handleApplyAndClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentHex, hexInputText]);

  // High performance throttled onChange caller
  const triggerThrottledChange = (hex: string, immediate: boolean = false) => {
    lastPendingHexRef.current = hex;

    if (immediate) {
      if (throttleTimerRef.current) {
        window.clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }
      onChange(hex);
      return;
    }

    if (throttleTimerRef.current === null) {
      // Call parent at most once every 40ms to keep 60fps responsive without choking React
      throttleTimerRef.current = window.setTimeout(() => {
        throttleTimerRef.current = null;
        if (lastPendingHexRef.current) {
          onChange(lastPendingHexRef.current);
        }
      }, 40);
    }
  };

  // SPECTRUM (Saturation & Value) Drag Handling: ZERO LAG
  const handleSpectrumMove = (clientX: number, clientY: number, isFinal: boolean = false) => {
    if (!spectrumRef.current) return;
    const rect = spectrumRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    const nextHsv = { ...hsv, s, v };
    const newHex = hsvToHex(nextHsv.h, nextHsv.s, nextHsv.v);

    setHsv(nextHsv);
    setCurrentHex(newHex);
    setHexInputText(sanitizeHexInput(newHex));

    // Fast throttled update to parent, immediate on release
    triggerThrottledChange(newHex, isFinal);
  };

  const handleSpectrumMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleSpectrumMove(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      handleSpectrumMove(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      handleSpectrumMove(upEvent.clientX, upEvent.clientY, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleSpectrumTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleSpectrumMove(touch.clientX, touch.clientY);
    }

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length > 0) {
        const touch = moveEvent.touches[0];
        handleSpectrumMove(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = (endEvent: TouchEvent) => {
      if (endEvent.changedTouches.length > 0) {
        const touch = endEvent.changedTouches[0];
        handleSpectrumMove(touch.clientX, touch.clientY, true);
      }
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // HUE Slider Drag Handling: ZERO LAG
  const handleHueMove = (clientX: number, isFinal: boolean = false) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const h = Math.round((x / rect.width) * 360) % 360;

    const nextHsv = { ...hsv, h };
    const newHex = hsvToHex(nextHsv.h, nextHsv.s, nextHsv.v);

    setHsv(nextHsv);
    setCurrentHex(newHex);
    setHexInputText(sanitizeHexInput(newHex));

    // Fast throttled update to parent, immediate on release
    triggerThrottledChange(newHex, isFinal);
  };

  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleHueMove(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      handleHueMove(moveEvent.clientX);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      handleHueMove(upEvent.clientX, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleHueTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleHueMove(e.touches[0].clientX);
    }

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length > 0) {
        handleHueMove(moveEvent.touches[0].clientX);
      }
    };

    const onTouchEnd = (endEvent: TouchEvent) => {
      if (endEvent.changedTouches.length > 0) {
        handleHueMove(endEvent.changedTouches[0].clientX, true);
      }
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // Native EyeDropper API (Chrome, Edge, Opera)
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          const pickedHex = result.sRGBHex.toUpperCase();
          setCurrentHex(pickedHex);
          setHexInputText(sanitizeHexInput(pickedHex));
          setHsv(hexToHsv(pickedHex));
          triggerThrottledChange(pickedHex, true);
        }
      } catch (err) {
        // User cancelled eyedropper
      }
    }
  };

  // Single Hex Input handler:
  // Strictly strips '#' and non-hex characters so only the 6 alphanumeric hex characters remain
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizeHexInput(raw);
    setHexInputText(sanitized);

    if (sanitized.length === 6) {
      const fullHex = `#${sanitized}`;
      setCurrentHex(fullHex);
      setHsv(hexToHsv(fullHex));
      triggerThrottledChange(fullHex, true);
    }
  };

  const handleHexInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    // If user copied e.g. "#2848F0" or "#FF0000" or with spaces, strip # and keep up to 6 hex characters
    const sanitized = sanitizeHexInput(pasted);
    setHexInputText(sanitized);

    if (sanitized.length === 6) {
      const fullHex = `#${sanitized}`;
      setCurrentHex(fullHex);
      setHsv(hexToHsv(fullHex));
      triggerThrottledChange(fullHex, true);
    }
  };

  const handleHexInputBlur = () => {
    if (hexInputText.length === 6) {
      const fullHex = `#${hexInputText}`;
      setCurrentHex(fullHex);
      setHsv(hexToHsv(fullHex));
      triggerThrottledChange(fullHex, true);
    } else if (hexInputText.length === 3) {
      const expanded = hexInputText.split('').map((c) => c + c).join('');
      const fullHex = `#${expanded}`;
      setHexInputText(expanded);
      setCurrentHex(fullHex);
      setHsv(hexToHsv(fullHex));
      triggerThrottledChange(fullHex, true);
    } else {
      // Revert to current valid hex
      setHexInputText(sanitizeHexInput(currentHex));
    }
  };

  const handleSelectPreset = (presetHex: string) => {
    setCurrentHex(presetHex);
    setHexInputText(sanitizeHexInput(presetHex));
    setHsv(hexToHsv(presetHex));
    triggerThrottledChange(presetHex, true);
  };

  const pureHueColor = `hsl(${hsv.h}, 100%, 50%)`;

  // Portal Popover rendered in document.body
  const popoverContent = isOpen && typeof document !== 'undefined' ? (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 999999, // Super high z-index to appear ABOVE EVERYTHING without being clipped
      }}
      className="w-70 bg-white rounded-2xl shadow-2xl border border-zinc-200/90 p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-100 select-none backdrop-blur-xs text-zinc-800 font-sans"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Popover Header with Title and Close button */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
        <span className="text-xs font-bold text-zinc-800 tracking-tight">
          {label ? label.replace(':', '') : 'Selector de Color'}
        </span>
        <button
          type="button"
          onClick={handleCancelAndClose}
          className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          title="Cerrar sin guardar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. 2D SATURATION & VALUE SPECTRUM (Zero Delay, 60fps) */}
      <div
        ref={spectrumRef}
        onMouseDown={handleSpectrumMouseDown}
        onTouchStart={handleSpectrumTouchStart}
        className="relative w-full h-36 rounded-xl cursor-crosshair overflow-hidden shadow-inner border border-zinc-200/80 touch-none"
        style={{
          backgroundColor: pureHueColor,
          backgroundImage: `linear-gradient(to top, #000000, transparent), linear-gradient(to right, #FFFFFF, transparent)`,
        }}
      >
        {/* Draggable Circle Handle */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-1 ring-black/20"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: currentHex,
          }}
        />
      </div>

      {/* 2. CONTROLS BAR: Eyedropper, Swatch, and Rainbow Hue Bar */}
      <div className="flex items-center gap-2">
        {'EyeDropper' in window && (
          <button
            type="button"
            onClick={handleEyeDropper}
            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Cuentagotas (Tomar color de cualquier pixel)"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Current Color Circular Swatch */}
        <div
          className="w-7 h-7 rounded-full border border-black/15 shadow-inner shrink-0"
          style={{ backgroundColor: currentHex }}
          title={currentHex}
        />

        {/* Rainbow Hue Track Bar (Zero Delay, 60fps) */}
        <div
          ref={hueSliderRef}
          onMouseDown={handleHueMouseDown}
          onTouchStart={handleHueTouchStart}
          className="relative flex-1 h-3.5 rounded-full cursor-pointer shadow-inner border border-black/10 touch-none"
          style={{
            background:
              'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
        >
          {/* Draggable Hue Thumb */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-zinc-800 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${(hsv.h / 360) * 100}%` }}
          />
        </div>
      </div>

      {/* 3. HEXADECIMAL INPUT: Only single text input for 6 hex numbers, NO RGB boxes */}
      <div className="pt-1.5 border-t border-zinc-100 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <span>Código Hexadecimal:</span>
          <span className="text-[10px] text-zinc-400 font-mono">6 caracteres</span>
        </div>

        <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 focus-within:bg-white focus-within:border-[#2848F0] focus-within:ring-2 focus-within:ring-[#2848F0]/20 overflow-hidden px-2.5 py-1.5 shadow-2xs">
          {/* Michi / Almohadilla # fija por defecto */}
          <span className="text-zinc-500 font-mono font-bold text-sm select-none pr-1">#</span>
          <input
            type="text"
            maxLength={6}
            value={hexInputText}
            onChange={handleHexInputChange}
            onPaste={handleHexInputPaste}
            onBlur={handleHexInputBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyAndClose();
              }
            }}
            placeholder="2848F0"
            spellCheck={false}
            className="w-full bg-transparent font-mono font-semibold text-xs text-zinc-900 tracking-wider uppercase focus:outline-none"
          />
        </div>
      </div>

      {/* 4. PRESET PALETTE QUICK SELECTION */}
      <div className="pt-1 border-t border-zinc-100">
        <div className="text-[10px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
          Colores rápidos
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => handleSelectPreset(preset)}
              className="w-6 h-6 rounded-md border border-black/10 shadow-2xs hover:scale-115 transition-transform flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: preset }}
              title={preset}
            >
              {currentHex.toUpperCase() === preset.toUpperCase() && (
                <Check
                  className={`w-3 h-3 ${
                    preset === '#FFFFFF' || preset === '#9CA3AF'
                      ? 'text-zinc-900'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. ACTION FOOTER: OK / LISTO BUTTON & REVERT BUTTON */}
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
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={handleApplyAndClose}
          className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          title="Confirmar color (o pulsa Enter)"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>OK</span>
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative flex items-center justify-between ${className}`}>
      {label && <span className="text-zinc-700 text-xs font-semibold">{label}</span>}

      {/* Trigger Swatch & Hex Badge */}
      {compact ? (
        <button
          ref={triggerRef}
          type="button"
          onMouseDown={(e) => {
            // Prevent deselecting text on canvas
            e.preventDefault();
          }}
          onClick={() => (isOpen ? handleApplyAndClose() : handleOpen())}
          className="flex items-center gap-1 p-0.5 px-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded shadow-2xs transition-all cursor-pointer group"
          title="Cambiar color"
        >
          <div
            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner shrink-0"
            style={{ backgroundColor: currentHex }}
          />
          <span className="font-mono text-[10px] font-semibold text-zinc-600 group-hover:text-zinc-900 pr-0.5">
            {currentHex}
          </span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onMouseDown={(e) => {
            // Prevent deselecting text on canvas
            e.preventDefault();
          }}
          onClick={() => (isOpen ? handleApplyAndClose() : handleOpen())}
          className="flex items-center gap-1.5 p-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-all cursor-pointer group"
          title="Abrir selector de color"
        >
          <div
            className="w-6 h-6 rounded-md border border-black/10 shadow-inner shrink-0"
            style={{ backgroundColor: currentHex }}
          />
          <span className="font-mono text-xs font-semibold text-zinc-700 pr-1 group-hover:text-zinc-900">
            {currentHex}
          </span>
        </button>
      )}

      {/* Render via Portal so it is NEVER clipped by parent containers */}
      {isOpen && typeof document !== 'undefined' && createPortal(popoverContent, document.body)}
    </div>
  );
};
