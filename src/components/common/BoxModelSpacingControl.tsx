import React, { useState, useEffect } from 'react';
import { Monitor, Link2, Unlink } from 'lucide-react';

export interface SpacingValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SingleBoxProps {
  label: string; // 'Margen' | 'Relleno' | 'Grosor de borde'
  values: SpacingValues;
  onChange: (values: SpacingValues) => void;
  defaultLinked?: boolean;
}

export const SingleBoxModelRow: React.FC<SingleBoxProps> = ({
  label,
  values,
  onChange,
  defaultLinked = false,
}) => {
  const [isLinked, setIsLinked] = useState<boolean>(() => {
    if (!defaultLinked) return false;
    const t = values.top ?? 0;
    return t === (values.right ?? 0) && t === (values.bottom ?? 0) && t === (values.left ?? 0);
  });
  const [focusedField, setFocusedField] = useState<keyof SpacingValues | null>(null);
  const [localTop, setLocalTop] = useState<string>(String(values.top ?? 0));
  const [localRight, setLocalRight] = useState<string>(String(values.right ?? 0));
  const [localBottom, setLocalBottom] = useState<string>(String(values.bottom ?? 0));
  const [localLeft, setLocalLeft] = useState<string>(String(values.left ?? 0));

  useEffect(() => {
    if (isLinked && focusedField !== null) return;
    if (focusedField !== 'top') setLocalTop(String(values.top ?? 0));
    if (focusedField !== 'right') setLocalRight(String(values.right ?? 0));
    if (focusedField !== 'bottom') setLocalBottom(String(values.bottom ?? 0));
    if (focusedField !== 'left') setLocalLeft(String(values.left ?? 0));
  }, [values.top, values.right, values.bottom, values.left, focusedField, isLinked]);

  const handleFieldChange = (field: keyof SpacingValues, text: string) => {
    if (text !== '' && !/^\d*$/.test(text)) return;

    if (isLinked) {
      setLocalTop(text);
      setLocalRight(text);
      setLocalBottom(text);
      setLocalLeft(text);
      if (text === '') return;
      const val = parseInt(text, 10);
      if (!Number.isNaN(val)) {
        onChange({ top: val, right: val, bottom: val, left: val });
      }
      return;
    }

    if (field === 'top') setLocalTop(text);
    if (field === 'right') setLocalRight(text);
    if (field === 'bottom') setLocalBottom(text);
    if (field === 'left') setLocalLeft(text);

    if (text === '') return;
    const num = parseInt(text, 10);
    if (!Number.isNaN(num)) {
      onChange({
        ...values,
        [field]: num,
      });
    }
  };

  const handleBlur = (field: keyof SpacingValues, text: string) => {
    setFocusedField(null);
    const parsed = text.trim() === '' ? 0 : Math.max(0, parseInt(text, 10) || 0);
    const normalized = String(parsed);
    if (isLinked) {
      setLocalTop(normalized);
      setLocalRight(normalized);
      setLocalBottom(normalized);
      setLocalLeft(normalized);
      onChange({ top: parsed, right: parsed, bottom: parsed, left: parsed });
    } else {
      if (field === 'top') setLocalTop(normalized);
      if (field === 'right') setLocalRight(normalized);
      if (field === 'bottom') setLocalBottom(normalized);
      if (field === 'left') setLocalLeft(normalized);
      onChange({ ...values, [field]: parsed });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof SpacingValues,
    currentText: string
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const base = currentText.trim() === '' ? (values[field] ?? 0) : parseInt(currentText, 10) || 0;
      const step = e.shiftKey ? 10 : 1;
      const next = Math.max(0, base + (e.key === 'ArrowUp' ? step : -step));
      handleFieldChange(field, String(next));
    }
  };

  return (
    <div className="space-y-1.5 font-['Inter']">
      {/* Header: Label + Monitor Icon + Unit */}
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-1.5 font-medium text-zinc-700">
          <span>{label}</span>
          <Monitor className="w-3.5 h-3.5 text-zinc-500 stroke-[1.75]" />
        </div>
        <div className="text-zinc-500 font-mono text-[11px] cursor-default">
          <span>px</span>
        </div>
      </div>

      {/* Inputs row */}
      <div>
        <div className="flex items-stretch border border-zinc-200 rounded-md overflow-hidden bg-white shadow-2xs">
          <input
            type="text"
            inputMode="numeric"
            value={localTop}
            onFocus={() => setFocusedField('top')}
            onChange={(e) => handleFieldChange('top', e.target.value)}
            onBlur={(e) => handleBlur('top', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'top', localTop)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Arriba (Top)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={localRight}
            onFocus={() => setFocusedField('right')}
            onChange={(e) => handleFieldChange('right', e.target.value)}
            onBlur={(e) => handleBlur('right', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'right', localRight)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Derecha (Right)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={localBottom}
            onFocus={() => setFocusedField('bottom')}
            onChange={(e) => handleFieldChange('bottom', e.target.value)}
            onBlur={(e) => handleBlur('bottom', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'bottom', localBottom)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Abajo (Bottom)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={localLeft}
            onFocus={() => setFocusedField('left')}
            onChange={(e) => handleFieldChange('left', e.target.value)}
            onBlur={(e) => handleBlur('left', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'left', localLeft)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Izquierda (Left)"
          />
          <button
            type="button"
            onClick={() => setIsLinked(!isLinked)}
            title={isLinked ? 'Desvincular valores (independiente)' : 'Vincular valores (todos iguales)'}
            className={`w-9 flex items-center justify-center transition-colors cursor-pointer select-none ${
              isLinked
                ? 'bg-zinc-200 text-zinc-900 font-bold'
                : 'bg-zinc-50 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {isLinked ? <Link2 className="w-3.5 h-3.5 stroke-[2.2]" /> : <Unlink className="w-3.5 h-3.5 stroke-[1.8]" />}
          </button>
        </div>

        {/* Sub-labels under the 4 inputs, precisely aligned */}
        <div className="grid grid-cols-4 pr-9 mt-1 text-center select-none">
          <span className="text-[10px] text-zinc-400">Arriba</span>
          <span className="text-[10px] text-zinc-400">Derecha</span>
          <span className="text-[10px] text-zinc-400">Abajo</span>
          <span className="text-[10px] text-zinc-400">Izquierda</span>
        </div>
      </div>
    </div>
  );
};

export interface BoxModelSpacingControlProps {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  onChangeMargin?: (margins: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  }) => void;
  onChangePadding?: (paddings: {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  }) => void;
  showMargin?: boolean;
  showPadding?: boolean;
}

export const BoxModelSpacingControl: React.FC<BoxModelSpacingControlProps> = ({
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  onChangeMargin,
  onChangePadding,
  showMargin = true,
  showPadding = true,
}) => {
  return (
    <div className="space-y-4">
      {/* Margen */}
      {showMargin && onChangeMargin && (
        <SingleBoxModelRow
          label="Margen"
          values={{
            top: marginTop,
            right: marginRight,
            bottom: marginBottom,
            left: marginLeft,
          }}
          onChange={(v) =>
            onChangeMargin({
              marginTop: v.top,
              marginRight: v.right,
              marginBottom: v.bottom,
              marginLeft: v.left,
            })
          }
        />
      )}

      {/* Relleno */}
      {showPadding && onChangePadding && (
        <SingleBoxModelRow
          label="Relleno"
          values={{
            top: paddingTop,
            right: paddingRight,
            bottom: paddingBottom,
            left: paddingLeft,
          }}
          onChange={(v) =>
            onChangePadding({
              paddingTop: v.top,
              paddingRight: v.right,
              paddingBottom: v.bottom,
              paddingLeft: v.left,
            })
          }
        />
      )}
    </div>
  );
};
