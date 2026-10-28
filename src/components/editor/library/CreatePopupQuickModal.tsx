import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layers, Plus, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { LibraryItem } from '../../../types';
import {
  DEFAULT_LIBRARY_CATEGORY,
  DEFAULT_POPUP_SETTINGS,
  createBlankPopupSections,
} from '../../../utils/libraryUtils';

interface CreatePopupQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (createdPopup: LibraryItem) => void;
  suggestedName?: string;
}

export const CreatePopupQuickModal: React.FC<CreatePopupQuickModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  suggestedName = '',
}) => {
  const {
    libraryItems,
    libraryCategories,
    saveLibraryItem,
    addLibraryCategory,
  } = useApp();

  const [name, setName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    DEFAULT_LIBRARY_CATEGORY
  );
  const [showNewCategoryInput, setShowNewCategoryInput] =
    useState<boolean>(false);
  const [newCategoryValue, setNewCategoryValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const allCategories = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    const push = (raw?: string) => {
      const clean = (raw || '').trim();
      if (!clean) return;
      const lower = clean.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        out.push(clean);
      }
    };
    push(DEFAULT_LIBRARY_CATEGORY);
    libraryCategories.forEach(push);
    libraryItems.forEach((item) => push(item.category));
    return out;
  }, [libraryCategories, libraryItems]);

  useEffect(() => {
    if (isOpen) {
      setName(suggestedName.trim() || 'Nuevo Pop-up de Captura');
      setSelectedCategory('Captura / Leads');
      setShowNewCategoryInput(false);
      setNewCategoryValue('');
      setErrorMsg(null);
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
          nameInputRef.current.select();
        }
      }, 40);
    }
  }, [isOpen, suggestedName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('Ingresa un nombre para identificar tu Pop-up.');
      nameInputRef.current?.focus();
      return;
    }

    const finalCategory =
      showNewCategoryInput && newCategoryValue.trim()
        ? addLibraryCategory(newCategoryValue.trim())
        : selectedCategory || DEFAULT_LIBRARY_CATEGORY;

    const created = saveLibraryItem({
      kind: 'popup',
      name: trimmedName,
      category: finalCategory,
      sections: createBlankPopupSections(),
      pageSettings: {
        pageBgColor: '#FFFFFF',
        pageBorderRadius: 16,
        primaryColor: '#2848F0',
        textColor: '#121111',
        headingFontFamily: 'Poppins',
        bodyFontFamily: 'Inter',
      },
      popupSettings: {
        ...DEFAULT_POPUP_SETTINGS,
        maxWidth: 560,
        closeBtnPosition: 'inside',
        closeBtnBgColor: '#18181B',
        closeBtnIconColor: '#FFFFFF',
      },
    });

    onCreated(created);
  };

  return (
    <div
      className="fixed inset-0 z-[85] bg-black/65 backdrop-blur-[1px] flex items-center justify-center p-4 font-['Inter']"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-md shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#2848F0]/10 text-[#2848F0] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 font-['Poppins']">
              Crear Nuevo Pop-up
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Asigna un nombre y categoría a tu Pop-up. Al continuar se abrirá el{' '}
            <strong className="text-zinc-900">Constructor de Pop-up</strong>{' '}
            para diseñarlo visualmente.
          </p>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Nombre del Pop-up
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Ej. Registro Masterclass 2 Pasos"
              className="w-full px-3 py-2 text-xs font-medium text-zinc-900 bg-white border border-zinc-300 rounded-[4px] focus:outline-none focus:border-[#2848F0]"
            />
            {errorMsg && (
              <p className="mt-1 text-[11px] font-medium text-red-600">
                {errorMsg}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-700">
                Categoría
              </label>
              <button
                type="button"
                onClick={() => setShowNewCategoryInput((prev) => !prev)}
                className="text-[11px] font-semibold text-[#2848F0] hover:underline cursor-pointer"
              >
                {showNewCategoryInput ? 'Elegir existente' : '+ Nueva categoría'}
              </button>
            </div>

            {showNewCategoryInput ? (
              <input
                type="text"
                value={newCategoryValue}
                onChange={(e) => setNewCategoryValue(e.target.value)}
                placeholder="Escribe el nombre de la nueva categoría..."
                autoFocus
                className="w-full px-3 py-2 text-xs text-zinc-900 bg-white border border-zinc-300 rounded-[4px] focus:outline-none focus:border-[#2848F0]"
              />
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded-[4px] focus:outline-none focus:border-[#2848F0] cursor-pointer"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-[4px] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-[4px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer font-['Poppins']"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear y Abrir Constructor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
