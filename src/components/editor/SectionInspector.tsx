import React, { useRef, useState, useEffect } from 'react';
import { PageBlockSection } from '../../types';
import { NumberControl } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl, SingleBoxModelRow } from '../common/BoxModelSpacingControl';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Palette,
  ChevronDown,
  ChevronRight,
  Upload,
  Layout,
  Layers,
  Clock,
  Maximize2,
  Minimize2,
  Square,
} from 'lucide-react';

interface SectionInlineSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

const SectionInlineSlider: React.FC<SectionInlineSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
}) => {
  const [inputStr, setInputStr] = useState<string>(String(value));

  useEffect(() => {
    setInputStr(String(value));
  }, [value]);

  const handleNumberChange = (raw: string) => {
    setInputStr(raw);
    if (raw.trim() === '' || raw === '-') return;
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    const parsed = Number(inputStr);
    if (inputStr.trim() === '' || Number.isNaN(parsed)) {
      setInputStr(String(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    setInputStr(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-zinc-700 block text-xs">{label}:</label>
      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, value))}
          onChange={(e) => {
            const next = Number(e.target.value);
            setInputStr(String(next));
            onChange(next);
          }}
          className="flex-1 accent-[#2848F0] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
        />
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputStr}
            onChange={(e) => handleNumberChange(e.target.value)}
            onBlur={handleBlur}
            className="w-[68px] px-1.5 py-1 text-right font-mono font-semibold text-xs border border-zinc-300 rounded-md bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-[#2848F0] [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
          />
          {unit && (
            <span className="text-[11px] text-zinc-500 font-mono select-none">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
};


interface SectionInspectorProps {
  section: PageBlockSection;
  canvasMaxWidth?: number;
  onUpdate: (updatedProps: Partial<PageBlockSection>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

// Preset color palettes & quick backgrounds
const SOLID_PALETTES = [
  '#FFFFFF',
  '#FAFAFB',
  '#F4F4F5',
  '#E4E4E7',
  '#1C1C1C',
  '#121111',
  '#0B0F19',
  '#2848F0',
  '#1E3A8A',
  '#065F46',
  '#7C2D12',
  '#581C87',
  '#FEF3C7',
  '#FEE2E2',
  '#EFF6FF',
];

const GRADIENT_PRESETS = [
  { name: 'Azul Eléctrico', c1: '#1E3A8A', c2: '#2848F0', value: 'linear-gradient(135deg, #1E3A8A 0%, #2848F0 100%)' },
  { name: 'Noche Oscura', c1: '#18181B', c2: '#09090B', value: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)' },
  { name: 'Púrpura Neón', c1: '#4C1D95', c2: '#2848F0', value: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #2848F0 100%)' },
  { name: 'Esmeralda Pro', c1: '#064E3B', c2: '#059669', value: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)' },
  { name: 'Fuego Caliente', c1: '#991B1B', c2: '#EA580C', value: 'linear-gradient(135deg, #991B1B 0%, #EA580C 100%)' },
  { name: 'Gris Ejecutivo', c1: '#27272A', c2: '#18181B', value: 'linear-gradient(180deg, #27272A 0%, #18181B 100%)' },
  { name: 'Amanecer Dorado', c1: '#78350F', c2: '#D97706', value: 'linear-gradient(135deg, #78350F 0%, #D97706 100%)' },
  { name: 'Azul Hielo Suave', c1: '#EFF6FF', c2: '#DBEAFE', value: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)' },
];

export const SectionInspector: React.FC<SectionInspectorProps> = ({
  section,
  canvasMaxWidth,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onClose,
  canMoveUp,
  canMoveDown,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    width: true,
    background: true,
    spacing: true,
    borderRadius: true,
    borders: true,
    delay: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const maxAllowedWidth = Math.max(320, Math.round(canvasMaxWidth || 1200));
  const minAllowedWidth = Math.min(320, maxAllowedWidth);
  const numericMaxWidth = typeof section.maxWidth === 'number' ? section.maxWidth : undefined;
  const currentWidthType: 'boxed' | 'full' = section.widthType
    ? section.widthType
    : numericMaxWidth !== undefined
    ? 'boxed'
    : 'full';
  const currentMaxWidth = Math.min(
    numericMaxWidth ?? Math.min(1200, maxAllowedWidth),
    maxAllowedWidth
  );

  const basePresetValues = [600, 720, 960, 1140, 1200].filter((val) => val < maxAllowedWidth);
  const widthPresets = [
    ...basePresetValues.map((val) => ({ label: `${val}px`, val })),
    { label: '100%', val: maxAllowedWidth },
  ];

  const bgType = section.bgType || (section.bgGradient ? 'gradient' : section.bgImageUrl ? 'image' : 'solid');
  const extractedHexes = section.bgGradient?.match(/#[0-9A-Fa-f]{6}/g) || [];
  const gradColor1 = section.bgGradientColor1 || extractedHexes[0] || '#18181B';
  const gradColor2 =
    section.bgGradientColor2 || extractedHexes[extractedHexes.length - 1] || '#09090B';

  return (
    <div className="flex-1 flex flex-col h-full bg-white select-none">
      {/* Header with back button */}
      <div className="p-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Biblioteca</span>
        </button>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Sección
        </span>
      </div>

      {/* Quick Action Toolbar */}
      <div className="px-3 py-2 border-b border-zinc-100 flex items-center justify-between bg-white text-zinc-600">
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 rounded hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-700 cursor-pointer"
            title="Subir sección en la página"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 rounded hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-700 cursor-pointer"
            title="Bajar sección en la página"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            title="Duplicar o clonar sección completa"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-1 text-xs font-medium"
          title="Eliminar esta sección"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar</span>
        </button>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-['Inter']">
        {/* Hidden File Input for direct image uploading */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (uploadEv) => {
                const base64 = uploadEv.target?.result as string;
                if (base64) {
                  onUpdate({
                    bgType: 'image',
                    bgImageUrl: base64,
                  });
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Section Name / Title */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-700">Nombre de la Sección:</label>
          <input
            type="text"
            value={section.name || ''}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Ej: Encabezado VSL, Oferta de Cierre, etc."
            className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-zinc-50"
          />
        </div>

        {/* ============================================================== */}
        {/* ACCORDION 1: ANCHO DE LA SECCIÓN EXTERNA                       */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('width')}
            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#2848F0]" />
              Ancho de la Sección Externa
            </span>
            {openSections.width ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.width && (
            <div className="p-3 space-y-3 bg-white">
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
                        maxWidth: currentMaxWidth,
                      })
                    }
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      currentWidthType === 'boxed'
                        ? 'bg-blue-50 border-[#2848F0] text-[#2848F0] font-bold shadow-2xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium'
                    }`}
                  >
                    <Minimize2 className="w-4 h-4 mx-auto mb-1 text-[#2848F0]" />
                    <span className="whitespace-nowrap">En Caja (Boxed)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate({ widthType: 'full' })}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      currentWidthType === 'full'
                        ? 'bg-blue-50 border-[#2848F0] text-[#2848F0] font-bold shadow-2xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4 mx-auto mb-1 text-[#2848F0]" />
                    <span className="whitespace-nowrap">Ancho Completo (100%)</span>
                  </button>
                </div>
              </div>

              {currentWidthType === 'boxed' && (
                <div className="space-y-2 pt-1 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-700">Presets de Ancho:</label>
                    <span className="text-[10px] font-mono tabular-nums text-zinc-400">
                      Máx. Canvas: {maxAllowedWidth}px
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
                        className={`flex-1 min-w-[52px] py-1 px-1.5 border rounded text-[10px] font-mono tabular-nums text-center transition-all cursor-pointer whitespace-nowrap ${
                          currentMaxWidth === preset.val
                            ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                            : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <NumberControl
                    label="Ancho máximo exacto"
                    value={currentMaxWidth}
                    min={minAllowedWidth}
                    max={maxAllowedWidth}
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
        {/* ACCORDION 2: FONDO Y BACKGROUND DE LA SECCIÓN (SÓLIDO, DEGRADADO, IMAGEN) */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('background')}
            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#2848F0]" />
              Fondo de la Sección (Background)
            </span>
            {openSections.background ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.background && (
            <div className="p-3 space-y-3.5 bg-white">
              {/* Type Switcher: Sólido | Degradado | Imagen */}
              <div className="flex p-0.5 bg-zinc-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdate({ bgType: 'solid' })}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    bgType === 'solid' ? 'bg-white text-[#2848F0] shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Color Sólido
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      bgType: 'gradient',
                      bgGradientColor1: gradColor1,
                      bgGradientColor2: gradColor2,
                      bgGradient:
                        section.bgGradient ||
                        `linear-gradient(135deg, ${gradColor1} 0%, ${gradColor2} 100%)`,
                    })
                  }
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    bgType === 'gradient' ? 'bg-white text-[#2848F0] shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Degradado
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ bgType: 'image' })}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    bgType === 'image' ? 'bg-white text-[#2848F0] shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Imagen
                </button>
              </div>

              {/* OPTION A: COLOR SÓLIDO */}
              {bgType === 'solid' && (
                <div className="space-y-2.5">
                  <HexColorPicker
                    label="Color de Fondo:"
                    value={
                      !section.bgColor || section.bgColor === 'transparent'
                        ? '#FFFFFF'
                        : section.bgColor
                    }
                    onChange={(val) => onUpdate({ bgColor: val, bgCustom: true })}
                  />

                  <button
                    type="button"
                    onClick={() => onUpdate({ bgColor: 'transparent', bgCustom: true })}
                    className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      section.bgColor === 'transparent'
                        ? 'bg-blue-50 border-[#2848F0] text-[#2848F0]'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span>Transparente (Mostrar fondo de página)</span>
                  </button>

                  {/* Palette Presets */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Colores rápidos:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {SOLID_PALETTES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => onUpdate({ bgColor: color, bgCustom: true })}
                          style={{ backgroundColor: color }}
                          className={`h-6 rounded border transition-transform hover:scale-105 cursor-pointer ${
                            section.bgCustom &&
                            section.bgColor?.toLowerCase() === color.toLowerCase()
                              ? 'ring-2 ring-[#2848F0] ring-offset-1 border-transparent'
                              : 'border-zinc-300'
                          }`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OPTION B: DEGRADADO (2 COLORES + ESTILOS RÁPIDOS, SIN CSS PERSONALIZADO) */}
              {bgType === 'gradient' && (
                <div className="space-y-3">
                  <HexColorPicker
                    label="Color 1 del gradiente:"
                    value={gradColor1}
                    onChange={(val) =>
                      onUpdate({
                        bgType: 'gradient',
                        bgGradientColor1: val,
                        bgGradientColor2: gradColor2,
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
                        bgGradientColor1: gradColor1,
                        bgGradientColor2: val,
                        bgGradient: `linear-gradient(135deg, ${gradColor1} 0%, ${val} 100%)`,
                      })
                    }
                  />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
                      Estilos de Degradado:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GRADIENT_PRESETS.map((grad) => (
                        <button
                          key={grad.name}
                          type="button"
                          onClick={() =>
                            onUpdate({
                              bgType: 'gradient',
                              bgGradientColor1: grad.c1,
                              bgGradientColor2: grad.c2,
                              bgGradient: grad.value,
                            })
                          }
                          className={`p-2 rounded-lg text-left text-[11px] font-medium border transition-all cursor-pointer flex flex-col gap-1.5 ${
                            section.bgGradient === grad.value
                              ? 'border-[#2848F0] ring-2 ring-blue-500/30'
                              : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <div
                            className="w-full h-7 rounded shadow-2xs"
                            style={{ backgroundImage: grad.value }}
                          />
                          <span className="text-zinc-800 text-[10px] truncate">{grad.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OPTION C: IMAGEN DE FONDO */}
              {bgType === 'image' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-zinc-600 font-medium block mb-1">Subir o Enlace de Imagen:</span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={section.bgImageUrl || ''}
                        onChange={(e) => onUpdate({ bgImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... o data:image"
                        className="flex-1 p-1.5 text-xs border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                        title="Subir archivo desde tu ordenador"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview de la imagen */}
                  {section.bgImageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-zinc-200 h-24 bg-zinc-100 flex items-center justify-center group">
                      <img
                        src={section.bgImageUrl}
                        alt="Fondo de sección"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdate({ bgImageUrl: '' })}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white hover:bg-red-600 rounded-md transition-colors"
                        title="Quitar imagen"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Quick Unsplash background presets for fast design */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Fondos sugeridos:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        {
                          title: 'Oficina Tech',
                          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                        },
                        {
                          title: 'Abstract Dark',
                          url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
                        },
                        {
                          title: 'Conferencia',
                          url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
                        },
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => onUpdate({ bgImageUrl: item.url })}
                          className="h-12 rounded border border-zinc-200 overflow-hidden relative group cursor-pointer"
                        >
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute inset-0 bg-black/40 text-white text-[9px] flex items-center justify-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlay sobre la imagen */}
                  <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
                    <span className="font-semibold text-zinc-700 block">Superposición (Overlay):</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['none', 'dark', 'light'] as const).map((overlay) => (
                        <button
                          key={overlay}
                          type="button"
                          onClick={() => onUpdate({ bgOverlayType: overlay })}
                          className={`py-1 text-[11px] font-medium rounded border capitalize cursor-pointer ${
                            (section.bgOverlayType || 'dark') === overlay
                              ? 'bg-white border-[#2848F0] text-[#2848F0] font-bold shadow-2xs'
                              : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                          }`}
                        >
                          {overlay === 'none' ? 'Sin filtro' : overlay === 'dark' ? 'Oscuro' : 'Claro'}
                        </button>
                      ))}
                    </div>

                    {(section.bgOverlayType || 'dark') !== 'none' && (
                      <NumberControl
                        label="Opacidad del Overlay"
                        value={section.bgOverlayOpacity ?? 60}
                        min={0}
                        max={95}
                        step={5}
                        unit="%"
                        onChange={(val) => onUpdate({ bgOverlayOpacity: val })}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* ACCORDION 2: DISPOSICIÓN (MARGEN Y RELLENO UNIFICADOS)         */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('spacing')}
            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-[#2848F0]" />
              Disposición
            </span>
            {openSections.spacing ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.spacing && (
            <div className="p-3 bg-white">
              <BoxModelSpacingControl
                marginTop={section.marginTop ?? 0}
                marginRight={section.marginRight ?? 0}
                marginBottom={section.marginBottom ?? 0}
                marginLeft={section.marginLeft ?? 0}
                paddingTop={section.paddingTop ?? section.paddingY ?? 48}
                paddingRight={section.paddingRight ?? 24}
                paddingBottom={section.paddingBottom ?? section.paddingY ?? 48}
                paddingLeft={section.paddingLeft ?? 24}
                onChangeMargin={(margins) => onUpdate(margins)}
                onChangePadding={(paddings) => onUpdate(paddings)}
                showPadding={true}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* ACCORDION 4: REDONDEO DE ESQUINAS / RADIO                      */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('borderRadius')}
            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-[#2848F0]" />
              Redondeo de Esquinas (Radio)
            </span>
            {openSections.borderRadius ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSections.borderRadius && (
            <div className="p-3 space-y-3 bg-white">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Presets Rápidos:
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {[0, 8, 16, 24, 32, 48].map((rad) => {
                    const isActive = (section.borderRadius ?? 0) === rad;
                    return (
                      <button
                        key={rad}
                        type="button"
                        onClick={() => onUpdate({ borderRadius: rad })}
                        className={`py-1 px-1 rounded border text-[10px] font-mono tabular-nums text-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                            : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                        }`}
                      >
                        {rad}px
                      </button>
                    );
                  })}
                </div>
              </div>

              <SectionInlineSlider
                label="Radio de Esquinas"
                value={section.borderRadius ?? 0}
                min={0}
                max={64}
                step={1}
                unit="px"
                onChange={(val) => onUpdate({ borderRadius: val })}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* ACCORDION 5: BORDES Y LÍNEAS DIVISORIAS                        */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('borders')}
            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-[#2848F0]" />
              Bordes y Líneas Divisorias
            </span>
            {openSections.borders ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.borders && (
            <div className="p-3 space-y-3.5 bg-white">
              <SingleBoxModelRow
                label="Grosor de borde"
                defaultLinked={true}
                values={{
                  top: section.borderTopWidth ?? 0,
                  right: section.borderRightWidth ?? 0,
                  bottom: section.borderBottomWidth ?? 0,
                  left: section.borderLeftWidth ?? 0,
                }}
                onChange={(v) =>
                  onUpdate({
                    borderTopWidth: v.top,
                    borderRightWidth: v.right,
                    borderBottomWidth: v.bottom,
                    borderLeftWidth: v.left,
                  })
                }
              />

              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Estilo de Borde:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { value: 'solid', label: 'Sólido' },
                      { value: 'dashed', label: 'Guiones' },
                      { value: 'dotted', label: 'Puntos' },
                    ] as const
                  ).map((st) => {
                    const isSelected = (section.borderStyle || 'solid') === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => onUpdate({ borderStyle: st.value })}
                        className={`py-1.5 px-2 rounded-md border text-[11px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-[#2848F0] text-[#2848F0] shadow-2xs'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <HexColorPicker
                label="Color de Borde:"
                value={section.borderColor || '#E4E4E7'}
                onChange={(val) => onUpdate({ borderColor: val })}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* ACCORDION 5: RETARDO DE APARICIÓN (DELAY)                      */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('delay')}
            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Retardo de Aparición (Delay)
            </span>
            <div className="flex items-center gap-1.5">
              {((section.delayMinutes || 0) * 60 + (section.delaySeconds || 0)) > 0 && (
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                  {(section.delayMinutes || 0) > 0 ? `${section.delayMinutes}m ` : ''}
                  {section.delaySeconds || 0}s
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
            <div className="p-3.5 space-y-3.5 bg-white text-xs font-['Inter']">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Configura un retardo en minutos y segundos para que esta sección externa aparezca de forma gradual una vez cargada la página.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Minutos:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={section.delayMinutes ?? 0}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(60, parseInt(e.target.value, 10) || 0));
                        onUpdate({ delayMinutes: val });
                      }}
                      className="w-full p-2 pr-7 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                    />
                    <span className="absolute right-2 top-2 text-[10px] font-bold text-zinc-400 select-none">
                      min
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Segundos:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={section.delaySeconds ?? 0}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                        onUpdate({ delaySeconds: val });
                      }}
                      className="w-full p-2 pr-7 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                    />
                    <span className="absolute right-2 top-2 text-[10px] font-bold text-zinc-400 select-none">
                      seg
                    </span>
                  </div>
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
                      (section.delayMinutes || 0) === preset.m &&
                      (section.delaySeconds || 0) === preset.s;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onUpdate({ delayMinutes: preset.m, delaySeconds: preset.s })}
                        className={`py-1.5 px-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
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
                  ((section.delayMinutes || 0) * 60 + (section.delaySeconds || 0)) > 0
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  {((section.delayMinutes || 0) * 60 + (section.delaySeconds || 0)) > 0 ? (
                    <>
                      <p className="font-semibold">
                        Aparecerá a los{' '}
                        {(section.delayMinutes || 0) > 0 ? `${section.delayMinutes}m ` : ''}
                        {section.delaySeconds || 0}s (
                        {(section.delayMinutes || 0) * 60 + (section.delaySeconds || 0)} segundos)
                      </p>
                      <p className="text-[10px] text-amber-700 mt-0.5">
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
      </div>
    </div>
  );
};
