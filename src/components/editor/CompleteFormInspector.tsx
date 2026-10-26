import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  List,
  MousePointerClick,
  CheckSquare,
  Zap,
  Layout,
  ChevronDown,
  ChevronRight,
  Copy,
  X,
  Plus,
  GripVertical,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Monitor,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  AVAILABLE_FONTS,
  CompleteFormButtonStyles,
  CompleteFormColumnWidth,
  CompleteFormFieldItem,
  CompleteFormFieldType,
  CompleteFormGlobalFieldStyle,
  CompleteFormInputSize,
  CompleteFormPostSubmitActions,
  ElementStyles,
  FunnelPageGlobalSettings,
  PageBlockElement,
} from '../../types';
import { useApp } from '../../context/AppContext';
import { NumberControl, InlineSliderInput } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import {
  CTA_FORM_BUTTON_ICONS,
  createDefaultFormButtonStyles,
  createDefaultGlobalFieldStyle,
  DEFAULT_EMAIL_PLACEHOLDER,
  DEFAULT_POLICY_ERROR_TEXT,
  DEFAULT_POLICY_HTML,
  DEFAULT_SELECT_PLACEHOLDER,
  EMAIL_MARKETING_PROVIDERS,
  getDefaultPlaceholderForField,
  getResolvedFieldStyle,
  getResolvedFormButtonStyles,
  getResolvedGlobalFieldStyle,
  getResolvedPostSubmitActions,
  isDefaultOrLegacyPlaceholder,
  normalizeCompleteFormFields,
  sanitizePolicyHtml,
} from '../../utils/completeFormUtils';

interface CompleteFormInspectorProps {
  element: PageBlockElement;
  pageSettings: FunnelPageGlobalSettings;
  onUpdate: (
    updatedStyles: Partial<ElementStyles>,
    updatedContent?: Partial<PageBlockElement['content']>
  ) => void;
}

const FIELD_TYPE_LABELS: Record<CompleteFormFieldType, string> = {
  text: 'Texto',
  email: 'Email',
  textarea: 'Text Area',
  tel: 'Teléfono',
  whatsapp: 'WhatsApp',
  select: 'Select',
  radio: 'Radio',
  checkbox: 'Checkbox',
};

const MULTI_OPTION_TYPES: CompleteFormFieldType[] = ['select', 'radio', 'checkbox'];

