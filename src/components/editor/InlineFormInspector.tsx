import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  SlidersHorizontal,
  Mail,
  MousePointerClick,
  CheckSquare,
  Zap,
  Layout,
  ChevronDown,
  ChevronRight,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  AVAILABLE_FONTS,
  CompleteFormButtonStyles,
  CompleteFormGlobalFieldStyle,
  CompleteFormPostSubmitActions,
  ElementStyles,
  FunnelPage,
  FunnelPageGlobalSettings,
  PageBlockElement,
} from '../../types';
import { useApp } from '../../context/AppContext';
import { NumberControl, InlineSliderInput } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import {
  CTA_FORM_BUTTON_ICONS,
  createDefaultInlineButtonStyles,
  createDefaultInlineFieldStyle,
  DEFAULT_EMAIL_PLACEHOLDER,
  DEFAULT_POLICY_ERROR_TEXT,
  DEFAULT_POLICY_HTML,
  EMAIL_MARKETING_PROVIDERS,
  getResolvedFormButtonStyles,
  getResolvedGlobalFieldStyle,
  getResolvedPostSubmitActions,
  sanitizePolicyHtml,
} from '../../utils/completeFormUtils';

interface InlineFormInspectorProps {
  element: PageBlockElement;
  pageSettings: FunnelPageGlobalSettings;
  funnelPages?: FunnelPage[];
  currentPageId?: string;
  onUpdate: (
    updatedStyles: Partial<ElementStyles>,
    updatedContent?: Partial<PageBlockElement['content']>
  ) => void;
}

const BUTTON_WIDTH_PRESETS = [20, 25, 30, 40, 50];

