import React, { useState, useRef } from 'react';
import {
  FunnelPageGlobalSettings,
  PopupWindowSettings,
  AVAILABLE_FONTS,
} from '../../types';
import { useApp } from '../../context/AppContext';
import { resolvePopupSettings } from '../../utils/libraryUtils';
import { NumberControl, InlineSliderInput } from '../common/NumberControl';
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
  Save,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

interface PageSettingsInspectorProps {
  settings: FunnelPageGlobalSettings;
  pageTitle?: string;
  onUpdate: (newSettings: Partial<FunnelPageGlobalSettings>) => void;
  onClose?: () => void;
  onSavePageToLibrary?: () => void;
  isPopupMode?: boolean;
  popupSettings?: PopupWindowSettings;
  onUpdatePopupSettings?: (patch: Partial<PopupWindowSettings>) => void;
}

export const PageSettingsInspector: React.FC<PageSettingsInspectorProps> = ({
  settings,
  pageTitle,
  onUpdate,
  onClose,
  onSavePageToLibrary,
  isPopupMode = false,
  popupSettings,
  onUpdatePopupSettings,
}) => {
  const { libraryItems } = useApp();
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  const [openSections, setOpenSections] = useState({
    popupCloseBtn: true,
    popupProgressBar: true,
    seo: true,
    canvasWidth: true,
    colors: true,
    typography: true,
    borderRadius: true,
    bgImage: true,
    spacing: true,
    autoPopup: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resolvedPopup = resolvePopupSettings(popupSettings);
  const availablePopups = libraryItems.filter((item) => item.kind === 'popup');

  const currentMode = settings.pageWidthType || 'boxed';
  const currentMaxWidth = settings.pageContentMaxWidth || 1200;

  const widthPresets = [
    { label: '800px', val: 800, desc: 'Compacto' },
    { label: '960px', val: 960, desc: 'Clásico' },
    { label: '1140px', val: 1140, desc: 'Estándar' },
    { label: '1200px', val: 1200, desc: 'Recomendado' },
    { label: '1400px', val: 1400, desc: 'Amplio' },
  ];

  const popupWidthPresets = [
    { label: '380px', val: 380, desc: 'Compacto' },
    { label: '480px', val: 480, desc: 'Clásico' },
    { label: '560px', val: 560, desc: 'Recomendado' },
    { label: '720px', val: 720, desc: 'Amplio' },
    { label: '920px', val: 920, desc: 'Video / Oferta' },
  ];

  const hasBgImage = Boolean(
    settings.pageBgImageUrl && settings.pageBgImageUrl.trim() !== ''
  );
  const isBgImageEnabled =
    settings.pageBgImageEnabled !== undefined
      ? settings.pageBgImageEnabled
      : hasBgImage;
  const currentBgSize = settings.pageBgImageSize || 'cover';
  const currentBgPosition = settings.pageBgImagePosition || 'center';
  const currentBgRepeat = settings.pageBgImageRepeat || 'no-repeat';
  const currentBgAttachment = settings.pageBgImageAttachment || 'scroll';
  const currentBgOpacity = settings.pageBgImageOpacity ?? 100;

  const effectiveRadius =
    settings.pageBorderRadius ?? (isPopupMode ? 16 : 0);

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
                  pageBgImageEnabled: true,
                  pageBgImageUrl: dataUrl,
                  pageBgImageOpacity: settings.pageBgImageOpacity ?? 100,
                  pageBgImageSize: settings.pageBgImageSize || 'cover',
                  pageBgImagePosition: settings.pageBgImagePosition || 'center',
                  pageBgImageRepeat: settings.pageBgImageRepeat || 'no-repeat',
                  pageBgImageAttachment:
                    settings.pageBgImageAttachment || 'scroll',
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
              {isPopupMode
                ? 'Configuración de Pop-up'
                : 'Configuración de Página'}
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[200px]">
            {pageTitle ||
              (isPopupMode ? 'Ventana del Pop-up' : 'Hoja / Canvas General')}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!isPopupMode && onSavePageToLibrary && (
            <button
              type="button"
              onClick={onSavePageToLibrary}
              className="p-1.5 text-zinc-600 hover:text-[#2848F0] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
              title="Guardar esta página en tu Biblioteca"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer text-xs font-semibold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Body Scrollable Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* POP-UP ONLY: 1. BOTÓN DE CERRAR (X) EN ESQUINA SUPERIOR DERECHA */}
        {/* ============================================================== */}
        {isPopupMode && (
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('popupCloseBtn')}
              className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <X className="w-3.5 h-3.5 text-[#2848F0] stroke-[2.5]" />
                Botón de Cerrar (X) — Esquina
              </span>
              {openSections.popupCloseBtn ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {openSections.popupCloseBtn && (
              <div className="p-3.5 space-y-3.5 bg-white text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Ubicación rápida en esquina superior derecha:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      {
                        val: 'inside' as const,
                        label: 'Dentro',
                        desc: 'Interior',
                      },
                      {
                        val: 'edge' as const,
                        label: 'En esquina',
                        desc: 'Sobre borde',
                      },
                      {
                        val: 'outside' as const,
                        label: 'Fuera',
                        desc: 'Exterior',
                      },
                    ].map((pos) => (
                      <button
                        key={pos.val}
                        type="button"
                        onClick={() =>
                          onUpdatePopupSettings?.({ closeBtnPosition: pos.val })
                        }
                        className={`py-2 px-1 border rounded-lg text-center transition-all cursor-pointer ${
                          resolvedPopup.closeBtnPosition === pos.val
                            ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                            : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{pos.label}</div>
                        <div
                          className={`text-[9px] ${
                            resolvedPopup.closeBtnPosition === pos.val
                              ? 'text-blue-100'
                              : 'text-zinc-400'
                          }`}
                        >
                          {pos.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fine X / Y offset controls */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-700">
                      Ajuste fino de posición (Izq / Der / Arriba / Abajo):
                    </span>
                    {(resolvedPopup.closeBtnOffsetX !== 0 ||
                      resolvedPopup.closeBtnOffsetY !== 0) && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdatePopupSettings?.({
                            closeBtnOffsetX: 0,
                            closeBtnOffsetY: 0,
                          })
                        }
                        className="text-[10px] font-semibold text-[#2848F0] hover:underline cursor-pointer"
                      >
                        Centrar (0, 0)
                      </button>
                    )}
                  </div>

                  <InlineSliderInput
                    label="Mover Horizontal (← Izq / Der →)"
                    value={resolvedPopup.closeBtnOffsetX}
                    min={-60}
                    max={60}
                    step={1}
                    unit="px"
                    onChange={(val) =>
                      onUpdatePopupSettings?.({ closeBtnOffsetX: val })
                    }
                  />

                  <InlineSliderInput
                    label="Mover Vertical (↑ Arriba / Abajo ↓)"
                    value={resolvedPopup.closeBtnOffsetY}
                    min={-60}
                    max={60}
                    step={1}
                    unit="px"
                    onChange={(val) =>
                      onUpdatePopupSettings?.({ closeBtnOffsetY: val })
                    }
                  />
                </div>

                {/* Size & Shape */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                  <InlineSliderInput
                    label="Tamaño del botón X"
                    value={resolvedPopup.closeBtnSize}
                    min={24}
                    max={56}
                    step={2}
                    unit="px"
                    onChange={(val) =>
                      onUpdatePopupSettings?.({ closeBtnSize: val })
                    }
                  />

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Forma del botón:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { val: 'circle' as const, label: 'Círculo' },
                        { val: 'rounded' as const, label: 'Redondeado' },
                        { val: 'square' as const, label: 'Cuadrado' },
                      ].map((sh) => (
                        <button
                          key={sh.val}
                          type="button"
                          onClick={() =>
                            onUpdatePopupSettings?.({ closeBtnShape: sh.val })
                          }
                          className={`py-1.5 px-2 border rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            resolvedPopup.closeBtnShape === sh.val
                              ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                              : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors of X Button */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                  <HexColorPicker
                    label="Color de fondo del botón (Negro por defecto):"
                    value={resolvedPopup.closeBtnBgColor}
                    onChange={(val) =>
                      onUpdatePopupSettings?.({ closeBtnBgColor: val })
                    }
                  />

                  <HexColorPicker
                    label="Color del icono X (Blanco por defecto):"
                    value={resolvedPopup.closeBtnIconColor}
                    onChange={(val) =>
                      onUpdatePopupSettings?.({ closeBtnIconColor: val })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* POP-UP ONLY: 2. BARRA DE PROGRESO 2 PASOS (CONVERSIÓN EMBUDO)   */}
        {/* ============================================================== */}
        {isPopupMode && (
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('popupProgressBar')}
              className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Barra Superior 2 Pasos (Conversión)
              </span>
              {openSections.popupProgressBar ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {openSections.popupProgressBar && (
              <div className="p-3.5 space-y-3 bg-white text-xs">
                <div
                  onClick={() =>
                    onUpdatePopupSettings?.({
                      showTopProgressBar: !resolvedPopup.showTopProgressBar,
                    })
                  }
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100/70 transition-colors cursor-pointer select-none"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-800 text-xs">
                      Mostrar barra de progreso arriba
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Aumenta conversiones (Efecto &quot;Paso 1 de 2&quot;)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-bold ${
                        resolvedPopup.showTopProgressBar
                          ? 'text-[#2848F0]'
                          : 'text-zinc-400'
                      }`}
                    >
                      {resolvedPopup.showTopProgressBar ? 'Sí' : 'No'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={resolvedPopup.showTopProgressBar}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePopupSettings?.({
                          showTopProgressBar: !resolvedPopup.showTopProgressBar,
                        });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                        resolvedPopup.showTopProgressBar
                          ? 'bg-[#2848F0]'
                          : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          resolvedPopup.showTopProgressBar
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {resolvedPopup.showTopProgressBar && (
                  <div className="space-y-3 pt-1">
                    <InlineSliderInput
                      label="Porcentaje de la barra"
                      value={resolvedPopup.progressBarPercent}
                      min={10}
                      max={100}
                      strictMax={true}
                      step={5}
                      unit="%"
                      onChange={(val) =>
                        onUpdatePopupSettings?.({ progressBarPercent: val })
                      }
                    />

                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1">
                        Texto motivador superior:
                      </label>
                      <input
                        type="text"
                        value={resolvedPopup.progressBarText}
                        onChange={(e) =>
                          onUpdatePopupSettings?.({
                            progressBarText: e.target.value,
                          })
                        }
                        placeholder="Paso 1 de 2: 50% Completado..."
                        className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
                      />
                    </div>

                    <HexColorPicker
                      label="Color de la barra:"
                      value={resolvedPopup.progressBarColor}
                      onChange={(val) =>
                        onUpdatePopupSettings?.({ progressBarColor: val })
                      }
                    />

                    <HexColorPicker
                      label="Color del texto de la barra:"
                      value={resolvedPopup.progressBarTextColor}
                      onChange={(val) =>
                        onUpdatePopupSettings?.({ progressBarTextColor: val })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 1. SEO Y METADATOS DE LA PÁGINA (OCULTO EN POP-UP)              */}
        {/* ============================================================== */}
        {!isPopupMode && (
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
                    onChange={(e) =>
                      onUpdate({ seo_description: e.target.value })
                    }
                    placeholder="Describe el beneficio principal de tu oferta en 150 caracteres..."
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ANCHO DEL CANVAS / VENTANA DEL POP-UP                        */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('canvasWidth')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#2848F0]" />
              {isPopupMode
                ? 'Ancho y Ventana del Pop-up'
                : 'Ancho del Canvas (Pantalla)'}
            </span>
            {openSections.canvasWidth ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {openSections.canvasWidth &&
            (isPopupMode ? (
              <div className="p-3.5 space-y-3.5 bg-white text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Presets de Ancho del Pop-up:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {popupWidthPresets.map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() =>
                          onUpdatePopupSettings?.({ maxWidth: preset.val })
                        }
                        className={`py-1.5 px-1 border rounded text-[11px] text-center transition-all cursor-pointer ${
                          resolvedPopup.maxWidth === preset.val
                            ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                            : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                        }`}
                        title={preset.desc}
                      >
                        <div>{preset.label}</div>
                        <div
                          className={`text-[9px] ${
                            resolvedPopup.maxWidth === preset.val
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
                  label="Ancho del Pop-up"
                  value={resolvedPopup.maxWidth}
                  min={300}
                  max={1100}
                  inputMin={280}
                  step={10}
                  unit="px"
                  onChange={(val) => onUpdatePopupSettings?.({ maxWidth: val })}
                />

                <div className="pt-2 border-t border-zinc-100 space-y-3">
                  <HexColorPicker
                    label="Color de fondo de la ventana:"
                    value={settings.pageBgColor || '#FFFFFF'}
                    onChange={(val) => onUpdate({ pageBgColor: val })}
                  />

                  <InlineSliderInput
                    label="Oscuridad del fondo trasero"
                    value={resolvedPopup.overlayOpacity}
                    min={0}
                    max={95}
                    strictMax={true}
                    step={2}
                    unit="%"
                    onChange={(val) =>
                      onUpdatePopupSettings?.({ overlayOpacity: val })
                    }
                  />

                  <div
                    onClick={() =>
                      onUpdatePopupSettings?.({
                        closeOnBackdropClick:
                          !resolvedPopup.closeOnBackdropClick,
                      })
                    }
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100/70 transition-colors cursor-pointer select-none"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-800 text-xs">
                        Cerrar al hacer clic fuera
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {resolvedPopup.closeOnBackdropClick
                          ? 'Se cierra al tocar el fondo oscuro'
                          : 'Obliga a usar la X o enviar'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-bold ${
                          resolvedPopup.closeOnBackdropClick
                            ? 'text-[#2848F0]'
                            : 'text-zinc-400'
                        }`}
                      >
                        {resolvedPopup.closeOnBackdropClick ? 'Sí' : 'No'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={resolvedPopup.closeOnBackdropClick}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePopupSettings?.({
                            closeOnBackdropClick:
                              !resolvedPopup.closeOnBackdropClick,
                          });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                          resolvedPopup.closeOnBackdropClick
                            ? 'bg-[#2848F0]'
                            : 'bg-zinc-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            resolvedPopup.closeOnBackdropClick
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
                            onClick={() =>
                              onUpdate({ pageContentMaxWidth: preset.val })
                            }
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
                                currentMaxWidth === preset.val
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
                      label="Ancho personalizado"
                      value={currentMaxWidth}
                      min={640}
                      max={1920}
                      inputMin={320}
                      step={10}
                      unit="px"
                      onChange={(val) => onUpdate({ pageContentMaxWidth: val })}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* ============================================================== */}
        {/* 3. COLORES GENERALES DE LA PÁGINA (OCULTO EN POP-UP)            */}
        {/* ============================================================== */}
        {!isPopupMode && (
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
        )}

        {/* ============================================================== */}
        {/* 4. TIPOGRAFÍA GLOBAL (GOOGLE FONTS) (OCULTO EN POP-UP)          */}
        {/* ============================================================== */}
        {!isPopupMode && (
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
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Fuente de Encabezados (H1, H2, H3, H4):
                  </label>
                  <select
                    value={settings.headingFontFamily || 'Poppins'}
                    onChange={(e) =>
                      onUpdate({ headingFontFamily: e.target.value })
                    }
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] cursor-pointer"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option
                        key={f.value}
                        value={f.value}
                        style={{ fontFamily: f.value }}
                      >
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className="mt-1.5 p-2 rounded bg-zinc-50 border border-zinc-100 text-sm font-bold text-zinc-800 truncate"
                    style={{
                      fontFamily: settings.headingFontFamily || 'Poppins',
                    }}
                  >
                    Vista previa: Titular con{' '}
                    {settings.headingFontFamily || 'Poppins'}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100">
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Fuente de Párrafos, Listas y Botones:
                  </label>
                  <select
                    value={settings.bodyFontFamily || 'Inter'}
                    onChange={(e) =>
                      onUpdate({ bodyFontFamily: e.target.value })
                    }
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] cursor-pointer"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option
                        key={f.value}
                        value={f.value}
                        style={{ fontFamily: f.value }}
                      >
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className="mt-1.5 p-2 rounded bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 leading-snug"
                    style={{ fontFamily: settings.bodyFontFamily || 'Inter' }}
                  >
                    Vista previa: Este es un texto de párrafo mostrando cómo se
                    lee la tipografía seleccionada.
                  </div>
                </div>

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
                    Al insertar nuevos bloques o encabezados, se aplicarán estas
                    dimensiones y tipografías automáticamente.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

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
                  Estilo de Puntas {isPopupMode ? 'del Pop-up' : 'del Lienzo'}:
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
                      onClick={() =>
                        onUpdate({ pageBorderRadius: preset.val })
                      }
                      className={`py-2 px-1 border rounded-lg text-center transition-all cursor-pointer ${
                        effectiveRadius === preset.val
                          ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-2xs'
                          : 'border-zinc-200 bg-white hover:border-[#2848F0] text-zinc-700'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold">
                        {preset.label}
                      </div>
                      <div
                        className={`text-[10px] ${
                          effectiveRadius === preset.val
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
                value={effectiveRadius}
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
              <div
                onClick={() =>
                  onUpdate({ pageBgImageEnabled: !isBgImageEnabled })
                }
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100/70 transition-colors cursor-pointer select-none"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-800 text-xs">
                    Usar imagen de fondo
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {isBgImageEnabled
                      ? 'Imagen activa en el fondo'
                      : 'Usando color de fondo normal'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-bold ${
                      isBgImageEnabled ? 'text-[#2848F0]' : 'text-zinc-400'
                    }`}
                  >
                    {isBgImageEnabled ? 'Sí' : 'No'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isBgImageEnabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({ pageBgImageEnabled: !isBgImageEnabled });
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                      isBgImageEnabled ? 'bg-[#2848F0]' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isBgImageEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {isBgImageEnabled && (
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={() => bgImageInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-white border border-[#2848F0] text-[#2848F0] hover:bg-blue-50/70 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {hasBgImage
                        ? 'Cambiar imagen de fondo'
                        : 'Subir imagen desde explorador'}
                    </span>
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
                          pageBgImageEnabled: true,
                          pageBgImageUrl: e.target.value,
                          pageBgImageOpacity:
                            settings.pageBgImageOpacity ?? 100,
                          pageBgImageSize: settings.pageBgImageSize || 'cover',
                          pageBgImagePosition:
                            settings.pageBgImagePosition || 'center',
                          pageBgImageRepeat:
                            settings.pageBgImageRepeat || 'no-repeat',
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
                      <div className="relative rounded-lg overflow-hidden border border-zinc-200 h-24 bg-zinc-100 flex items-center justify-center">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url("${settings.pageBgImageUrl}")`,
                            backgroundSize:
                              currentBgSize === 'stretch'
                                ? '100% 100%'
                                : currentBgSize,
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

                      <InlineSliderInput
                        label="Opacidad de la imagen"
                        value={currentBgOpacity}
                        min={0}
                        max={100}
                        strictMax={true}
                        step={1}
                        unit="%"
                        onChange={(val) =>
                          onUpdate({ pageBgImageOpacity: val })
                        }
                      />

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1.5">
                          Ajuste / Tamaño:
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { val: 'cover' as const, label: 'Ajustado (Cubrir)' },
                            {
                              val: 'contain' as const,
                              label: 'Completo (Contener)',
                            },
                            {
                              val: 'stretch' as const,
                              label: 'Alargado (Estirar)',
                            },
                            { val: 'auto' as const, label: 'Tamaño Original' },
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() =>
                                onUpdate({ pageBgImageSize: opt.val })
                              }
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
                              onClick={() =>
                                onUpdate({ pageBgImagePosition: pos.val })
                              }
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

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1.5">
                          Repetición / Patrón:
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { val: 'no-repeat' as const, label: 'Sin repetir' },
                            {
                              val: 'repeat' as const,
                              label: 'En patrón (Mosaico)',
                            },
                            {
                              val: 'repeat-x' as const,
                              label: 'Repetir horizontal',
                            },
                            {
                              val: 'repeat-y' as const,
                              label: 'Repetir vertical',
                            },
                          ].map((rep) => (
                            <button
                              key={rep.val}
                              type="button"
                              onClick={() => {
                                const patch: Partial<FunnelPageGlobalSettings> =
                                  {
                                    pageBgImageRepeat: rep.val,
                                  };
                                if (
                                  rep.val !== 'no-repeat' &&
                                  (currentBgSize === 'cover' ||
                                    currentBgSize === 'stretch')
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

                      {!isPopupMode && (
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1.5">
                            Movimiento al desplazar:
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              {
                                val: 'scroll' as const,
                                label: 'Normal (Con scroll)',
                              },
                              {
                                val: 'fixed' as const,
                                label: 'Fijo (Inmóvil)',
                              },
                            ].map((att) => (
                              <button
                                key={att.val}
                                type="button"
                                onClick={() =>
                                  onUpdate({ pageBgImageAttachment: att.val })
                                }
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
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 7. DISPOSICIÓN / PADDING DEL CANVAS                             */}
        {/* ============================================================== */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('spacing')}
            className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-[#2848F0]" />
              {isPopupMode
                ? 'Disposición (Padding del Pop-up)'
                : 'Disposición (Padding del Canvas)'}
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

        {/* ============================================================== */}
        {/* 8. POP-UP AUTOMÁTICO DE PÁGINA (EXIT-INTENT / TIEMPO)           */}
        {/* ============================================================== */}
        {!isPopupMode && (
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('autoPopup')}
              className="w-full px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-xs text-zinc-800 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Pop-up Automático (Exit-Intent / Tiempo)
              </span>
              {openSections.autoPopup ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {openSections.autoPopup && (
              <div className="p-3.5 space-y-3 bg-white text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Disparador automático en esta página:
                  </label>
                  <select
                    value={settings.autoPopupTrigger || 'none'}
                    onChange={(e) => {
                      const val = e.target.value as
                        | 'none'
                        | 'exit_intent'
                        | 'delay';
                      onUpdate({
                        autoPopupTrigger: val,
                        autoPopupId:
                          val !== 'none' && !settings.autoPopupId
                            ? availablePopups[0]?.id || 'lib_pop_exit_offer'
                            : settings.autoPopupId,
                        autoPopupDelaySeconds:
                          settings.autoPopupDelaySeconds ?? 8,
                      });
                    }}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] cursor-pointer"
                  >
                    <option value="none">Desactivado (Solo con botones)</option>
                    <option value="exit_intent">
                      Intención de salida (Exit-Intent)
                    </option>
                    <option value="delay">
                      Por tiempo en la página (Segundos)
                    </option>
                  </select>
                </div>

                {settings.autoPopupTrigger &&
                  settings.autoPopupTrigger !== 'none' && (
                    <>
                      {settings.autoPopupTrigger === 'delay' && (
                        <InlineSliderInput
                          label="Mostrar después de"
                          value={settings.autoPopupDelaySeconds ?? 8}
                          min={1}
                          max={120}
                          step={1}
                          unit="s"
                          onChange={(val) =>
                            onUpdate({ autoPopupDelaySeconds: val })
                          }
                        />
                      )}

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">
                          Pop-up de la Biblioteca a abrir:
                        </label>
                        {availablePopups.length > 0 ? (
                          <select
                            value={
                              settings.autoPopupId || availablePopups[0].id
                            }
                            onChange={(e) =>
                              onUpdate({ autoPopupId: e.target.value })
                            }
                            className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 focus:bg-white focus:outline-[#2848F0] cursor-pointer"
                          >
                            {availablePopups.map((pop) => (
                              <option key={pop.id} value={pop.id}>
                                {pop.name} ({pop.category})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-[11px] text-zinc-500">
                            No hay Pop-ups creados aún en la Biblioteca.
                          </p>
                        )}
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
