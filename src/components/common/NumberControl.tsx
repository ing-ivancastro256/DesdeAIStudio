import React, { useState, useEffect } from 'react';

export interface NumberControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const NumberControl: React.FC<NumberControlProps> = ({
  label,
  value,
  min = 1,
  max = 120,
  step = 1,
  unit = 'px',
  onChange,
}) => {
  const [localText, setLocalText] = useState<string>(String(value ?? ''));

  useEffect(() => {
    // Only update if value is a valid number and differs from parsed local text
    if (value !== undefined && value !== null && !isNaN(value)) {
      setLocalText((prev) => {
        const parsed = parseInt(prev, 10);
        return parsed === value ? prev : String(value);
      });
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow user complete freedom to type any number (e.g. "1", "2", "14", "99") or empty
    // without premature jumping or restrictive clamping on each keystroke!
    if (raw === '' || /^\d*$/.test(raw)) {
      setLocalText(raw);
      if (raw !== '') {
        const num = parseInt(raw, 10);
        if (!isNaN(num)) {
          // Immediately apply if positive number without forcing min/max jumps
          onChange(num);
        }
      }
    }
  };

  const handleInputBlur = () => {
    if (localText === '' || isNaN(parseInt(localText, 10))) {
      const fallback = Math.max(1, min);
      setLocalText(String(fallback));
      onChange(fallback);
    } else {
      const num = parseInt(localText, 10);
      const effectiveMin = Math.min(min, 1);
      const clamped = Math.max(effectiveMin, num);
      setLocalText(String(clamped));
      onChange(clamped);
    }
  };

  // Ensure slider min is never greater than the current value or 1
  const safeSliderMin = Math.min(min, typeof value === 'number' && value >= 1 ? value : 1, 1);
  const safeSliderMax = Math.max(max, typeof value === 'number' && value > max ? value : max, 100);

  return (
    <div className="space-y-1.5 font-['Inter']">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-700 font-medium">{label}:</span>
        <div className="flex items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            value={localText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-14 px-1.5 py-0.5 text-right font-mono font-semibold text-xs border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0]"
          />
          <span className="text-[11px] text-zinc-500 font-mono">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={safeSliderMin}
        max={safeSliderMax}
        step={step}
        value={typeof value === 'number' && value >= safeSliderMin ? value : safeSliderMin}
        onChange={(e) => {
          const num = Number(e.target.value);
          setLocalText(String(num));
          onChange(num);
        }}
        className="w-full accent-[#2848F0] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
      />
    </div>
  );
};
