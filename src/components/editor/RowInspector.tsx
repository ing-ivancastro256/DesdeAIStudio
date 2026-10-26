import React, { useState } from 'react';
import { PageBlockRow } from '../../types';
import { NumberControl, InlineSliderInput, FreeNumberInput } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import { resizeColumnWidthInRow } from '../../utils/editorTreeUtils';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Palette,
  Sliders,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  Box,
  Clock,
  Columns,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface RowInspectorProps {
  row: PageBlockRow;
  sectionName?: string;
  canvasMaxWidth?: number;
  governingLabel?: string;
  onUpdate: (props: Partial<PageBlockRow>) => void;
  onSelectColumn?: (columnId: string) => void;
  onChangeColumnsCount?: (count: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canDelete?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const RowInspector: React.FC<RowInspectorProps> = ({
  row,
  sectionName,
  canvasMaxWidth,
  governingLabel,
  onUpdate,
  onSelectColumn,
  onChangeColumnsCount,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  canDelete = true,
  onDuplicate,
  onDelete,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({
    layout: true,
    background: true,
    columnsList: true,
    borders: true,
    delay: true,
    spacing: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const maxAllowedWidth = Math.max(320, Math.round(canvasMaxWidth || 1200));
  const minAllowedWidth = Math.min(100, maxAllowedWidth);
  const sliderMinWidth = Math.min(200, maxAllowedWidth);
  const currentWidthType = row.widthType || 'boxed';
  const currentMaxWidth = Math.min(row.maxWidth ?? maxAllowedWidth, maxAllowedWidth);

  const basePresetValues = [600, 800, 960, 1140].filter((val) => val < maxAllowedWidth);
  const widthPresets = [
    ...basePresetValues.map((val) => ({ label: `${val}px`, val })),
    { label: '100%', val: maxAllowedWidth },
  ];

  return (
    <div className="flex flex-col h-full bg-white font-['Inter']">
      {/* Top Bar with Volver a Biblioteca */}
      {onClose && (
        <div className="p-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Biblioteca</span>
          </button>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold flex items-center gap-1">
            <Box className="w-3 h-3" />
            Contenedor
          </span>
        </div>
      )}

      {/* Header */}
      <div className="px-3 py-2.5 border-b border-zinc-200 flex items-center justify-between bg-white">
        <div>
          <div className="flex items-center gap-1.5">
            <Box className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 font-['Poppins']">
              Sección Interna
            </h3>
          </div>
          {sectionName && (
            <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[180px]">
              Dentro de: {sectionName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Subir sección interna"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}

          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Bajar sección interna"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
              title="Duplicar contenedor interno"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Eliminar contenedor interno"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Body Scrollable Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* 1. COLUMNAS (SOLO SELECTOR DE NÚMERO DE COLUMNAS)              */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('columnsList')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Columns className="w-3.5 h-3.5 text-purple-600" />
              Columnas
            </span>
            {openSections.columnsList ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.columnsList && (
            <div className="p-3.5 bg-white text-xs space-y-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Número de columnas:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onChangeColumnsCount?.(num)}
                      className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                        row.columns.length === num
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {num} Col
                    </button>
                  ))}
                </div>
              </div>

              {row.columns.length > 1 && (
                <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-700 text-[11px]">
                      Ancho por columna (%):
                    </span>
                    <button
                      type="button"
                      onClick={() => onChangeColumnsCount?.(row.columns.length)}
                      className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                    >
                      Igualar anchos
                    </button>
                  </div>

                  <div className="space-y-2">
                    {row.columns.map((col, idx) => {
                      const maxColPct = 100 - (row.columns.length - 1) * 10;
                      return (
                        <div
                          key={col.id}
                          className="p-2 rounded-lg bg-zinc-50/80 border border-zinc-200/80 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-zinc-700">
                              Columna {idx + 1}
                            </span>
                            {onSelectColumn && (
                              <button
                                type="button"
                                onClick={() => onSelectColumn(col.id)}
                                className="text-[10px] font-semibold text-teal-700 hover:underline cursor-pointer"
                              >
                                Editar columna →
                              </button>
                            )}
                          </div>
                          <InlineSliderInput
                            value={Math.round(col.widthPercentage)}
                            min={10}
                            max={maxColPct}
                            strictMax={true}
                            step={1}
                            unit="%"
                            accentClassName="accent-purple-600"
                            onChange={(val) => {
                              const nextRow = resizeColumnWidthInRow(row, col.id, val);
                              onUpdate({ columns: nextRow.columns });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 2. ANCHO DEL CONTENEDOR INTERNO                                */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('layout')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
              Ancho del Contenedor Interno
            </span>
            {openSections.layout ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.layout && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Comportamiento de Ancho:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        widthType: 'boxed',
                        maxWidth: Math.min(row.maxWidth ?? maxAllowedWidth, maxAllowedWidth),
                      })
                    }
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      currentWidthType === 'boxed'
                        ? 'bg-purple-50 border-purple-600 text-purple-800 font-bold shadow-2xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium'
                    }`}
                  >
                    <Minimize2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span>En Caja (Boxed)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate({ widthType: 'full' })}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      currentWidthType === 'full'
                        ? 'bg-purple-50 border-purple-600 text-purple-800 font-bold shadow-2xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span>Ancho Completo (100%)</span>
                  </button>
                </div>
              </div>

              {currentWidthType === 'boxed' && (
                <div className="space-y-2 pt-1 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-700">Presets de Ancho:</label>
                    <span className="text-[10px] font-mono tabular-nums text-zinc-400">
                      Máx. {governingLabel || 'Canvas'}: {maxAllowedWidth}px
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {widthPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          onUpdate({
                            widthType: 'boxed',
                            maxWidth: Math.min(preset.val, maxAllowedWidth),
                          })
                        }
                        className={`flex-1 min-w-[52px] py-1 px-1.5 border rounded text-[10px] text-center transition-all cursor-pointer ${
                          currentMaxWidth === preset.val
                            ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-2xs'
                            : 'border-zinc-200 bg-white hover:border-purple-600 text-zinc-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <NumberControl
                    label="Ancho máximo exacto"
                    value={currentMaxWidth}
                    min={sliderMinWidth}
                    max={maxAllowedWidth}
                    inputMin={minAllowedWidth}
                    inputMax={maxAllowedWidth}
                    strictMax={true}
                    step={10}
                    unit="px"
                    onChange={(val) =>
                      onUpdate({
                        widthType: 'boxed',
                        maxWidth: Math.min(Math.max(minAllowedWidth, val), maxAllowedWidth),
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. FONDO DEL CONTENEDOR INTERNO                                */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('background')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              Fondo del Contenedor Interno
            </span>
            {openSections.background ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.background && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <HexColorPicker
                label="Color de fondo:"
                value={row.bgColor || '#FFFFFF'}
                onChange={(val) => onUpdate({ bgColor: val })}
              />

              <div className="flex items-center gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => onUpdate({ bgColor: undefined })}
                  className={`py-1 px-2 border rounded text-[10px] font-semibold cursor-pointer ${
                    !row.bgColor
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-zinc-200 bg-white text-zinc-700'
                  }`}
                >
                  Transparente
                </button>
                {['#FFFFFF', '#F8FAFC', '#F3F4F6', '#EFF6FF', '#18181B'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ bgColor: color })}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                      row.bgColor === color ? 'ring-2 ring-purple-600 scale-110' : 'border-zinc-300'
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 4. BORDES Y REDONDEO                                           */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('borders')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-purple-600" />
              Bordes y Redondeo
            </span>
            {openSections.borders ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.borders && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <NumberControl
                label="Radio de Redondeo (Esquinas)"
                value={row.borderRadius || 0}
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
                      (row.borderRadius || 0) === rad
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}
                  >
                    {rad === 0 ? 'Recto' : `${rad}px`}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-2">
                <NumberControl
                  label="Grosor de Borde"
                  value={row.borderWidth || 0}
                  min={0}
                  max={12}
                  onChange={(val) => onUpdate({ borderWidth: val })}
                />

                {(row.borderWidth || 0) > 0 && (
                  <>
                    <HexColorPicker
                      label="Color de Borde:"
                      value={row.borderColor || '#E4E4E7'}
                      onChange={(val) => onUpdate({ borderColor: val })}
                    />

                    <div className="flex items-center gap-1">
                      {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => onUpdate({ borderStyle: style })}
                          className={`flex-1 py-1 text-[11px] font-semibold border rounded capitalize cursor-pointer ${
                            (row.borderStyle || 'solid') === style
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'border-zinc-200 bg-white text-zinc-700'
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

        {/* ============================================================== */}
        {/* 5. RETARDO DE APARICIÓN (DELAY)                                */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('delay')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Retardo de Aparición (Delay)
            </span>
            <div className="flex items-center gap-1.5">
              {((row.delayMinutes || 0) * 60 + (row.delaySeconds || 0)) > 0 && (
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                  {(row.delayMinutes || 0) > 0 ? `${row.delayMinutes}m ` : ''}
                  {row.delaySeconds || 0}s
                </span>
              )}
              {openSections.delay ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </div>
          </button>

          {openSections.delay && (
            <div className="p-3.5 space-y-3.5 bg-white text-xs">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Configura un tiempo de retardo en minutos y segundos para que esta sección interna aparezca de forma gradual una vez cargada la página.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Minutos:
                  </label>
                  <FreeNumberInput
                    value={row.delayMinutes ?? 0}
                    min={0}
                    max={60}
                    strictMax={true}
                    unit="min"
                    onChange={(val) => onUpdate({ delayMinutes: val })}
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Segundos:
                  </label>
                  <FreeNumberInput
                    value={row.delaySeconds ?? 0}
                    min={0}
                    max={59}
                    strictMax={true}
                    unit="seg"
                    onChange={(val) => onUpdate({ delaySeconds: val })}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Atajos rápidos:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '0s (Inmediato)', m: 0, s: 0 },
                    { label: '5 seg', m: 0, s: 5 },
                    { label: '10 seg', m: 0, s: 10 },
                    { label: '15 seg', m: 0, s: 15 },
                    { label: '30 seg', m: 0, s: 30 },
                    { label: '1 min', m: 1, s: 0 },
                  ].map((preset) => {
                    const isSelected =
                      (row.delayMinutes || 0) === preset.m &&
                      (row.delaySeconds || 0) === preset.s;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onUpdate({ delayMinutes: preset.m, delaySeconds: preset.s })}
                        className={`py-1.5 px-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status summary */}
              <div
                className={`p-2.5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2 ${
                  ((row.delayMinutes || 0) * 60 + (row.delaySeconds || 0)) > 0
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                <div>
                  {((row.delayMinutes || 0) * 60 + (row.delaySeconds || 0)) > 0 ? (
                    <>
                      <p className="font-semibold">
                        Aparecerá a los{' '}
                        {(row.delayMinutes || 0) > 0 ? `${row.delayMinutes}m ` : ''}
                        {row.delaySeconds || 0}s (
                        {(row.delayMinutes || 0) * 60 + (row.delaySeconds || 0)} segundos)
                      </p>
                      <p className="text-[10px] text-indigo-700 mt-0.5">
                        En el editor permanece siempre visible para editar. Compruébalo en Vista Previa o en la página pública.
                      </p>
                    </>
                  ) : (
                    <p>Aparición inmediata al cargar la página (sin retardo).</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 6. DISPOSICIÓN (MÁRGENES Y RELLENO)                            */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('spacing')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              Disposición
            </span>
            {openSections.spacing ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.spacing && (
            <div className="p-3.5 bg-white">
              <BoxModelSpacingControl
                marginTop={row.marginTop ?? 0}
                marginRight={0}
                marginBottom={row.marginBottom ?? 0}
                marginLeft={0}
                paddingTop={row.paddingTop ?? 0}
                paddingRight={row.paddingRight ?? 0}
                paddingBottom={row.paddingBottom ?? 0}
                paddingLeft={row.paddingLeft ?? 0}
                onChangeMargin={(m) => onUpdate({ marginTop: m.marginTop, marginBottom: m.marginBottom })}
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
      </div>
    </div>
  );
};
