import React, { useState, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { PageBlockElement, PopupModal } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { PopupRuntimeModal } from '../library/PopupRuntimeModal';

interface PopupButtonElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  isSelected?: boolean;
  defaultPrimaryColor?: string;
  defaultFontFamily?: string;
  onUpdateText?: (newText: string) => void;
  popups?: PopupModal[];
  onOpenEditor?: () => void;
  onNextFunnelStep?: () => void;
  onGoToFunnelPage?: (pageId: string) => void;
}

export const formatCtaDisplayText = (
  raw: string,
  transform?: string
): string => {
  if (!raw) return raw;
  if (transform === 'uppercase') return raw.toLocaleUpperCase('es');
  if (transform === 'lowercase') return raw.toLocaleLowerCase('es');
  if (transform === 'capitalize') {
    return raw
      .toLocaleLowerCase('es')
      .replace(
        /(^|[\s¡¿"'(/-])(\p{L})/gu,
        (_, sep: string, ch: string) => sep + ch.toLocaleUpperCase('es')
      );
  }
  return raw;
};

export const PopupButtonElement: React.FC<PopupButtonElementProps> = ({
  element,
  isEditable = false,
  isSelected = false,
  defaultPrimaryColor = '#2848F0',
  defaultFontFamily = 'Poppins',
  onUpdateText,
  popups = [],
  onOpenEditor: _onOpenEditor,
  onNextFunnelStep,
  onGoToFunnelPage,
}) => {
  const { libraryItems } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const dirtyTextRef = useRef<string | null>(null);

  const rawButtonText =
    element.content.popupButtonText || 'Abrir Oferta en Pop-up';
  const popupId = element.content.popupId || 'lib_pop_lead_2step';

  const libraryPopups = libraryItems.filter((item) => item.kind === 'popup');
  const livePopupItem =
    libraryPopups.find((item) => item.id === popupId) ||
    (popupId === 'popup_1' ? libraryPopups[0] || null : libraryPopups[0] || null);
  const fallbackLegacyPopup = popups.find((p) => p.id === popupId) || null;

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isEditable) {
      return;
    }
    e.stopPropagation();
    setIsOpen(true);
  };

  const isFullWidth = Boolean(element.styles?.fullWidth);
  const align = element.styles?.textAlign || 'center';

  const containerStyle: React.CSSProperties = isEditable
    ? {
        display: 'flex',
        justifyContent: isFullWidth
          ? 'center'
          : align === 'left'
          ? 'flex-start'
          : align === 'right'
          ? 'flex-end'
          : 'center',
        width: '100%',
      }
    : {
        display: 'flex',
        justifyContent: isFullWidth
          ? 'center'
          : align === 'left'
          ? 'flex-start'
          : align === 'right'
          ? 'flex-end'
          : 'center',
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

  const normalBg = element.styles?.bgColor || defaultPrimaryColor || '#2848F0';
  const normalText = element.styles?.textColor || '#FFFFFF';
  const bWidth = element.styles?.borderWidth ?? 0;
  const hasBorder = bWidth > 0;
  const normalBorder = element.styles?.borderColor || '#18181B';

  const hoverBg = element.styles?.hoverBgColor || normalBg;
  const hoverText = element.styles?.hoverTextColor || normalText;
  const hoverBorder = hasBorder
    ? element.styles?.hoverBorderColor || normalBorder
    : 'transparent';

  const padY = element.styles?.buttonPaddingY ?? 14;
  const padX = element.styles?.buttonPaddingX ?? 28;
  const fontSize = element.styles?.fontSize || 16;

  const iconName = element.content.buttonIcon || '';
  const IconComp = iconName
    ? ((
        LucideIcons as unknown as Record<
          string,
          React.ComponentType<{
            style?: React.CSSProperties;
            className?: string;
          }>
        >
      )[iconName] || null)
    : null;
  const iconPos = element.content.buttonIconPosition || 'before';
  const iconSpacing = element.content.buttonIconSpacing ?? 8;
  const iconSize =
    element.content.buttonIconSize ?? Math.max(14, Math.round(fontSize * 1.05));

  const displayText = isEditingInline
    ? rawButtonText
    : formatCtaDisplayText(rawButtonText, element.styles?.textTransform);

  const showSubtext =
    Boolean(element.content.buttonSubtextEnabled) &&
    Boolean((element.content.buttonSubtext || '').trim());
  const subtextFontSize = element.content.buttonSubtextFontSize ?? 12;
  const subtextFontFamily =
    element.content.buttonSubtextFontFamily ||
    element.styles?.fontFamily ||
    defaultFontFamily ||
    'Inter';
  const subtextColor =
    element.content.buttonSubtextColor || 'rgba(255, 255, 255, 0.85)';
  const subtextGap = element.content.buttonSubtextGap ?? 4;
  const subtextTransform = element.content.buttonSubtextTransform || 'none';
  const displaySubtext = formatCtaDisplayText(
    element.content.buttonSubtext || '',
    subtextTransform
  );
  const subtextIconName = element.content.buttonSubtextIcon || '';
  const SubtextIconComp = subtextIconName
    ? ((
        LucideIcons as unknown as Record<
          string,
          React.ComponentType<{
            style?: React.CSSProperties;
            className?: string;
          }>
        >
      )[subtextIconName] || null)
    : null;
  const subtextIconSize = Math.max(10, Math.round(subtextFontSize * 1.05));

  return (
    <div style={containerStyle} className="w-full relative">
      <button
        type="button"
        onClick={handleButtonClick}
        style={
          {
            '--cta-bg': normalBg,
            '--cta-hover-bg': hoverBg,
            '--cta-text': normalText,
            '--cta-hover-text': hoverText,
            '--cta-border': hasBorder ? normalBorder : 'transparent',
            '--cta-hover-border': hoverBorder,
            width: isFullWidth ? '100%' : 'auto',
            fontSize: `${fontSize}px`,
            fontFamily:
              element.styles?.fontFamily || defaultFontFamily || 'Poppins',
            fontWeight: element.styles?.isBold ? 700 : 500,
            fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
            paddingTop: `${padY}px`,
            paddingBottom: `${padY}px`,
            paddingLeft: `${padX}px`,
            paddingRight: `${padX}px`,
            borderRadius: `${element.styles?.borderRadius ?? 0}px`,
            borderWidth: `${bWidth}px`,
            borderStyle: hasBorder
              ? element.styles?.borderStyle || 'solid'
              : 'none',
            outline: isSelected ? 'none' : undefined,
          } as React.CSSProperties
        }
        className="[background-color:var(--cta-bg)] hover:[background-color:var(--cta-hover-bg)] [color:var(--cta-text)] hover:[color:var(--cta-hover-text)] [border-color:var(--cta-border)] hover:[border-color:var(--cta-hover-border)] inline-flex flex-col items-center justify-center shadow-sm transition-colors duration-200 cursor-pointer text-center"
      >
        <span
          className="inline-flex items-center justify-center"
          style={{
            gap: IconComp ? `${iconSpacing}px` : '0px',
            textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
            textTransform: element.styles?.textTransform || 'none',
          }}
        >
          {IconComp && iconPos === 'before' && (
            <IconComp
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              className="shrink-0"
            />
          )}
          <span
            contentEditable={isEditable && isSelected}
            suppressContentEditableWarning={true}
            onFocus={() => {
              setIsEditingInline(true);
              dirtyTextRef.current = null;
            }}
            onInput={(e) => {
              dirtyTextRef.current = e.currentTarget.textContent || '';
            }}
            onBlur={() => {
              setIsEditingInline(false);
              if (dirtyTextRef.current !== null && onUpdateText) {
                onUpdateText(dirtyTextRef.current);
                dirtyTextRef.current = null;
              }
            }}
            className="outline-none"
          >
            {displayText}
          </span>
          {IconComp && iconPos === 'after' && (
            <IconComp
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              className="shrink-0"
            />
          )}
        </span>

        {showSubtext && (
          <span
            className="inline-flex items-center justify-center leading-tight"
            style={{
              marginTop: `${subtextGap}px`,
              fontSize: `${subtextFontSize}px`,
              fontFamily: subtextFontFamily,
              color: subtextColor,
              fontWeight: element.content.buttonSubtextBold ? 700 : 400,
              fontStyle: element.content.buttonSubtextItalic
                ? 'italic'
                : 'normal',
              textDecoration: element.content.buttonSubtextUnderline
                ? 'underline'
                : 'none',
              textTransform: subtextTransform,
              gap: SubtextIconComp ? '5px' : '0px',
            }}
          >
            {SubtextIconComp && (
              <SubtextIconComp
                style={{
                  width: `${subtextIconSize}px`,
                  height: `${subtextIconSize}px`,
                }}
                className="shrink-0"
              />
            )}
            <span>{displaySubtext}</span>
          </span>
        )}
      </button>

      {/* LIVE POPUP RUNTIME MODAL */}
      <PopupRuntimeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        popupItem={livePopupItem}
        fallbackLegacyPopup={fallbackLegacyPopup}
        onNextFunnelStep={onNextFunnelStep}
        onGoToFunnelPage={onGoToFunnelPage}
      />
    </div>
  );
};
