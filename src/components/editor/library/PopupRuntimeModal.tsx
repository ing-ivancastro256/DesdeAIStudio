import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  LibraryItem,
  PageBlockColumn,
  PageBlockElement,
  PageBlockRow,
  PopupModal,
} from '../../../types';
import {
  computePopupCloseButtonStyle,
  resolvePopupSettings,
} from '../../../utils/libraryUtils';
import {
  getColumnShadowClass,
  getColumnSurfaceStyle,
  getSectionEffectiveMaxWidth,
  isSectionBoxed,
} from '../../../utils/editorTreeUtils';
import { renderBulletIcon } from '../../../utils/bulletIcons';
import { ConfiguredImage } from '../../common/ConfiguredImage';
import { EmbeddedVideoPlayer } from '../../common/EmbeddedVideoPlayer';
import { DelayedAppearance } from '../../common/DelayedAppearance';
import { RichTextElement } from '../elements/RichTextElement';
import { AudioPlayerElement } from '../elements/AudioPlayerElement';
import { IconElement } from '../elements/IconElement';
import { SimpleFormElement } from '../elements/SimpleFormElement';
import { InlineFormElement } from '../elements/InlineFormElement';
import {
  CountdownTimerWidget,
  FaqAccordionWidget,
  SocialLinksWidget,
  CheckboxWidget,
  InputFieldWidget,
} from '../elements/ConversionWidgets';

interface PopupRuntimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  popupItem?: LibraryItem | null;
  fallbackLegacyPopup?: PopupModal | null;
  onNextFunnelStep?: () => void;
  onGoToFunnelPage?: (pageId: string) => void;
}

