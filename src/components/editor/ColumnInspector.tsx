import React, { useState } from 'react';
import { PageBlockColumn, PageBlockRow } from '../../types';
import { NumberControl, InlineSliderInput } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import { formatRowDisplayName } from '../../utils/editorTreeUtils';
import {
  ArrowLeft,
  Columns,
  Palette,
  Sliders,
  ChevronDown,
  ChevronRight,
  Box,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  RotateCcw,
  Maximize2,
} from 'lucide-react';

interface ColumnInspectorProps {
  column: PageBlockColumn;
  columnIndex: number;
  parentRow: PageBlockRow;
  sectionName?: string;
  onUpdate: (props: Partial<PageBlockColumn>) => void;
  onResizeColumnWidth?: (pct: number) => void;
  onEqualizeColumns?: () => void;
  onSelectSiblingColumn: (columnId: string) => void;
  onSelectParentRow: () => void;
  onClose: () => void;
}

const COLUMN_COLOR_SWATCHES = [
  '#FFFFFF',
  '#F8FAFC',
  '#F4F4F5',
  '#EFF6FF',
  '#DBEAFE',
  '#ECFDF5',
  '#FEF3C7',
  '#FEE2E2',
  '#F3E8FF',
  '#2848F0',
  '#18181B',
  '#09090B',
];

const COLUMN_GRADIENT_PRESETS = [
  { name: 'Azul Pro', c1: '#1E3A8A', c2: '#2848F0' },
  { name: 'Noche', c1: '#18181B', c2: '#09090B' },
  { name: 'Púrpura', c1: '#4C1D95', c2: '#7C3AED' },
  { name: 'Esmeralda', c1: '#064E3B', c2: '#059669' },
  { name: 'Hielo Suave', c1: '#EFF6FF', c2: '#DBEAFE' },
  { name: 'Ámbar Cálido', c1: '#FEF3C7', c2: '#FDE68A' },
];

