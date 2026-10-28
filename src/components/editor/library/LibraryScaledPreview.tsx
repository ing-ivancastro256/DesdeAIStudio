import React, { useEffect, useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Play, Calendar as CalendarIcon, X } from 'lucide-react';
import {
  FunnelPageGlobalSettings,
  PageBlockColumn,
  PageBlockElement,
  PageBlockRow,
  PageBlockSection,
  PopupWindowSettings,
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
import { getEmbedVideoInfo } from '../../../utils/videoUtils';
import { ConfiguredImage } from '../../common/ConfiguredImage';
import { SimpleFormElement } from '../elements/SimpleFormElement';
import { InlineFormElement } from '../elements/InlineFormElement';
import { PopupButtonElement, formatCtaDisplayText } from '../elements/PopupButtonElement';
import { AudioPlayerElement } from '../elements/AudioPlayerElement';
import { IconElement } from '../elements/IconElement';
import {
  CountdownTimerWidget,
  FaqAccordionWidget,
  SocialLinksWidget,
} from '../elements/ConversionWidgets';

interface LibraryScaledPreviewProps {
  sections: PageBlockSection[];
  pageSettings?: Partial<FunnelPageGlobalSettings>;
  popupSettings?: PopupWindowSettings;
  isPopup?: boolean;
  maxHeight?: number;
  fixedHeight?: number;
  virtualWidth?: number;
  className?: string;
}

const getYoutubeThumbnail = (videoUrl?: string): string | null => {
  if (!videoUrl) return null;
  const info = getEmbedVideoInfo(videoUrl);
  if (info.type === 'youtube' && info.videoId) {
    return `https://img.youtube.com/vi/${info.videoId}/hqdefault.jpg`;
  }
  return null;
};

export const LibraryScaledPreview: React.FC<LibraryScaledPreviewProps> = ({
  sections,
  pageSettings,
  popupSettings,
  isPopup = false,
  maxHeight = 320,
  fixedHeight,
  virtualWidth = 1080,
  className = '',
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState<number>(320);
  const [innerHeight, setInnerHeight] = useState<number>(360);

  useEffect(() => {
    const outerEl = outerRef.current;
    if (!outerEl) return;

    const updateWidth = () => {
      const w = outerEl.clientWidth;
      if (w > 20) {
        setFrameWidth(w);
      }
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(outerEl);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const innerEl = innerRef.current;
    if (!innerEl) return;

    const updateHeight = () => {
      const h = innerEl.scrollHeight || innerEl.offsetHeight;
      if (h > 20) {
        setInnerHeight(h);
      }
    };

    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(innerEl);
    return () => ro.disconnect();
  }, [sections, pageSettings, popupSettings, isPopup]);

  const resolvedPopup = resolvePopupSettings(popupSettings);
  const effectiveVirtualWidth = isPopup
    ? Math.max(660, resolvedPopup.maxWidth + 140)
    : virtualWidth;

  const scale = Math.max(0.14, Math.min(1, frameWidth / effectiveVirtualWidth));
  const scaledHeight = Math.max(72, Math.ceil(innerHeight * scale));

  const headingFont = pageSettings?.headingFontFamily || 'Poppins';
  const bodyFont = pageSettings?.bodyFontFamily || 'Inter';
  const primaryColor = pageSettings?.primaryColor || '#2848F0';
  const defaultTextColor = pageSettings?.textColor || '#121111';
  const canvasBg = pageSettings?.pageBgColor || '#FFFFFF';

  const renderElement = (el: PageBlockElement): React.ReactNode => {
    const st = el.styles || {};
    const alignClass =
      st.textAlign === 'center'
        ? 'text-center items-center justify-center'
        : st.textAlign === 'right'
        ? 'text-right items-end justify-end'
        : 'text-left items-start justify-start';

    const wrapStyle: React.CSSProperties = {
      marginTop: st.marginTop !== undefined ? `${st.marginTop}px` : undefined,
      marginBottom: st.marginBottom !== undefined ? `${st.marginBottom}px` : '12px',
      marginLeft: st.marginLeft !== undefined ? `${st.marginLeft}px` : undefined,
      marginRight: st.marginRight !== undefined ? `${st.marginRight}px` : undefined,
      opacity: st.opacity !== undefined ? st.opacity / 100 : undefined,
    };

    if (el.type === 'inner_columns' && el.nestedRow) {
      return (
        <div key={el.id} style={wrapStyle}>
          {renderRow(el.nestedRow, true)}
        </div>
      );
    }

    if (el.type === 'heading') {
      const defaultSize =
        el.content.level === 'h1'
          ? pageSettings?.defaultH1Size || 34
          : el.content.level === 'h3'
          ? pageSettings?.defaultH3Size || 22
          : el.content.level === 'h4'
          ? pageSettings?.defaultH4Size || 18
          : pageSettings?.defaultH2Size || 28;
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            fontSize: `${st.fontSize || defaultSize}px`,
            lineHeight: st.lineHeight || 1.22,
            fontFamily: st.fontFamily || headingFont,
            color: st.textColor || defaultTextColor,
            fontWeight: st.isBold === false ? 500 : 700,
            fontStyle: st.isItalic ? 'italic' : 'normal',
            textDecoration: st.isUnderline ? 'underline' : 'none',
            textTransform: st.textTransform || 'none',
            textAlign: st.textAlign || 'left',
            letterSpacing: st.letterSpacing ? `${st.letterSpacing}px` : undefined,
            backgroundColor: st.bgColor && st.bgColor !== 'transparent' ? st.bgColor : undefined,
            paddingTop: st.paddingTop ? `${st.paddingTop}px` : undefined,
            paddingBottom: st.paddingBottom ? `${st.paddingBottom}px` : undefined,
            paddingLeft: st.paddingLeft ? `${st.paddingLeft}px` : undefined,
            paddingRight: st.paddingRight ? `${st.paddingRight}px` : undefined,
            borderRadius: st.borderRadius ? `${st.borderRadius}px` : undefined,
          }}
          dangerouslySetInnerHTML={{
            __html: el.content.html || el.content.text || 'Titular',
          }}
        />
      );
    }

    if (el.type === 'subheading') {
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            fontSize: `${st.fontSize || 16}px`,
            lineHeight: st.lineHeight || 1.4,
            fontFamily: st.fontFamily || headingFont,
            color: st.textColor || defaultTextColor,
            fontWeight: st.isBold ? 700 : 600,
            fontStyle: st.isItalic ? 'italic' : 'normal',
            textDecoration: st.isUnderline ? 'underline' : 'none',
            textTransform: st.textTransform || 'none',
            textAlign: st.textAlign || 'left',
            letterSpacing: st.letterSpacing ? `${st.letterSpacing}px` : undefined,
            backgroundColor: st.bgColor && st.bgColor !== 'transparent' ? st.bgColor : undefined,
            paddingTop: st.paddingTop ? `${st.paddingTop}px` : undefined,
            paddingBottom: st.paddingBottom ? `${st.paddingBottom}px` : undefined,
            paddingLeft: st.paddingLeft ? `${st.paddingLeft}px` : undefined,
            paddingRight: st.paddingRight ? `${st.paddingRight}px` : undefined,
            borderRadius: st.borderRadius ? `${st.borderRadius}px` : undefined,
          }}
          dangerouslySetInnerHTML={{
            __html: el.content.html || el.content.text || 'Subtítulo',
          }}
        />
      );
    }

    if (el.type === 'paragraph' || el.type === 'rich_text') {
      return (
        <div
          key={el.id}
          style={{
            ...wrapStyle,
            fontSize: `${st.fontSize || 15}px`,
            lineHeight: st.lineHeight || 1.6,
            fontFamily: st.fontFamily || bodyFont,
            color: st.textColor || defaultTextColor,
            fontWeight: st.isBold ? 700 : 400,
            fontStyle: st.isItalic ? 'italic' : 'normal',
            textDecoration: st.isUnderline ? 'underline' : 'none',
            textAlign: st.textAlign || 'left',
            whiteSpace: el.content.html ? undefined : 'pre-line',
            backgroundColor: st.bgColor && st.bgColor !== 'transparent' ? st.bgColor : undefined,
            paddingTop: st.paddingTop ? `${st.paddingTop}px` : undefined,
            paddingBottom: st.paddingBottom ? `${st.paddingBottom}px` : undefined,
            paddingLeft: st.paddingLeft ? `${st.paddingLeft}px` : undefined,
            paddingRight: st.paddingRight ? `${st.paddingRight}px` : undefined,
            borderRadius: st.borderRadius ? `${st.borderRadius}px` : undefined,
          }}
          dangerouslySetInnerHTML={{
            __html: el.content.html || el.content.text || '',
          }}
        />
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
            fontFamily: st.fontFamily || bodyFont,
            fontSize: `${st.fontSize || 15}px`,
            color: st.textColor || defaultTextColor,
          }}
          className="list-none pl-0"
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              style={{ marginBottom: idx < items.length - 1 ? `${spacing}px` : 0 }}
              className="flex items-start gap-2.5"
            >
              <span className="mt-1 shrink-0">
                {renderBulletIcon(bulletIcon, st.fontSize || 15, bulletColor)}
              </span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );
    }

    if (el.type === 'button') {
      const rawText = el.content.buttonText || 'Botón de Acción';
      const formattedText = formatCtaDisplayText(rawText, st.textTransform);
      const BtnIconComp = el.content.buttonIcon
        ? ((LucideIcons as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[
            el.content.buttonIcon
          ] ?? null)
        : null;
      const iconPos = el.content.buttonIconPosition || 'after';
      const iconGap = el.content.buttonIconSpacing ?? 8;
      const iconSize = el.content.buttonIconSize || st.fontSize || 16;

      return (
        <div
          key={el.id}
          style={wrapStyle}
          className={`w-full flex ${
            st.textAlign === 'center'
              ? 'justify-center'
              : st.textAlign === 'right'
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          <div
            style={{
              width: st.fullWidth ? '100%' : undefined,
              backgroundColor: st.bgColor || primaryColor,
              color: st.textColor || '#FFFFFF',
              fontFamily: st.fontFamily || headingFont,
              fontSize: `${st.fontSize || 16}px`,
              fontWeight: st.isBold === false ? 500 : 700,
              fontStyle: st.isItalic ? 'italic' : 'normal',
              textDecoration: st.isUnderline ? 'underline' : 'none',
              paddingTop: `${st.buttonPaddingY ?? st.paddingTop ?? 14}px`,
              paddingBottom: `${st.buttonPaddingY ?? st.paddingBottom ?? 14}px`,
              paddingLeft: `${st.buttonPaddingX ?? st.paddingLeft ?? 28}px`,
              paddingRight: `${st.buttonPaddingX ?? st.paddingRight ?? 28}px`,
              borderRadius: `${st.borderRadius ?? 8}px`,
              borderWidth: st.borderWidth ? `${st.borderWidth}px` : undefined,
              borderColor: st.borderColor || undefined,
              borderStyle: st.borderWidth ? st.borderStyle || 'solid' : undefined,
            }}
            className="inline-flex flex-col items-center justify-center text-center shadow-sm"
          >
            <span className="inline-flex items-center justify-center" style={{ gap: `${iconGap}px` }}>
              {BtnIconComp && iconPos === 'before' && (
                <BtnIconComp style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
              )}
              <span>{formattedText}</span>
              {BtnIconComp && iconPos === 'after' && (
                <BtnIconComp style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
              )}
            </span>
            {el.content.buttonSubtextEnabled && el.content.buttonSubtext && (
              <span
                style={{
                  marginTop: `${el.content.buttonSubtextGap ?? 4}px`,
                  fontSize: `${el.content.buttonSubtextFontSize ?? 12}px`,
                  fontFamily: el.content.buttonSubtextFontFamily || bodyFont,
                  color: el.content.buttonSubtextColor || 'rgba(255,255,255,0.85)',
                  fontWeight: el.content.buttonSubtextBold ? 700 : 400,
                  fontStyle: el.content.buttonSubtextItalic ? 'italic' : 'normal',
                  textDecoration: el.content.buttonSubtextUnderline ? 'underline' : 'none',
                  textTransform: el.content.buttonSubtextTransform || 'none',
                }}
              >
                {el.content.buttonSubtext}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (el.type === 'popup_button') {
      return (
        <div key={el.id} style={wrapStyle}>
          <PopupButtonElement
            element={el}
            isEditable={false}
            defaultPrimaryColor={primaryColor}
            defaultFontFamily={headingFont}
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
          />
        </div>
      );
    }

    if (el.type === 'image') {
      return (
        <div key={el.id} style={wrapStyle} className={`w-full flex ${alignClass}`}>
          {el.content.src ? (
            <ConfiguredImage
              src={el.content.src}
              alt={el.content.alt || 'Imagen'}
              styles={st}
              defaultWidth={520}
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 text-sm">
              Imagen
            </div>
          )}
        </div>
      );
    }

    if (el.type === 'video') {
      const thumb = el.content.videoCoverImage || getYoutubeThumbnail(el.content.videoUrl);
      const maxW = st.maxWidth || '750px';
      return (
        <div key={el.id} style={wrapStyle} className="w-full flex justify-center">
          <div
            style={{
              maxWidth: maxW,
              borderRadius: `${st.borderRadius ?? 12}px`,
              borderWidth: st.borderWidth ? `${st.borderWidth}px` : undefined,
              borderColor: st.borderColor || '#FACC15',
              borderStyle: st.borderWidth ? st.borderStyle || 'solid' : undefined,
            }}
            className="w-full aspect-video bg-zinc-900 relative overflow-hidden flex items-center justify-center shadow-md"
          >
            {thumb && (
              <img
                src={thumb}
                alt="Vista previa de video"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                style={{
                  backgroundColor: el.content.videoCoverPlayBg || '#DC2626',
                  color: el.content.videoCoverPlayColor || '#FFFFFF',
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              >
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </div>
              {el.content.videoCoverText && (
                <span className="px-3 py-1 rounded bg-black/75 text-white text-xs font-bold">
                  {el.content.videoCoverText}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (el.type === 'divider') {
      return (
        <hr
          key={el.id}
          style={{
            ...wrapStyle,
            borderTopWidth: `${st.borderWidth || 1}px`,
            borderColor: st.borderColor || '#E4E4E7',
            borderStyle: st.borderStyle || 'solid',
          }}
        />
      );
    }

    if (el.type === 'spacer') {
      return (
        <div
          key={el.id}
          style={{ height: `${el.content.spacerHeight || 32}px` }}
        />
      );
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
        <div key={el.id} style={wrapStyle} className={`w-full flex ${alignClass}`}>
          <IconElement element={el} isEditable={false} />
        </div>
      );
    }

    if (el.type === 'countdown') {
      return (
        <div key={el.id} style={wrapStyle} className="w-full flex justify-center">
          <CountdownTimerWidget
            endDate={el.content.countdownEndDate}
            daysLabel={el.content.countdownDaysLabel}
            hoursLabel={el.content.countdownHoursLabel}
            minutesLabel={el.content.countdownMinutesLabel}
            secondsLabel={el.content.countdownSecondsLabel}
            theme={el.content.countdownTheme}
          />
        </div>
      );
    }

    if (el.type === 'faq') {
      return (
        <div key={el.id} style={wrapStyle}>
          <FaqAccordionWidget items={el.content.faqItems} />
        </div>
      );
    }

    if (el.type === 'social_links') {
      return (
        <div key={el.id} style={wrapStyle} className={`w-full flex ${alignClass}`}>
          <SocialLinksWidget
            links={el.content.socialLinks}
            size={el.content.socialSize}
            styleType={el.content.socialStyle}
            colorMode={el.content.socialColorMode}
            iconColor={el.content.socialIconColor}
            bgColor={el.content.socialBgColor}
            shape={el.content.socialShape}
          />
        </div>
      );
    }

    if (el.type === 'calendar') {
      return (
        <div
          key={el.id}
          style={wrapStyle}
          className="p-6 rounded-xl border border-zinc-200 bg-white shadow-xs flex flex-col items-center gap-2 text-center"
        >
          <CalendarIcon className="w-8 h-8 text-[#2848F0]" />
          <div className="font-bold text-sm text-zinc-900 font-['Poppins']">
            Calendario de Reservas
          </div>
          <div className="text-xs text-zinc-500">
            Selección de fecha y horario disponible
          </div>
        </div>
      );
    }

    return null;
  };

  const renderColumn = (col: PageBlockColumn): React.ReactNode => {
    const colStyle = getColumnSurfaceStyle(col, { isPreview: true });
    const vAlign =
      col.verticalAlign === 'center'
        ? 'justify-center'
        : col.verticalAlign === 'bottom'
        ? 'justify-end'
        : 'justify-start';

    return (
      <div
        key={col.id}
        style={{
          ...colStyle,
          width: `${col.widthPercentage || 100}%`,
          paddingTop: col.paddingTop !== undefined ? `${col.paddingTop}px` : '8px',
          paddingBottom: col.paddingBottom !== undefined ? `${col.paddingBottom}px` : '8px',
          paddingLeft: col.paddingLeft !== undefined ? `${col.paddingLeft}px` : '12px',
          paddingRight: col.paddingRight !== undefined ? `${col.paddingRight}px` : '12px',
        }}
        className={`flex flex-col ${vAlign} shrink-0 box-border ${getColumnShadowClass(col.shadow)}`}
      >
        {(col.elements || []).map((el) => renderElement(el))}
      </div>
    );
  };

  const renderRow = (row: PageBlockRow, isNested = false): React.ReactNode => {
    const isBoxed = row.widthType !== 'full';
    const rowMaxW = isBoxed ? row.maxWidth || 1040 : undefined;

    return (
      <div
        key={row.id}
        style={{
          maxWidth: !isNested && rowMaxW ? `${rowMaxW}px` : undefined,
          marginLeft: !isNested && isBoxed ? 'auto' : undefined,
          marginRight: !isNested && isBoxed ? 'auto' : undefined,
          marginTop: row.marginTop ? `${row.marginTop}px` : undefined,
          marginBottom: row.marginBottom ? `${row.marginBottom}px` : undefined,
          paddingTop: row.paddingTop !== undefined ? `${row.paddingTop}px` : '4px',
          paddingBottom: row.paddingBottom !== undefined ? `${row.paddingBottom}px` : '4px',
          paddingLeft: row.paddingLeft !== undefined ? `${row.paddingLeft}px` : '0px',
          paddingRight: row.paddingRight !== undefined ? `${row.paddingRight}px` : '0px',
          backgroundColor:
            row.bgColor && row.bgColor !== 'transparent' ? row.bgColor : undefined,
          borderRadius: row.borderRadius ? `${row.borderRadius}px` : undefined,
          borderWidth: row.borderWidth ? `${row.borderWidth}px` : undefined,
          borderColor: row.borderColor || undefined,
          borderStyle: row.borderWidth ? row.borderStyle || 'solid' : undefined,
        }}
        className="w-full flex flex-nowrap items-stretch box-border"
      >
        {(row.columns || []).map((col) => renderColumn(col))}
      </div>
    );
  };

  return (
    <div
      ref={outerRef}
      style={{
        height: fixedHeight ? `${fixedHeight}px` : undefined,
        maxHeight: !fixedHeight ? `${maxHeight}px` : undefined,
      }}
      className={`w-full overflow-y-auto overflow-x-hidden bg-white scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent ${className}`}
    >
      <div
        style={{
          width: '100%',
          height: `${scaledHeight}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: `${effectiveVirtualWidth}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor: isPopup ? '#18181B' : canvasBg,
            padding: isPopup ? '44px 36px' : undefined,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          className="box-border"
        >
          {isPopup ? (
            <div
              style={{ maxWidth: `${resolvedPopup.maxWidth}px` }}
              className="relative mx-auto overflow-visible"
            >
              {/* Corner X Close Button Preview */}
              <div
                style={computePopupCloseButtonStyle(resolvedPopup)}
                className="absolute z-20 flex items-center justify-center shadow-md"
              >
                <X
                  style={{
                    width: `${Math.max(
                      12,
                      Math.round(resolvedPopup.closeBtnSize * 0.5)
                    )}px`,
                    height: `${Math.max(
                      12,
                      Math.round(resolvedPopup.closeBtnSize * 0.5)
                    )}px`,
                  }}
                  strokeWidth={2.5}
                />
              </div>

              <div
                style={{
                  backgroundColor: canvasBg,
                  borderRadius: `${pageSettings?.pageBorderRadius ?? 16}px`,
                }}
                className="w-full overflow-hidden shadow-2xl border border-white/15"
              >
                {resolvedPopup.showTopProgressBar && (
                  <div className="w-full bg-zinc-200/80 border-b border-black/5">
                    <div className="relative w-full h-8 overflow-hidden flex items-center justify-center px-3">
                      <div
                        style={{
                          width: `${Math.max(
                            5,
                            Math.min(100, resolvedPopup.progressBarPercent)
                          )}%`,
                          backgroundColor: resolvedPopup.progressBarColor,
                        }}
                        className="absolute inset-y-0 left-0"
                      />
                      <span
                        style={{ color: resolvedPopup.progressBarTextColor }}
                        className="relative z-10 text-[11px] font-bold truncate font-['Poppins']"
                      >
                        {resolvedPopup.progressBarText}
                      </span>
                    </div>
                  </div>
                )}

                {(sections || []).map((sec) => {
                  const secBgType =
                    sec.bgType ||
                    (sec.bgGradient
                      ? 'gradient'
                      : sec.bgImageUrl
                      ? 'image'
                      : 'solid');
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
                        paddingTop: `${padTop}px`,
                        paddingBottom: `${padBottom}px`,
                        paddingLeft: `${padLeft}px`,
                        paddingRight: `${padRight}px`,
                        backgroundColor: resolvedBg,
                      }}
                      className="relative box-border"
                    >
                      {(sec.rows || []).map((row) => renderRow(row, false))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            (sections || []).map((sec) => {
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
              const padTop = sec.paddingTop ?? sec.paddingY ?? 36;
              const padBottom = sec.paddingBottom ?? sec.paddingY ?? 36;
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
                          effectiveVirtualWidth
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
                    backgroundSize: secBgType === 'image' ? 'cover' : undefined,
                    backgroundPosition:
                      secBgType === 'image' ? 'center' : undefined,
                  }}
                  className="relative box-border"
                >
                  {(sec.rows || []).map((row) => renderRow(row, false))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
