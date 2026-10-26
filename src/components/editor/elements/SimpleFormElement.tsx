import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, MessageCircle, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  CompleteFormColumnWidth,
  CompleteFormFieldItem,
  CompleteFormInputSize,
  PageBlockElement,
} from '../../../types';
import { useApp } from '../../../context/AppContext';
import { formatCtaDisplayText } from './PopupButtonElement';
import {
  DEFAULT_POLICY_ERROR_TEXT,
  DEFAULT_SELECT_PLACEHOLDER,
  getDefaultPlaceholderForField,
  getResolvedFieldStyle,
  getResolvedFormButtonStyles,
  getResolvedGlobalFieldStyle,
  getResolvedPostSubmitActions,
  normalizeCompleteFormFields,
  parseFieldOptions,
  sanitizePolicyHtml,
} from '../../../utils/completeFormUtils';

interface SimpleFormElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  defaultPrimaryColor?: string;
  defaultFontFamily?: string;
  onSubmitSuccess?: (data: Record<string, any>) => void;
  onNextFunnelStep?: () => void;
}

const COLUMN_SPAN_CLASS: Record<CompleteFormColumnWidth, string> = {
  '100': 'col-span-12',
  '75': 'col-span-12 sm:col-span-9',
  '66': 'col-span-12 sm:col-span-8',
  '50': 'col-span-12 sm:col-span-6',
  '33': 'col-span-12 sm:col-span-4',
  '25': 'col-span-12 sm:col-span-3',
};

const INPUT_SIZE_PADDING: Record<
  CompleteFormInputSize,
  { py: number; px: number; minHeight: number }
> = {
  xs: { py: 6, px: 10, minHeight: 32 },
  sm: { py: 8, px: 12, minHeight: 38 },
  md: { py: 11, px: 14, minHeight: 44 },
  lg: { py: 14, px: 16, minHeight: 52 },
};

