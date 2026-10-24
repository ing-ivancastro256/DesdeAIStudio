import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PageBlockElement, PopupModal } from '../../../types';
import { SimpleFormElement } from './SimpleFormElement';

interface PopupButtonElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  isSelected?: boolean;
  defaultPrimaryColor?: string;
  defaultFontFamily?: string;
  onUpdateText?: (newText: string) => void;
  popups?: PopupModal[];
  onOpenEditor?: () => void;
}

export const formatCtaDisplayText = (raw: string, transform?: string): string => {
  if (!raw) return raw;
  if (transform === 'uppercase') return raw.toLocaleUpperCase('es');
  if (transform === 'lowercase') return raw.toLocaleLowerCase('es');
  if (transform === 'capitalize') {
    return raw
      .toLocaleLowerCase('es')
      .replace(/(^|[\s¡¿"'(/-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toLocaleUpperCase('es'));
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const dirtyTextRef = useRef<string | null>(null);

  const rawButtonText = element.content.popupButtonText || 'Abrir Oferta en Pop-up';
  const popupId = element.content.popupId || 'popup_1';
  const targetPopup = popups.find((p) => p.id === popupId) || {
    id: popupId,
    name: 'Pop-up Oferta',
    elements: [
      {
        id: 'el_pop_head',
        type: 'heading',
        content: { text: '¡Oferta Especial por Tiempo Limitado!', level: 'h2' },
        styles: { fontSize: 22, fontFamily: 'Poppins', textColor: '#18181b', isBold: true, textAlign: 'center', marginBottom: 8 },
      },
      {
        id: 'el_pop_p',
        type: 'paragraph',
        content: { text: 'Completa tus datos a continuación para acceder a la guía gratuita y agendar tu sesión de asesoría.' },
        styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#52525b', textAlign: 'center', marginBottom: 16 },
      },
      {
        id: 'el_pop_form',
        type: 'simple_form',
        content: {
          showNameField: true,
          showPhoneField: true,
          submitButtonText: 'Quiero Acceder de Inmediato',
          formSuccessMessage: '¡Gracias! Hemos recibido tus datos y te contactaremos de inmediato.',
        },
        styles: { marginBottom: 8 },
      },
    ],
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isEditable) {
      // Allow click to bubble in editor so element gets selected cleanly
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
  const hoverBorder = hasBorder ? (element.styles?.hoverBorderColor || normalBorder) : 'transparent';

  const padY = element.styles?.buttonPaddingY ?? 14;
  const padX = element.styles?.buttonPaddingX ?? 28;
  const fontSize = element.styles?.fontSize || 16;

  const iconName = element.content.buttonIcon || '';
  const IconComp = iconName
    ? ((LucideIcons as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[iconName] || null)
    : null;
  const iconPos = element.content.buttonIconPosition || 'before';
  const iconSpacing = element.content.buttonIconSpacing ?? 8;
  const iconSize = element.content.buttonIconSize ?? Math.max(14, Math.round(fontSize * 1.05));

  const displayText = isEditingInline
    ? rawButtonText
    : formatCtaDisplayText(rawButtonText, element.styles?.textTransform);

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
            fontFamily: element.styles?.fontFamily || defaultFontFamily || 'Poppins',
            fontWeight: element.styles?.isBold ? 700 : 500,
            fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
            textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
            textTransform: element.styles?.textTransform || 'none',
            paddingTop: `${padY}px`,
            paddingBottom: `${padY}px`,
            paddingLeft: `${padX}px`,
            paddingRight: `${padX}px`,
            borderRadius: `${element.styles?.borderRadius ?? 0}px`,
            borderWidth: `${bWidth}px`,
            borderStyle: hasBorder ? (element.styles?.borderStyle || 'solid') : 'none',
            gap: IconComp ? `${iconSpacing}px` : '0px',
            outline: isSelected ? 'none' : undefined,
          } as React.CSSProperties
        }
        className="[background-color:var(--cta-bg)] hover:[background-color:var(--cta-hover-bg)] [color:var(--cta-text)] hover:[color:var(--cta-hover-text)] [border-color:var(--cta-border)] hover:[border-color:var(--cta-hover-border)] inline-flex items-center justify-center shadow-sm transition-colors duration-200 cursor-pointer"
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
      </button>

      {/* POPUP MODAL DISPLAY WHEN TRIGGERED */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden relative p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: targetPopup.bgColor || '#FFFFFF' }}
          >
            {/* Close Button on top right */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Cerrar pop-up"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Render elements inside the popup */}
            <div className="pt-2 space-y-3">
              {targetPopup.elements.map((el) => {
                if (el.type === 'heading') {
                  return (
                    <h3
                      key={el.id}
                      style={{
                        fontSize: `${el.styles?.fontSize || 22}px`,
                        fontFamily: el.styles?.fontFamily || 'Poppins',
                        color: el.styles?.textColor || '#18181b',
                        fontWeight: el.styles?.isBold ? 700 : 600,
                        textAlign: el.styles?.textAlign || 'center',
                        textTransform: el.styles?.textTransform || 'none',
                        marginBottom: `${el.styles?.marginBottom ?? 8}px`,
                      }}
                    >
                      {el.content.text || 'Oferta Exclusiva'}
                    </h3>
                  );
                }
                if (el.type === 'paragraph') {
                  return (
                    <p
                      key={el.id}
                      style={{
                        fontSize: `${el.styles?.fontSize || 14}px`,
                        fontFamily: el.styles?.fontFamily || 'Inter',
                        color: el.styles?.textColor || '#52525b',
                        textAlign: el.styles?.textAlign || 'center',
                        textTransform: el.styles?.textTransform || 'none',
                        marginBottom: `${el.styles?.marginBottom ?? 14}px`,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {el.content.text || ''}
                    </p>
                  );
                }
                if (el.type === 'image' && el.content.src) {
                  return (
                    <div key={el.id} className="text-center mb-3">
                      <img
                        src={el.content.src}
                        alt={el.content.alt || ''}
                        style={{ opacity: el.styles?.opacity ?? 1 }}
                        className="max-h-48 mx-auto rounded-xl object-cover shadow-xs"
                      />
                    </div>
                  );
                }
                if (el.type === 'simple_form') {
                  return (
                    <SimpleFormElement
                      key={el.id}
                      element={el}
                      isEditable={false}
                      onSubmitSuccess={() => {
                        setTimeout(() => setIsOpen(false), 2000);
                      }}
                    />
                  );
                }
                if (el.type === 'button') {
                  return (
                    <div key={el.id} style={{ textAlign: el.styles?.textAlign || 'center' }}>
                      <button
                        type="button"
                        style={{
                          backgroundColor: el.styles?.bgColor || '#2848F0',
                          color: el.styles?.textColor || '#FFFFFF',
                          borderRadius: `${el.styles?.borderRadius ?? 0}px`,
                          paddingTop: `${el.styles?.buttonPaddingY ?? 12}px`,
                          paddingBottom: `${el.styles?.buttonPaddingY ?? 12}px`,
                          paddingLeft: `${el.styles?.buttonPaddingX ?? 24}px`,
                          paddingRight: `${el.styles?.buttonPaddingX ?? 24}px`,
                          textTransform: el.styles?.textTransform || 'none',
                        }}
                        className="font-bold text-xs shadow-md cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        {el.content.buttonText || 'Aceptar'}
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
