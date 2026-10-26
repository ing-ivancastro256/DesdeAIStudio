import React, { useState, useEffect, useRef } from 'react';
import { FunnelPageGlobalSettings, AVAILABLE_FONTS } from '../../types';
import { NumberControl } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import {
  Palette,
  Type,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Globe,
  Layout,
  Square,
  Image as ImageIcon,
  Upload,
  Trash2,
} from 'lucide-react';

interface InlineSliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

const InlineSliderInput: React.FC<InlineSliderInputProps> = ({
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

interface PageSettingsInspectorProps {
  settings: FunnelPageGlobalSettings;
  pageTitle?: string;
  onUpdate: (newSettings: Partial<FunnelPageGlobalSettings>) => void;
  onClose?: () => void;
}

export const PageSettingsInspector: React.FC<PageSettingsInspectorProps> = ({
  settings,
  pageTitle,
  onUpdate,
  onClose,
}) => {
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  const [openSections, setOpenSections] = useState({
    canvasWidth: true,
    colors: true,
    typography: true,
    seo: true,
    borderRadius: true,
    bgImage: true,
    spacing: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentMode = settings.pageWidthType || 'boxed';
  const currentMaxWidth = settings.pageContentMaxWidth || 1200;

  const widthPresets = [
    { label: '800px', val: 800, desc: 'Compacto' },
    { label: '960px', val: 960, desc: 'Clásico' },
    { label: '1140px', val: 1140, desc: 'Estándar' },
    { label: '1200px', val: 1200, desc: 'Recomendado' },
    { label: '1400px', val: 1400, desc: 'Amplio' },
  ];

  const hasBgImage = Boolean(settings.pageBgImageUrl && settings.pageBgImageUrl.trim() !== '');
  const currentBgSize = settings.pageBgImageSize || 'cover';
  const currentBgPosition = settings.pageBgImagePosition || 'center';
  const currentBgRepeat = settings.pageBgImageRepeat || 'no-repeat';
  const currentBgAttachment = settings.pageBgImageAttachment || 'scroll';
  const currentBgOpacity = settings.pageBgImageOpacity ?? 100;

  return (
    <div className="flex flex-col h-full bg-white font-['Inter']">
      {/* Hidden input for uploading Canvas Background Image */}
      <input
        type="file"
        ref={bgImageInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEv) => {
              const dataUrl = uploadEv.target?.result as string;
              if (dataUrl) {
                onUpdate({
                  pageBgImageUrl: dataUrl,
                  pageBgImageOpacity: settings.pageBgImageOpacity ?? 100,
                  pageBgImageSize: settings.pageBgImageSize || 'cover',
                  pageBgImagePosition: settings.pageBgImagePosition || 'center',
                  pageBgImageRepeat: settings.pageBgImageRepeat || 'no-repeat',
                  pageBgImageAttachment: settings.pageBgImageAttachment || 'scroll',
                });
              }
            };
            reader.readAsDataURL(file);
          }
          e.target.value = '';
        }}
      />

      {/* Header */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
        <div>
          <div className="flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-[#2848F0]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 font-['Poppins']">
              Configuración de Página
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[200px]">
            {pageTitle || 'Hoja / Canvas General'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer text-xs font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Body Scrollable Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* 1. ANCHO DEL CANVAS (PANTALLA)                                  */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('canvasWidth')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#2848F0]" />
              Ancho del Canvas (Pantalla)
            </span>
            {openSections.canvasWidth ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.canvasWidth && (
            <div className="p-3.5 space-y-3.5 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Modo de Ancho del Lienzo:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdate({ pageWidthType: 'boxed' })}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      currentMode === 'boxed'
                        ? 'bg-blue-50 border-[#2848F0] text-[#2848F0] font-bold shadow-2xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium'
                    }`}
                  >
                    <Minimize2 className="w-4 h-4 mx-auto mb-1 text-[#2848F0]" />
                    <span>En Caja (Boxed)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate({ pageWidthType: 'full' })}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      currentMode === 'full'
                        ? 'bg-blue-50 border-[#2848F0] text-[#2848F0] font-bold shadow-2xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4 mx-auto mb-1 text-[#2848F0]" />
                    <span>Ancho Total (100%)</span>
                  </button>
                </div>
              </div>

              {currentMode === 'boxed' && (
                <div className="space-y-3 pt-2 border-t border-zinc-100">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Presets de Ancho Máximo:
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {widthPresets.map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => onUpdate({ pageContentMaxWidth: preset.val })}
                          className={`py-1.5 px-1 border rounded text-[11px] text-center transition-all cursor-pointer ${
                            currentMaxWidth === preset.val
                              ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                              : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                          }`}
                          title={preset.desc}
                        >
                          <div>{preset.label}</div>
                          <div
                            className={`text-[9px] ${
                              currentMaxWidth === preset.val ? 'text-blue-100' : 'text-zinc-400'
                            }`}
                          >
                            {preset.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <InlineSliderInput
                    label="Ancho personalizado"
                    value={currentMaxWidth}
                    min={640}
                    max={1920}
                    step={10}
                    unit="px"
                    onChange={(val) => onUpdate({ pageContentMaxWidth: val })}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 2. COLORES GENERALES DE LA PÁGINA                               */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('colors')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#2848F0]" />
              Colores Generales de la Página
            </span>
            {openSections.colors ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.colors && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div className="space-y-1">
                <HexColorPicker
                  label="Fondo general del Canvas:"
                  value={settings.pageBgColor || '#FFFFFF'}
                  onChange={(val) => onUpdate({ pageBgColor: val })}
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-100">
                <HexColorPicker
                  label="Color Primario (Botones y Acentos):"
                  value={settings.primaryColor || '#2848F0'}
                  onChange={(val) => onUpdate({ primaryColor: val })}
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-100">
                <HexColorPicker
                  label="Color General de Texto:"
                  value={settings.textColor || '#121111'}
                  onChange={(val) => onUpdate({ textColor: val })}
                />
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. TIPOGRAFÍA GLOBAL (GOOGLE FONTS)                             */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('typography')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#2848F0]" />
              Tipografía Global (Google Fonts)
            </span>
            {openSections.typography ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.typography && (
            <div className="p-3.5 space-y-3.5 bg-white text-xs">
              {/* Heading Font */}
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Fuente de Encabezados (H1, H2, H3, H4):
                </label>
                <select
                  value={settings.headingFontFamily || 'Poppins'}
                  onChange={(e) => onUpdate({ headingFontFamily: e.target.value })}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] cursor-pointer"
                >
                  {AVAILABLE_FONTS.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <div
                  className="mt-1.5 p-2 rounded bg-zinc-50 border border-zinc-100 text-sm font-bold text-zinc-800 truncate"
                  style={{ fontFamily: settings.headingFontFamily || 'Poppins' }}
                >
                  Vista previa: Titular con {settings.headingFontFamily || 'Poppins'}
                </div>
              </div>

              {/* Body Font */}
              <div className="pt-2 border-t border-zinc-100">
                <label className="font-semibold text-zinc-700 block mb-1">
                  Fuente de Párrafos, Listas y Botones:
                </label>
                <select
                  value={settings.bodyFontFamily || 'Inter'}
                  onChange={(e) => onUpdate({ bodyFontFamily: e.target.value })}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] cursor-pointer"
                >
                  {AVAILABLE_FONTS.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <div
                  className="mt-1.5 p-2 rounded bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 leading-snug"
                  style={{ fontFamily: settings.bodyFontFamily || 'Inter' }}
                >
                  Vista previa: Este es un texto de párrafo mostrando cómo se lee la tipografía seleccionada.
                </div>
              </div>

              {/* Default Heading Sizes */}
              <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                <label className="font-semibold text-zinc-700 block">
                  Tamaños por defecto para Encabezados:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <NumberControl
                    label="H1 Principal"
                    value={settings.defaultH1Size || 36}
                    min={1}
                    max={120}
                    onChange={(val) => onUpdate({ defaultH1Size: val })}
                  />
                  <NumberControl
                    label="H2 Sección"
                    value={settings.defaultH2Size || 28}
                    min={1}
                    max={120}
                    onChange={(val) => onUpdate({ defaultH2Size: val })}
                  />
                  <NumberControl
                    label="H3 Subtítulo"
                    value={settings.defaultH3Size || 22}
                    min={1}
                    max={120}
                    onChange={(val) => onUpdate({ defaultH3Size: val })}
                  />
                  <NumberControl
                    label="H4 Detalle"
                    value={settings.defaultH4Size || 18}
                    min={1}
                    max={120}
                    onChange={(val) => onUpdate({ defaultH4Size: val })}
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  Al insertar nuevos bloques o encabezados, se aplicarán estas dimensiones y tipografías automáticamente.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 4. SEO Y METADATOS DE LA PÁGINA                                 */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('seo')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              SEO y Metadatos de la Página
            </span>
            {openSections.seo ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.seo && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Título SEO (Etiqueta Title):
                </label>
                <input
                  type="text"
                  value={settings.seo_title || ''}
                  onChange={(e) => onUpdate({ seo_title: e.target.value })}
                  placeholder="Ej. Sesión Estratégica High-Ticket | Tu Empresa"
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Descripción SEO (Meta Description):
                </label>
                <textarea
                  rows={3}
                  value={settings.seo_description || ''}
                  onChange={(e) => onUpdate({ seo_description: e.target.value })}
                  placeholder="Describe el beneficio principal de tu oferta en 150 caracteres..."
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 5. REDONDEO DE ESQUINAS / PUNTAS                                */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('borderRadius')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-[#2848F0]" />
              Redondeo de Esquinas / Puntas
            </span>
            {openSections.borderRadius ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.borderRadius && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Estilo de Puntas del Lienzo:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '0px', val: 0, desc: 'Rectas' },
                    { label: '8px', val: 8, desc: 'Sutil' },
                    { label: '16px', val: 16, desc: 'Estándar' },
                    { label: '24px', val: 24, desc: 'Medio' },
                    { label: '32px', val: 32, desc: 'Curvo' },
                    { label: '40px', val: 40, desc: 'Extra' },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => onUpdate({ pageBorderRadius: preset.val })}
                      className={`py-2 px-1 border rounded-lg text-center transition-all cursor-pointer ${
                        (settings.pageBorderRadius ?? 0) === preset.val
                          ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                          : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold">{preset.label}</div>
                      <div
                        className={`text-[10px] ${
                          (settings.pageBorderRadius ?? 0) === preset.val
                            ? 'text-blue-100'
                            : 'text-zinc-400'
                        }`}
                      >
                        {preset.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <InlineSliderInput
                label="Radio de Esquinas"
                value={settings.pageBorderRadius ?? 0}
                min={0}
                max={64}
                step={1}
                unit="px"
                onChange={(val) => onUpdate({ pageBorderRadius: val })}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 6. IMAGEN DE FONDO (OPCIONAL - VACÍA POR DEFECTO)               */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('bgImage')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#2848F0]" />
              Imagen de Fondo
            </span>
            {openSections.bgImage ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.bgImage && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <button
                type="button"
                onClick={() => bgImageInputRef.current?.click()}
                className="w-full py-2 px-3 bg-white border border-[#2848F0] text-[#2848F0] hover:bg-blue-50/70 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{hasBgImage ? 'Cambiar imagen de fondo' : 'Subir imagen desde explorador'}</span>
              </button>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                  O pegar URL de imagen:
                </label>
                <input
                  type="text"
                  value={
                    settings.pageBgImageUrl?.startsWith('data:')
                      ? ''
                      : settings.pageBgImageUrl || ''
                  }
                  onChange={(e) =>
                    onUpdate({
                      pageBgImageUrl: e.target.value,
                      pageBgImageOpacity: settings.pageBgImageOpacity ?? 100,
                      pageBgImageSize: settings.pageBgImageSize || 'cover',
                      pageBgImagePosition: settings.pageBgImagePosition || 'center',
                      pageBgImageRepeat: settings.pageBgImageRepeat || 'no-repeat',
                    })
                  }
                  placeholder={
                    settings.pageBgImageUrl?.startsWith('data:')
                      ? 'Imagen local cargada (pega otra URL si deseas)'
                      : 'https://...'
                  }
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] font-mono"
                />
              </div>

              {hasBgImage && (
                <div className="space-y-3 pt-2 border-t border-zinc-100">
                  {/* Thumbnail Preview & Remove */}
                  <div className="relative rounded-lg overflow-hidden border border-zinc-200 h-24 bg-zinc-100 flex items-center justify-center">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url("${settings.pageBgImageUrl}")`,
                        backgroundSize:
                          currentBgSize === 'stretch' ? '100% 100%' : currentBgSize,
                        backgroundPosition: currentBgPosition,
                        backgroundRepeat: currentBgRepeat,
                        opacity: currentBgOpacity / 100,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate({ pageBgImageUrl: '' })}
                      className="absolute top-1.5 right-1.5 px-2 py-1 bg-black/70 text-white hover:bg-red-600 rounded-md transition-colors flex items-center gap-1 text-[10px] font-semibold cursor-pointer shadow-xs"
                      title="Quitar imagen de fondo"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Quitar</span>
                    </button>
                  </div>

                  {/* Opacity */}
                  <InlineSliderInput
                    label="Opacidad de la imagen"
                    value={currentBgOpacity}
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    onChange={(val) => onUpdate({ pageBgImageOpacity: val })}
                  />

                  {/* Size / Fit */}
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Ajuste / Tamaño:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { val: 'cover' as const, label: 'Ajustado (Cubrir)' },
                        { val: 'contain' as const, label: 'Completo (Contener)' },
                        { val: 'stretch' as const, label: 'Alargado (Estirar)' },
                        { val: 'auto' as const, label: 'Tamaño Original' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => onUpdate({ pageBgImageSize: opt.val })}
                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                            currentBgSize === opt.val
                              ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Posición:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { val: 'center' as const, label: 'Centrado' },
                        { val: 'top' as const, label: 'Arriba' },
                        { val: 'bottom' as const, label: 'Abajo' },
                        { val: 'left' as const, label: 'Izquierda' },
                        { val: 'right' as const, label: 'Derecha' },
                      ].map((pos) => (
                        <button
                          key={pos.val}
                          type="button"
                          onClick={() => onUpdate({ pageBgImagePosition: pos.val })}
                          className={`py-1.5 px-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                            currentBgPosition === pos.val
                              ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Repeat / Pattern */}
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Repetición / Patrón:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { val: 'no-repeat' as const, label: 'Sin repetir' },
                        { val: 'repeat' as const, label: 'En patrón (Mosaico)' },
                        { val: 'repeat-x' as const, label: 'Repetir horizontal' },
                        { val: 'repeat-y' as const, label: 'Repetir vertical' },
                      ].map((rep) => (
                        <button
                          key={rep.val}
                          type="button"
                          onClick={() => {
                            const patch: Partial<FunnelPageGlobalSettings> = {
                              pageBgImageRepeat: rep.val,
                            };
                            if (
                              rep.val !== 'no-repeat' &&
                              (currentBgSize === 'cover' || currentBgSize === 'stretch')
                            ) {
                              patch.pageBgImageSize = 'auto';
                            }
                            onUpdate(patch);
                          }}
                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                            currentBgRepeat === rep.val
                              ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Movement / Scroll Attachment */}
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Movimiento al desplazar:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { val: 'scroll' as const, label: 'Normal (Con scroll)' },
                        { val: 'fixed' as const, label: 'Fijo (Inmóvil)' },
                      ].map((att) => (
                        <button
                          key={att.val}
                          type="button"
                          onClick={() => onUpdate({ pageBgImageAttachment: att.val })}
                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                            currentBgAttachment === att.val
                              ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {att.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 7. DISPOSICIÓN / PADDING DEL CANVAS (ÚLTIMO GRUPO)              */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('spacing')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-[#2848F0]" />
              Disposición (Padding del Canvas)
            </span>
            {openSections.spacing ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.spacing && (
            <div className="p-3.5 bg-white text-xs">
              <BoxModelSpacingControl
                showMargin={false}
                showPadding={true}
                paddingTop={settings.pagePaddingTop ?? 0}
                paddingRight={settings.pagePaddingRight ?? 0}
                paddingBottom={settings.pagePaddingBottom ?? 0}
                paddingLeft={settings.pagePaddingLeft ?? 0}
                onChangePadding={(paddings) =>
                  onUpdate({
                    pagePaddingTop: paddings.paddingTop,
                    pagePaddingRight: paddings.paddingRight,
                    pagePaddingBottom: paddings.paddingBottom,
                    pagePaddingLeft: paddings.paddingLeft,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
