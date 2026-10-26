import React, { useState, useEffect } from 'react';

export interface NumberControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  inputMin?: number;
  inputMax?: number;
  strictMax?: boolean;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const NumberControl: React.FC<NumberControlProps> = ({
  label,
  value,
  min = 0,
  max = 120,
  inputMin,
  inputMax,
  strictMax = false,
  step = 1,
  unit = 'px',
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localText, setLocalText] = useState<string>(() =>
    value !== undefined && value !== null && !Number.isNaN(value) ? String(value) : ''
  );

  const effectiveInputMin = inputMin !== undefined ? inputMin : min;
  const effectiveInputMax = inputMax !== undefined ? inputMax : max;

  useEffect(() => {
    if (!isFocused && value !== undefined && value !== null && !Number.isNaN(value)) {
      setLocalText(String(value));
    }
  }, [value, isFocused]);

  const clampCommitted = (num: number): number => {
    let res = Math.round(num);
    if (effectiveInputMin !== undefined) {
      res = Math.max(effectiveInputMin, res);
    }
    if (strictMax && effectiveInputMax !== undefined) {
      res = Math.min(effectiveInputMax, res);
    }
    return res;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw !== '' && raw !== '-' && !/^-?\d*\.?\d*$/.test(raw)) {
      return;
    }
    setLocalText(raw);

    if (raw.trim() === '' || raw === '-') {
      return;
    }

    const parsed = Math.round(Number(raw));
    if (Number.isNaN(parsed)) return;

    if (effectiveInputMin !== undefined && parsed < effectiveInputMin) {
      // Allow typing intermediate digits (e.g. '6' -> '60' -> '600') without jumping
      return;
    }

    if (strictMax && effectiveInputMax !== undefined && parsed > effectiveInputMax) {
      onChange(effectiveInputMax);
      return;
    }

    onChange(parsed);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    const trimmed = localText.trim();
    if (trimmed === '' || trimmed === '-' || Number.isNaN(Number(trimmed))) {
      if ((effectiveInputMin ?? 0) <= 0) {
        const zeroVal = clampCommitted(0);
        setLocalText(String(zeroVal));
        if (zeroVal !== value) onChange(zeroVal);
      } else {
        const safeCurrent =
          typeof value === 'number' && !Number.isNaN(value)
            ? clampCommitted(value)
            : effectiveInputMin ?? 0;
        setLocalText(String(safeCurrent));
        if (safeCurrent !== value) onChange(safeCurrent);
      }
      return;
    }

    const clamped = clampCommitted(Number(trimmed));
    setLocalText(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }
    if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const base =
        localText.trim() !== '' && !Number.isNaN(Number(localText))
          ? Number(localText)
          : value ?? effectiveInputMin ?? 0;
      const delta = e.key === 'ArrowUp' ? 10 : -10;
      const next = clampCommitted(base + delta);
      setLocalText(String(next));
      onChange(next);
    }
  };

  const safeSliderMin = typeof min === 'number' ? min : 0;
  const safeSliderMax = typeof max === 'number' ? Math.max(max, safeSliderMin) : 120;
  const currentSliderVal =
    typeof value === 'number' && !Number.isNaN(value)
      ? Math.min(Math.max(safeSliderMin, value), safeSliderMax)
      : safeSliderMin;

  return (
    <div className="space-y-1.5 font-['Inter']">
      <div className="flex items-center justify-between text-xs gap-2">
        <span className="text-zinc-700 font-medium">{label}:</span>
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            step={1}
            min={effectiveInputMin}
            max={strictMax ? effectiveInputMax : undefined}
            value={localText}
            onFocus={() => setIsFocused(true)}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-[68px] px-1.5 py-0.5 text-right font-mono font-semibold text-xs border border-zinc-300 rounded-md bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0] [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
          />
          {unit && <span className="text-[11px] text-zinc-500 font-mono select-none">{unit}</span>}
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
          setIsFocused(false);
          setLocalText(String(num));
          onChange(num);
        }}
        className="w-full accent-[#2848F0] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
      />
    </div>
  );
};

export interface InlineSliderInputProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  inputMin?: number;
  inputMax?: number;
  strictMax?: boolean;
  step?: number;
  unit?: string;
  accentClassName?: string;
  onChange: (val: number) => void;
}

