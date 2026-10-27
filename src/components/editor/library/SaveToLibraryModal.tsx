import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
  FunnelPageGlobalSettings,
  PageBlockSection,
} from '../../../types';
import { DEFAULT_LIBRARY_CATEGORY } from '../../../utils/libraryUtils';
import { LibraryScaledPreview } from './LibraryScaledPreview';

interface SaveToLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: PageBlockSection[];
  pageSettings?: Partial<FunnelPageGlobalSettings>;
  suggestedName?: string;
  sourceType?: 'section' | 'page';
  defaultKind?: 'template' | 'block';
  onOpenLibrary?: (initialTab: 'template' | 'block') => void;
}

export const SaveToLibraryModal: React.FC<SaveToLibraryModalProps> = ({
  isOpen,
  onClose,
  sections,
  pageSettings,
  suggestedName = '',
  sourceType = 'section',
  defaultKind = 'block',
  onOpenLibrary,
}) => {
  const {
    libraryItems,
    libraryCategories,
    saveLibraryItem,
    addLibraryCategory,
  } = useApp();

  const [kind, setKind] = useState<'template' | 'block'>(defaultKind);
  const [name, setName] = useState<string>(suggestedName);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    DEFAULT_LIBRARY_CATEGORY
  );
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setKind(defaultKind);
      setName(
        suggestedName.trim() ||
          (defaultKind === 'block' ? 'Mi Nuevo Bloque' : 'Mi Nueva Plantilla')
      );
      setSelectedCategory(DEFAULT_LIBRARY_CATEGORY);
      setIsCategoryMenuOpen(false);
      setIsAddingNewCategory(false);
      setNewCategoryInput('');
      setNameError(null);

      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
          nameInputRef.current.select();
        }
      }, 40);
    }
  }, [isOpen, defaultKind, suggestedName]);

  useEffect(() => {
    if (!isCategoryMenuOpen) return;
    const handleClickOutside = (ev: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(ev.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryMenuOpen]);

  const matchingCount = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (!q) return 0;
    return libraryItems.filter(
      (item) => item.kind === kind && item.name.toLowerCase().includes(q)
    ).length;
  }, [libraryItems, kind, name]);

  if (!isOpen) return null;

  const handleCreateCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const created = addLibraryCategory(trimmed);
    setSelectedCategory(created);
    setNewCategoryInput('');
    setIsAddingNewCategory(false);
    setIsCategoryMenuOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setNameError(
        kind === 'template'
          ? 'Ingresa un nombre para la plantilla.'
          : 'Ingresa un nombre para el bloque.'
      );
      nameInputRef.current?.focus();
      return;
    }

    saveLibraryItem({
      kind,
      name: cleanName,
      category: selectedCategory || DEFAULT_LIBRARY_CATEGORY,
      sections,
      pageSettings: kind === 'template' ? pageSettings : undefined,
    });
    onClose();
  };

  const sourceWord = sourceType === 'page' ? 'Página' : 'Sección';

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-[1px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['Inter']"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[960px] rounded-[4px] shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: BIBLIOTECA + Close X */}
        <div className="h-12 px-6 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 font-['Poppins']">
            BIBLIOTECA
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="px-6 sm:px-12 py-8 sm:py-10">
          {/* Center Save Tray Icon + Heading + Subtitle */}
          <div className="flex flex-col items-center text-center mb-9">
            <div className="w-24 h-24 bg-[#F7F7F8] border border-zinc-100 flex items-center justify-center mb-4">
              {/* Save-into-tray crisp SVG icon matching reference */}
              <svg
                viewBox="0 0 64 64"
                className="w-14 h-14 text-zinc-950"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M14 10h36a2 2 0 0 1 2 2v18h-5V15H17v15h-5V12a2 2 0 0 1 2-2z" />
                <path d="M28 17h8v11h6L32 39 22 28h6V17z" />
                <path d="M10 30h11v7a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3v-7h11v20a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V30z" />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl text-zinc-600 font-normal font-['Poppins'] tracking-tight">
              Guarda esta {sourceWord} en tu biblioteca{' '}
              <strong className="font-bold text-zinc-950">
                {kind === 'template' ? 'de Plantillas' : 'de Bloques'}
              </strong>
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">
              Las plantillas y bloques guardados se pueden cargar fácilmente en
              tus páginas.
              <br className="hidden sm:inline" /> Actualizar un elemento en la
              biblioteca no afectará al contenido ya publicado.
            </p>
          </div>

          {/* Two-Column Content: Left Rectangular Preview | Right Save Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
            {/* Left Column: Gray Rectangular Frame with Scaled Preview & Vertical Scroll */}
            <div className="md:col-span-6 bg-[#E5E7EB] p-4 sm:p-5 border border-zinc-300/70">
              <div className="bg-white shadow-xs border border-zinc-200/80 overflow-hidden">
                <LibraryScaledPreview
                  sections={sections}
                  pageSettings={pageSettings}
                  maxHeight={310}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Vista previa proporcional en vivo</span>
                <span>Desplaza verticalmente si es extensa ↕</span>
              </div>
            </div>

            {/* Right Column: Save Options */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6 pt-1">
              {/* Guardar Como: Plantilla | Bloque (Bloque default) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-2">
                  Guardar Como
                </label>
                <div className="grid grid-cols-2 border border-zinc-300 rounded-[3px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setKind('template')}
                    className={`py-2.5 px-4 text-sm font-bold transition-colors cursor-pointer font-['Poppins'] ${
                      kind === 'template'
                        ? 'bg-[#59606D] text-white'
                        : 'bg-white text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    Plantilla
                  </button>
                  <button
                    type="button"
                    onClick={() => setKind('block')}
                    className={`py-2.5 px-4 text-sm font-bold border-l border-zinc-300 transition-colors cursor-pointer font-['Poppins'] ${
                      kind === 'block'
                        ? 'bg-[#59606D] text-white'
                        : 'bg-white text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    Bloque
                  </button>
                </div>
              </div>

              {/* Dynamic Name Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {kind === 'template'
                    ? 'Nombre de Plantilla'
                    : 'Nombre de Bloque'}
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder={
                    kind === 'template'
                      ? 'Ej. Carta de Ventas Principal'
                      : 'Ej. Formulario con Imagen'
                  }
                  className="w-full py-2 px-0.5 text-sm font-semibold text-zinc-900 bg-transparent border-0 border-b-2 border-[#4CAF50] focus:outline-none focus:border-[#388E3C] transition-colors"
                />
                {nameError ? (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {nameError}
                  </p>
                ) : (
                  <div className="mt-1.5 text-[11px] text-[#4CAF50] font-medium flex flex-wrap items-center gap-1">
                    <span className="tabular-nums">
                      {matchingCount}{' '}
                      {matchingCount === 1 ? 'resultado' : 'resultados'}.
                    </span>
                    {onOpenLibrary && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenLibrary(kind);
                        }}
                        className="underline hover:text-[#2E7D32] cursor-pointer font-semibold"
                      >
                        Revisar &quot;Mostrar{' '}
                        {kind === 'template'
                          ? 'todas las Plantillas guardadas'
                          : 'todos los Bloques guardados'}
                        &quot;
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Categoría Selector + Create New Category */}
              <div ref={categoryMenuRef} className="relative">
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                  Categoría
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                  className="w-full py-2 px-0.5 text-sm text-zinc-800 bg-transparent border-0 border-b border-zinc-400 hover:border-zinc-700 flex items-center justify-between cursor-pointer text-left transition-colors"
                >
                  <span className="truncate">{selectedCategory}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform ${
                      isCategoryMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-md shadow-xl z-30 overflow-hidden">
                    <div className="max-h-44 overflow-y-auto py-1">
                      {libraryCategories.map((cat) => {
                        const isSelected = cat === selectedCategory;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsCategoryMenuOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-zinc-100 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/70 text-[#2848F0] font-semibold'
                                : 'text-zinc-700'
                            }`}
                          >
                            <span className="truncate">{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Inline Create New Category */}
                    <div className="border-t border-zinc-200 bg-zinc-50 p-2.5">
                      {!isAddingNewCategory ? (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewCategory(true)}
                          className="w-full flex items-center gap-1.5 text-xs font-semibold text-[#2848F0] hover:text-[#1E36B9] py-1 px-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar nueva categoría</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateCategory();
                              }
                            }}
                            placeholder="Nombre de la nueva categoría..."
                            autoFocus
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-zinc-300 rounded focus:outline-none focus:border-[#2848F0]"
                          />
                          <button
                            type="button"
                            onClick={handleCreateCategory}
                            className="px-2.5 py-1.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded cursor-pointer shrink-0"
                          >
                            Crear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button aligned bottom-right */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-[4px] shadow-md transition-colors cursor-pointer font-['Poppins']"
                >
                  {kind === 'template'
                    ? 'Guardar nueva plantilla'
                    : 'Guardar nuevo bloque'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
