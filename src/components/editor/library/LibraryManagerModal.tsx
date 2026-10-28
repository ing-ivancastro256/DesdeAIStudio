import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  FolderOpen,
  Heart,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { LibraryItem, PageBlockElement, PageBlockRow } from '../../../types';
import { DEFAULT_LIBRARY_CATEGORY } from '../../../utils/libraryUtils';
import { LibraryScaledPreview } from './LibraryScaledPreview';
import { CreatePopupQuickModal } from './CreatePopupQuickModal';

export type LibrarySidebarTab =
  | 'templates'
  | 'blocks'
  | 'popups'
  | 'favorites';

interface LibraryManagerModalProps {
  isOpen: boolean;
  initialTab?: LibrarySidebarTab;
  isCurrentCanvasEmpty: boolean;
  onClose: () => void;
  onInsertBlock: (item: LibraryItem) => void;
  onInsertTemplate: (item: LibraryItem) => void;
  onInsertPopupButton?: (item: LibraryItem) => void;
  onCreatePopupAndEdit?: (createdPopup: LibraryItem) => void;
  onEditItemInEditor: (item: LibraryItem) => void;
}

export const LibraryManagerModal: React.FC<LibraryManagerModalProps> = ({
  isOpen,
  initialTab = 'blocks',
  isCurrentCanvasEmpty,
  onClose,
  onInsertBlock,
  onInsertTemplate,
  onInsertPopupButton,
  onCreatePopupAndEdit,
  onEditItemInEditor,
}) => {
  const {
    funnels,
    libraryItems,
    libraryCategories,
    updateLibraryItem,
    duplicateLibraryItem,
    deleteLibraryItem,
    toggleFavoriteLibraryItem,
    addLibraryCategory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<LibrarySidebarTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sub-modals inside Library
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<LibraryItem | null>(null);
  const [templateConfirmItem, setTemplateConfirmItem] =
    useState<LibraryItem | null>(null);
  const [itemToRename, setItemToRename] = useState<LibraryItem | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const [renameCategory, setRenameCategory] = useState<string>(
    DEFAULT_LIBRARY_CATEGORY
  );
  const [newCatInRename, setNewCatInRename] = useState<string>('');
  const [showNewCatInRename, setShowNewCatInRename] = useState<boolean>(false);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
      setCategoryFilter('ALL');
      setOpenMenuId(null);
      setIsCreatePopupOpen(false);
      setItemToDelete(null);
      setTemplateConfirmItem(null);
      setItemToRename(null);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!openMenuId) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [openMenuId]);

  const counts = useMemo(() => {
    const templates = libraryItems.filter((i) => i.kind === 'template').length;
    const blocks = libraryItems.filter((i) => i.kind === 'block').length;
    const popups = libraryItems.filter((i) => i.kind === 'popup').length;
    const favorites = libraryItems.filter(
      (i) =>
        i.isFavorite &&
        (i.kind === 'template' || i.kind === 'block' || i.kind === 'popup')
    ).length;
    return { templates, blocks, popups, favorites };
  }, [libraryItems]);

  const allAvailableCategories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    const pushUnique = (raw?: string) => {
      const cleaned = (raw || '').trim();
      if (!cleaned) return;
      const lower = cleaned.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        result.push(cleaned);
      }
    };
    libraryCategories.forEach(pushUnique);
    libraryItems.forEach((item) => pushUnique(item.category));
    return result;
  }, [libraryCategories, libraryItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return libraryItems.filter((item) => {
      if (activeTab === 'templates' && item.kind !== 'template') return false;
      if (activeTab === 'blocks' && item.kind !== 'block') return false;
      if (activeTab === 'popups' && item.kind !== 'popup') return false;
      if (activeTab === 'favorites') {
        if (!item.isFavorite) return false;
        if (
          item.kind !== 'template' &&
          item.kind !== 'block' &&
          item.kind !== 'popup'
        )
          return false;
      }

      if (categoryFilter !== 'ALL') {
        const cat = (item.category || DEFAULT_LIBRARY_CATEGORY)
          .trim()
          .toLowerCase();
        if (cat !== categoryFilter.trim().toLowerCase()) return false;
      }

      if (q) {
        const inName = item.name.toLowerCase().includes(q);
        const inCat = (item.category || '').toLowerCase().includes(q);
        if (!inName && !inCat) return false;
      }

      return true;
    });
  }, [libraryItems, activeTab, categoryFilter, searchQuery]);

  // Count how many funnel buttons / automatic triggers currently reference itemToDelete if it's a popup
  const deletePopupUsageCount = useMemo(() => {
    if (!itemToDelete || itemToDelete.kind !== 'popup') return 0;
    const targetId = itemToDelete.id;
    let total = 0;

    const countInRow = (row: PageBlockRow) => {
      (row.columns || []).forEach((col) => {
        (col.elements || []).forEach((el: PageBlockElement) => {
          if (el.type === 'popup_button' && el.content.popupId === targetId) {
            total += 1;
          }
          if (el.type === 'inner_columns' && el.nestedRow) {
            countInRow(el.nestedRow);
          }
        });
      });
    };

    (funnels || []).forEach((fn) => {
      (fn.pages || []).forEach((pg) => {
        if (
          pg.settings?.autoPopupTrigger &&
          pg.settings.autoPopupTrigger !== 'none' &&
          pg.settings.autoPopupId === targetId
        ) {
          total += 1;
        }
        (pg.sections || []).forEach((sec) => {
          (sec.rows || []).forEach((row) => countInRow(row));
        });
      });
    });

    return total;
  }, [itemToDelete, funnels]);

  // Keep selection synced with visible items
  useEffect(() => {
    if (
      selectedItemId &&
      !filteredItems.some((item) => item.id === selectedItemId)
    ) {
      setSelectedItemId(filteredItems[0]?.id ?? null);
    } else if (!selectedItemId && filteredItems.length > 0) {
      setSelectedItemId(filteredItems[0].id);
    }
  }, [filteredItems, selectedItemId]);

  if (!isOpen) return null;

  const selectedItem =
    filteredItems.find((i) => i.id === selectedItemId) || null;

  const handleTriggerInsert = (item: LibraryItem) => {
    if (item.kind === 'popup') {
      if (onInsertPopupButton) {
        onInsertPopupButton(item);
      }
      onClose();
      return;
    }

    if (item.kind === 'block') {
      onInsertBlock(item);
      onClose();
      return;
    }

    if (item.kind === 'template') {
      if (isCurrentCanvasEmpty) {
        onInsertTemplate(item);
        onClose();
      } else {
        setTemplateConfirmItem(item);
      }
    }
  };

  const openRenameDialog = (item: LibraryItem) => {
    setItemToRename(item);
    setRenameValue(item.name);
    setRenameCategory(item.category || DEFAULT_LIBRARY_CATEGORY);
    setNewCatInRename('');
    setShowNewCatInRename(false);
    setOpenMenuId(null);
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToRename) return;
    const finalCat =
      showNewCatInRename && newCatInRename.trim()
        ? addLibraryCategory(newCatInRename.trim())
        : renameCategory;

    updateLibraryItem(itemToRename.id, {
      name: renameValue.trim() || itemToRename.name,
      category: finalCat,
    });
    setItemToRename(null);
  };

  const tabHeading =
    activeTab === 'templates'
      ? 'Plantillas'
      : activeTab === 'blocks'
      ? 'Bloques'
      : activeTab === 'popups'
      ? 'Pop-ups'
      : 'Favoritos';

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-[1px] flex items-center justify-center p-2 sm:p-5 overflow-hidden font-['Inter']"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[1180px] h-[90vh] max-h-[860px] rounded-[4px] shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar: BIBLIOTECA + Close X */}
        <div className="h-12 px-6 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 font-['Poppins']">
            BIBLIOTECA
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
            title="Cerrar Biblioteca"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Main Workspace Split: Left Sidebar | Right Card Grid */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-56 sm:w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0 py-4">
            {/* Search Box */}
            <div className="px-4 mb-5">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-9 pr-7 py-2 text-xs bg-[#F4F4F5] text-zinc-800 placeholder-zinc-400 rounded-[4px] border border-transparent focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* TIPO Section */}
            <div className="px-4 mb-2 flex items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                TIPO
              </span>
              <div className="h-[1px] bg-zinc-200 flex-1" />
            </div>

            <nav className="flex flex-col">
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`w-full px-5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-[#EAECEF] text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                }`}
              >
                <span>Plantillas</span>
                <span className="tabular-nums text-xs font-semibold text-zinc-700">
                  {counts.templates}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('blocks')}
                className={`w-full px-5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'blocks'
                    ? 'bg-[#EAECEF] text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                }`}
              >
                <span>Bloques</span>
                <span className="tabular-nums text-xs font-semibold text-zinc-700">
                  {counts.blocks}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('popups')}
                className={`w-full px-5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'popups'
                    ? 'bg-[#EAECEF] text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                }`}
              >
                <span>Pop-ups</span>
                <span className="tabular-nums text-xs font-semibold text-zinc-700">
                  {counts.popups}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`w-full px-5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-[#EAECEF] text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span>Favoritos</span>
                  <Heart
                    className={`w-3 h-3 ${
                      counts.favorites > 0
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-zinc-400'
                    }`}
                  />
                </span>
                <span className="tabular-nums text-xs font-semibold text-zinc-700">
                  {counts.favorites}
                </span>
              </button>
            </nav>
          </aside>

          {/* Right Main Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Sub-header with Active Title (+ Crear Pop-up button when on Pop-ups) & Category Filter */}
            <div className="px-6 sm:px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-950 font-['Poppins']">
                    {tabHeading}
                  </h2>

                  {activeTab === 'popups' && (
                    <button
                      type="button"
                      onClick={() => setIsCreatePopupOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-[4px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer font-['Poppins']"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Crear Pop-up</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-zinc-500 mt-0.5">
                  {filteredItems.length}{' '}
                  {filteredItems.length === 1
                    ? 'elemento disponible'
                    : 'elementos disponibles'}{' '}
                  •{' '}
                  {activeTab === 'popups'
                    ? 'Haz clic en una tarjeta y pulsa Agregar para insertar un Botón Pop-up vinculado en tu página'
                    : 'Haz clic en una tarjeta y pulsa Agregar para insertarla'}
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-zinc-400 shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs font-medium text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-[4px] px-3 py-1.5 focus:outline-none focus:border-[#2848F0] cursor-pointer"
                >
                  <option value="ALL">Todas las categorías</option>
                  {allAvailableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scrollable 3-Column Card Grid */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8">
              {filteredItems.length === 0 ? (
                <div className="h-64 border border-dashed border-zinc-200 rounded-md flex flex-col items-center justify-center text-center p-6">
                  <p className="text-sm font-semibold text-zinc-700 font-['Poppins']">
                    {activeTab === 'favorites'
                      ? 'Aún no tienes elementos marcados en Favoritos'
                      : activeTab === 'popups'
                      ? 'No se encontraron Pop-ups con ese filtro'
                      : 'No se encontraron elementos con ese filtro'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-md">
                    {activeTab === 'favorites'
                      ? 'Haz clic en el icono de corazón (♥) de cualquier Plantilla, Bloque o Pop-up para tenerlo siempre a mano aquí.'
                      : activeTab === 'popups'
                      ? 'Haz clic en "+ Crear Pop-up" arriba para diseñar un nuevo Pop-up en el constructor.'
                      : 'Prueba cambiando la categoría seleccionada, limpiando el buscador o guardando una nueva sección desde el lienzo.'}
                  </p>
                  {activeTab === 'popups' && (
                    <button
                      type="button"
                      onClick={() => setIsCreatePopupOpen(true)}
                      className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-[4px] shadow-xs flex items-center gap-1.5 cursor-pointer font-['Poppins']"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear Pop-up</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const isMenuOpen = openMenuId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        onDoubleClick={() => handleTriggerInsert(item)}
                        className="flex flex-col group cursor-pointer select-none"
                      >
                        {/* Card Top Row: Name + Heart + 3-Dots Menu */}
                        <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3
                                className={`text-xs font-bold truncate font-['Poppins'] ${
                                  isSelected
                                    ? 'text-[#2848F0]'
                                    : 'text-zinc-900 group-hover:text-[#2848F0]'
                                }`}
                                title={item.name}
                              >
                                {item.name}
                              </h3>
                              {activeTab === 'favorites' && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-[3px] shrink-0">
                                  {item.kind === 'template'
                                    ? 'Plantilla'
                                    : item.kind === 'popup'
                                    ? 'Pop-up'
                                    : 'Bloque'}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">
                              {item.category || DEFAULT_LIBRARY_CATEGORY}
                            </div>
                          </div>

                          {/* Right Actions: Favorite Heart + Three Dots */}
                          <div
                            className="flex items-center gap-1 shrink-0 relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => toggleFavoriteLibraryItem(item.id)}
                              className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                                item.isFavorite
                                  ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                                  : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100'
                              }`}
                              title={
                                item.isFavorite
                                  ? 'Quitar de Favoritos'
                                  : 'Agregar a Favoritos'
                              }
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  item.isFavorite ? 'fill-rose-500' : ''
                                }`}
                              />
                            </button>

                            <div
                              ref={isMenuOpen ? menuContainerRef : undefined}
                              className="relative"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenuId((prev) =>
                                    prev === item.id ? null : item.id
                                  )
                                }
                                className="px-1.5 py-1 bg-[#ECEEF1] hover:bg-zinc-300/80 text-zinc-700 rounded-[3px] transition-colors cursor-pointer flex items-center justify-center"
                                title="Opciones"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-md shadow-xl py-1 z-40">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      onEditItemInEditor(item);
                                    }}
                                    className="w-full px-3 py-2 text-xs text-left text-zinc-800 hover:bg-zinc-100 flex items-center gap-2 font-medium cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-[#2848F0]" />
                                    <span>Editar en constructor</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const created = duplicateLibraryItem(
                                        item.id
                                      );
                                      setOpenMenuId(null);
                                      if (created) {
                                        setSelectedItemId(created.id);
                                      }
                                    }}
                                    className="w-full px-3 py-2 text-xs text-left text-zinc-800 hover:bg-zinc-100 flex items-center gap-2 font-medium cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-zinc-600" />
                                    <span>Clonar / Duplicar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => openRenameDialog(item)}
                                    className="w-full px-3 py-2 text-xs text-left text-zinc-800 hover:bg-zinc-100 flex items-center gap-2 font-medium cursor-pointer"
                                  >
                                    <Tag className="w-3.5 h-3.5 text-zinc-600" />
                                    <span>Renombrar / Categoría</span>
                                  </button>

                                  <div className="my-1 border-t border-zinc-100" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setItemToDelete(item);
                                    }}
                                    className="w-full px-3 py-2 text-xs text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Eliminar</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Rectangular Scaled Preview Frame */}
                        <div
                          className={`p-1.5 bg-[#F4F4F5] border-2 transition-all ${
                            isSelected
                              ? 'border-[#2848F0] ring-2 ring-[#2848F0]/15 shadow-md'
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className="bg-white border border-zinc-200/70 overflow-hidden">
                            <LibraryScaledPreview
                              sections={item.sections}
                              pageSettings={item.pageSettings}
                              isPopup={item.kind === 'popup'}
                              popupSettings={item.popupSettings}
                              fixedHeight={185}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Footer with Bottom-Right "Agregar" Button */}
            <div className="h-16 px-6 sm:px-8 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0 flex-1 text-xs text-zinc-600 truncate">
                {selectedItem ? (
                  <span>
                    Seleccionado:{' '}
                    <strong className="text-zinc-900 font-semibold">
                      {selectedItem.name}
                    </strong>{' '}
                    <span className="text-zinc-400">
                      (
                      {selectedItem.kind === 'template'
                        ? 'Plantilla completa'
                        : selectedItem.kind === 'popup'
                        ? 'Pop-up vinculado en vivo'
                        : 'Bloque de sección'}{' '}
                      • {selectedItem.category || DEFAULT_LIBRARY_CATEGORY})
                    </span>
                  </span>
                ) : (
                  <span>
                    Selecciona una tarjeta de la biblioteca para insertarla en tu
                    página
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-[4px] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={() => {
                    if (selectedItem) {
                      handleTriggerInsert(selectedItem);
                    }
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] disabled:opacity-40 disabled:pointer-events-none rounded-[4px] shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 font-['Poppins']"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SUB-MODAL 0: Create New Pop-up Quick Dialog */}
        <CreatePopupQuickModal
          isOpen={isCreatePopupOpen}
          onClose={() => setIsCreatePopupOpen(false)}
          onCreated={(created) => {
            setIsCreatePopupOpen(false);
            if (onCreatePopupAndEdit) {
              onClose();
              onCreatePopupAndEdit(created);
            } else {
              setSelectedItemId(created.id);
            }
          }}
        />

        {/* SUB-MODAL 1: Confirm Replace Non-Empty Canvas with Template */}
        {templateConfirmItem && (
          <div
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setTemplateConfirmItem(null)}
          >
            <div
              className="bg-white w-full max-w-md rounded-md shadow-2xl border border-zinc-200 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 font-['Poppins']">
                    ¿Reemplazar el contenido actual del lienzo?
                  </h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Tu página actual ya contiene elementos. Al agregar la
                    plantilla{' '}
                    <strong className="text-zinc-900">
                      &quot;{templateConfirmItem.name}&quot;
                    </strong>
                    , se cargará su estructura completa en este lienzo (podrás
                    usar &quot;Deshacer&quot; si deseas volver atrás).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTemplateConfirmItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-[4px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tpl = templateConfirmItem;
                    setTemplateConfirmItem(null);
                    onInsertTemplate(tpl);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-[4px] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Sí, reemplazar y agregar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL 2: Confirm Delete Item from Library */}
        {itemToDelete && (
          <div
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setItemToDelete(null)}
          >
            <div
              className="bg-white w-full max-w-md rounded-md shadow-2xl border border-zinc-200 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 font-['Poppins']">
                    ¿Eliminar de tu Biblioteca?
                  </h4>
                  {itemToDelete.kind === 'popup' ? (
                    <div className="text-xs text-zinc-600 mt-1 leading-relaxed space-y-2">
                      <p>
                        Se eliminará el Pop-up{' '}
                        <strong className="text-zinc-900">
                          &quot;{itemToDelete.name}&quot;
                        </strong>{' '}
                        de tu Biblioteca.
                      </p>
                      {deletePopupUsageCount > 0 ? (
                        <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                          ⚠️ Atención: Actualmente hay{' '}
                          <strong>
                            {deletePopupUsageCount}{' '}
                            {deletePopupUsageCount === 1
                              ? 'botón o página vinculada'
                              : 'botones o páginas vinculadas'}
                          </strong>{' '}
                          a este Pop-up en tus embudos. Si lo eliminas, recuerda
                          vincular otro Pop-up en esos botones.
                        </div>
                      ) : (
                        <p className="text-zinc-500">
                          Actualmente ningún botón en tus embudos está llamando a
                          este Pop-up.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Se eliminará{' '}
                      <strong className="text-zinc-900">
                        &quot;{itemToDelete.name}&quot;
                      </strong>{' '}
                      de la Biblioteca. Las páginas de tus embudos donde ya la
                      hayas insertado anteriormente no se verán afectadas.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-[4px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteLibraryItem(itemToDelete.id);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-[4px] shadow-xs cursor-pointer"
                >
                  Eliminar definitivamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL 3: Quick Rename & Category Edit */}
        {itemToRename && (
          <div
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setItemToRename(null)}
          >
            <form
              onSubmit={handleConfirmRename}
              className="bg-white w-full max-w-md rounded-md shadow-2xl border border-zinc-200 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-900 font-['Poppins']">
                  Renombrar y Categoría
                </h4>
                <button
                  type="button"
                  onClick={() => setItemToRename(null)}
                  className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-[4px] focus:outline-none focus:border-[#2848F0]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Categoría
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInRename((p) => !p)}
                    className="text-[11px] font-semibold text-[#2848F0] hover:underline cursor-pointer"
                  >
                    {showNewCatInRename
                      ? 'Elegir existente'
                      : '+ Nueva categoría'}
                  </button>
                </div>

                {showNewCatInRename ? (
                  <input
                    type="text"
                    value={newCatInRename}
                    onChange={(e) => setNewCatInRename(e.target.value)}
                    placeholder="Escribe el nombre de la nueva categoría..."
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-[4px] focus:outline-none focus:border-[#2848F0]"
                  />
                ) : (
                  <select
                    value={renameCategory}
                    onChange={(e) => setRenameCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-[4px] bg-white focus:outline-none focus:border-[#2848F0]"
                  >
                    {allAvailableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToRename(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-[4px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-[4px] cursor-pointer"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