export const SimpleFormElement: React.FC<SimpleFormElementProps> = ({
  element,
  isEditable = false,
  defaultPrimaryColor = '#2848F0',
  defaultFontFamily = 'Inter',
  onSubmitSuccess,
  onNextFunnelStep,
}) => {
  const { submitCompleteFormLead, showToast } = useApp();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [unlockedInputs, setUnlockedInputs] = useState<Record<string, boolean>>({});
  const [openSelectFieldId, setOpenSelectFieldId] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isHoveredBtn, setIsHoveredBtn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openSelectFieldId) return;
    const handleOutsideMouseDown = (ev: MouseEvent) => {
      if (
        formContainerRef.current &&
        !formContainerRef.current.contains(ev.target as Node)
      ) {
        setOpenSelectFieldId(null);
      }
    };
    const handleEscape = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setOpenSelectFieldId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideMouseDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideMouseDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openSelectFieldId]);

  const fields = normalizeCompleteFormFields(element.content);
  const globalFieldStyle = getResolvedGlobalFieldStyle(
    element.content,
    defaultFontFamily
  );
  const btnStyles = getResolvedFormButtonStyles(
    element,
    defaultPrimaryColor,
    defaultFontFamily
  );
  const postActions = getResolvedPostSubmitActions(element.content);

  const showLabels = element.content.formShowLabels !== false;
  const showReqMark = element.content.formShowRequiredMark !== false;
  const inputSize: CompleteFormInputSize = element.content.formInputSize || 'md';
  const rowsGap = element.content.formRowsGap ?? 14;
  const sizePad = INPUT_SIZE_PADDING[inputSize] || INPUT_SIZE_PADDING.md;

  const policyEnabled = Boolean(element.content.policyCheckboxEnabled);
  const policyHtml = sanitizePolicyHtml(element.content.policyCheckboxHtml);
  const policyFontSize = element.content.policyCheckboxFontSize ?? 12;
  const policyTextColor = element.content.policyCheckboxTextColor || '#3F3F46';
  const policyErrorMessage =
    element.content.policyCheckboxErrorText?.trim() || DEFAULT_POLICY_ERROR_TEXT;

  const successMsg =
    element.content.formSuccessMessage ||
    '¡Gracias! Hemos recibido tus datos correctamente.';

  const openExternalSafeUrl = (rawUrl: string, newTab: boolean) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;
    const normalized = /^https?:\/\/|^mailto:|^tel:/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    if (newTab) {
      const anchor = document.createElement('a');
      anchor.href = normalized;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      window.location.assign(normalized);
    }
  };

  const validateBeforeSubmit = (): boolean => {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const isFieldRequired = field.type === 'email' ? true : Boolean(field.required);
      const val = formData[field.id];
      const isEmpty = Array.isArray(val)
        ? val.length === 0
        : String(val ?? '').trim() === '';

      if (isFieldRequired && isEmpty) {
        nextErrors[field.id] = `Completa el campo "${field.label}"`;
      } else if (
        field.type === 'email' &&
        !isEmpty &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())
      ) {
        nextErrors[field.id] = 'Ingresa un correo electrónico válido';
      }
    });

    setFieldErrors(nextErrors);

    // Mandatory validation for Policy Checkbox whenever enabled
    if (policyEnabled && !policyAccepted) {
      setPolicyError(policyErrorMessage);
      return false;
    }
    setPolicyError(null);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenSelectFieldId(null);

    // In editor design mode, preview policy validation if enabled & unchecked, otherwise don't submit
    if (isEditable) {
      if (policyEnabled && !policyAccepted) {
        setPolicyError(policyErrorMessage);
      } else {
        setPolicyError(null);
      }
      return;
    }

    if (!validateBeforeSubmit()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const entries = fields.map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        value: formData[f.id] ?? (f.type === 'checkbox' ? [] : ''),
      }));

      if (postActions.addToCrm || postActions.sendToEmailMarketing) {
        submitCompleteFormLead({
          formName: element.content.formName || 'Formulario Principal',
          entries,
          addToCrm: postActions.addToCrm,
          sendToEmailMarketing: postActions.sendToEmailMarketing,
          emailTargets: postActions.emailTargets,
        });
      }

      setIsSubmitting(false);

      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }

      if (postActions.goToNextStep) {
        if (onNextFunnelStep) {
          onNextFunnelStep();
        } else {
          showToast('Avanzando a la siguiente página del embudo...');
        }
      }

      if (postActions.redirectToUrl && postActions.redirectUrl.trim()) {
        openExternalSafeUrl(
          postActions.redirectUrl,
          postActions.redirectOpenNewTab
        );
        if (!postActions.redirectOpenNewTab) {
          return;
        }
      }

      if (!postActions.goToNextStep || !onNextFunnelStep) {
        setSubmitted(true);
      }
    }, 350);
  };

  // Outer container: clean and transparent, respecting outer element Margin & Padding
  const containerStyle: React.CSSProperties = isEditable
    ? {
        width: '100%',
        paddingTop: `${element.styles?.paddingTop ?? 0}px`,
        paddingBottom: `${element.styles?.paddingBottom ?? 0}px`,
        paddingLeft: `${element.styles?.paddingLeft ?? 0}px`,
        paddingRight: `${element.styles?.paddingRight ?? 0}px`,
      }
    : {
        width: '100%',
        marginTop: `${element.styles?.marginTop ?? 0}px`,
        marginBottom: `${element.styles?.marginBottom ?? 20}px`,
        marginLeft: `${element.styles?.marginLeft ?? 0}px`,
        marginRight: `${element.styles?.marginRight ?? 0}px`,
        paddingTop: `${element.styles?.paddingTop ?? 0}px`,
        paddingBottom: `${element.styles?.paddingBottom ?? 0}px`,
        paddingLeft: `${element.styles?.paddingLeft ?? 0}px`,
        paddingRight: `${element.styles?.paddingRight ?? 0}px`,
      };

  if (submitted && !isEditable) {
    return (
      <div style={containerStyle} className="w-full">
        <div className="bg-emerald-50 border border-emerald-200 p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-zinc-900 mb-1">
            {successMsg}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({});
              setPolicyAccepted(false);
              setPolicyError(null);
            }}
            className="mt-2 text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
          >
            Enviar otra respuesta
          </button>
        </div>
      </div>
    );
  }

  const unlockFieldForTyping = (fieldId: string) => {
    if (isEditable) return;
    setUnlockedInputs((prev) => (prev[fieldId] ? prev : { ...prev, [fieldId]: true }));
  };

  const renderFieldInput = (field: CompleteFormFieldItem) => {
    const fStyle = getResolvedFieldStyle(field, globalFieldStyle);
    const hasFieldError = Boolean(fieldErrors[field.id]);
    const resolvedPlaceholder =
      field.placeholder !== undefined
        ? field.placeholder
        : getDefaultPlaceholderForField(field.type, field.label);

    const sharedInputStyle: React.CSSProperties = {
      fontFamily: fStyle.fontFamily,
      fontSize: `${fStyle.fontSize}px`,
      fontWeight: fStyle.isBold ? 700 : 400,
      fontStyle: fStyle.isItalic ? 'italic' : 'normal',
      color: fStyle.textColor,
      backgroundColor: fStyle.bgColor,
      borderWidth: `${fStyle.borderWidth}px`,
      borderStyle: fStyle.borderStyle,
      borderColor: hasFieldError ? '#DC2626' : fStyle.borderColor,
      borderRadius: `${fStyle.borderRadius}px`,
      paddingTop: `${sizePad.py}px`,
      paddingBottom: `${sizePad.py}px`,
      paddingLeft: `${sizePad.px}px`,
      paddingRight: `${sizePad.px}px`,
    };

    const clearFieldError = () => {
      if (fieldErrors[field.id]) {
        setFieldErrors((prev) => {
          const copy = { ...prev };
          delete copy[field.id];
          return copy;
        });
      }
    };

    if (field.type === 'textarea') {
      return (
        <textarea
          rows={3}
          autoComplete="off"
          readOnly={isEditable || !unlockedInputs[field.id]}
          tabIndex={isEditable ? -1 : undefined}
          onMouseDown={() => unlockFieldForTyping(field.id)}
          onTouchStart={() => unlockFieldForTyping(field.id)}
          onFocus={() => unlockFieldForTyping(field.id)}
          placeholder={resolvedPlaceholder}
          value={isEditable ? '' : formData[field.id] || ''}
          onChange={(e) => {
            if (isEditable) return;
            clearFieldError();
            setFormData({ ...formData, [field.id]: e.target.value });
          }}
          style={sharedInputStyle}
          className="w-full placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#2848F0] transition-colors"
        />
      );
    }

    if (field.type === 'select') {
      const opts = parseFieldOptions(field.optionsText);
      const selectPlaceholder =
        field.placeholder !== undefined && field.placeholder.trim().length > 0
          ? field.placeholder
          : DEFAULT_SELECT_PLACEHOLDER;
      const currentVal = String(formData[field.id] ?? '');
      const selectedOpt = opts.find((o) => o.value === currentVal) || null;
      const isSelectOpen = openSelectFieldId === field.id;

      return (
        <div
          draggable={false}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="relative w-full"
        >
          <button
            type="button"
            role="combobox"
            aria-expanded={isSelectOpen}
            onMouseDown={(e) => {
              // Prevent parent canvas drag initiation while preserving click selection
              e.stopPropagation();
            }}
            onClick={() => {
              setOpenSelectFieldId((prev) => (prev === field.id ? null : field.id));
            }}
            style={{
              ...sharedInputStyle,
              minHeight: `${sizePad.minHeight}px`,
            }}
            className="w-full flex items-center justify-between gap-2 text-left focus:outline-none focus:ring-1 focus:ring-[#2848F0] transition-colors cursor-pointer"
          >
            <span
              style={selectedOpt ? { color: fStyle.textColor } : undefined}
              className={`truncate ${selectedOpt ? '' : 'text-zinc-400'}`}
            >
              {selectedOpt ? selectedOpt.label : selectPlaceholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform duration-150 ${
                isSelectOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isSelectOpen && (
            <div
              role="listbox"
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                backgroundColor: fStyle.bgColor || '#FFFFFF',
                borderColor: fStyle.borderColor || '#D4D4D8',
                borderWidth: `${Math.max(1, fStyle.borderWidth)}px`,
                borderStyle: 'solid',
                borderRadius: `${fStyle.borderRadius}px`,
                fontFamily: fStyle.fontFamily,
                fontSize: `${fStyle.fontSize}px`,
              }}
              className="absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-y-auto shadow-lg"
            >
              {/* Placeholder header / reset option */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFieldError();
                  setFormData({ ...formData, [field.id]: '' });
                  setOpenSelectFieldId(null);
                }}
                style={{
                  paddingTop: `${Math.max(7, sizePad.py - 2)}px`,
                  paddingBottom: `${Math.max(7, sizePad.py - 2)}px`,
                  paddingLeft: `${sizePad.px}px`,
                  paddingRight: `${sizePad.px}px`,
                }}
                className="w-full text-left text-zinc-400 hover:bg-zinc-100/80 border-b border-zinc-100 transition-colors cursor-pointer block truncate"
              >
                {selectPlaceholder}
              </button>

              {/* Configured options */}
              {opts.map((opt, idx) => {
                const isSelectedOpt = currentVal === opt.value;
                return (
                  <button
                    key={`${opt.value}_${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isSelectedOpt}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFieldError();
                      setFormData({ ...formData, [field.id]: opt.value });
                      setOpenSelectFieldId(null);
                    }}
                    style={{
                      color: isSelectedOpt ? '#2848F0' : fStyle.textColor,
                      fontWeight: isSelectedOpt ? 600 : fStyle.isBold ? 700 : 400,
                      fontStyle: fStyle.isItalic ? 'italic' : 'normal',
                      paddingTop: `${Math.max(8, sizePad.py - 1)}px`,
                      paddingBottom: `${Math.max(8, sizePad.py - 1)}px`,
                      paddingLeft: `${sizePad.px}px`,
                      paddingRight: `${sizePad.px}px`,
                    }}
                    className={`w-full text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelectedOpt ? 'bg-blue-50/80' : 'hover:bg-zinc-100/90'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'radio') {
      const opts = parseFieldOptions(field.optionsText);
      return (
        <div
          draggable={false}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="space-y-1.5 pt-0.5"
        >
          {opts.map((opt, idx) => {
            const checked = formData[field.id] === opt.value;
            return (
              <label
                key={`${opt.value}_${idx}`}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  fontFamily: fStyle.fontFamily,
                  fontSize: `${fStyle.fontSize}px`,
                  fontWeight: fStyle.isBold ? 700 : 400,
                  fontStyle: fStyle.isItalic ? 'italic' : 'normal',
                  color: fStyle.textColor,
                  backgroundColor: fStyle.bgColor,
                  borderWidth: `${fStyle.borderWidth}px`,
                  borderStyle: fStyle.borderStyle,
                  borderColor: hasFieldError ? '#DC2626' : fStyle.borderColor,
                  borderRadius: `${fStyle.borderRadius}px`,
                  paddingTop: `${Math.max(6, sizePad.py - 2)}px`,
                  paddingBottom: `${Math.max(6, sizePad.py - 2)}px`,
                  paddingLeft: `${sizePad.px}px`,
                  paddingRight: `${sizePad.px}px`,
                }}
                className="flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`radio_${element.id}_${field.id}`}
                  value={opt.value}
                  checked={checked}
                  onChange={() => {
                    clearFieldError();
                    setFormData({ ...formData, [field.id]: opt.value });
                  }}
                  className="accent-[#2848F0] w-4 h-4 shrink-0 cursor-pointer"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (field.type === 'checkbox') {
      const opts = parseFieldOptions(field.optionsText);
      const selectedArr: string[] = Array.isArray(formData[field.id])
        ? formData[field.id]
        : [];

      return (
        <div
          draggable={false}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="space-y-1.5 pt-0.5"
        >
          {opts.map((opt, idx) => {
            const isChecked = selectedArr.includes(opt.value);
            return (
              <label
                key={`${opt.value}_${idx}`}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  fontFamily: fStyle.fontFamily,
                  fontSize: `${fStyle.fontSize}px`,
                  fontWeight: fStyle.isBold ? 700 : 400,
                  fontStyle: fStyle.isItalic ? 'italic' : 'normal',
                  color: fStyle.textColor,
                  backgroundColor: fStyle.bgColor,
                  borderWidth: `${fStyle.borderWidth}px`,
                  borderStyle: fStyle.borderStyle,
                  borderColor: hasFieldError ? '#DC2626' : fStyle.borderColor,
                  borderRadius: `${fStyle.borderRadius}px`,
                  paddingTop: `${Math.max(6, sizePad.py - 2)}px`,
                  paddingBottom: `${Math.max(6, sizePad.py - 2)}px`,
                  paddingLeft: `${sizePad.px}px`,
                  paddingRight: `${sizePad.px}px`,
                }}
                className="flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    clearFieldError();
                    const nextArr = e.target.checked
                      ? [...selectedArr, opt.value]
                      : selectedArr.filter((v) => v !== opt.value);
                    setFormData({ ...formData, [field.id]: nextArr });
                  }}
                  className="accent-[#2848F0] w-4 h-4 shrink-0 cursor-pointer"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (field.type === 'whatsapp') {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3 pointer-events-none text-emerald-600 flex items-center">
            <MessageCircle className="w-4 h-4" />
          </span>
          <input
            type={isEditable ? 'text' : 'tel'}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            readOnly={isEditable || !unlockedInputs[field.id]}
            tabIndex={isEditable ? -1 : undefined}
            onMouseDown={() => unlockFieldForTyping(field.id)}
            onTouchStart={() => unlockFieldForTyping(field.id)}
            onFocus={() => unlockFieldForTyping(field.id)}
            placeholder={resolvedPlaceholder}
            value={isEditable ? '' : formData[field.id] || ''}
            onChange={(e) => {
              if (isEditable) return;
              clearFieldError();
              setFormData({ ...formData, [field.id]: e.target.value });
            }}
            style={{
              ...sharedInputStyle,
              paddingLeft: `${Math.max(34, sizePad.px + 20)}px`,
              minHeight: `${sizePad.minHeight}px`,
            }}
            className="w-full placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#2848F0] transition-colors"
          />
        </div>
      );
    }

    const htmlInputType = isEditable
      ? 'text'
      : field.type === 'email'
      ? 'email'
      : field.type === 'tel'
      ? 'tel'
      : 'text';

    return (
      <input
        type={htmlInputType}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        readOnly={isEditable || !unlockedInputs[field.id]}
        tabIndex={isEditable ? -1 : undefined}
        onMouseDown={() => unlockFieldForTyping(field.id)}
        onTouchStart={() => unlockFieldForTyping(field.id)}
        onFocus={() => unlockFieldForTyping(field.id)}
        placeholder={resolvedPlaceholder}
        value={isEditable ? '' : formData[field.id] || ''}
        onChange={(e) => {
          if (isEditable) return;
          clearFieldError();
          setFormData({ ...formData, [field.id]: e.target.value });
        }}
        style={{
          ...sharedInputStyle,
          minHeight: `${sizePad.minHeight}px`,
        }}
        className="w-full placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#2848F0] transition-colors"
      />
    );
  };

  // Button Icon resolution
  const BtnIconComp = btnStyles.icon
    ? ((LucideIcons as unknown as Record<
        string,
        React.ComponentType<{ style?: React.CSSProperties; className?: string }>
      >)[btnStyles.icon] || null)
    : null;

  const formattedBtnText = formatCtaDisplayText(
    btnStyles.text,
    btnStyles.textTransform
  );

  const activeBtnBg = isHoveredBtn ? btnStyles.hoverBgColor : btnStyles.bgColor;
  const activeBtnText = isHoveredBtn
    ? btnStyles.hoverTextColor
    : btnStyles.textColor;
  const activeBtnBorder = isHoveredBtn
    ? btnStyles.hoverBorderColor
    : btnStyles.borderColor;

  const buttonBackgroundCss =
    !isHoveredBtn && btnStyles.bgType === 'gradient'
      ? `linear-gradient(135deg, ${btnStyles.bgColor}, ${btnStyles.bgColor2})`
      : activeBtnBg;

  const btnWrapperJustify = btnStyles.fullWidth
    ? 'center'
    : btnStyles.align === 'left'
    ? 'flex-start'
    : btnStyles.align === 'right'
    ? 'flex-end'
    : 'center';

  return (
    <div ref={formContainerRef} style={containerStyle} className="w-full bg-transparent">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
        style={{ gap: `${rowsGap}px` }}
        className="w-full flex flex-col"
      >
        {/* Cuadrícula de campos (soporta 100%, 75%, 66%, 50%, 33%, 25%) */}
        <div
          style={{ rowGap: `${rowsGap}px`, columnGap: '12px' }}
          className="grid grid-cols-12"
        >
          {fields.map((field) => {
            const colClass =
              COLUMN_SPAN_CLASS[field.columnWidth || '100'] || 'col-span-12';
            const fStyle = getResolvedFieldStyle(field, globalFieldStyle);
            const isFieldRequired =
              field.type === 'email' ? true : Boolean(field.required);
            const isThisSelectOpen = openSelectFieldId === field.id;

            return (
              <div
                key={field.id}
                className={`${colClass} text-left space-y-1 ${
                  isThisSelectOpen ? 'relative z-40' : 'relative'
                }`}
              >
                {showLabels && field.label && (
                  <label
                    style={{
                      fontFamily: fStyle.fontFamily,
                      fontSize: `${Math.max(11, fStyle.fontSize - 1)}px`,
                      color: fStyle.labelColor,
                      fontWeight: 600,
                    }}
                    className="block leading-snug"
                  >
                    <span>{field.label}</span>
                    {isFieldRequired && showReqMark && (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>
                )}

                {renderFieldInput(field)}

                {fieldErrors[field.id] && (
                  <p className="text-[11px] font-medium text-red-600 mt-0.5">
                    {fieldErrors[field.id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Checkbox obligatorio de Políticas (encima del botón enviar) */}
        {policyEnabled && (
          <div className="space-y-1.5 text-left pt-0.5">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setPolicyAccepted(checked);
                  if (checked) {
                    setPolicyError(null);
                  }
                }}
                className={`mt-0.5 w-4 h-4 shrink-0 accent-[#2848F0] cursor-pointer ${
                  policyError ? 'ring-2 ring-red-500 ring-offset-1' : ''
                }`}
              />
              <span
                style={{
                  fontSize: `${policyFontSize}px`,
                  color: policyTextColor,
                  fontFamily: globalFieldStyle.fontFamily,
                }}
                onClick={(e) => {
                  // Allow clicking anchor links inside the policy text without toggling the checkbox in preview/public mode
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A') {
                    e.stopPropagation();
                    if (isEditable) {
                      e.preventDefault();
                    }
                  }
                }}
                className="leading-snug [&_a]:text-[#2848F0] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: policyHtml }}
              />
              {showReqMark && (
                <span className="text-red-500 text-xs font-bold leading-none mt-0.5">
                  *
                </span>
              )}
            </label>

            {policyError && (
              <div
                role="alert"
                className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-300 text-red-700 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{policyError}</span>
              </div>
            )}
          </div>
        )}

        {/* Botón de envío con 100% paridad visual con botón normal */}
        <div
          style={{ display: 'flex', justifyContent: btnWrapperJustify }}
          className="w-full pt-1"
        >
          <button
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => setIsHoveredBtn(true)}
            onMouseLeave={() => setIsHoveredBtn(false)}
            style={{
              width: btnStyles.fullWidth ? '100%' : 'auto',
              background: buttonBackgroundCss,
              color: activeBtnText,
              fontFamily: btnStyles.fontFamily,
              fontSize: `${btnStyles.fontSize}px`,
              fontWeight: btnStyles.isBold ? 700 : 500,
              fontStyle: btnStyles.isItalic ? 'italic' : 'normal',
              textDecoration: btnStyles.isUnderline ? 'underline' : 'none',
              paddingTop: `${btnStyles.paddingY}px`,
              paddingBottom: `${btnStyles.paddingY}px`,
              paddingLeft: `${btnStyles.paddingX}px`,
              paddingRight: `${btnStyles.paddingX}px`,
              borderWidth: `${btnStyles.borderWidth}px`,
              borderStyle: btnStyles.borderWidth > 0 ? btnStyles.borderStyle : 'none',
              borderColor:
                btnStyles.borderWidth > 0 ? activeBtnBorder : 'transparent',
              borderRadius: `${btnStyles.borderRadius}px`,
            }}
            className="inline-flex flex-col items-center justify-center transition-all cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
              <>
                <span
                  style={{ gap: `${btnStyles.iconSpacing}px` }}
                  className="inline-flex items-center justify-center"
                >
                  {BtnIconComp && btnStyles.iconPosition === 'before' && (
                    <BtnIconComp
                      style={{
                        width: `${btnStyles.iconSize}px`,
                        height: `${btnStyles.iconSize}px`,
                      }}
                      className="shrink-0"
                    />
                  )}
                  <span>{formattedBtnText}</span>
                  {BtnIconComp && btnStyles.iconPosition === 'after' && (
                    <BtnIconComp
                      style={{
                        width: `${btnStyles.iconSize}px`,
                        height: `${btnStyles.iconSize}px`,
                      }}
                      className="shrink-0"
                    />
                  )}
                </span>
                {btnStyles.subtext && (
                  <span className="text-[11px] font-normal opacity-90 mt-0.5">
                    {btnStyles.subtext}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
