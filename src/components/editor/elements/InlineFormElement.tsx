import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PageBlockElement } from '../../../types';
import { useApp } from '../../../context/AppContext';
import {
  DEFAULT_EMAIL_PLACEHOLDER,
  DEFAULT_POLICY_ERROR_TEXT,
  DEFAULT_POLICY_HTML,
  getResolvedFormButtonStyles,
  getResolvedGlobalFieldStyle,
  getResolvedPostSubmitActions,
  sanitizePolicyHtml,
} from '../../../utils/completeFormUtils';

interface InlineFormElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  defaultPrimaryColor?: string;
  defaultFontFamily?: string;
  onSubmitSuccess?: (formData: Record<string, string>) => void;
  onNextFunnelStep?: () => void;
  onGoToFunnelPage?: (pageId: string) => void;
}

export const InlineFormElement: React.FC<InlineFormElementProps> = ({
  element,
  isEditable = false,
  defaultPrimaryColor = '#F5B056',
  defaultFontFamily = 'Inter',
  onSubmitSuccess,
  onNextFunnelStep,
  onGoToFunnelPage,
}) => {
  const { submitCompleteFormLead, showToast } = useApp();

  const [emailValue, setEmailValue] = useState<string>('');
  const [emailInputUnlocked, setEmailInputUnlocked] = useState<boolean>(false);
  const [policyAccepted, setPolicyAccepted] = useState<boolean>(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);

  const formName = element.content.formName?.trim() || 'Formulario Inline';
  const showLabel = Boolean(element.content.inlineShowLabel);
  const showReqMark = element.content.formShowRequiredMark !== false;
  const emailLabel = element.content.inlineEmailLabel?.trim() || 'Tu mejor email';
  const emailPlaceholder =
    element.content.inlineEmailPlaceholder !== undefined
      ? element.content.inlineEmailPlaceholder
      : DEFAULT_EMAIL_PLACEHOLDER;

  // Single unified height for BOTH field and button — never one taller than the other
  const unifiedHeight = Math.max(
    36,
    Math.min(96, Number(element.content.inlineFormHeight ?? 52) || 52)
  );

  // Button width percentage clamped strictly between 20% and 50%
  const buttonWidthPercent = Math.max(
    20,
    Math.min(50, Number(element.content.inlineFormButtonWidthPercent ?? 30) || 30)
  );

  // Horizontal gap between email input and button (0 = joined flush like reference design)
  const inlineGap = Math.max(
    0,
    Math.min(32, Number(element.content.inlineFormGap ?? 0) || 0)
  );

  const fieldStyle = getResolvedGlobalFieldStyle(element.content, defaultFontFamily);
  const btnStyles = getResolvedFormButtonStyles(
    element,
    defaultPrimaryColor,
    defaultFontFamily
  );
  const postActions = getResolvedPostSubmitActions(element.content);

  const policyEnabled = Boolean(element.content.policyCheckboxEnabled);
  const policyHtml = sanitizePolicyHtml(
    element.content.policyCheckboxHtml || DEFAULT_POLICY_HTML
  );
  const policyFontSize = element.content.policyCheckboxFontSize ?? 12;
  const policyTextColor = element.content.policyCheckboxTextColor || '#3F3F46';
  const policyErrorMessage =
    element.content.policyCheckboxErrorText?.trim() || DEFAULT_POLICY_ERROR_TEXT;

  const successMessage =
    element.content.formSuccessMessage ||
    '¡Gracias! Hemos recibido tu correo correctamente.';

  const BtnIconComponent = btnStyles.icon
    ? ((LucideIcons as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties }>>)[
        btnStyles.icon
      ] || null)
    : null;

  const formatButtonText = (raw: string): string => {
    switch (btnStyles.textTransform) {
      case 'uppercase':
        return raw.toUpperCase();
      case 'lowercase':
        return raw.toLowerCase();
      case 'capitalize':
        return raw.replace(/\b\w/g, (ch) => ch.toUpperCase());
      default:
        return raw;
    }
  };

  // Clean & transparent outer container
  const outerContainerStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    paddingTop: `${element.styles.paddingTop ?? 0}px`,
    paddingRight: `${element.styles.paddingRight ?? 0}px`,
    paddingBottom: `${element.styles.paddingBottom ?? 0}px`,
    paddingLeft: `${element.styles.paddingLeft ?? 0}px`,
    marginTop: `${element.styles.marginTop ?? 0}px`,
    marginRight: `${element.styles.marginRight ?? 0}px`,
    marginBottom: `${element.styles.marginBottom ?? 20}px`,
    marginLeft: `${element.styles.marginLeft ?? 0}px`,
    maxWidth: element.styles.maxWidth || '100%',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPolicyError(null);

    const trimmedEmail = emailValue.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Ingresa un correo electrónico válido para continuar.');
      return;
    }

    if (policyEnabled && !policyAccepted) {
      setPolicyError(policyErrorMessage);
      return;
    }

    const enabledEmailTargets = postActions.sendToEmailMarketing
      ? postActions.emailTargets.filter((t) => t.enabled)
      : [];

    submitCompleteFormLead({
      formName,
      entries: [
        {
          id: 'fld_inline_email',
          label: emailLabel || 'Email',
          type: 'email',
          value: trimmedEmail,
        },
      ],
      addToCrm: postActions.addToCrm,
      sendToEmailMarketing: postActions.sendToEmailMarketing,
      emailTargets: enabledEmailTargets,
    });

    if (onSubmitSuccess) {
      onSubmitSuccess({ Email: trimmedEmail });
    }

    // Priority 1: External or custom URL redirect
    if (postActions.redirectToUrl && postActions.redirectUrl.trim()) {
      const targetUrl = postActions.redirectUrl.trim();
      const normalizedUrl = /^https?:\/\//i.test(targetUrl)
        ? targetUrl
        : `https://${targetUrl}`;
      if (!isEditable) {
        if (postActions.redirectOpenNewTab) {
          window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = normalizedUrl;
          return;
        }
      } else {
        showToast(`Redirección configurada a: ${normalizedUrl}`);
      }
    }

    // Priority 2: Specific page inside the funnel
    if (postActions.goToFunnelPage && postActions.targetFunnelPageId) {
      if (onGoToFunnelPage) {
        onGoToFunnelPage(postActions.targetFunnelPageId);
        return;
      } else if (isEditable) {
        showToast('En el embudo publicado dirigirá a la página seleccionada del embudo.');
      }
    }

    // Priority 3: Next funnel step
    if (postActions.goToNextStep) {
      if (onNextFunnelStep) {
        onNextFunnelStep();
        return;
      } else if (isEditable) {
        showToast('En el embudo publicado avanzará automáticamente al siguiente paso.');
      }
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={outerContainerStyle} className="w-full">
        <div className="py-4 px-5 rounded-xl bg-emerald-50/95 border border-emerald-200 text-center flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold text-emerald-900">{successMessage}</p>
          {isEditable && (
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setPolicyError(null);
                setEmailError(null);
              }}
              className="text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer sm:ml-2"
            >
              Volver a ver el formulario
            </button>
          )}
        </div>
      </div>
    );
  }

  const isJoined = inlineGap === 0;
  const fieldRad = fieldStyle.borderRadius ?? 8;
  const btnRad = btnStyles.borderRadius ?? 8;

  const inputBorderRadiusStyle: React.CSSProperties = isJoined
    ? {
        borderTopLeftRadius: `${fieldRad}px`,
        borderBottomLeftRadius: `${fieldRad}px`,
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
      }
    : {
        borderRadius: `${fieldRad}px`,
      };

  const buttonBorderRadiusStyle: React.CSSProperties = isJoined
    ? {
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderTopRightRadius: `${btnRad}px`,
        borderBottomRightRadius: `${btnRad}px`,
      }
    : {
        borderRadius: `${btnRad}px`,
      };

  const resolvedButtonBg = isButtonHovered
    ? btnStyles.hoverBgColor || btnStyles.bgColor
    : btnStyles.bgType === 'gradient'
    ? `linear-gradient(135deg, ${btnStyles.bgColor} 0%, ${btnStyles.bgColor2} 100%)`
    : btnStyles.bgColor;

  const resolvedButtonText = isButtonHovered
    ? btnStyles.hoverTextColor || btnStyles.textColor
    : btnStyles.textColor;

  const resolvedButtonBorderColor = isButtonHovered
    ? btnStyles.hoverBorderColor || btnStyles.borderColor
    : btnStyles.borderColor;

  return (
    <div style={outerContainerStyle} className="w-full">
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="w-full flex flex-col gap-2.5"
      >
        {showLabel && (
          <label
            style={{
              fontFamily: `'${fieldStyle.fontFamily}', sans-serif`,
              fontSize: `${Math.max(11, (fieldStyle.fontSize || 15) - 1)}px`,
              color: fieldStyle.labelColor,
              fontWeight: 600,
            }}
            className="block leading-snug"
          >
            <span>{emailLabel}</span>
            {showReqMark && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {/* HORIZONTAL SINGLE-LINE ROW: EMAIL INPUT + SUBMIT BUTTON WITH IDENTICAL HEIGHT */}
        <div
          className="w-full flex items-stretch"
          style={{
            gap: `${inlineGap}px`,
          }}
        >
          <input
            type="email"
            name={`inline_email_${element.id}`}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            readOnly={!emailInputUnlocked && !emailValue}
            onMouseDown={() => {
              if (!emailInputUnlocked) setEmailInputUnlocked(true);
            }}
            onFocus={() => {
              if (!emailInputUnlocked) setEmailInputUnlocked(true);
            }}
            required
            value={emailValue}
            placeholder={emailPlaceholder}
            onChange={(e) => {
              setEmailValue(e.target.value);
              if (emailError) setEmailError(null);
            }}
            style={{
              height: `${unifiedHeight}px`,
              minHeight: `${unifiedHeight}px`,
              maxHeight: `${unifiedHeight}px`,
              boxSizing: 'border-box',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '0px',
              paddingBottom: '0px',
              fontFamily: `'${fieldStyle.fontFamily}', sans-serif`,
              fontSize: `${fieldStyle.fontSize}px`,
              fontWeight: fieldStyle.isBold ? 700 : 400,
              fontStyle: fieldStyle.isItalic ? 'italic' : 'normal',
              color: fieldStyle.textColor,
              backgroundColor: fieldStyle.bgColor,
              borderTopWidth: `${fieldStyle.borderWidth}px`,
              borderBottomWidth: `${fieldStyle.borderWidth}px`,
              borderLeftWidth: `${fieldStyle.borderWidth}px`,
              borderRightWidth:
                isJoined && btnStyles.borderWidth > 0
                  ? '0px'
                  : `${fieldStyle.borderWidth}px`,
              borderStyle: fieldStyle.borderStyle,
              borderColor: emailError ? '#EF4444' : fieldStyle.borderColor,
              ...inputBorderRadiusStyle,
            }}
            className="flex-1 min-w-0 outline-none focus:ring-2 focus:ring-[#2848F0]/25 transition-all placeholder:text-zinc-400"
          />

          <button
            type="submit"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              width: `${buttonWidthPercent}%`,
              minWidth: 'fit-content',
              maxWidth: '50%',
              height: `${unifiedHeight}px`,
              minHeight: `${unifiedHeight}px`,
              maxHeight: `${unifiedHeight}px`,
              boxSizing: 'border-box',
              paddingLeft: `${btnStyles.paddingX}px`,
              paddingRight: `${btnStyles.paddingX}px`,
              paddingTop: '0px',
              paddingBottom: '0px',
              fontFamily: `'${btnStyles.fontFamily}', sans-serif`,
              fontSize: `${btnStyles.fontSize}px`,
              fontWeight: btnStyles.isBold ? 700 : 500,
              fontStyle: btnStyles.isItalic ? 'italic' : 'normal',
              textDecoration: btnStyles.isUnderline ? 'underline' : 'none',
              background: resolvedButtonBg,
              color: resolvedButtonText,
              borderWidth: `${btnStyles.borderWidth}px`,
              borderStyle: btnStyles.borderWidth > 0 ? btnStyles.borderStyle : 'none',
              borderColor: resolvedButtonBorderColor,
              ...buttonBorderRadiusStyle,
            }}
            className="shrink-0 inline-flex flex-col items-center justify-center transition-all cursor-pointer select-none leading-tight overflow-hidden whitespace-nowrap"
          >
            <span
              className="inline-flex items-center justify-center leading-tight"
              style={{ gap: `${btnStyles.iconSpacing}px` }}
            >
              {BtnIconComponent && btnStyles.iconPosition === 'before' && (
                <BtnIconComponent
                  style={{
                    width: `${btnStyles.iconSize}px`,
                    height: `${btnStyles.iconSize}px`,
                    flexShrink: 0,
                  }}
                />
              )}
              <span className="truncate">
                {formatButtonText(btnStyles.text || 'Comenzar Ahora')}
              </span>
              {BtnIconComponent && btnStyles.iconPosition === 'after' && (
                <BtnIconComponent
                  style={{
                    width: `${btnStyles.iconSize}px`,
                    height: `${btnStyles.iconSize}px`,
                    flexShrink: 0,
                  }}
                />
              )}
            </span>

            {btnStyles.subtext && (
              <span
                className="opacity-90 font-normal leading-none truncate max-w-full mt-0.5"
                style={{ fontSize: `${Math.max(10, btnStyles.fontSize - 4)}px` }}
              >
                {btnStyles.subtext}
              </span>
            )}
          </button>
        </div>

        {/* EMAIL VALIDATION ERROR */}
        {emailError && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{emailError}</span>
          </div>
        )}

        {/* OPTIONAL MANDATORY POLICY CHECKBOX */}
        {policyEnabled && (
          <div className="space-y-1.5 pt-0.5">
            <label
              className="flex items-start gap-2.5 cursor-pointer select-none"
              style={{
                fontSize: `${policyFontSize}px`,
                color: policyTextColor,
                fontFamily: `'${fieldStyle.fontFamily}', sans-serif`,
              }}
            >
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => {
                  setPolicyAccepted(e.target.checked);
                  if (e.target.checked && policyError) {
                    setPolicyError(null);
                  }
                }}
                className="mt-0.5 w-4 h-4 accent-[#2848F0] rounded cursor-pointer shrink-0"
              />
              <span
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A') {
                    e.stopPropagation();
                  }
                }}
                className="leading-snug [&_a]:underline [&_a]:font-medium [&_a]:text-[#2848F0]"
                dangerouslySetInnerHTML={{ __html: policyHtml }}
              />
            </label>

            {policyError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{policyError}</span>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
