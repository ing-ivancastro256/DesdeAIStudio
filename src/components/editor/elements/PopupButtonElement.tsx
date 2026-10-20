import React, { useState } from 'react';
import { Layers, Sparkles, X } from 'lucide-react';
import { PageBlockElement, PopupModal } from '../../../types';
import { SimpleFormElement } from './SimpleFormElement';

interface PopupButtonElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  popups?: PopupModal[];
  onOpenEditor?: () => void;
}

export const PopupButtonElement: React.FC<PopupButtonElementProps> = ({
  element,
  isEditable = false,
  popups = [],
  onOpenEditor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonText = element.content.popupButtonText || '🎁 Ver Oferta Especial (Pop-up)';
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
          submitButtonText: '🚀 Quiero Acceder de Inmediato',
          formSuccessMessage: '¡Gracias! Hemos recibido tus datos y te contactaremos de inmediato.',
        },
        styles: { marginBottom: 8 },
      },
    ],
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const containerStyle: React.CSSProperties = {
    textAlign: element.styles?.textAlign || 'center',
    marginTop: `${element.styles?.marginTop || 0}px`,
    marginBottom: `${element.styles?.marginBottom ?? 20}px`,
    paddingTop: `${element.styles?.paddingTop || 0}px`,
    paddingBottom: `${element.styles?.paddingBottom || 0}px`,
    paddingLeft: `${element.styles?.paddingLeft || 0}px`,
    paddingRight: `${element.styles?.paddingRight || 0}px`,
  };

  return (
    <div style={containerStyle} className="w-full relative">
      <button
        type="button"
        onClick={handleButtonClick}
        style={{
          backgroundColor: element.styles?.bgColor || '#2848F0',
          color: element.styles?.textColor || '#FFFFFF',
          fontSize: `${element.styles?.fontSize || 16}px`,
          fontFamily: element.styles?.fontFamily || 'Poppins',
          fontWeight: element.styles?.isBold ? 700 : 600,
          borderRadius: `${element.styles?.borderRadius ?? 12}px`,
          paddingTop: `${element.styles?.paddingTop || 14}px`,
          paddingBottom: `${element.styles?.paddingBottom || 14}px`,
          paddingLeft: `${element.styles?.paddingLeft || 28}px`,
          paddingRight: `${element.styles?.paddingRight || 28}px`,
        }}
        className="inline-flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>{buttonText}</span>
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
                        alt={el.content.alt || 'Pop-up'}
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
                          borderRadius: `${el.styles?.borderRadius || 8}px`,
                          padding: '12px 24px',
                        }}
                        className="font-bold text-xs shadow-md"
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