export const InlineFormInspector: React.FC<InlineFormInspectorProps> = ({
  element,
  pageSettings,
  funnelPages = [],
  currentPageId,
  onUpdate,
}) => {
  const { integrations, showToast } = useApp();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    formName: true,
    inlineLayout: true,
    emailField: true,
    formButton: true,
    policyCheckbox: true,
    postSubmit: true,
    disposition: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [emailTab, setEmailTab] = useState<'content' | 'style'>('content');
  const [btnColorTab, setBtnColorTab] = useState<'normal' | 'hover'>('normal');
  const [showIconGrid, setShowIconGrid] = useState<boolean>(false);

  const policyEditorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrlDraft, setLinkUrlDraft] = useState('https://');

  const fieldStyle = getResolvedGlobalFieldStyle(
    element.content,
    pageSettings.bodyFontFamily || 'Inter'
  );
  const btnStyles = getResolvedFormButtonStyles(
    element,
    '#F5B056',
    pageSettings.bodyFontFamily || 'Poppins'
  );
  const postActions = getResolvedPostSubmitActions(element.content);

  const unifiedHeight = Math.max(
    36,
    Math.min(96, Number(element.content.inlineFormHeight ?? 52) || 52)
  );
  const buttonWidthPercent = Math.max(
    20,
    Math.min(50, Number(element.content.inlineFormButtonWidthPercent ?? 30) || 30)
  );
  const inlineGap = Math.max(
    0,
    Math.min(32, Number(element.content.inlineFormGap ?? 0) || 0)
  );

  const showLabel = Boolean(element.content.inlineShowLabel);
  const showReqMark = element.content.formShowRequiredMark !== false;
  const emailLabel = element.content.inlineEmailLabel ?? 'Tu mejor email';
  const emailPlaceholder =
    element.content.inlineEmailPlaceholder !== undefined
      ? element.content.inlineEmailPlaceholder
      : DEFAULT_EMAIL_PLACEHOLDER;

  const policyEnabled = Boolean(element.content.policyCheckboxEnabled);
  const policyHtml = element.content.policyCheckboxHtml || DEFAULT_POLICY_HTML;

  useEffect(() => {
    if (policyEditorRef.current) {
      const currentSanitized = sanitizePolicyHtml(policyHtml);
      if (policyEditorRef.current.innerHTML !== currentSanitized) {
        policyEditorRef.current.innerHTML = currentSanitized;
      }
    }
  }, [element.id, element.content.policyCheckboxEnabled]);

  const updateFieldStyle = (patch: Partial<CompleteFormGlobalFieldStyle>) => {
    onUpdate(
      {},
      {
        formFieldStyles: {
          ...(element.content.formFieldStyles || fieldStyle),
          ...patch,
        },
      }
    );
  };

  const updateButtonStyles = (patch: Partial<CompleteFormButtonStyles>) => {
    const merged: CompleteFormButtonStyles = {
      ...(element.content.formButtonStyles || btnStyles),
      ...patch,
    };
    const contentPatch: Partial<PageBlockElement['content']> = {
      formButtonStyles: merged,
    };
    if (patch.text !== undefined) contentPatch.submitButtonText = patch.text;
    if (patch.bgColor !== undefined) contentPatch.submitButtonBg = patch.bgColor;
    if (patch.textColor !== undefined) contentPatch.submitButtonTextColor = patch.textColor;
    onUpdate({}, contentPatch);
  };

  const handleResetFieldStyles = () => {
    const defaultField = createDefaultInlineFieldStyle(
      pageSettings.bodyFontFamily || 'Inter'
    );
    onUpdate(
      {},
      {
        formFieldStyles: defaultField,
        inlineShowLabel: false,
      }
    );
    showToast('Estilos del campo restaurados por defecto');
  };

  const handleResetButtonStyles = () => {
    const defaultBtn = createDefaultInlineButtonStyles(
      btnStyles.text || 'Comenzar Ahora',
      btnStyles.subtext || '',
      '#F5B056',
      pageSettings.bodyFontFamily || 'Poppins'
    );
    onUpdate(
      {},
      {
        formButtonStyles: defaultBtn,
        submitButtonBg: defaultBtn.bgColor,
        submitButtonTextColor: defaultBtn.textColor,
      }
    );
    setBtnColorTab('normal');
    showToast('Estilos del botón restaurados por defecto');
  };

  const updatePostActions = (patch: Partial<CompleteFormPostSubmitActions>) => {
    onUpdate(
      {},
      {
        formPostSubmitActions: {
          ...postActions,
          ...patch,
        },
      }
    );
  };

  const activeDestination: 'next_step' | 'funnel_page' | 'url' | 'message' =
    postActions.redirectToUrl
      ? 'url'
      : postActions.goToFunnelPage
      ? 'funnel_page'
      : postActions.goToNextStep
      ? 'next_step'
      : 'message';

  const handleSelectDestination = (
    dest: 'next_step' | 'funnel_page' | 'url' | 'message'
  ) => {
    if (dest === 'next_step') {
      updatePostActions({
        goToNextStep: true,
        goToFunnelPage: false,
        redirectToUrl: false,
      });
    } else if (dest === 'funnel_page') {
      const fallbackPageId =
        postActions.targetFunnelPageId ||
        funnelPages.find((p) => p.id !== currentPageId)?.id ||
        funnelPages[0]?.id ||
        '';
      updatePostActions({
        goToNextStep: false,
        goToFunnelPage: true,
        targetFunnelPageId: fallbackPageId,
        redirectToUrl: false,
      });
    } else if (dest === 'url') {
      updatePostActions({
        goToNextStep: false,
        goToFunnelPage: false,
        redirectToUrl: true,
      });
    } else {
      updatePostActions({
        goToNextStep: false,
        goToFunnelPage: false,
        redirectToUrl: false,
      });
    }
  };

  const saveCurrentPolicySelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      policyEditorRef.current &&
      policyEditorRef.current.contains(sel.anchorNode)
    ) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const commitPolicyEditorHtml = () => {
    if (!policyEditorRef.current) return;
    const cleaned = sanitizePolicyHtml(policyEditorRef.current.innerHTML);
    onUpdate({}, { policyCheckboxHtml: cleaned });
  };

  const execPolicyCommand = (cmd: 'bold' | 'italic' | 'underline' | 'unlink') => {
    if (!policyEditorRef.current) return;
    policyEditorRef.current.focus();
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
    document.execCommand(cmd, false);
    saveCurrentPolicySelection();
    commitPolicyEditorHtml();
  };

  const handleOpenPolicyLinkInput = () => {
    saveCurrentPolicySelection();
    setShowLinkInput((prev) => !prev);
  };

  const handleApplyPolicyLink = () => {
    if (!policyEditorRef.current) return;
    const cleanUrl = linkUrlDraft.trim();
    if (!cleanUrl) return;
    const normalizedUrl = /^https?:\/\/|^mailto:|^tel:/i.test(cleanUrl)
      ? cleanUrl
      : `https://${cleanUrl}`;

    policyEditorRef.current.focus();
    const sel = window.getSelection();
    if (savedSelectionRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }

    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand('createLink', false, normalizedUrl);
    } else {
      const anchorHtml = `<a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">ver políticas</a>`;
      document.execCommand('insertHTML', false, anchorHtml);
    }

    commitPolicyEditorHtml();
    if (policyEditorRef.current) {
      policyEditorRef.current.innerHTML = sanitizePolicyHtml(
        policyEditorRef.current.innerHTML
      );
    }
    setShowLinkInput(false);
  };

  const CurrentBtnIconComp = btnStyles.icon
    ? ((LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
        btnStyles.icon
      ] || null)
    : null;

  return (
    <div className="space-y-3 text-xs font-['Inter']">
      {/* GRUPO 1: NOMBRE DEL FORMULARIO INLINE */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('formName')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Nombre del formulario</span>
          </span>
          {openGroups.formName ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.formName && (
          <div className="p-3 bg-white">
            <div className="flex items-center justify-between gap-2">
              <label className="text-zinc-600 font-medium shrink-0">Nombre:</label>
              <input
                type="text"
                value={element.content.formName ?? 'Formulario Inline'}
                onChange={(e) => onUpdate({}, { formName: e.target.value })}
                placeholder="Ej. Captura Rápida Email"
                className="flex-1 min-w-0 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md bg-white text-zinc-800 focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0]"
              />
            </div>
          </div>
        )}
      </div>

      {/* GRUPO 2: TAMAÑO Y PROPORCIÓN EN LÍNEA */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('inlineLayout')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Tamaño y Proporción en Línea</span>
          </span>
          {openGroups.inlineLayout ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.inlineLayout && (
          <div className="p-3 space-y-3.5 bg-white">
            <div className="p-2.5 rounded-lg bg-blue-50/40 border border-blue-100 space-y-2">
              <InlineSliderInput
                label="Altura (Campo y Botón por igual)"
                value={unifiedHeight}
                min={36}
                max={96}
                step={1}
                unit="px"
                onChange={(val) =>
                  onUpdate(
                    {},
                    { inlineFormHeight: Math.max(36, Math.min(96, Math.round(val))) }
                  )
                }
              />
              <p className="text-[10px] text-zinc-500 leading-snug">
                Aplica exactamente la misma altura vertical al campo de correo y al botón
                al mismo tiempo.
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700">Ancho del botón (%):</span>
                <span className="text-[10px] font-semibold text-[#2848F0] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Campo {100 - buttonWidthPercent}% · Botón {buttonWidthPercent}%
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {BUTTON_WIDTH_PRESETS.map((pct) => {
                  const isActive = buttonWidthPercent === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() =>
                        onUpdate({}, { inlineFormButtonWidthPercent: pct })
                      }
                      className={`py-1.5 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>

              <InlineSliderInput
                label="Ajuste fino del botón (máx. 50%)"
                value={buttonWidthPercent}
                min={20}
                max={50}
                step={1}
                unit="%"
                onChange={(val) =>
                  onUpdate(
                    {},
                    {
                      inlineFormButtonWidthPercent: Math.max(
                        20,
                        Math.min(50, Math.round(val))
                      ),
                    }
                  )
                }
              />
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <InlineSliderInput
                label="Separación entre campo y botón"
                value={inlineGap}
                min={0}
                max={24}
                step={1}
                unit="px"
                onChange={(val) =>
                  onUpdate(
                    {},
                    { inlineFormGap: Math.max(0, Math.min(32, Math.round(val))) }
                  )
                }
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                En 0 px el campo y el botón quedan unidos en una sola barra continua.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GRUPO 3: CAMPO ÚNICO DE CORREO */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('emailField')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Campo de Correo (Email)</span>
          </span>
          {openGroups.emailField ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.emailField && (
          <div className="p-3 space-y-3 bg-white">
            <div className="px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 text-[#2848F0] shrink-0" />
                <span className="font-semibold text-zinc-800 truncate">
                  Email <span className="text-red-500">*</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-[#2848F0] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                Campo único obligatorio
              </span>
            </div>

            <div className="grid grid-cols-2 border border-zinc-300 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setEmailTab('content')}
                className={`py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  emailTab === 'content'
                    ? 'bg-zinc-200/80 text-zinc-900'
                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Contenido
              </button>
              <button
                type="button"
                onClick={() => setEmailTab('style')}
                className={`py-1.5 text-xs font-semibold border-l border-zinc-300 transition-colors cursor-pointer ${
                  emailTab === 'style'
                    ? 'bg-zinc-200/80 text-zinc-900'
                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Estilo del campo
              </button>
            </div>

            {emailTab === 'content' ? (
              <div className="space-y-2.5">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Placeholder del correo:
                  </label>
                  <input
                    type="text"
                    value={emailPlaceholder}
                    onChange={(e) =>
                      onUpdate({}, { inlineEmailPlaceholder: e.target.value })
                    }
                    placeholder="Coloca tu mejor email"
                    className="w-full p-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-800 focus:outline-[#2848F0]"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 font-medium">Mostrar etiqueta (Label)</span>
                    <button
                      type="button"
                      onClick={() => onUpdate({}, { inlineShowLabel: !showLabel })}
                      className={`relative inline-flex items-center h-6 w-20 rounded-full transition-colors cursor-pointer px-1.5 ${
                        showLabel ? 'bg-[#2848F0]' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold w-full text-center ${
                          showLabel ? 'text-white pr-4' : 'text-zinc-700 pl-4'
                        }`}
                      >
                        {showLabel ? 'Mostrar' : 'Ocultar'}
                      </span>
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                          showLabel ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {showLabel && (
                    <>
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">
                          Texto de etiqueta:
                        </label>
                        <input
                          type="text"
                          value={emailLabel}
                          onChange={(e) =>
                            onUpdate({}, { inlineEmailLabel: e.target.value })
                          }
                          placeholder="Tu mejor email"
                          className="w-full p-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-800 focus:outline-[#2848F0]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 font-medium">Marca de requerido (*)</span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdate({}, { formShowRequiredMark: !showReqMark })
                          }
                          className={`relative inline-flex items-center h-6 w-20 rounded-full transition-colors cursor-pointer px-1.5 ${
                            showReqMark ? 'bg-[#2848F0]' : 'bg-zinc-300'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-bold w-full text-center ${
                              showReqMark ? 'text-white pr-4' : 'text-zinc-700 pl-4'
                            }`}
                          >
                            {showReqMark ? 'Mostrar' : 'Ocultar'}
                          </span>
                          <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                              showReqMark ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Fuente del campo:
                  </label>
                  <select
                    value={fieldStyle.fontFamily}
                    onChange={(e) => updateFieldStyle({ fontFamily: e.target.value })}
                    className="w-full p-1.5 text-xs border border-zinc-300 rounded bg-white"
                  >
                    {AVAILABLE_FONTS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <NumberControl
                  label="Tamaño de fuente"
                  value={fieldStyle.fontSize}
                  min={10}
                  max={28}
                  onChange={(val) => updateFieldStyle({ fontSize: val })}
                />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">Formato:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateFieldStyle({ isBold: !fieldStyle.isBold })}
                      className={`p-1.5 px-2.5 rounded border cursor-pointer transition-colors ${
                        fieldStyle.isBold
                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                      title="Negrita"
                    >
                      <BoldIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateFieldStyle({ isItalic: !fieldStyle.isItalic })
                      }
                      className={`p-1.5 px-2.5 rounded border cursor-pointer transition-colors ${
                        fieldStyle.isItalic
                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                      title="Cursiva"
                    >
                      <ItalicIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <HexColorPicker
                  label="Color de fuente:"
                  value={fieldStyle.textColor}
                  onChange={(val) => updateFieldStyle({ textColor: val })}
                />

                {showLabel && (
                  <HexColorPicker
                    label="Color de Label:"
                    value={fieldStyle.labelColor}
                    onChange={(val) => updateFieldStyle({ labelColor: val })}
                  />
                )}

                <HexColorPicker
                  label="Color de fondo del campo:"
                  value={fieldStyle.bgColor}
                  onChange={(val) => updateFieldStyle({ bgColor: val })}
                />

                <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                  <NumberControl
                    label="Espesor de borde"
                    value={fieldStyle.borderWidth}
                    min={0}
                    max={10}
                    onChange={(val) => updateFieldStyle({ borderWidth: val })}
                  />

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-zinc-700">Tipo de borde:</span>
                    <select
                      value={fieldStyle.borderStyle}
                      onChange={(e) =>
                        updateFieldStyle({
                          borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted',
                        })
                      }
                      className="px-2 py-1 text-xs border border-zinc-300 rounded bg-white"
                    >
                      <option value="solid">Sólido</option>
                      <option value="dashed">Guiones</option>
                      <option value="dotted">Puntos</option>
                    </select>
                  </div>

                  <HexColorPicker
                    label="Color del borde:"
                    value={fieldStyle.borderColor}
                    onChange={(val) => updateFieldStyle({ borderColor: val })}
                  />

                  <NumberControl
                    label="Radio del campo (Redondeo)"
                    value={fieldStyle.borderRadius}
                    min={0}
                    max={48}
                    onChange={(val) => updateFieldStyle({ borderRadius: val })}
                  />
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleResetFieldStyles}
                className="w-full py-2 px-3 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Restaurar estilos del campo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GRUPO 4: BOTÓN EN LÍNEA */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('formButton')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Botón del formulario</span>
          </span>
          {openGroups.formButton ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.formButton && (
          <div className="p-3 space-y-3.5 bg-white">
            <div className="space-y-2">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Texto del botón:
                </label>
                <input
                  type="text"
                  value={btnStyles.text}
                  onChange={(e) => updateButtonStyles({ text: e.target.value })}
                  placeholder="Comenzar Ahora"
                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Subtexto opcional:
                </label>
                <input
                  type="text"
                  value={btnStyles.subtext}
                  onChange={(e) => updateButtonStyles({ subtext: e.target.value })}
                  placeholder="Ej. Acceso inmediato"
                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                />
              </div>

              <NumberControl
                label="Relleno horizontal interno"
                value={btnStyles.paddingX}
                min={8}
                max={56}
                onChange={(val) => updateButtonStyles({ paddingX: val })}
              />
            </div>

            <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700">Icono del botón:</span>
                <div className="flex items-center gap-1.5">
                  {btnStyles.icon && (
                    <button
                      type="button"
                      onClick={() => updateButtonStyles({ icon: '' })}
                      className="px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 cursor-pointer"
                    >
                      Quitar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowIconGrid((prev) => !prev)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {CurrentBtnIconComp ? (
                      <CurrentBtnIconComp className="w-3.5 h-3.5 text-[#2848F0]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span>{btnStyles.icon ? 'Cambiar icono' : 'Elegir icono'}</span>
                  </button>
                </div>
              </div>

              {showIconGrid && (
                <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                  {CTA_FORM_BUTTON_ICONS.map((iconName) => {
                    const IconComp = (
                      LucideIcons as unknown as Record<
                        string,
                        React.ComponentType<{ className?: string }>
                      >
                    )[iconName];
                    if (!IconComp) return null;
                    const active = btnStyles.icon === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => updateButtonStyles({ icon: iconName })}
                        className={`p-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#2848F0] text-white'
                            : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200/70'
                        }`}
                        title={iconName}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              )}

              {btnStyles.icon && (
                <div className="space-y-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Posición del icono:
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => updateButtonStyles({ iconPosition: 'before' })}
                        className={`py-1 px-2 text-[11px] font-semibold rounded border cursor-pointer ${
                          btnStyles.iconPosition === 'before'
                            ? 'bg-[#2848F0] text-white border-[#2848F0]'
                            : 'bg-white text-zinc-700 border-zinc-200'
                        }`}
                      >
                        Adelante del texto
                      </button>
                      <button
                        type="button"
                        onClick={() => updateButtonStyles({ iconPosition: 'after' })}
                        className={`py-1 px-2 text-[11px] font-semibold rounded border cursor-pointer ${
                          btnStyles.iconPosition === 'after'
                            ? 'bg-[#2848F0] text-white border-[#2848F0]'
                            : 'bg-white text-zinc-700 border-zinc-200'
                        }`}
                      >
                        Después del texto
                      </button>
                    </div>
                  </div>

                  <NumberControl
                    label="Tamaño del icono"
                    value={btnStyles.iconSize}
                    min={8}
                    max={40}
                    onChange={(val) => updateButtonStyles({ iconSize: val })}
                  />

                  <NumberControl
                    label="Espaciado icono y texto"
                    value={btnStyles.iconSpacing}
                    min={0}
                    max={28}
                    onChange={(val) => updateButtonStyles({ iconSpacing: val })}
                  />
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
              <div className="text-[11px] font-bold text-zinc-800">
                Tipografía y Formato
              </div>

              <NumberControl
                label="Tamaño de fuente"
                value={btnStyles.fontSize}
                min={10}
                max={36}
                onChange={(val) => updateButtonStyles({ fontSize: val })}
              />

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Tipo de fuente (Google Fonts):
                </label>
                <select
                  value={btnStyles.fontFamily}
                  onChange={(e) => updateButtonStyles({ fontFamily: e.target.value })}
                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Transformación:
                </label>
                <select
                  value={btnStyles.textTransform}
                  onChange={(e) =>
                    updateButtonStyles({
                      textTransform: e.target.value as
                        | 'none'
                        | 'uppercase'
                        | 'lowercase'
                        | 'capitalize',
                    })
                  }
                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                >
                  <option value="none">Normal</option>
                  <option value="uppercase">Mayúsculas</option>
                  <option value="lowercase">Minúsculas</option>
                  <option value="capitalize">Iniciales en mayúscula</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700">Formato:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateButtonStyles({ isBold: !btnStyles.isBold })}
                    className={`p-1.5 px-2.5 rounded-lg border cursor-pointer transition-colors ${
                      btnStyles.isBold
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                    title="Negrita"
                  >
                    <BoldIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateButtonStyles({ isItalic: !btnStyles.isItalic })}
                    className={`p-1.5 px-2.5 rounded-lg border cursor-pointer transition-colors ${
                      btnStyles.isItalic
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                    title="Cursiva"
                  >
                    <ItalicIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateButtonStyles({ isUnderline: !btnStyles.isUnderline })
                    }
                    className={`p-1.5 px-2.5 rounded-lg border cursor-pointer transition-colors ${
                      btnStyles.isUnderline
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                    title="Subrayado"
                  >
                    <UnderlineIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
              <div className="text-[11px] font-bold text-zinc-800">Color y Fondo</div>

              <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
                <button
                  type="button"
                  onClick={() => setBtnColorTab('normal')}
                  className={`py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                    btnColorTab === 'normal'
                      ? 'bg-white text-[#2848F0] shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setBtnColorTab('hover')}
                  className={`py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                    btnColorTab === 'hover'
                      ? 'bg-white text-[#2848F0] shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Al pasar el cursor
                </button>
              </div>

              {btnColorTab === 'normal' ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-700">Tipo de fondo:</span>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => updateButtonStyles({ bgType: 'solid' })}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded border cursor-pointer ${
                          btnStyles.bgType === 'solid'
                            ? 'bg-[#2848F0] text-white border-[#2848F0]'
                            : 'bg-white text-zinc-700 border-zinc-200'
                        }`}
                      >
                        Sólido
                      </button>
                      <button
                        type="button"
                        onClick={() => updateButtonStyles({ bgType: 'gradient' })}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded border cursor-pointer ${
                          btnStyles.bgType === 'gradient'
                            ? 'bg-[#2848F0] text-white border-[#2848F0]'
                            : 'bg-white text-zinc-700 border-zinc-200'
                        }`}
                      >
                        Degradado
                      </button>
                    </div>
                  </div>

                  <HexColorPicker
                    label={
                      btnStyles.bgType === 'gradient'
                        ? 'Color inicial:'
                        : 'Color de fondo:'
                    }
                    value={btnStyles.bgColor}
                    onChange={(val) => updateButtonStyles({ bgColor: val })}
                  />

                  {btnStyles.bgType === 'gradient' && (
                    <HexColorPicker
                      label="Color final:"
                      value={btnStyles.bgColor2}
                      onChange={(val) => updateButtonStyles({ bgColor2: val })}
                    />
                  )}

                  <HexColorPicker
                    label="Color de fuente del botón:"
                    value={btnStyles.textColor}
                    onChange={(val) => updateButtonStyles({ textColor: val })}
                  />

                  <HexColorPicker
                    label="Color del borde:"
                    value={btnStyles.borderColor}
                    onChange={(val) => updateButtonStyles({ borderColor: val })}
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <HexColorPicker
                    label="Color de fondo (cursor):"
                    value={btnStyles.hoverBgColor}
                    onChange={(val) => updateButtonStyles({ hoverBgColor: val })}
                  />
                  <HexColorPicker
                    label="Color de fuente (cursor):"
                    value={btnStyles.hoverTextColor}
                    onChange={(val) => updateButtonStyles({ hoverTextColor: val })}
                  />
                  <HexColorPicker
                    label="Color del borde (cursor):"
                    value={btnStyles.hoverBorderColor}
                    onChange={(val) => updateButtonStyles({ hoverBorderColor: val })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateButtonStyles({
                        hoverBgColor: undefined,
                        hoverTextColor: undefined,
                        hoverBorderColor: undefined,
                      })
                    }
                    className="w-full py-1.5 text-[11px] font-semibold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Restablecer estado al pasar el cursor
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
              <div className="text-[11px] font-bold text-zinc-800">Borde y Redondeo</div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700">Agregar borde:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={btnStyles.borderWidth > 0}
                    onChange={(e) =>
                      updateButtonStyles({ borderWidth: e.target.checked ? 2 : 0 })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2848F0]" />
                </label>
              </div>

              {btnStyles.borderWidth > 0 && (
                <div className="space-y-2.5 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <NumberControl
                    label="Grosor de borde"
                    value={btnStyles.borderWidth}
                    min={1}
                    max={12}
                    onChange={(val) => updateButtonStyles({ borderWidth: val })}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-zinc-700">Tipo de borde:</span>
                    <select
                      value={btnStyles.borderStyle}
                      onChange={(e) =>
                        updateButtonStyles({
                          borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted',
                        })
                      }
                      className="px-2 py-1 text-xs border border-zinc-300 rounded bg-white"
                    >
                      <option value="solid">Sólido</option>
                      <option value="dashed">Guiones</option>
                      <option value="dotted">Puntos</option>
                    </select>
                  </div>
                </div>
              )}

              <NumberControl
                label="Borde redondeado (Radio)"
                value={btnStyles.borderRadius}
                min={0}
                max={48}
                onChange={(val) => updateButtonStyles({ borderRadius: val })}
              />

              <div className="pt-2.5 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handleResetButtonStyles}
                  className="w-full py-2 px-3 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Restaurar estilos del botón</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GRUPO 5: CHECKBOX DE POLÍTICAS */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('policyCheckbox')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Checkbox de Políticas</span>
          </span>
          {openGroups.policyCheckbox ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.policyCheckbox && (
          <div className="p-3 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-700">
                Mostrar casilla de políticas:
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdate({}, { policyCheckboxEnabled: !policyEnabled })
                }
                className={`relative inline-flex items-center h-6 w-14 rounded-full transition-colors cursor-pointer px-1 ${
                  policyEnabled ? 'bg-[#2848F0]' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`text-[10px] font-bold w-full text-center ${
                    policyEnabled ? 'text-white pr-4' : 'text-zinc-700 pl-4'
                  }`}
                >
                  {policyEnabled ? 'Sí' : 'No'}
                </span>
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    policyEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {policyEnabled && (
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Al activar esta casilla, es <strong>obligatorio</strong> que el
                    usuario la marque antes de enviar su correo.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 block">
                    Texto de políticas (selecciona palabras para formato o enlace):
                  </label>

                  <div className="border border-zinc-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex items-center gap-1 px-2 py-1.5 bg-zinc-50 border-b border-zinc-200 flex-wrap">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execPolicyCommand('bold');
                        }}
                        className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                        title="Negrita"
                      >
                        <BoldIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execPolicyCommand('italic');
                        }}
                        className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                        title="Cursiva"
                      >
                        <ItalicIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execPolicyCommand('underline');
                        }}
                        className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                        title="Subrayado"
                      >
                        <UnderlineIcon className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-4 bg-zinc-300 mx-0.5" />

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleOpenPolicyLinkInput();
                        }}
                        className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                          showLinkInput
                            ? 'bg-[#2848F0] text-white'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                        title="Agregar enlace URL"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Enlace</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execPolicyCommand('unlink');
                        }}
                        className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        title="Quitar enlace"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {showLinkInput && (
                      <div className="p-2 bg-blue-50/60 border-b border-blue-200 flex items-center gap-1.5">
                        <input
                          type="url"
                          value={linkUrlDraft}
                          onChange={(e) => setLinkUrlDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyPolicyLink();
                            }
                          }}
                          placeholder="https://tusitio.com/privacidad"
                          className="flex-1 min-w-0 px-2 py-1 text-xs border border-zinc-300 rounded bg-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPolicyLink}
                          className="px-2.5 py-1 bg-[#2848F0] text-white font-semibold text-[11px] rounded cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Check className="w-3 h-3" />
                          <span>Aplicar</span>
                        </button>
                      </div>
                    )}

                    <div
                      ref={policyEditorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onKeyUp={saveCurrentPolicySelection}
                      onMouseUp={saveCurrentPolicySelection}
                      onBlur={commitPolicyEditorHtml}
                      dangerouslySetInnerHTML={{
                        __html: sanitizePolicyHtml(policyHtml),
                      }}
                      className="p-2.5 min-h-[64px] text-xs text-zinc-800 leading-relaxed focus:outline-none [&_a]:text-[#2848F0] [&_a]:underline"
                    />
                  </div>
                </div>

                <NumberControl
                  label="Tamaño de texto"
                  value={element.content.policyCheckboxFontSize ?? 12}
                  min={10}
                  max={20}
                  onChange={(val) =>
                    onUpdate({}, { policyCheckboxFontSize: val })
                  }
                />

                <HexColorPicker
                  label="Color del texto:"
                  value={element.content.policyCheckboxTextColor || '#3F3F46'}
                  onChange={(val) =>
                    onUpdate({}, { policyCheckboxTextColor: val })
                  }
                />

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Aviso si intenta enviar sin aceptar:
                  </label>
                  <input
                    type="text"
                    value={
                      element.content.policyCheckboxErrorText ??
                      DEFAULT_POLICY_ERROR_TEXT
                    }
                    onChange={(e) =>
                      onUpdate({}, { policyCheckboxErrorText: e.target.value })
                    }
                    placeholder={DEFAULT_POLICY_ERROR_TEXT}
                    className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white text-zinc-800 focus:outline-[#2848F0]"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GRUPO 6: ACCIÓN DESPUÉS DE ENVIAR */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('postSubmit')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Acción Después de Enviar</span>
          </span>
          {openGroups.postSubmit ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.postSubmit && (
          <div className="p-3 space-y-3 bg-white">
            <div className="space-y-2">
              <label className="font-semibold text-zinc-800 block">
                ¿A dónde dirige el botón al enviar el correo?
              </label>

              <select
                value={activeDestination}
                onChange={(e) =>
                  handleSelectDestination(
                    e.target.value as 'next_step' | 'funnel_page' | 'url' | 'message'
                  )
                }
                className="w-full p-2 text-xs border border-zinc-300 rounded-lg bg-white text-zinc-800 font-medium focus:outline-[#2848F0]"
              >
                <option value="next_step">Siguiente paso del embudo</option>
                <option value="funnel_page">Página específica dentro del embudo</option>
                <option value="url">URL específica (enlace externo)</option>
                <option value="message">Mostrar mensaje de confirmación</option>
              </select>

              {activeDestination === 'funnel_page' && (
                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-700 block">
                    Selecciona la página del embudo:
                  </label>
                  <select
                    value={
                      postActions.targetFunnelPageId ||
                      funnelPages[0]?.id ||
                      ''
                    }
                    onChange={(e) =>
                      updatePostActions({
                        goToFunnelPage: true,
                        targetFunnelPageId: e.target.value,
                      })
                    }
                    className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0]"
                  >
                    {funnelPages.length === 0 ? (
                      <option value="">Sin páginas adicionales</option>
                    ) : (
                      funnelPages.map((pg, idx) => (
                        <option key={pg.id} value={pg.id}>
                          Paso {idx + 1}: {pg.title || pg.page_type}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {activeDestination === 'url' && (
                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-700 block">
                    URL de destino:
                  </label>
                  <input
                    type="url"
                    value={postActions.redirectUrl}
                    onChange={(e) =>
                      updatePostActions({ redirectUrl: e.target.value })
                    }
                    placeholder="https://tusitio.com/oferta"
                    className="w-full p-2 text-xs border border-zinc-300 rounded bg-white font-mono focus:outline-[#2848F0]"
                  />
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postActions.redirectOpenNewTab}
                      onChange={(e) =>
                        updatePostActions({ redirectOpenNewTab: e.target.checked })
                      }
                      className="accent-[#2848F0] rounded"
                    />
                    <span>Abrir enlace en una nueva pestaña</span>
                  </label>
                </div>
              )}

              {activeDestination === 'message' && (
                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-700 block">
                    Mensaje de confirmación:
                  </label>
                  <input
                    type="text"
                    value={
                      element.content.formSuccessMessage ??
                      '¡Gracias! Hemos recibido tu correo correctamente.'
                    }
                    onChange={(e) =>
                      onUpdate({}, { formSuccessMessage: e.target.value })
                    }
                    className="w-full p-2 text-xs border border-zinc-300 rounded bg-white focus:outline-[#2848F0]"
                  />
                </div>
              )}
            </div>

            <div className="p-2.5 border border-zinc-200 rounded-lg bg-zinc-50/50">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-800 block">
                    Añadir al CRM
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Guarda el correo automáticamente como contacto en el CRM
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={postActions.addToCrm}
                  onChange={(e) =>
                    updatePostActions({ addToCrm: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#2848F0] rounded cursor-pointer shrink-0 ml-2"
                />
              </label>
            </div>

            <div className="p-2.5 border border-zinc-200 rounded-lg bg-zinc-50/50 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-800 block">
                    Email Marketing
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Sincroniza con proveedores externos y asigna lista o etiqueta
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={postActions.sendToEmailMarketing}
                  onChange={(e) =>
                    updatePostActions({ sendToEmailMarketing: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#2848F0] rounded cursor-pointer shrink-0 ml-2"
                />
              </label>

              {postActions.sendToEmailMarketing && (
                <div className="pt-2 border-t border-zinc-200 space-y-2">
                  {EMAIL_MARKETING_PROVIDERS.map((prov) => {
                    const target = postActions.emailTargets.find(
                      (t) => t.provider === prov.id
                    ) || {
                      provider: prov.id,
                      enabled: false,
                      listOrTag: '',
                    };
                    const integ = integrations.find((i) => i.provider === prov.id);
                    const isConnected = integ?.status === 'connected';

                    return (
                      <div
                        key={prov.id}
                        className={`p-2 rounded-lg border transition-colors ${
                          target.enabled
                            ? 'bg-white border-[#2848F0]/60'
                            : 'bg-white border-zinc-200'
                        }`}
                      >
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: prov.accent }}
                            />
                            <span className="font-semibold text-zinc-800 truncate">
                              {prov.name}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              · {isConnected ? 'Conectado' : 'Disponible'}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={target.enabled}
                            onChange={(e) => {
                              const nextTargets = postActions.emailTargets.map((t) =>
                                t.provider === prov.id
                                  ? {
                                      ...t,
                                      enabled: e.target.checked,
                                      listOrTag:
                                        t.listOrTag || integ?.list_name || '',
                                    }
                                  : t
                              );
                              updatePostActions({ emailTargets: nextTargets });
                            }}
                            className="w-3.5 h-3.5 accent-[#2848F0] rounded cursor-pointer shrink-0"
                          />
                        </label>

                        {target.enabled && (
                          <div className="mt-2">
                            <label className="text-[10px] font-medium text-zinc-500 block mb-1">
                              Lista o Etiqueta (Tag):
                            </label>
                            <input
                              type="text"
                              value={target.listOrTag}
                              onChange={(e) => {
                                const nextTargets = postActions.emailTargets.map(
                                  (t) =>
                                    t.provider === prov.id
                                      ? { ...t, listOrTag: e.target.value }
                                      : t
                                );
                                updatePostActions({ emailTargets: nextTargets });
                              }}
                              placeholder={prov.placeholder}
                              className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* GRUPO 7: DISPOSICIÓN EXTERIOR */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('disposition')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Disposición</span>
          </span>
          {openGroups.disposition ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.disposition && (
          <div className="p-3 bg-white">
            <BoxModelSpacingControl
              marginTop={element.styles.marginTop ?? 0}
              marginRight={element.styles.marginRight ?? 0}
              marginBottom={element.styles.marginBottom ?? 20}
              marginLeft={element.styles.marginLeft ?? 0}
              paddingTop={element.styles.paddingTop ?? 0}
              paddingRight={element.styles.paddingRight ?? 0}
              paddingBottom={element.styles.paddingBottom ?? 0}
              paddingLeft={element.styles.paddingLeft ?? 0}
              onChangeMargin={(margins) => onUpdate(margins)}
              onChangePadding={(paddings) => onUpdate(paddings)}
              showPadding
            />
          </div>
        )}
      </div>
    </div>
  );
};