const formatDisplayText = (raw: string, transform?: string): string => {
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

export const PopupRuntimeModal: React.FC<PopupRuntimeModalProps> = ({
  isOpen,
  onClose,
  popupItem,
  fallbackLegacyPopup,
  onNextFunnelStep,
  onGoToFunnelPage,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popupSettings = resolvePopupSettings(popupItem?.popupSettings);
  const pageSettings = popupItem?.pageSettings || {};

  const headingFont = pageSettings.headingFontFamily || 'Poppins';
  const bodyFont = pageSettings.bodyFontFamily || 'Inter';
  const primaryColor = pageSettings.primaryColor || '#2848F0';
  const defaultTextColor = pageSettings.textColor || '#121111';
  const windowBgColor =
    pageSettings.pageBgColor || fallbackLegacyPopup?.bgColor || '#FFFFFF';
  const windowRadius = pageSettings.pageBorderRadius ?? 16;

  const hasBgImage = Boolean(
    pageSettings.pageBgImageUrl && pageSettings.pageBgImageUrl.trim() !== ''
  );
  const isBgImageEnabled =
    pageSettings.pageBgImageEnabled !== undefined
      ? pageSettings.pageBgImageEnabled
      : hasBgImage;

  const closeBtnStyle = computePopupCloseButtonStyle(popupSettings);
  const closeIconSize = Math.max(
    12,
    Math.round(popupSettings.closeBtnSize * 0.5)
  );

  const renderElement = (el: PageBlockElement): React.ReactNode => {
    const st = el.styles || {};
    const wrapStyle: React.CSSProperties = {
      marginTop: st.marginTop !== undefined ? `${st.marginTop}px` : undefined,
      marginBottom:
        st.marginBottom !== undefined ? `${st.marginBottom}px` : '12px',
      marginLeft: st.marginLeft !== undefined ? `${st.marginLeft}px` : undefined,
      marginRight:
        st.marginRight !== undefined ? `${st.marginRight}px` : undefined,
      paddingTop: st.paddingTop !== undefined ? `${st.paddingTop}px` : undefined,
      paddingBottom:
        st.paddingBottom !== undefined ? `${st.paddingBottom}px` : undefined,
      paddingLeft:
        st.paddingLeft !== undefined ? `${st.paddingLeft}px` : undefined,
      paddingRight:
        st.paddingRight !== undefined ? `${st.paddingRight}px` : undefined,
      opacity: st.opacity !== undefined ? st.opacity / 100 : undefined,
    };

    if (el.type === 'inner_columns' && el.nestedRow) {
      return (
        <div key={el.id} style={wrapStyle}>
          {renderRow(el.nestedRow, true)}
        </div>
      );
    }

    if (el.type === 'heading' || el.type === 'subheading') {
      const defaultSize =
        el.type === 'subheading'
          ? pageSettings.defaultH3Size || 20
          : el.content.level === 'h1'
          ? pageSettings.defaultH1Size || 30
          : el.content.level === 'h3'
          ? pageSettings.defaultH3Size || 20
          : el.content.level === 'h4'
          ? pageSettings.defaultH4Size || 17
          : pageSettings.defaultH2Size || 24;
      return (
        <div key={el.id} style={wrapStyle}>
          <h2
            style={{
              fontSize: `${st.fontSize || defaultSize}px`,
              fontFamily: st.fontFamily || headingFont,
              color: st.textColor || defaultTextColor,
              fontWeight: st.isBold === false ? 500 : 700,
              fontStyle: st.isItalic ? 'italic' : 'normal',
              textDecoration: st.isUnderline ? 'underline' : 'none',
              textTransform: st.textTransform || 'none',
              textAlign: st.textAlign || 'center',
              lineHeight: st.lineHeight || 1.22,
              letterSpacing:
                st.letterSpacing !== undefined
                  ? `${st.letterSpacing}px`
                  : undefined,
            }}
            className="whitespace-pre-wrap break-words"
          >
            {el.content.text || ''}
          </h2>
        </div>
      );
    }

    if (el.type === 'paragraph') {
      return (
        <div key={el.id} style={wrapStyle}>
          <p
            style={{
              fontSize: `${st.fontSize || 15}px`,
              fontFamily: st.fontFamily || bodyFont,
              color: st.textColor || defaultTextColor,
              fontWeight: st.isBold ? 700 : 400,
              fontStyle: st.isItalic ? 'italic' : 'normal',
              textDecoration: st.isUnderline ? 'underline' : 'none',
              textTransform: st.textTransform || 'none',
              textAlign: st.textAlign || 'center',
              lineHeight: st.lineHeight || 1.55,
            }}
            className="whitespace-pre-wrap break-words"
          >
            {el.content.text || ''}
          </p>
        </div>
      );
    }

    if (el.type === 'rich_text') {
      return (
        <div key={el.id} style={wrapStyle}>
          <RichTextElement element={el} isEditable={false} />
        </div>
      );
    }

    if (el.type === 'bullet_list') {
      const items = el.content.items || [];
      const bulletIcon = st.bulletIcon || 'check';
      const bulletColor = st.bulletColor || primaryColor;
      const spacing = st.bulletSpacing ?? 10;
      return (
        <ul
          key={el.id}
          style={{
            ...wrapStyle,
            fontSize: `${st.fontSize || 15}px`,
            fontFamily: st.fontFamily || bodyFont,
            color: st.textColor || defaultTextColor,
          }}
          className="list-none pl-0"
        >
          {items.map((itemText, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: idx < items.length - 1 ? `${spacing}px` : 0,
              }}
              className="flex items-start gap-2.5"
            >
              <span className="mt-1 shrink-0">
                {renderBulletIcon(bulletIcon, st.fontSize || 15, bulletColor)}
              </span>
              <span
                className="leading-snug"
                dangerouslySetInnerHTML={{ __html: itemText }}
              />
            </li>
          ))}
        </ul>
      );
    }

    if (el.type === 'image') {
      const linkUrl = st.linkUrl || el.content.linkUrl;
      const linkOpenNewTab =
        st.linkOpenNewTab ?? el.content.linkOpenNewTab ?? true;
      const imgNode = (
        <ConfiguredImage
          src={el.content.src}
          alt={el.content.alt}
          styles={st}
          defaultWidth={st.maxWidth || 420}
        />
      );
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            display: 'flex',
            width: '100%',
            justifyContent:
              st.textAlign === 'left'
                ? 'flex-start'
                : st.textAlign === 'right'
                ? 'flex-end'
                : 'center',
          }}
        >
          {linkUrl ? (
            <a
              href={linkUrl}
              target={linkOpenNewTab ? '_blank' : '_self'}
              rel="noreferrer noopener"
              style={{ display: 'inline-flex', maxWidth: '100%' }}
              className="cursor-pointer hover:opacity-95 transition-opacity"
            >
              {imgNode}
            </a>
          ) : (
            imgNode
          )}
        </div>
      );
    }

    if (el.type === 'video') {
      const videoNode = (
        <div key={el.id} style={wrapStyle}>
          <EmbeddedVideoPlayer
            videoUrl={el.content.videoUrl}
            videoFileName={el.content.videoFileName}
            aspectRatio={st.aspectRatio || '16/9'}
            borderRadius={st.borderRadius ?? 0}
            maxWidth={st.maxWidth ? `${st.maxWidth}px` : '100%'}
            borderWidth={st.borderWidth}
            borderColor={st.borderColor}
            borderStyle={st.borderStyle}
            isEditable={false}
            videoSource={el.content.videoSource}
            videoAutoplay={el.content.videoAutoplay}
            videoMuted={el.content.videoMuted}
            videoLoop={el.content.videoLoop}
            videoCoverType={el.content.videoCoverType}
            videoCoverImage={el.content.videoCoverImage}
            videoCoverText={el.content.videoCoverText}
            videoCoverTextFont={el.content.videoCoverTextFont}
            videoCoverTextSize={el.content.videoCoverTextSize}
            videoCoverTextColor={el.content.videoCoverTextColor}
            videoCoverTextBg={el.content.videoCoverTextBg}
            videoCoverTextBold={el.content.videoCoverTextBold}
            videoCoverPlayIcon={el.content.videoCoverPlayIcon}
            videoCoverButtonShape={el.content.videoCoverButtonShape}
            videoCoverPlayColor={el.content.videoCoverPlayColor}
            videoCoverPlayBg={el.content.videoCoverPlayBg}
            videoCoverPlaySize={el.content.videoCoverPlaySize}
            videoCoverArrowType={el.content.videoCoverArrowType}
            videoCoverArrowColor={el.content.videoCoverArrowColor}
            videoCoverArrowSize={el.content.videoCoverArrowSize}
            videoCoverArrowRotation={el.content.videoCoverArrowRotation}
            videoCoverBgType={el.content.videoCoverBgType}
            videoCoverBgColor={el.content.videoCoverBgColor}
            videoCoverBgColor2={el.content.videoCoverBgColor2}
            videoCoverBgOpacity={el.content.videoCoverBgOpacity}
          />
        </div>
      );
      return videoNode;
    }

    if (el.type === 'audio') {
      return (
        <div key={el.id} style={wrapStyle}>
          <AudioPlayerElement element={el} isEditable={false} />
        </div>
      );
    }

    if (el.type === 'icon') {
      return (
        <div key={el.id} style={wrapStyle}>
          <IconElement element={el} isEditable={false} />
        </div>
      );
    }

    if (el.type === 'divider') {
      return (
        <div key={el.id} style={wrapStyle} className="w-full py-1">
          <hr
            style={{
              borderTopWidth: `${st.borderWidth ?? 1}px`,
              borderColor: st.borderColor || st.textColor || '#E4E4E7',
              borderStyle: st.borderStyle || 'solid',
            }}
          />
        </div>
      );
    }

    if (el.type === 'spacer') {
      return (
        <div
          key={el.id}
          style={{ height: `${el.content.spacerHeight ?? 24}px` }}
        />
      );
    }

    if (el.type === 'countdown') {
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            textAlign: st.textAlign || 'center',
          }}
          className="w-full"
        >
          <CountdownTimerWidget
            endDate={el.content.countdownEndDate}
            daysLabel={el.content.countdownDaysLabel}
            hoursLabel={el.content.countdownHoursLabel}
            minutesLabel={el.content.countdownMinutesLabel}
            secondsLabel={el.content.countdownSecondsLabel}
            theme={el.content.countdownTheme || 'dark'}
          />
        </div>
      );
    }

    if (el.type === 'faq') {
      return (
        <div key={el.id} style={wrapStyle} className="w-full">
          <FaqAccordionWidget items={el.content.faqItems} />
        </div>
      );
    }

    if (el.type === 'social_links') {
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            textAlign: st.textAlign || 'center',
          }}
          className="w-full"
        >
          <SocialLinksWidget
            links={el.content.socialLinks}
            size={el.content.socialSize || 'md'}
            styleType={el.content.socialStyle || 'colored'}
            colorMode={el.content.socialColorMode || 'default'}
            iconColor={el.content.socialIconColor || '#FFFFFF'}
            bgColor={el.content.socialBgColor || '#2848F0'}
            shape={el.content.socialShape || 'circle'}
          />
        </div>
      );
    }

    if (el.type === 'checkbox') {
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            textAlign: st.textAlign || 'left',
          }}
          className="w-full"
        >
          <CheckboxWidget
            label={el.content.checkboxLabel}
            checked={el.content.checkboxChecked}
            required={el.content.checkboxRequired}
          />
        </div>
      );
    }

    if (el.type === 'input_field') {
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            display: 'flex',
            justifyContent:
              st.textAlign === 'center'
                ? 'center'
                : st.textAlign === 'right'
                ? 'flex-end'
                : 'flex-start',
          }}
          className="w-full"
        >
          <InputFieldWidget
            label={el.content.fieldLabel}
            placeholder={el.content.fieldPlaceholder}
            type={el.content.fieldType || 'email'}
            required={el.content.fieldRequired}
          />
        </div>
      );
    }

    if (el.type === 'simple_form') {
      return (
        <div key={el.id} style={wrapStyle}>
          <SimpleFormElement
            element={el}
            isEditable={false}
            defaultPrimaryColor={primaryColor}
            defaultFontFamily={bodyFont}
            onNextFunnelStep={() => {
              onClose();
              onNextFunnelStep?.();
            }}
            onSubmitSuccess={() => {
              setTimeout(() => onClose(), 1600);
            }}
          />
        </div>
      );
    }

    if (el.type === 'inline_form') {
      return (
        <div key={el.id} style={wrapStyle}>
          <InlineFormElement
            element={el}
            isEditable={false}
            defaultPrimaryColor={primaryColor}
            defaultFontFamily={bodyFont}
            onNextFunnelStep={() => {
              onClose();
              onNextFunnelStep?.();
            }}
            onGoToFunnelPage={(targetPageId) => {
              onClose();
              onGoToFunnelPage?.(targetPageId);
            }}
          />
        </div>
      );
    }

    if (el.type === 'button' || el.type === 'form_button') {
      const isFullWidth = Boolean(st.fullWidth);
      const align = st.textAlign || 'center';
      const normalBg = st.bgColor || primaryColor;
      const normalText = st.textColor || '#FFFFFF';
      const bWidth = st.borderWidth ?? 0;
      const hasBorder = bWidth > 0;
      const normalBorder = st.borderColor || '#18181B';
      const hoverBg = st.hoverBgColor || normalBg;
      const hoverText = st.hoverTextColor || normalText;
      const hoverBorder = hasBorder
        ? st.hoverBorderColor || normalBorder
        : 'transparent';
      const padY = st.buttonPaddingY ?? 14;
      const padX = st.buttonPaddingX ?? 28;
      const fontSize = st.fontSize || 16;

      const iconName = el.content.buttonIcon || '';
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
      const iconPos = el.content.buttonIconPosition || 'before';
      const iconSpacing = el.content.buttonIconSpacing ?? 8;
      const iconSize =
        el.content.buttonIconSize ?? Math.max(14, Math.round(fontSize * 1.05));

      const displayBtnText = formatDisplayText(
        el.content.buttonText || 'Continuar',
        st.textTransform
      );

      const hasSubtext = Boolean(
        el.content.buttonSubtextEnabled &&
          (el.content.buttonSubtext ?? '').trim() !== ''
      );
      const subtextFontSize = el.content.buttonSubtextFontSize ?? 12;
      const subtextFontFamily =
        el.content.buttonSubtextFontFamily || st.fontFamily || bodyFont;
      const subtextColor =
        el.content.buttonSubtextColor || 'rgba(255, 255, 255, 0.85)';
      const subtextGap = el.content.buttonSubtextGap ?? 4;
      const subtextTransform = el.content.buttonSubtextTransform || 'none';
      const displaySubtext = formatDisplayText(
        el.content.buttonSubtext || '',
        subtextTransform
      );
      const subtextIconName = el.content.buttonSubtextIcon || '';
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
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            display: 'flex',
            justifyContent: isFullWidth
              ? 'center'
              : align === 'left'
              ? 'flex-start'
              : align === 'right'
              ? 'flex-end'
              : 'center',
            width: '100%',
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (st.buttonDestination === 'url' && st.buttonUrl) {
                const a = document.createElement('a');
                a.href = st.buttonUrl;
                if (st.buttonOpenNewTab) {
                  a.target = '_blank';
                  a.rel = 'noopener noreferrer';
                } else {
                  a.target = '_self';
                }
                a.click();
                onClose();
              } else {
                onClose();
                onNextFunnelStep?.();
              }
            }}
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
                fontFamily: st.fontFamily || bodyFont,
                fontWeight: st.isBold ? 700 : 600,
                fontStyle: st.isItalic ? 'italic' : 'normal',
                paddingTop: `${padY}px`,
                paddingBottom: `${padY}px`,
                paddingLeft: `${padX}px`,
                paddingRight: `${padX}px`,
                borderRadius: `${st.borderRadius ?? 8}px`,
                borderWidth: `${bWidth}px`,
                borderStyle: hasBorder ? st.borderStyle || 'solid' : 'none',
              } as React.CSSProperties
            }
            className="[background-color:var(--cta-bg)] hover:[background-color:var(--cta-hover-bg)] [color:var(--cta-text)] hover:[color:var(--cta-hover-text)] [border-color:var(--cta-border)] hover:[border-color:var(--cta-hover-border)] shadow-sm transition-colors duration-200 inline-flex flex-col items-center justify-center cursor-pointer text-center"
          >
            <span
              className="inline-flex items-center justify-center"
              style={{
                gap: IconComp ? `${iconSpacing}px` : '0px',
                textDecoration: st.isUnderline ? 'underline' : 'none',
                textTransform: st.textTransform || 'none',
              }}
            >
              {IconComp && iconPos === 'before' && (
                <IconComp
                  style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                  className="shrink-0"
                />
              )}
              <span>{displayBtnText}</span>
              {IconComp && iconPos === 'after' && (
                <IconComp
                  style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                  className="shrink-0"
                />
              )}
            </span>

            {hasSubtext && (
              <span
                className="inline-flex items-center justify-center leading-tight"
                style={{
                  marginTop: `${subtextGap}px`,
                  fontSize: `${subtextFontSize}px`,
                  fontFamily: subtextFontFamily,
                  color: subtextColor,
                  fontWeight: el.content.buttonSubtextBold ? 700 : 400,
                  fontStyle: el.content.buttonSubtextItalic
                    ? 'italic'
                    : 'normal',
                  textDecoration: el.content.buttonSubtextUnderline
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
        </div>
      );
    }

    return null;
  };

  const renderColumn = (col: PageBlockColumn, isNested: boolean) => {
    const widthPct = col.widthPercentage ?? 100;
    return (
      <div
        key={col.id}
        style={{
          width: `${widthPct}%`,
          ...getColumnSurfaceStyle(col, { isPreview: true }),
        }}
        className={`flex flex-col box-border min-w-0 ${getColumnShadowClass(
          col.shadow
        )} ${isNested ? 'px-2' : 'px-2.5'}`}
      >
        {(col.elements || []).map((el) => renderElement(el))}
      </div>
    );
  };

  const renderRow = (row: PageBlockRow, isNested = false) => {
    return (
      <div
        key={row.id}
        className={`flex flex-col sm:flex-row items-stretch w-full ${
          isNested ? 'gap-2' : 'gap-4'
        }`}
      >
        {(row.columns || []).map((col) => renderColumn(col, isNested))}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: `rgba(0, 0, 0, ${
          Math.max(0, Math.min(95, popupSettings.overlayOpacity)) / 100
        })`,
      }}
      className="fixed inset-0 z-[90] backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-150 font-['Inter']"
      onClick={() => {
        if (popupSettings.closeOnBackdropClick) {
          onClose();
        }
      }}
    >
      {/* Outer Modal Wrapper with overflow-visible so corner X button is NEVER clipped */}
      <div
        style={{ maxWidth: `${popupSettings.maxWidth}px` }}
        className="relative w-full my-auto overflow-visible animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          style={closeBtnStyle}
          className="absolute z-30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
          title="Cerrar pop-up"
        >
          <X
            style={{ width: `${closeIconSize}px`, height: `${closeIconSize}px` }}
            strokeWidth={2.6}
          />
        </button>

        {/* Inner Window Card */}
        <div
          style={{
            backgroundColor: windowBgColor,
            borderRadius: `${windowRadius}px`,
            paddingTop: pageSettings.pagePaddingTop
              ? `${pageSettings.pagePaddingTop}px`
              : undefined,
            paddingRight: pageSettings.pagePaddingRight
              ? `${pageSettings.pagePaddingRight}px`
              : undefined,
            paddingBottom: pageSettings.pagePaddingBottom
              ? `${pageSettings.pagePaddingBottom}px`
              : undefined,
            paddingLeft: pageSettings.pagePaddingLeft
              ? `${pageSettings.pagePaddingLeft}px`
              : undefined,
          }}
          className="relative w-full overflow-hidden shadow-2xl border border-black/10"
        >
          {/* Optional Background Image */}
          {isBgImageEnabled && hasBgImage && (
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: `url("${pageSettings.pageBgImageUrl}")`,
                backgroundSize:
                  pageSettings.pageBgImageSize === 'stretch'
                    ? '100% 100%'
                    : pageSettings.pageBgImageSize || 'cover',
                backgroundPosition: pageSettings.pageBgImagePosition || 'center',
                backgroundRepeat: pageSettings.pageBgImageRepeat || 'no-repeat',
                opacity: (pageSettings.pageBgImageOpacity ?? 100) / 100,
              }}
            />
          )}

          {/* Optional Top 2-Step Conversion Progress Bar */}
          {popupSettings.showTopProgressBar && (
            <div className="relative z-10 w-full bg-zinc-200/80 border-b border-black/5">
              <div className="relative w-full h-9 overflow-hidden flex items-center justify-center px-4">
                <div
                  style={{
                    width: `${Math.max(
                      5,
                      Math.min(100, popupSettings.progressBarPercent)
                    )}%`,
                    backgroundColor: popupSettings.progressBarColor,
                  }}
                  className="absolute inset-y-0 left-0 transition-all duration-300"
                />
                <span
                  style={{ color: popupSettings.progressBarTextColor }}
                  className="relative z-10 text-[11px] sm:text-xs font-bold tracking-tight text-center truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] font-['Poppins']"
                >
                  {popupSettings.progressBarText}
                </span>
              </div>
            </div>
          )}

          {/* Pop-up Content Body */}
          <div className="relative z-10">
            {popupItem && popupItem.sections && popupItem.sections.length > 0 ? (
              popupItem.sections.map((sec) => {
                const secBoxed = isSectionBoxed(sec);
                const secBgType =
                  sec.bgType ||
                  (sec.bgGradient
                    ? 'gradient'
                    : sec.bgImageUrl
                    ? 'image'
                    : 'solid');
                const borderStyle = sec.borderStyle || 'solid';
                const borderColor = sec.borderColor || '#E4E4E7';
                const padTop = sec.paddingTop ?? sec.paddingY ?? 28;
                const padBottom = sec.paddingBottom ?? sec.paddingY ?? 28;
                const padLeft = sec.paddingLeft ?? 24;
                const padRight = sec.paddingRight ?? 24;

                const resolvedBg =
                  secBgType === 'solid'
                    ? sec.bgColor && sec.bgColor !== 'transparent'
                      ? sec.bgColor
                      : 'transparent'
                    : undefined;

                return (
                  <div
                    key={sec.id}
                    style={{
                      width: '100%',
                      maxWidth: secBoxed
                        ? `${getSectionEffectiveMaxWidth(
                            sec,
                            popupSettings.maxWidth
                          )}px`
                        : undefined,
                      marginLeft: secBoxed ? 'auto' : undefined,
                      marginRight: secBoxed ? 'auto' : undefined,
                      paddingTop: `${padTop}px`,
                      paddingBottom: `${padBottom}px`,
                      paddingLeft: `${padLeft}px`,
                      paddingRight: `${padRight}px`,
                      borderRadius: sec.borderRadius
                        ? `${sec.borderRadius}px`
                        : undefined,
                      borderTop: sec.borderTopWidth
                        ? `${sec.borderTopWidth}px ${borderStyle} ${borderColor}`
                        : undefined,
                      borderRight: sec.borderRightWidth
                        ? `${sec.borderRightWidth}px ${borderStyle} ${borderColor}`
                        : undefined,
                      borderBottom: sec.borderBottomWidth
                        ? `${sec.borderBottomWidth}px ${borderStyle} ${borderColor}`
                        : undefined,
                      borderLeft: sec.borderLeftWidth
                        ? `${sec.borderLeftWidth}px ${borderStyle} ${borderColor}`
                        : undefined,
                      backgroundColor: resolvedBg,
                      backgroundImage:
                        secBgType === 'gradient'
                          ? sec.bgGradient
                          : secBgType === 'image' && sec.bgImageUrl
                          ? `url(${sec.bgImageUrl})`
                          : undefined,
                      backgroundSize:
                        secBgType === 'image' ? 'cover' : undefined,
                      backgroundPosition:
                        secBgType === 'image' ? 'center' : undefined,
                    }}
                    className="relative box-border"
                  >
                    {(sec.rows || []).map((row) => renderRow(row, false))}
                  </div>
                );
              })
            ) : fallbackLegacyPopup ? (
              <div className="p-6 sm:p-7 space-y-3">
                {fallbackLegacyPopup.elements.map((el) => renderElement(el))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
