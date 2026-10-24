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
  min = 0,
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
    if (raw === '' || /^\d*$/.test(raw)) {
      if (raw !== '') {
        const num = parseInt(raw, 10);
        if (!isNaN(num)) {
          if (max !== undefined && num > max) {
            setLocalText(String(max));
            onChange(max);
            return;
          }
          setLocalText(raw);
          onChange(num);
          return;
        }
      }
      setLocalText(raw);
    }
  };

  const handleInputBlur = () => {
    const minVal = min !== undefined ? min : 0;
    const maxVal = max !== undefined ? max : 9999;
    if (localText === '' || isNaN(parseInt(localText, 10))) {
      setLocalText(String(minVal));
      onChange(minVal);
    } else {
      const num = parseInt(localText, 10);
      const clamped = Math.min(Math.max(minVal, num), maxVal);
      setLocalText(String(clamped));
      onChange(clamped);
    }
  };

  const safeSliderMin = typeof min === 'number' ? min : 0;
  const safeSliderMax = typeof max === 'number' ? Math.max(max, safeSliderMin) : 120;
  const currentSliderVal =
    typeof value === 'number' && !isNaN(value)
      ? Math.min(Math.max(safeSliderMin, value), safeSliderMax)
      : safeSliderMin;

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
        value={currentSliderVal}
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