export const ColumnInspector: React.FC<ColumnInspectorProps> = ({
  column,
  columnIndex,
  parentRow,
  sectionName,
  onUpdate,
  onResizeColumnWidth,
  onEqualizeColumns,
  onSelectSiblingColumn,
  onSelectParentRow,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({
    width: true,
    background: true,
    spacing: true,
    borders: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const effectiveBgType = column.bgType || (column.bgGradient ? 'gradient' : 'solid');
  const gradColor1 = column.bgColor || '#1E3A8A';
  const gradColor2 = column.bgColor2 || '#2848F0';

  const hasCustomVisual =
    Boolean(column.bgColor) ||
    Boolean(column.bgGradient) ||
    Boolean(column.borderWidth && column.borderWidth > 0);

  const defaultPaddingDisplay = hasCustomVisual ? 16 : 10;

  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] select-none">
      {/* Top Bar with Volver a Biblioteca */}
      <div className="p-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Biblioteca</span>
        </button>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold flex items-center gap-1">
          <Columns className="w-3 h-3" />
          Columna {columnIndex + 1}
        </span>
      </div>

      {/* Column Header & Quick Sibling Column Switcher */}
      <div className="px-3 py-2.5 border-b border-zinc-200 bg-white space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Columns className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 font-['Poppins']">
                Columna {columnIndex + 1} de {parentRow.columns.length}
              </h3>
              <span className="text-[10px] bg-teal-50 border border-teal-200 text-teal-800 font-mono font-bold px-1.5 py-0.5 rounded">
                {Math.round(column.widthPercentage)}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[210px]">
              {sectionName
                ? `${sectionName} • ${formatRowDisplayName(parentRow.name, 'Sección Interna')}`
                : formatRowDisplayName(parentRow.name, 'Sección Interna')}
            </p>
          </div>

          <button
            type="button"
            onClick={onSelectParentRow}
            className="px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            title="Editar contenedor de Sección Interna"
          >
            <Box className="w-3 h-3" />
            <span>Contenedor</span>
          </button>
        </div>

        {/* Sibling Column Tabs (2, 3, 4 Columns) */}
        {parentRow.columns.length > 1 && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Cambiar de columna:
            </span>
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${parentRow.columns.length}, minmax(0, 1fr))`,
              }}
            >
              {parentRow.columns.map((sibCol, idx) => {
                const isActive = sibCol.id === column.id;
                const swatchStyle: React.CSSProperties = sibCol.bgGradient
                  ? { backgroundImage: sibCol.bgGradient }
                  : sibCol.bgColor
                  ? { backgroundColor: sibCol.bgColor }
                  : { backgroundColor: 'transparent' };
                return (
                  <button
                    key={sibCol.id}
                    type="button"
                    onClick={() => onSelectSiblingColumn(sibCol.id)}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    <span
                      style={swatchStyle}
                      className={`w-2.5 h-2.5 rounded-full shrink-0 border ${
                        isActive ? 'border-white/80' : 'border-zinc-300'
                      }`}
                    />
                    <span>Col {idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Inspector Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* 0. ANCHO DE LA COLUMNA (CUANDO HAY MÚLTIPLES COLUMNAS) */}
        {parentRow.columns.length > 1 && onResizeColumnWidth && (() => {
          const minColPct = 10;
          const maxColPct = 100 - (parentRow.columns.length - 1) * 10;
          const curPct = Math.round(column.widthPercentage);
          const colPresets = [20, 25, 33, 50, 67, 75, 80].filter(
            (v) => v >= minColPct && v <= maxColPct
          );

          return (
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('width')}
                className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                  Ancho de Columna
                </span>
                {openSections.width ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>

              {openSections.width && (
                <div className="p-3.5 space-y-2.5 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-700 text-[11px]">
                      Proporción rápida:
                    </span>
                    {onEqualizeColumns && (
                      <button
                        type="button"
                        onClick={onEqualizeColumns}
                        className="text-[10px] font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        Igualar todas ({Math.round(100 / parentRow.columns.length)}%)
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {colPresets.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => onResizeColumnWidth(pct)}
                        className={`flex-1 min-w-[42px] py-1 px-1.5 border rounded text-[10px] font-mono font-semibold text-center transition-all cursor-pointer ${
                          curPct === pct
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'border-zinc-200 bg-white hover:border-teal-600 text-zinc-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  <InlineSliderInput
                    label="Ancho exacto de columna"
                    value={curPct}
                    min={minColPct}
                    max={maxColPct}
                    strictMax={true}
                    step={1}
                    unit="%"
                    accentClassName="accent-teal-600"
                    onChange={(val) => onResizeColumnWidth(val)}
                  />
                </div>
              )}
            </div>
          );
        })()}

        {/* 1. COLOR Y FONDO DE LA COLUMNA */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('background')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-teal-600" />
              Color y Fondo de Columna
            </span>
            {openSections.background ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.background && (
            <div className="p-3.5 space-y-3 bg-white">
              {/* Solid vs Gradient Switch */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      bgType: 'solid',
                      bgGradient: undefined,
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                    effectiveBgType === 'solid'
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  Color Sólido
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextGrad = `linear-gradient(135deg, ${gradColor1} 0%, ${gradColor2} 100%)`;
                    onUpdate({
                      bgType: 'gradient',
                      bgColor: gradColor1,
                      bgColor2: gradColor2,
                      bgGradient: column.bgGradient || nextGrad,
                    });
                  }}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                    effectiveBgType === 'gradient'
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  Gradiente
                </button>
              </div>

              {effectiveBgType === 'solid' ? (
                <div className="space-y-3">
                  <HexColorPicker
                    label="Color de fondo:"
                    value={column.bgColor || '#FFFFFF'}
                    onChange={(val) =>
                      onUpdate({
                        bgType: 'solid',
                        bgColor: val,
                        bgGradient: undefined,
                      })
                    }
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Colores rápidos:
                      </span>
                      {(column.bgColor || column.bgGradient) && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdate({
                              bgColor: undefined,
                              bgColor2: undefined,
                              bgGradient: undefined,
                            })
                          }
                          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Transparente</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate({
                            bgColor: undefined,
                            bgColor2: undefined,
                            bgGradient: undefined,
                          })
                        }
                        className={`py-1 px-2 border rounded text-[10px] font-semibold cursor-pointer ${
                          !column.bgColor && !column.bgGradient
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        Transparente
                      </button>

                      {COLUMN_COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch}
                          type="button"
                          onClick={() =>
                            onUpdate({
                              bgType: 'solid',
                              bgColor: swatch,
                              bgGradient: undefined,
                            })
                          }
                          style={{ backgroundColor: swatch }}
                          className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                            column.bgColor === swatch && !column.bgGradient
                              ? 'ring-2 ring-teal-600 scale-110'
                              : 'border-zinc-300 hover:scale-105'
                          }`}
                          title={swatch}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <HexColorPicker
                    label="Color 1 del gradiente:"
                    value={gradColor1}
                    onChange={(val) =>
                      onUpdate({
                        bgType: 'gradient',
                        bgColor: val,
                        bgColor2: gradColor2,
                        bgGradient: `linear-gradient(135deg, ${val} 0%, ${gradColor2} 100%)`,
                      })
                    }
                  />
                  <HexColorPicker
                    label="Color 2 del gradiente:"
                    value={gradColor2}
                    onChange={(val) =>
                      onUpdate({
                        bgType: 'gradient',
                        bgColor: gradColor1,
                        bgColor2: val,
                        bgGradient: `linear-gradient(135deg, ${gradColor1} 0%, ${val} 100%)`,
                      })
                    }
                  />

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Gradientes rápidos:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {COLUMN_GRADIENT_PRESETS.map((preset) => {
                        const gradVal = `linear-gradient(135deg, ${preset.c1} 0%, ${preset.c2} 100%)`;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() =>
                              onUpdate({
                                bgType: 'gradient',
                                bgColor: preset.c1,
                                bgColor2: preset.c2,
                                bgGradient: gradVal,
                              })
                            }
                            style={{ backgroundImage: gradVal }}
                            className="h-7 rounded-lg border border-zinc-200 text-[10px] font-bold text-white drop-shadow-xs flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform"
                            title={preset.name}
                          >
                            <span className="bg-black/35 px-1.5 py-0.5 rounded text-[9px]">
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. DISPOSICIÓN Y ESPACIADO INTERNO */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('spacing')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              Disposición y Espaciado
            </span>
            {openSections.spacing ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.spacing && (
            <div className="p-3.5 bg-white space-y-3.5">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Alineación Vertical del Contenido:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { val: 'top', label: 'Superior', Icon: AlignStartVertical },
                      { val: 'center', label: 'Centro', Icon: AlignCenterVertical },
                      { val: 'bottom', label: 'Inferior', Icon: AlignEndVertical },
                    ] as const
                  ).map(({ val, label, Icon }) => {
                    const isActive = (column.verticalAlign || 'top') === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onUpdate({ verticalAlign: val })}
                        className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                            : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <BoxModelSpacingControl
                marginTop={column.marginTop ?? 0}
                marginRight={0}
                marginBottom={column.marginBottom ?? 0}
                marginLeft={0}
                paddingTop={column.paddingTop ?? defaultPaddingDisplay}
                paddingRight={column.paddingRight ?? defaultPaddingDisplay}
                paddingBottom={column.paddingBottom ?? defaultPaddingDisplay}
                paddingLeft={column.paddingLeft ?? defaultPaddingDisplay}
                onChangeMargin={(m) =>
                  onUpdate({
                    marginTop: m.marginTop,
                    marginBottom: m.marginBottom,
                  })
                }
                onChangePadding={(p) =>
                  onUpdate({
                    paddingTop: p.paddingTop,
                    paddingRight: p.paddingRight,
                    paddingBottom: p.paddingBottom,
                    paddingLeft: p.paddingLeft,
                  })
                }
                showPadding={true}
              />
            </div>
          )}
        </div>

        {/* 3. BORDES Y REDONDEO */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('borders')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-teal-600" />
              Bordes y Redondeo
            </span>
            {openSections.borders ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.borders && (
            <div className="p-3.5 space-y-3 bg-white">
              <NumberControl
                label="Radio de Redondeo (Esquinas)"
                value={column.borderRadius ?? 0}
                min={0}
                max={60}
                onChange={(val) => onUpdate({ borderRadius: val })}
              />
              <div className="flex items-center gap-1">
                {[0, 8, 16, 24].map((rad) => (
                  <button
                    key={rad}
                    type="button"
                    onClick={() => onUpdate({ borderRadius: rad })}
                    className={`flex-1 py-1 text-[11px] font-semibold border rounded cursor-pointer ${
                      (column.borderRadius ?? 0) === rad
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {rad === 0 ? 'Recto' : `${rad}px`}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                <NumberControl
                  label="Grosor de Borde"
                  value={column.borderWidth || 0}
                  min={0}
                  max={12}
                  onChange={(val) => onUpdate({ borderWidth: val })}
                />

                {(column.borderWidth || 0) > 0 && (
                  <>
                    <HexColorPicker
                      label="Color de Borde:"
                      value={column.borderColor || '#E4E4E7'}
                      onChange={(val) => onUpdate({ borderColor: val })}
                    />

                    <div className="flex items-center gap-1">
                      {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => onUpdate({ borderStyle: style })}
                          className={`flex-1 py-1 text-[11px] font-semibold border rounded capitalize cursor-pointer ${
                            (column.borderStyle || 'solid') === style
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
