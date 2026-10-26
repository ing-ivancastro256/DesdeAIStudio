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
  const [localTop, setLocalTop] = useState<string>(String(values.top ?? 0));
  const [localRight, setLocalRight] = useState<string>(String(values.right ?? 0));
  const [localBottom, setLocalBottom] = useState<string>(String(values.bottom ?? 0));
  const [localLeft, setLocalLeft] = useState<string>(String(values.left ?? 0));

  useEffect(() => {
    setLocalTop(String(values.top ?? 0));
    setLocalRight(String(values.right ?? 0));
    setLocalBottom(String(values.bottom ?? 0));
    setLocalLeft(String(values.left ?? 0));
  }, [values.top, values.right, values.bottom, values.left]);

  const handleFieldChange = (field: keyof SpacingValues, text: string) => {
    if (text !== '' && !/^\d*$/.test(text)) return;

    if (isLinked) {
      setLocalTop(text);
      setLocalRight(text);
      setLocalBottom(text);
      setLocalLeft(text);
      const val = text === '' ? 0 : parseInt(text, 10);
      onChange({ top: val, right: val, bottom: val, left: val });
      return;
    }

    if (field === 'top') setLocalTop(text);
    if (field === 'right') setLocalRight(text);
    if (field === 'bottom') setLocalBottom(text);
    if (field === 'left') setLocalLeft(text);

    const num = text === '' ? 0 : parseInt(text, 10);
    onChange({
      ...values,
      [field]: num,
    });
  };

  const handleBlur = (field: keyof SpacingValues, text: string) => {
    if (text === '') {
      if (isLinked) {
        setLocalTop('0');
        setLocalRight('0');
        setLocalBottom('0');
        setLocalLeft('0');
        onChange({ top: 0, right: 0, bottom: 0, left: 0 });
      } else {
        if (field === 'top') setLocalTop('0');
        if (field === 'right') setLocalRight('0');
        if (field === 'bottom') setLocalBottom('0');
        if (field === 'left') setLocalLeft('0');
        onChange({ ...values, [field]: 0 });
      }
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
            onChange={(e) => handleFieldChange('top', e.target.value)}
            onBlur={(e) => handleBlur('top', e.target.value)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Arriba (Top)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={localRight}
            onChange={(e) => handleFieldChange('right', e.target.value)}
            onBlur={(e) => handleBlur('right', e.target.value)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Derecha (Right)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={localBottom}
            onChange={(e) => handleFieldChange('bottom', e.target.value)}
            onBlur={(e) => handleBlur('bottom', e.target.value)}
            placeholder="0"
            className="w-0 flex-1 text-center py-1.5 text-xs font-mono font-medium text-zinc-800 border-r border-zinc-200 focus:outline-none focus:bg-blue-50/50"
            title="Abajo (Bottom)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={localLeft}
            onChange={(e) => handleFieldChange('left', e.target.value)}
            onBlur={(e) => handleBlur('left', e.target.value)}
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
