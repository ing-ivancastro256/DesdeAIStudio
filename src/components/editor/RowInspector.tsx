import React, { useState } from 'react';
import { PageBlockRow } from '../../types';
import { NumberControl } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import {
  Maximize2,
  Minimize2,
  Palette,
  Sliders,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';


interface RowInspectorProps {
  row: PageBlockRow;
  sectionName?: string;
  onUpdate: (props: Partial<PageBlockRow>) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const RowInspector: React.FC<RowInspectorProps> = ({
  row,
  sectionName,
  onUpdate,
  onDuplicate,
  onDelete,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({
    layout: true,
    background: true,
    spacing: true,
    borders: false,
    shadow: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentWidthType = row.widthType || 'boxed';
  const currentMaxWidth = row.maxWidth || 1140;

  const widthPresets = [
    { label: '600px', val: 600 },
    { label: '800px', val: 800 },
    { label: '960px', val: 960 },
    { label: '1140px', val: 1140 },
    { label: '100%', val: 1400 },
  ];

  return (
    <div className="flex flex-col h-full bg-white font-['Inter']">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
        <div>
          <div className="flex items-center gap-1.5">
            <Box className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 font-['Poppins']">
              Sección Interna
            </h3>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
              Contenedor
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[200px]">
            {sectionName ? `Dentro de: ${sectionName}` : `${row.columns.length} columna(s)`}
          </p>
        </div>

        <div className="flex items-center gap-1">
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

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Eliminar contenedor interno"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer text-xs font-semibold ml-1"
              title="Cerrar inspector"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Body Scrollable Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* 1. ANCHO Y DISPOSICIÓN DEL CONTENEDOR                          */}
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
            {openSections.layout ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.layout && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">Comportamiento de Ancho:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdate({ widthType: 'boxed' })}
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
                  <label className="font-semibold text-zinc-700 block">Presets de Ancho:</label>
                  <div className="grid grid-cols-5 gap-1">
                    {widthPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onUpdate({ maxWidth: preset.val })}
                        className={`py-1 px-1 border rounded text-[10px] text-center transition-all cursor-pointer ${
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
                    min={400}
                    max={1600}
                    step={10}
                    unit="px"
                    onChange={(val) => onUpdate({ maxWidth: val })}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 2. COLOR DE FONDO DE LA SECCIÓN INTERNA                         */}
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
            {openSections.background ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
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
                    !row.bgColor ? 'bg-purple-600 text-white border-purple-600' : 'border-zinc-200 bg-white text-zinc-700'
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
        {/* 3. ESPACIADO INTERNO Y MÁRGENES (PADDING & MARGIN)              */}
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
            {openSections.spacing ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.spacing && (
            <div className="p-3.5 bg-white">
              <BoxModelSpacingControl
                marginTop={row.marginTop ?? 0}
                marginRight={0}
                marginBottom={row.marginBottom ?? 24}
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

        {/* ============================================================== */}
        {/* 4. BORDES Y REDONDEO DE ESQUINAS                                */}
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
            {openSections.borders ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
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
        {/* 5. SOMBRA DEL CONTENEDOR                                        */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('shadow')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Sombra del Contenedor
            </span>
            {openSections.shadow ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.shadow && (
            <div className="p-3.5 space-y-2 bg-white text-xs">
              <div className="grid grid-cols-3 gap-1.5">
                {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((sh) => (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => onUpdate({ shadow: sh })}
                    className={`py-2 px-1 text-[11px] font-semibold border rounded-lg text-center capitalize cursor-pointer transition-all ${
                      (row.shadow || 'none') === sh
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    {sh === 'none' ? 'Sin sombra' : sh}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