export const CompleteFormInspector: React.FC<CompleteFormInspectorProps> = ({
  element,
  pageSettings,
  onUpdate,
}) => {
  const { integrations, showToast } = useApp();

  // All 6 groups open by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    formName: true,
    formFields: true,
    formButton: true,
    policyCheckbox: true,
    postSubmit: true,
    disposition: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Expanded field item + internal tab ('content' | 'style')
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [fieldTabMap, setFieldTabMap] = useState<Record<string, 'content' | 'style'>>({});

  // Drag-and-drop field reordering state
  const [draggedFieldIdx, setDraggedFieldIdx] = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    index: number;
    position: 'before' | 'after';
  } | null>(null);

  // Button color state tab ('normal' | 'hover')
  const [btnColorTab, setBtnColorTab] = useState<'normal' | 'hover'>('normal');
  const [showIconGrid, setShowIconGrid] = useState<boolean>(false);

  // Rich policy text editor refs & link popover state
  const policyEditorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrlDraft, setLinkUrlDraft] = useState('https://');

  const fields = normalizeCompleteFormFields(element.content);
  const emailFieldsCount = fields.filter((f) => f.type === 'email').length;
  const globalFieldStyle = getResolvedGlobalFieldStyle(
    element.content,
    pageSettings.bodyFontFamily || 'Inter'
  );
  const btnStyles = getResolvedFormButtonStyles(
    element,
    pageSettings.primaryColor || '#2848F0',
    pageSettings.bodyFontFamily || 'Poppins'
  );
  const postActions = getResolvedPostSubmitActions(element.content);

  const policyHtml = element.content.policyCheckboxHtml || DEFAULT_POLICY_HTML;

  // Keep rich policy editor synced when switching selected form element
  useEffect(() => {
    if (policyEditorRef.current) {
      const currentSanitized = sanitizePolicyHtml(policyHtml);
      if (policyEditorRef.current.innerHTML !== currentSanitized) {
        policyEditorRef.current.innerHTML = currentSanitized;
      }
    }
  }, [element.id, element.content.policyCheckboxEnabled]);

  const updateFields = (nextFields: CompleteFormFieldItem[]) => {
    onUpdate({}, { formFields: nextFields });
  };

  const updateSingleField = (
    fieldId: string,
    patch: Partial<CompleteFormFieldItem>
  ) => {
    const next = fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f));
    updateFields(next);
  };

  const handleFieldStyleChange = (
    field: CompleteFormFieldItem,
    patch: Partial<CompleteFormGlobalFieldStyle>
  ) => {
    if (field.styleOverride?.enabled) {
      updateSingleField(field.id, {
        styleOverride: {
          ...field.styleOverride,
          enabled: true,
          ...patch,
        },
      });
    } else {
      onUpdate(
        {},
        {
          formFieldStyles: {
            ...(element.content.formFieldStyles || {}),
            ...patch,
          },
        }
      );
    }
  };

  const updateButtonStyles = (patch: Partial<CompleteFormButtonStyles>) => {
    const merged: CompleteFormButtonStyles = {
      ...(element.content.formButtonStyles || {}),
      ...patch,
    };
    const legacyPatch: Partial<PageBlockElement['content']> = {
      formButtonStyles: merged,
    };
    if (patch.text !== undefined) legacyPatch.submitButtonText = patch.text;
    if (patch.bgColor !== undefined) legacyPatch.submitButtonBg = patch.bgColor;
    if (patch.textColor !== undefined) legacyPatch.submitButtonTextColor = patch.textColor;
    onUpdate({}, legacyPatch);
  };

  const handleResetFieldStyles = () => {
    const defaultStyles = createDefaultGlobalFieldStyle(
      pageSettings.bodyFontFamily || 'Inter'
    );
    const cleanedFields = fields.map((f) => ({
      ...f,
      styleOverride: undefined,
    }));
    onUpdate(
      {},
      {
        formFieldStyles: defaultStyles,
        formFields: cleanedFields,
        formInputSize: 'md',
        formRowsGap: 14,
      }
    );
    showToast('Estilos de los campos restaurados por defecto');
  };

  const handleResetButtonStyles = () => {
    const defaultBtn = createDefaultFormButtonStyles(
      btnStyles.text,
      btnStyles.subtext,
      pageSettings.primaryColor || '#2848F0',
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

  // Drag-and-drop handlers for field items
  const handleFieldDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedFieldIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(idx));
    } catch {
      // ignore
    }
  };

  const handleFieldDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedFieldIdx === null || draggedFieldIdx === idx) {
      setDropIndicator(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';
    setDropIndicator({ index: idx, position });
  };

  const handleFieldDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedFieldIdx === null || draggedFieldIdx === targetIdx) {
      setDraggedFieldIdx(null);
      setDropIndicator(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const insertAfter = e.clientY >= rect.top + rect.height / 2;

    const next = [...fields];
    const [moved] = next.splice(draggedFieldIdx, 1);
    let destIdx = targetIdx;
    if (draggedFieldIdx < targetIdx) {
      destIdx = insertAfter ? targetIdx : targetIdx - 1;
    } else {
      destIdx = insertAfter ? targetIdx + 1 : targetIdx;
    }
    destIdx = Math.max(0, Math.min(next.length, destIdx));
    next.splice(destIdx, 0, moved);

    updateFields(next);
    setDraggedFieldIdx(null);
    setDropIndicator(null);
  };

  const handleAddField = () => {
    const newId = `fld_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newField: CompleteFormFieldItem = {
      id: newId,
      type: 'text',
      label: `Nuevo campo ${fields.length + 1}`,
      placeholder: 'Escribe aquí...',
      required: false,
      columnWidth: '100',
    };
    updateFields([...fields, newField]);
    setExpandedFieldId(newId);
    setFieldTabMap((prev) => ({ ...prev, [newId]: 'content' }));
  };

  const handleDuplicateField = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const source = fields[idx];
    const copyId = `fld_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const duplicated: CompleteFormFieldItem = {
      ...source,
      id: copyId,
      label: `${source.label} (copia)`,
      styleOverride: source.styleOverride ? { ...source.styleOverride } : undefined,
    };
    const next = [...fields];
    next.splice(idx + 1, 0, duplicated);
    updateFields(next);
    setExpandedFieldId(copyId);
  };

  const handleRemoveField = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const target = fields[idx];
    if (!target) return;
    if (target.type === 'email' && emailFieldsCount <= 1) {
      return;
    }
    const next = fields.filter((_, i) => i !== idx);
    updateFields(next);
    if (expandedFieldId === target.id) {
      setExpandedFieldId(null);
    }
  };

  // Rich Policy Editor formatting commands
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
      // If no text was selected, insert a link at cursor/end
      const anchorHtml = `<a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">ver políticas</a>`;
      document.execCommand('insertHTML', false, anchorHtml);
    }

    commitPolicyEditorHtml();
    // Normalize innerHTML links right away so target="_blank" & underline appear in editor
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

  const showLabels = element.content.formShowLabels !== false;
  const showReqMark = element.content.formShowRequiredMark !== false;
  const inputSize: CompleteFormInputSize = element.content.formInputSize || 'md';
  const rowsGap = element.content.formRowsGap ?? 14;
  const policyEnabled = Boolean(element.content.policyCheckboxEnabled);

  return (
    <div className="space-y-3 text-xs font-['Inter']">
      {/* ===================================================================== */}
      {/* GRUPO 1: NOMBRE DEL FORMULARIO                                        */}
      {/* ===================================================================== */}
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
                value={element.content.formName ?? 'Formulario Principal'}
                onChange={(e) => onUpdate({}, { formName: e.target.value })}
                placeholder="Ej. Registro Masterclass"
                className="flex-1 min-w-0 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md bg-white text-zinc-800 focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* GRUPO 2: CAMPOS DEL FORMULARIO                                        */}
      {/* ===================================================================== */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => toggleGroup('formFields')}
          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <List className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Campos del formulario</span>
          </span>
          {openGroups.formFields ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openGroups.formFields && (
          <div className="p-3 space-y-3 bg-white">
            {/* Lista vertical de campos (con drag & drop, copiar y eliminar) */}
            <div className="space-y-2">
              {fields.map((field, idx) => {
                const isExpanded = expandedFieldId === field.id;
                const activeTab = fieldTabMap[field.id] || 'content';
                const resolvedStyle = getResolvedFieldStyle(field, globalFieldStyle);
                const isCustomStyle = Boolean(field.styleOverride?.enabled);
                const isEmailField = field.type === 'email';
                const isOnlyEmailField = isEmailField && emailFieldsCount <= 1;
                const isRequiredEffective = isEmailField ? true : Boolean(field.required);
                const showDropBefore =
                  dropIndicator?.index === idx && dropIndicator.position === 'before';
                const showDropAfter =
                  dropIndicator?.index === idx && dropIndicator.position === 'after';

                return (
                  <div
                    key={field.id}
                    onDragOver={(e) => handleFieldDragOver(e, idx)}
                    onDrop={(e) => handleFieldDrop(e, idx)}
                    onDragEnd={() => {
                      setDraggedFieldIdx(null);
                      setDropIndicator(null);
                    }}
                    className="relative"
                  >
                    {showDropBefore && (
                      <div className="absolute -top-1.5 left-0 right-0 h-0.5 bg-[#2848F0] rounded-full z-20 pointer-events-none" />
                    )}

                    <div
                      className={`border transition-colors bg-white ${
                        isExpanded
                          ? 'border-zinc-400 shadow-2xs'
                          : 'border-zinc-300 hover:border-zinc-400'
                      } ${draggedFieldIdx === idx ? 'opacity-50' : ''}`}
                    >
                      {/* Cabecera del ítem de campo (estilo limpio tipo imagen 1/2/3) */}
                      <div
                        draggable
                        onDragStart={(e) => handleFieldDragStart(e, idx)}
                        onClick={() =>
                          setExpandedFieldId((curr) => (curr === field.id ? null : field.id))
                        }
                        className="flex items-stretch min-h-[38px] cursor-pointer select-none bg-white hover:bg-zinc-50/70"
                      >
                        <div
                          className="flex items-center px-2 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing"
                          title="Arrastrar para cambiar orden"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0 flex items-center justify-between pr-2 py-2">
                          <span className="text-xs font-medium text-zinc-800 truncate">
                            {field.label || FIELD_TYPE_LABELS[field.type]}
                            {isRequiredEffective && (
                              <span className="text-red-500 ml-0.5">*</span>
                            )}
                          </span>
                          <span className="text-[10px] text-zinc-400 ml-2 shrink-0">
                            {FIELD_TYPE_LABELS[field.type]}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDuplicateField(e, idx)}
                          className="w-9 border-l border-zinc-300 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                          title="Duplicar campo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleRemoveField(e, idx)}
                          disabled={fields.length <= 1 || isOnlyEmailField}
                          className="w-9 border-l border-zinc-300 flex items-center justify-center text-zinc-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                          title={
                            isOnlyEmailField
                              ? 'El campo Email es obligatorio y no puede faltar en el formulario'
                              : fields.length <= 1
                              ? 'Debe existir al menos un campo'
                              : 'Eliminar campo'
                          }
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Panel interno propio del campo al seleccionarlo */}
                      {isExpanded && (
                        <div className="border-t border-zinc-200 p-3 space-y-3 bg-white">
                          {/* Pestañas Contenido / Estilo */}
                          <div className="grid grid-cols-2 border border-zinc-300 rounded overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                setFieldTabMap((prev) => ({
                                  ...prev,
                                  [field.id]: 'content',
                                }))
                              }
                              className={`py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                activeTab === 'content'
                                  ? 'bg-zinc-200/90 text-zinc-900'
                                  : 'bg-white text-zinc-600 hover:bg-zinc-50'
                              }`}
                            >
                              Contenido
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFieldTabMap((prev) => ({
                                  ...prev,
                                  [field.id]: 'style',
                                }))
                              }
                              className={`py-1.5 text-xs font-semibold border-l border-zinc-300 transition-colors cursor-pointer ${
                                activeTab === 'style'
                                  ? 'bg-zinc-200/90 text-zinc-900'
                                  : 'bg-white text-zinc-600 hover:bg-zinc-50'
                              }`}
                            >
                              Estilo
                            </button>
                          </div>

                          {activeTab === 'content' ? (
                            <div className="space-y-2.5">
                              {/* Tipo de campo */}
                              <div className="space-y-1">
                                <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                                  <label className="text-zinc-600 font-medium">Tipo</label>
                                  <select
                                    value={field.type}
                                    disabled={isOnlyEmailField}
                                    onChange={(e) => {
                                      const nextType = e.target.value as CompleteFormFieldType;
                                      if (isOnlyEmailField && nextType !== 'email') return;

                                      const patch: Partial<CompleteFormFieldItem> = {
                                        type: nextType,
                                      };

                                      if (nextType === 'email') {
                                        patch.required = true;
                                        if (
                                          isDefaultOrLegacyPlaceholder(field.placeholder) ||
                                          MULTI_OPTION_TYPES.includes(field.type)
                                        ) {
                                          patch.placeholder = DEFAULT_EMAIL_PLACEHOLDER;
                                        }
                                      } else {
                                        if (field.type === 'email') {
                                          patch.required = false;
                                        }
                                        if (nextType === 'select') {
                                          if (!field.optionsText) {
                                            patch.optionsText = 'Opción 1\nOpción 2\nOpción 3';
                                          }
                                          if (
                                            field.type !== 'select' ||
                                            isDefaultOrLegacyPlaceholder(field.placeholder)
                                          ) {
                                            patch.placeholder = DEFAULT_SELECT_PLACEHOLDER;
                                          }
                                        } else if (
                                          nextType === 'radio' ||
                                          nextType === 'checkbox'
                                        ) {
                                          if (!field.optionsText) {
                                            patch.optionsText = 'Opción 1\nOpción 2\nOpción 3';
                                          }
                                          patch.placeholder = '';
                                        } else {
                                          if (
                                            isDefaultOrLegacyPlaceholder(field.placeholder) ||
                                            MULTI_OPTION_TYPES.includes(field.type) ||
                                            field.type === 'email'
                                          ) {
                                            patch.placeholder = getDefaultPlaceholderForField(
                                              nextType,
                                              field.label
                                            );
                                          }
                                        }
                                      }

                                      updateSingleField(field.id, patch);
                                    }}
                                    className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0] disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed"
                                  >
                                    <option value="text">Texto</option>
                                    <option value="email">Email</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="tel">Teléfono</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="select">Select</option>
                                    <option value="radio">Radio</option>
                                    <option value="checkbox">Checkbox</option>
                                  </select>
                                </div>
                                {isOnlyEmailField && (
                                  <p className="text-[10px] text-zinc-500 leading-tight">
                                    El campo Email es indispensable en todo formulario.
                                  </p>
                                )}
                              </div>

                              {/* Label */}
                              <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                                <label className="text-zinc-600 font-medium">Label</label>
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) =>
                                    updateSingleField(field.id, { label: e.target.value })
                                  }
                                  placeholder="Etiqueta del campo"
                                  className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0]"
                                />
                              </div>

                              {/* Placeholder (para tipos con entrada o select) */}
                              {field.type !== 'radio' && field.type !== 'checkbox' && (
                                <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                                  <label className="text-zinc-600 font-medium">Placeholder</label>
                                  <input
                                    type="text"
                                    value={
                                      field.placeholder !== undefined
                                        ? field.placeholder
                                        : getDefaultPlaceholderForField(field.type, field.label)
                                    }
                                    onChange={(e) =>
                                      updateSingleField(field.id, {
                                        placeholder: e.target.value,
                                      })
                                    }
                                    placeholder={getDefaultPlaceholderForField(
                                      field.type,
                                      field.label
                                    )}
                                    className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0]"
                                  />
                                </div>
                              )}

                              {/* Requerido */}
                              <div className="flex items-center justify-between py-0.5">
                                <div className="flex flex-col">
                                  <span className="text-zinc-600 font-medium">Requerido</span>
                                  {isEmailField && (
                                    <span className="text-[10px] text-[#2848F0] font-medium">
                                      Obligatorio fijo
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  disabled={isEmailField}
                                  onClick={() => {
                                    if (isEmailField) return;
                                    updateSingleField(field.id, {
                                      required: !field.required,
                                    });
                                  }}
                                  title={
                                    isEmailField
                                      ? 'El campo Email siempre es requerido sí o sí'
                                      : 'Alternar si este campo es obligatorio'
                                  }
                                  className={`relative inline-flex items-center h-6 w-14 rounded-full transition-colors px-1 ${
                                    isRequiredEffective ? 'bg-[#2848F0]' : 'bg-zinc-300'
                                  } ${
                                    isEmailField
                                      ? 'opacity-90 cursor-not-allowed'
                                      : 'cursor-pointer'
                                  }`}
                                >
                                  <span
                                    className={`text-[10px] font-bold w-full text-center ${
                                      isRequiredEffective
                                        ? 'text-white pr-4'
                                        : 'text-zinc-700 pl-4'
                                    }`}
                                  >
                                    {isRequiredEffective ? 'Sí' : 'No'}
                                  </span>
                                  <span
                                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                                      isRequiredEffective ? 'right-0.5' : 'left-0.5'
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Opciones múltiples para Select, Radio o Checkbox (como en imagen 3) */}
                              {MULTI_OPTION_TYPES.includes(field.type) && (
                                <div className="space-y-1.5 pt-1 border-t border-zinc-100">
                                  <label className="text-zinc-700 font-medium block">
                                    Opciones
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={
                                      field.optionsText ?? 'Opción 1\nOpción 2\nOpción 3'
                                    }
                                    onChange={(e) =>
                                      updateSingleField(field.id, {
                                        optionsText: e.target.value,
                                      })
                                    }
                                    placeholder={'Opción 1\nOpción 2\nOpción 3'}
                                    className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0] leading-relaxed"
                                  />
                                  <p className="text-[11px] italic text-zinc-500 leading-snug">
                                    Escribe cada opción en una línea separada. Para diferenciar
                                    etiqueta y valor usa el carácter pleca (&quot;|&quot;), ej:{' '}
                                    <span className="font-mono not-italic">
                                      Opción A|opcion_a
                                    </span>
                                  </p>
                                </div>
                              )}

                              {/* Ancho de columna */}
                              <div className="grid grid-cols-[115px_1fr] items-center gap-2 pt-1">
                                <label className="text-zinc-600 font-medium flex items-center gap-1">
                                  <span>Ancho columna</span>
                                  <Monitor className="w-3 h-3 text-zinc-400" />
                                </label>
                                <select
                                  value={field.columnWidth || '100'}
                                  onChange={(e) =>
                                    updateSingleField(field.id, {
                                      columnWidth: e.target.value as CompleteFormColumnWidth,
                                    })
                                  }
                                  className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0]"
                                >
                                  <option value="100">100%</option>
                                  <option value="75">75%</option>
                                  <option value="66">66%</option>
                                  <option value="50">50%</option>
                                  <option value="33">33%</option>
                                  <option value="25">25%</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            /* Pestaña ESTILO del campo */
                            <div className="space-y-3">
                              {/* Selector: estilo compartido vs ajuste individual */}
                              <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold text-zinc-700">
                                    Personalizar solo este campo:
                                  </span>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isCustomStyle}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          updateSingleField(field.id, {
                                            styleOverride: {
                                              ...globalFieldStyle,
                                              ...(field.styleOverride || {}),
                                              enabled: true,
                                            },
                                          });
                                        } else {
                                          updateSingleField(field.id, {
                                            styleOverride: {
                                              ...(field.styleOverride || {}),
                                              enabled: false,
                                            },
                                          });
                                        }
                                      }}
                                      className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-zinc-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2848F0]" />
                                  </label>
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                  {isCustomStyle
                                    ? 'Editando únicamente este campo.'
                                    : 'Aplicando estilo compartido a todos los campos del formulario.'}
                                </p>
                              </div>

                              {/* Fuente del campo */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1">
                                  Fuente del campo:
                                </label>
                                <select
                                  value={resolvedStyle.fontFamily}
                                  onChange={(e) =>
                                    handleFieldStyleChange(field, {
                                      fontFamily: e.target.value,
                                    })
                                  }
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
                                value={resolvedStyle.fontSize}
                                min={10}
                                max={28}
                                onChange={(val) =>
                                  handleFieldStyleChange(field, { fontSize: val })
                                }
                              />

                              {/* Formato Negrita / Cursiva */}
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-zinc-700">Formato:</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleFieldStyleChange(field, {
                                        isBold: !resolvedStyle.isBold,
                                      })
                                    }
                                    className={`p-1.5 px-2.5 rounded border cursor-pointer transition-colors ${
                                      resolvedStyle.isBold
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
                                      handleFieldStyleChange(field, {
                                        isItalic: !resolvedStyle.isItalic,
                                      })
                                    }
                                    className={`p-1.5 px-2.5 rounded border cursor-pointer transition-colors ${
                                      resolvedStyle.isItalic
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
                                value={resolvedStyle.textColor}
                                onChange={(val) =>
                                  handleFieldStyleChange(field, { textColor: val })
                                }
                              />

                              <HexColorPicker
                                label="Color de Label:"
                                value={resolvedStyle.labelColor}
                                onChange={(val) =>
                                  handleFieldStyleChange(field, { labelColor: val })
                                }
                              />

                              <HexColorPicker
                                label="Color de fondo:"
                                value={resolvedStyle.bgColor}
                                onChange={(val) =>
                                  handleFieldStyleChange(field, { bgColor: val })
                                }
                              />

                              <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                                <NumberControl
                                  label="Espesor de borde"
                                  value={resolvedStyle.borderWidth}
                                  min={0}
                                  max={10}
                                  onChange={(val) =>
                                    handleFieldStyleChange(field, { borderWidth: val })
                                  }
                                />

                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-zinc-700">
                                    Tipo de borde:
                                  </span>
                                  <select
                                    value={resolvedStyle.borderStyle}
                                    onChange={(e) =>
                                      handleFieldStyleChange(field, {
                                        borderStyle: e.target.value as
                                          | 'solid'
                                          | 'dashed'
                                          | 'dotted',
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
                                  value={resolvedStyle.borderColor}
                                  onChange={(val) =>
                                    handleFieldStyleChange(field, { borderColor: val })
                                  }
                                />

                                <NumberControl
                                  label="Radio del campo (Redondeo)"
                                  value={resolvedStyle.borderRadius}
                                  min={0}
                                  max={40}
                                  onChange={(val) =>
                                    handleFieldStyleChange(field, { borderRadius: val })
                                  }
                                />

                                <div className="pt-2 border-t border-zinc-100">
                                  <button
                                    type="button"
                                    onClick={handleResetFieldStyles}
                                    className="w-full py-2 px-3 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                                    <span>Restaurar estilos de los campos</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {showDropAfter && (
                      <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#2848F0] rounded-full z-20 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botón + Añadir campo */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleAddField}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white font-semibold text-xs rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Añadir campo</span>
              </button>
            </div>

            {/* Controles globales debajo de + Añadir campo (como imagen 1 y Rows Gap) */}
            <div className="pt-3 border-t border-zinc-200 space-y-3">
              {/* Espaciado entre filas (Rows Gap) */}
              <InlineSliderInput
                label="Espaciado entre filas"
                value={rowsGap}
                min={0}
                max={48}
                step={1}
                unit="px"
                onChange={(val) => onUpdate({}, { formRowsGap: val })}
              />

              <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                <label className="text-zinc-600 font-medium">Tamaño de campo</label>
                <select
                  value={inputSize}
                  onChange={(e) =>
                    onUpdate(
                      {},
                      { formInputSize: e.target.value as CompleteFormInputSize }
                    )
                  }
                  className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-[#2848F0]"
                >
                  <option value="xs">Extra Pequeño</option>
                  <option value="sm">Pequeño</option>
                  <option value="md">Mediano</option>
                  <option value="lg">Grande</option>
                </select>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-medium">Label</span>
                  <button
                    type="button"
                    onClick={() => onUpdate({}, { formShowLabels: !showLabels })}
                    className={`relative inline-flex items-center h-6 w-20 rounded-full transition-colors cursor-pointer px-1.5 ${
                      showLabels ? 'bg-[#2848F0]' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold w-full text-center ${
                        showLabels ? 'text-white pr-4' : 'text-zinc-700 pl-4'
                      }`}
                    >
                      {showLabels ? 'Mostrar' : 'Ocultar'}
                    </span>
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        showLabels ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-medium">Marca de requerido</span>
                  <button
                    type="button"
                    onClick={() => onUpdate({}, { formShowRequiredMark: !showReqMark })}
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
              </div>

              {/* Botón para restaurar todos los estilos de los campos por defecto */}
              <div className="pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handleResetFieldStyles}
                  className="w-full py-2 px-3 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Restaurar estilos de los campos</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* GRUPO 3: BOTÓN DEL FORMULARIO (100% PARIDAD CON BOTÓN NORMAL)          */}
      {/* ===================================================================== */}
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
            {/* Texto y subtexto */}
            <div className="space-y-2">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Texto del botón:
                </label>
                <input
                  type="text"
                  value={btnStyles.text}
                  onChange={(e) => updateButtonStyles({ text: e.target.value })}
                  placeholder="Enviar Información"
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
                  placeholder="Ej. Respuesta inmediata"
                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <NumberControl
                  label="Relleno vertical"
                  value={btnStyles.paddingY}
                  min={0}
                  max={40}
                  onChange={(val) => updateButtonStyles({ paddingY: val })}
                />
                <NumberControl
                  label="Relleno horizontal"
                  value={btnStyles.paddingX}
                  min={0}
                  max={64}
                  onChange={(val) => updateButtonStyles({ paddingX: val })}
                />
              </div>
            </div>

            {/* Selector de Icono del Botón */}
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
                    max={48}
                    onChange={(val) => updateButtonStyles({ iconSize: val })}
                  />

                  <NumberControl
                    label="Espaciado icono y texto"
                    value={btnStyles.iconSpacing}
                    min={0}
                    max={32}
                    onChange={(val) => updateButtonStyles({ iconSpacing: val })}
                  />
                </div>
              )}
            </div>

            {/* Tipografía y Formato del Botón */}
            <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
              <div className="text-[11px] font-bold text-zinc-800">
                Tipografía y Formato
              </div>

              <NumberControl
                label="Tamaño de fuente"
                value={btnStyles.fontSize}
                min={10}
                max={48}
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

              <div>
                <label className="font-semibold text-zinc-700 block mb-1.5">
                  Alineación:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={() => updateButtonStyles({ align: 'left', fullWidth: false })}
                    className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                      !btnStyles.fullWidth && btnStyles.align === 'left'
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Izquierda</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateButtonStyles({ align: 'center', fullWidth: false })
                    }
                    className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                      !btnStyles.fullWidth && btnStyles.align === 'center'
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Centro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateButtonStyles({ align: 'right', fullWidth: false })}
                    className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                      !btnStyles.fullWidth && btnStyles.align === 'right'
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>Derecha</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateButtonStyles({ align: 'center', fullWidth: true })
                    }
                    className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                      btnStyles.fullWidth
                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Completo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Color y Fondo del Botón (Normal / Al pasar el cursor) */}
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

            {/* Borde y Redondeo del Botón (0px por defecto) */}
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

              {/* Botón para restaurar todos los estilos del botón por defecto */}
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

      {/* ===================================================================== */}
      {/* GRUPO 4: CHECKBOX DE POLÍTICAS (OBLIGATORIO + ENLACES EN PALABRAS)     */}
      {/* ===================================================================== */}
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
            {/* Switch activar / desactivar */}
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
                    usuario la marque antes de enviar el formulario.
                  </span>
                </div>

                {/* Barra de formato rico + enlaces para palabras seleccionadas */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 block">
                    Texto de políticas (selecciona palabras para dar formato o poner
                    enlace):
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
                        title="Agregar enlace URL a las palabras seleccionadas"
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
                        title="Quitar enlace de la selección"
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

      {/* ===================================================================== */}
      {/* GRUPO 5: ACCIÓN DESPUÉS DE ENVIAR                                     */}
      {/* ===================================================================== */}
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
          <div className="p-3 space-y-2.5 bg-white">
            {/* 1. Siguiente página del embudo */}
            <div className="p-2.5 border border-zinc-200 rounded-lg bg-zinc-50/50">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-800 block">
                    Siguiente página del embudo
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Avanza automáticamente al siguiente paso del embudo
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={postActions.goToNextStep}
                  onChange={(e) =>
                    updatePostActions({ goToNextStep: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#2848F0] rounded cursor-pointer shrink-0 ml-2"
                />
              </label>
            </div>

            {/* 2. Redirección a URL */}
            <div className="p-2.5 border border-zinc-200 rounded-lg bg-zinc-50/50 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-800 block">
                    Redirección a URL
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Envía al visitante a una página externa o enlace personalizado
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={postActions.redirectToUrl}
                  onChange={(e) =>
                    updatePostActions({ redirectToUrl: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#2848F0] rounded cursor-pointer shrink-0 ml-2"
                />
              </label>

              {postActions.redirectToUrl && (
                <div className="pt-2 border-t border-zinc-200 space-y-2">
                  <input
                    type="url"
                    value={postActions.redirectUrl}
                    onChange={(e) =>
                      updatePostActions({ redirectUrl: e.target.value })
                    }
                    placeholder="https://tusitio.com/gracias"
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
            </div>

            {/* 3. Añadir al CRM */}
            <div className="p-2.5 border border-zinc-200 rounded-lg bg-zinc-50/50">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-zinc-800 block">
                    Añadir al CRM
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Guarda el contacto y todas sus respuestas en el CRM
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

            {/* 4. Email Marketing (todos los proveedores + lista/etiqueta) */}
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

            {/* Mensaje de confirmación */}
            <div className="pt-1">
              <label className="font-semibold text-zinc-700 block mb-1">
                Mensaje de confirmación al enviar:
              </label>
              <input
                type="text"
                value={
                  element.content.formSuccessMessage ??
                  '¡Gracias! Hemos recibido tus datos correctamente.'
                }
                onChange={(e) =>
                  onUpdate({}, { formSuccessMessage: e.target.value })
                }
                className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* GRUPO 6: DISPOSICIÓN (MARGEN Y RELLENO EN UNA SOLA LÍNEA)             */}
      {/* ===================================================================== */}
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
