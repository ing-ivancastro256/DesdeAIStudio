import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Heading,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle,
  CreditCard,
  ClipboardList,
  Save,
  Sparkles,
} from 'lucide-react';
import { PopupModal, PageBlockElement, ElementType } from '../../../types';
import { SimpleFormElement } from './SimpleFormElement';

interface PopupEditorModalProps {
  popup: PopupModal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPopup: PopupModal) => void;
}

export const PopupEditorModal: React.FC<PopupEditorModalProps> = ({
  popup,
  isOpen,
  onClose,
  onSave,
}) => {
  const [currentPopup, setCurrentPopup] = useState<PopupModal>({
    ...popup,
    elements: popup.elements || [
      {
        id: `pop_el_${Date.now()}_1`,
        type: 'heading',
        content: { text: '¡Espera! No te vayas sin tu regalo 🎁', level: 'h2' },
        styles: { fontSize: 22, fontFamily: 'Poppins', textColor: '#18181b', isBold: true, textAlign: 'center', marginBottom: 8 },
      },
      {
        id: `pop_el_${Date.now()}_2`,
        type: 'paragraph',
        content: { text: 'Déjanos tus datos para enviarte de inmediato la guía completa y acceder al descuento exclusivo.' },
        styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#52525b', textAlign: 'center', marginBottom: 16 },
      },
      {
        id: `pop_el_${Date.now()}_3`,
        type: 'simple_form',
        content: {
          showNameField: true,
          showPhoneField: false,
          submitButtonText: '🚀 Reclamar Mi Regalo Ahora',
          formSuccessMessage: '¡Te hemos enviado el acceso! Revisa tu email.',
        },
        styles: { marginBottom: 10 },
      },
    ],
  });

  if (!isOpen) return null;

  const addElementToPopup = (type: ElementType) => {
    const newEl: PageBlockElement = {
      id: `pop_el_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      content: {},
      styles: {
        fontSize: 14,
        fontFamily: 'Inter',
        textAlign: 'center',
        marginBottom: 12,
      },
    };

    if (type === 'heading') {
      newEl.content = { text: 'Titular Especial', level: 'h3' };
      newEl.styles.fontSize = 20;
      newEl.styles.isBold = true;
    } else if (type === 'paragraph') {
      newEl.content = { text: 'Escribe aquí el texto que convencerá al usuario de no irse.' };
      newEl.styles.fontSize = 14;
    } else if (type === 'image') {
      newEl.content = {
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
        alt: 'Oferta Especial',
      };
      newEl.styles.borderRadius = 12;
    } else if (type === 'simple_form') {
      newEl.content = {
        showNameField: true,
        submitButtonText: '👉 Quiero la Oferta',
      };
    } else if (type === 'button') {
      newEl.content = { buttonText: '👉 Acceder Ahora' };
      newEl.styles.bgColor = '#2848F0';
      newEl.styles.textColor = '#FFFFFF';
      newEl.styles.borderRadius = 8;
      newEl.styles.paddingTop = 12;
      newEl.styles.paddingBottom = 12;
      newEl.styles.paddingLeft = 24;
      newEl.styles.paddingRight = 24;
    }

    setCurrentPopup({
      ...currentPopup,
      elements: [...currentPopup.elements, newEl],
    });
  };

  const removeElementFromPopup = (elId: string) => {
    setCurrentPopup({
      ...currentPopup,
      elements: currentPopup.elements.filter((el) => el.id !== elId),
    });
  };

  const updateElementInPopup = (elId: string, updatedContent: any) => {
    setCurrentPopup({
      ...currentPopup,
      elements: currentPopup.elements.map((el) =>
        el.id === elId ? { ...el, content: { ...el.content, ...updatedContent } } : el
      ),
    });
  };

  const handleSave = () => {
    onSave(currentPopup);
    onClose();
  };

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[currentPopup.width || 'md'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        className={`bg-white rounded-3xl w-full ${widthClasses} shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* POPUP EDITOR TOP BAR */}
        <div className="bg-zinc-900 text-white px-5 py-3 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold font-['Poppins']">
              Editor de Pop-up: {currentPopup.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Width Selector */}
            <select
              value={currentPopup.width || 'md'}
              onChange={(e) => setCurrentPopup({ ...currentPopup, width: e.target.value as any })}
              className="bg-zinc-800 text-xs px-2 py-1 rounded text-zinc-300 border border-zinc-700 focus:outline-none"
            >
              <option value="sm">Ancho: Pequeño (440px)</option>
              <option value="md">Ancho: Mediano (576px)</option>
              <option value="lg">Ancho: Grande (672px)</option>
            </select>

            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 bg-[#2848F0] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>

            {/* Top right close button (X) */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Cerrar editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOOLBAR FOR ADDING ELEMENTS TO POPUP */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-['Inter'] shrink-0">
            + Añadir elemento:
          </span>
          <button
            type="button"
            onClick={() => addElementToPopup('heading')}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-lg text-xs font-medium text-zinc-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <Heading className="w-3.5 h-3.5 text-zinc-600" />
            <span>Título</span>
          </button>
          <button
            type="button"
            onClick={() => addElementToPopup('paragraph')}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-lg text-xs font-medium text-zinc-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <AlignLeft className="w-3.5 h-3.5 text-zinc-600" />
            <span>Párrafo</span>
          </button>
          <button
            type="button"
            onClick={() => addElementToPopup('image')}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-lg text-xs font-medium text-zinc-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Imagen</span>
          </button>
          <button
            type="button"
            onClick={() => addElementToPopup('simple_form')}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-lg text-xs font-medium text-zinc-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
            <span>Formulario</span>
          </button>
          <button
            type="button"
            onClick={() => addElementToPopup('button')}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-lg text-xs font-medium text-zinc-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Botón</span>
          </button>
        </div>

        {/* POPUP PREVIEW & CANVAS AREA */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-100 flex items-center justify-center">
          <div
            className="relative w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-6 transition-all"
            style={{ backgroundColor: currentPopup.bgColor || '#FFFFFF' }}
          >
            {/* Pop-up Close Button (X in top right as required) */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Botón de cerrar pop-up"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Elements inside the popup */}
            <div className="space-y-4 pt-4">
              {currentPopup.elements.map((el) => (
                <div key={el.id} className="relative group/popelem p-2 border border-transparent hover:border-dashed hover:border-blue-300 rounded-xl transition-all">
                  {/* Delete button on hover */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover/popelem:opacity-100 transition-opacity z-20">
                    <button
                      type="button"
                      onClick={() => removeElementFromPopup(el.id)}
                      className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 cursor-pointer"
                      title="Eliminar elemento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ELEMENT TYPE RENDERING */}
                  {el.type === 'heading' && (
                    <input
                      type="text"
                      value={el.content.text || ''}
                      onChange={(e) => updateElementInPopup(el.id, { text: e.target.value })}
                      className="w-full font-['Poppins'] font-bold text-center text-zinc-900 border-b border-transparent hover:border-zinc-300 focus:border-blue-500 focus:outline-none py-1 text-xl"
                      placeholder="Escribe el título..."
                    />
                  )}

                  {el.type === 'paragraph' && (
                    <textarea
                      rows={2}
                      value={el.content.text || ''}
                      onChange={(e) => updateElementInPopup(el.id, { text: e.target.value })}
                      className="w-full font-['Inter'] text-center text-zinc-600 border border-transparent hover:border-zinc-300 focus:border-blue-500 focus:outline-none p-1 text-xs rounded"
                      placeholder="Escribe el texto descriptivo..."
                    />
                  )}

                  {el.type === 'image' && (
                    <div className="text-center">
                      <img
                        src={el.content.src}
                        alt={el.content.alt || 'Pop-up Image'}
                        className="max-h-48 mx-auto rounded-xl object-cover shadow-xs"
                      />
                      <input
                        type="text"
                        value={el.content.src || ''}
                        onChange={(e) => updateElementInPopup(el.id, { src: e.target.value })}
                        className="mt-1.5 w-full text-[10px] text-zinc-500 border border-zinc-200 rounded px-2 py-0.5"
                        placeholder="URL de la imagen"
                      />
                    </div>
                  )}

                  {el.type === 'simple_form' && (
                    <SimpleFormElement element={el} isEditable={true} />
                  )}

                  {el.type === 'button' && (
                    <div className="text-center">
                      <button
                        type="button"
                        style={{
                          backgroundColor: el.styles.bgColor || '#2848F0',
                          color: el.styles.textColor || '#FFFFFF',
                          borderRadius: `${el.styles.borderRadius || 8}px`,
                        }}
                        className="px-6 py-3 font-['Poppins'] font-bold text-xs shadow-md"
                      >
                        {el.content.buttonText || 'Botón de Acción'}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {currentPopup.elements.length === 0 && (
                <div className="p-8 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
                  <p className="text-xs">El Pop-up está vacío. Añade elementos arriba.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