export const InlineSliderInput: React.FC<InlineSliderInputProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  inputMin,
  inputMax,
  strictMax = false,
  step = 1,
  unit = 'px',
  accentClassName = 'accent-[#2848F0]',
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localText, setLocalText] = useState<string>(() =>
    value !== undefined && value !== null && !Number.isNaN(value) ? String(value) : ''
  );

  const effectiveInputMin = inputMin !== undefined ? inputMin : min;
  const effectiveInputMax = inputMax !== undefined ? inputMax : max;

  useEffect(() => {
    if (!isFocused && value !== undefined && value !== null && !Number.isNaN(value)) {
      setLocalText(String(value));
    }
  }, [value, isFocused]);

  const clampCommitted = (num: number): number => {
    let res = Math.round(num);
    if (effectiveInputMin !== undefined) {
      res = Math.max(effectiveInputMin, res);
    }
    if (strictMax && effectiveInputMax !== undefined) {
      res = Math.min(effectiveInputMax, res);
    }
    return res;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw !== '' && raw !== '-' && !/^-?\d*\.?\d*$/.test(raw)) {
      return;
    }
    setLocalText(raw);

    if (raw.trim() === '' || raw === '-') {
      return;
    }

    const parsed = Math.round(Number(raw));
    if (Number.isNaN(parsed)) return;

    if (effectiveInputMin !== undefined && parsed < effectiveInputMin) {
      return;
    }

    if (strictMax && effectiveInputMax !== undefined && parsed > effectiveInputMax) {
      onChange(effectiveInputMax);
      return;
    }

    onChange(parsed);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    const trimmed = localText.trim();
    if (trimmed === '' || trimmed === '-' || Number.isNaN(Number(trimmed))) {
      if ((effectiveInputMin ?? 0) <= 0) {
        const zeroVal = clampCommitted(0);
        setLocalText(String(zeroVal));
        if (zeroVal !== value) onChange(zeroVal);
      } else {
        const safeCurrent =
          typeof value === 'number' && !Number.isNaN(value)
            ? clampCommitted(value)
            : effectiveInputMin ?? 0;
        setLocalText(String(safeCurrent));
        if (safeCurrent !== value) onChange(safeCurrent);
      }
      return;
    }

    const clamped = clampCommitted(Number(trimmed));
    setLocalText(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }
    if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const base =
        localText.trim() !== '' && !Number.isNaN(Number(localText))
          ? Number(localText)
          : value ?? effectiveInputMin ?? 0;
      const delta = e.key === 'ArrowUp' ? 10 : -10;
      const next = clampCommitted(base + delta);
      setLocalText(String(next));
      onChange(next);
    }
  };

  const safeSliderMin = typeof min === 'number' ? min : 0;
  const safeSliderMax = typeof max === 'number' ? Math.max(max, safeSliderMin) : 100;
  const currentSliderVal =
    typeof value === 'number' && !Number.isNaN(value)
      ? Math.min(Math.max(safeSliderMin, value), safeSliderMax)
      : safeSliderMin;

  return (
    <div className="space-y-1.5 font-['Inter']">
      {label && (
        <label className="font-semibold text-zinc-700 block text-xs">
          {label.endsWith(':') ? label : `${label}:`}
        </label>
      )}
      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={safeSliderMin}
          max={safeSliderMax}
          step={step}
          value={currentSliderVal}
          onChange={(e) => {
            const next = Number(e.target.value);
            setIsFocused(false);
            setLocalText(String(next));
            onChange(next);
          }}
          className={`flex-1 ${accentClassName} h-1.5 bg-zinc-200 rounded-lg cursor-pointer`}
        />
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            step={1}
            min={effectiveInputMin}
            max={strictMax ? effectiveInputMax : undefined}
            value={localText}
            onFocus={() => setIsFocused(true)}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-[68px] px-1.5 py-1 text-right font-mono font-semibold text-xs border border-zinc-300 rounded-md bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0] [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
          />
          {unit && <span className="text-[11px] text-zinc-500 font-mono select-none">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export interface FreeNumberInputProps {
  value: number;
  min?: number;
  max?: number;
  strictMax?: boolean;
  step?: number;
  unit?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onChange: (val: number) => void;
}

export const FreeNumberInput: React.FC<FreeNumberInputProps> = ({
  value,
  min = 0,
  max,
  strictMax = false,
  step = 1,
  unit,
  placeholder,
  className = '',
  inputClassName = '',
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localText, setLocalText] = useState<string>(() =>
    value !== undefined && value !== null && !Number.isNaN(value) ? String(value) : ''
  );

  useEffect(() => {
    if (!isFocused && value !== undefined && value !== null && !Number.isNaN(value)) {
      setLocalText(String(value));
    }
  }, [value, isFocused]);

  const clampCommitted = (num: number): number => {
    let res = Math.round(num);
    if (min !== undefined) {
      res = Math.max(min, res);
    }
    if (strictMax && max !== undefined) {
      res = Math.min(max, res);
    }
    return res;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw !== '' && raw !== '-' && !/^-?\d*\.?\d*$/.test(raw)) {
      return;
    }
    setLocalText(raw);

    if (raw.trim() === '' || raw === '-') {
      return;
    }

    const parsed = Math.round(Number(raw));
    if (Number.isNaN(parsed)) return;

    if (min !== undefined && parsed < min) {
      return;
    }

    if (strictMax && max !== undefined && parsed > max) {
      onChange(max);
      return;
    }

    onChange(parsed);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const trimmed = localText.trim();
    if (trimmed === '' || trimmed === '-' || Number.isNaN(Number(trimmed))) {
      if ((min ?? 0) <= 0) {
        const zeroVal = clampCommitted(0);
        setLocalText(String(zeroVal));
        if (zeroVal !== value) onChange(zeroVal);
      } else {
        const safeCurrent =
          typeof value === 'number' && !Number.isNaN(value) ? clampCommitted(value) : min ?? 0;
        setLocalText(String(safeCurrent));
        if (safeCurrent !== value) onChange(safeCurrent);
      }
      return;
    }

    const clamped = clampCommitted(Number(trimmed));
    setLocalText(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }
    if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const base =
        localText.trim() !== '' && !Number.isNaN(Number(localText))
          ? Number(localText)
          : value ?? min ?? 0;
      const delta = e.key === 'ArrowUp' ? 10 : -10;
      const next = clampCommitted(base + delta);
      setLocalText(String(next));
      onChange(next);
    }
  };

  return (
    <div
      className={`flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden focus-within:border-[#2848F0] focus-within:ring-1 focus-within:ring-[#2848F0] ${className}`}
    >
      <input
        type="number"
        step={step}
        min={min}
        max={strictMax ? max : undefined}
        value={localText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full p-1.5 text-xs font-mono font-semibold text-zinc-900 bg-transparent focus:outline-none [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer ${inputClassName}`}
      />
      {unit && (
        <span className="text-[10px] font-bold text-zinc-400 pr-2 font-mono select-none shrink-0">
          {unit}
        </span>
      )}
    </div>
  );
};
