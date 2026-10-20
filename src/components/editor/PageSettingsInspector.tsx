import React, { useState } from 'react';
import { FunnelPageGlobalSettings, AVAILABLE_FONTS } from '../../types';
import { NumberControl } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import {
  Sliders,
  Palette,
  Type,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Globe,
  HelpCircle,
  Layout,
  Check,
  Square,
} from 'lucide-react';


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
  const [openSections, setOpenSections] = useState({
    canvasWidth: true,
    borderRadius: true,
    typography: true,
    colors: true,
    spacing: false,
    seo: false,
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

  return (
    <div className="flex flex-col h-full bg-white font-['Inter']">
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
        {/* 1. ANCHO DEL CANVAS / PANTALLA GENERAL                          */}
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
            {openSections.canvasWidth ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.canvasWidth && (
            <div className="p-3.5 space-y-3.5 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">Modo de Ancho del Lienzo:</label>
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
                <div className="space-y-2 pt-1 border-t border-zinc-100">
                  <label className="font-semibold text-zinc-700 block">Presets de Ancho Máximo:</label>
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
                        <div className={`text-[9px] ${currentMaxWidth === preset.val ? 'text-blue-100' : 'text-zinc-400'}`}>
                          {preset.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  <NumberControl
                    label="Ancho personalizado"
                    value={currentMaxWidth}
                    min={640}
                    max={1920}
                    step={10}
                    unit="px"
                    onChange={(val) => onUpdate({ pageContentMaxWidth: val })}
                  />

                  <p className="text-[11px] text-zinc-400 leading-snug pt-1">
                    Define el ancho del contenedor central en pantallas grandes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 2. REDONDEO DE ESQUINAS Y PUNTAS DEL LIENZO                    */}
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
            {openSections.borderRadius ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.borderRadius && (
            <div className="p-3.5 space-y-3.5 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Estilo de Puntas del Lienzo:
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
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
                        (settings.pageBorderRadius ?? 16) === preset.val
                          ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                          : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold">{preset.label}</div>
                      <div className={`text-[10px] ${
                        (settings.pageBorderRadius ?? 16) === preset.val ? 'text-blue-100' : 'text-zinc-400'
                      }`}>
                        {preset.desc}
                      </div>
                    </button>
                  ))}
                </div>

                <NumberControl
                  label="Radio de Esquinas Personalizado"
                  value={settings.pageBorderRadius ?? 16}
                  min={0}
                  max={64}
                  step={1}
                  unit="px"
                  onChange={(val) => onUpdate({ pageBorderRadius: val })}
                />
              </div>

              {/* Real-time interactive preview badge */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-semibold text-zinc-700">Previsualización de Esquinas</div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    border-radius: {settings.pageBorderRadius ?? 16}px
                  </div>
                </div>
                <div
                  className="w-12 h-10 border-2 border-[#2848F0] bg-blue-50/70 transition-all flex items-center justify-center text-[10px] font-mono font-bold text-[#2848F0]"
                  style={{
                    borderRadius: `${settings.pageBorderRadius ?? 16}px`,
                  }}
                >
                  {settings.pageBorderRadius ?? 16}
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-snug">
                Controla la curvatura de las 4 esquinas del canvas/página. Establece 0px para esquinas completamente cuadradas y rectas, o un valor mayor para un aspecto redondeado tipo aplicación web moderna.
              </p>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. TIPOGRAFÍAS GLOBALES (14 GOOGLE FONTS)                       */}
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
            {openSections.typography ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
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
                <label className="font-semibold text-zinc-700 block">Tamaños por defecto para Encabezados:</label>
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
        {/* 3. COLORES GLOBALES                                             */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('colors')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#2848F0]" />
              Colores Globales de la Página
            </span>
            {openSections.colors ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.colors && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              {/* Canvas Background Color */}
              <div className="space-y-1">
                <HexColorPicker
                  label="Fondo general del Canvas:"
                  value={settings.pageBgColor || '#FFFFFF'}
                  onChange={(val) => onUpdate({ pageBgColor: val })}
                />
              </div>

              {/* Primary Brand Color */}
              <div className="space-y-1 pt-2 border-t border-zinc-100">
                <HexColorPicker
                  label="Color Primario (Botones y Acentos):"
                  value={settings.primaryColor || '#2848F0'}
                  onChange={(val) => onUpdate({ primaryColor: val })}
                />
              </div>

              {/* Text Color */}
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
        {/* 4. RELLENO Y ESPACIADO DEL LIENZO                               */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('spacing')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#2848F0]" />
              Espaciado Vertical del Canvas
            </span>
            {openSections.spacing ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.spacing && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <NumberControl
                label="Padding Superior del Canvas"
                value={settings.pagePaddingTop || 0}
                min={0}
                max={160}
                onChange={(val) => onUpdate({ pagePaddingTop: val })}
              />
              <NumberControl
                label="Padding Inferior del Canvas"
                value={settings.pagePaddingBottom || 40}
                min={0}
                max={160}
                onChange={(val) => onUpdate({ pagePaddingBottom: val })}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 5. SEO Y METADATOS DE PÁGINA                                    */}
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
            {openSections.seo ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
          </button>

          {openSections.seo && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Título SEO (Etiqueta Title):</label>
                <input
                  type="text"
                  value={settings.seo_title || ''}
                  onChange={(e) => onUpdate({ seo_title: e.target.value })}
                  placeholder="Ej. Sesión Estratégica High-Ticket | Tu Empresa"
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Descripción SEO (Meta Description):</label>
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
      </div>
    </div>
  );
};
