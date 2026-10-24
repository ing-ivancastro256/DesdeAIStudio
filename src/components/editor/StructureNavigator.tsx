import React, { useState, useMemo } from 'react';
import {
  PageBlockSection,
  PageBlockRow,
  PageBlockColumn,
  PageBlockElement,
  ElementType,
} from '../../types';
import {
  Layers,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ChevronsDownUp,
  X,
  Type,
  AlignLeft,
  List,
  MousePointerClick,
  Image as ImageIcon,
  PlaySquare,
  FileText,
  Calendar,
  Minus,
  MoveVertical,
  Award,
  Smile,
  Headphones,
  FileCode,
  ExternalLink,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Box,
  Folder,
  Layout,
  Columns,
  Search,
  Sparkles,
  GripVertical,
  Eye,
  EyeOff,
  Radio,
  Timer,
  HelpCircle,
  Share2,
  CheckSquare,
  TextCursorInput,
} from 'lucide-react';

interface StructureNavigatorProps {
  sections: PageBlockSection[];
  selectedSectionId: string | null;
  selectedRowId: string | null;
  selectedElementId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectRow: (sectionId: string, rowId: string) => void;
  onSelectElement: (sectionId: string, rowId: string, columnId: string, elementId: string) => void;
  onSelectPage: () => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onMoveRow: (direction: 'up' | 'down', sectionId: string, rowId: string) => void;
  onMoveElement: (direction: 'up' | 'down', elementId: string) => void;
  onDuplicateSection?: (sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onDuplicateRow?: (rowId: string) => void;
  onDeleteRow?: (rowId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  onDeleteElement?: (elementId: string) => void;
  onReorderElementsInCol?: (colId: string, fromIndex: number, toIndex: number) => void;
  onReorderRowsInSection?: (sectionId: string, fromIndex: number, toIndex: number) => void;
  onReorderSections?: (fromIndex: number, toIndex: number) => void;
  onClose: () => void;
}

// Helper to get corresponding icon for each element type
const getElementIcon = (type: ElementType) => {
  switch (type) {
    case 'heading':
    case 'subheading':
      return <Type className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    case 'paragraph':
      return <AlignLeft className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    case 'bullet_list':
      return <List className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    case 'button':
      return <MousePointerClick className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    case 'image':
      return <ImageIcon className="w-3.5 h-3.5 text-violet-600 shrink-0" />;
    case 'video':
      return <PlaySquare className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
    case 'form':
    case 'simple_form':
      return <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    case 'calendar':
      return <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />;
    case 'divider':
      return <Minus className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    case 'spacer':
      return <MoveVertical className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    case 'icon':
      return <Smile className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
    case 'audio':
      return <Headphones className="w-3.5 h-3.5 text-orange-600 shrink-0" />;
    case 'rich_text':
      return <FileText className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    case 'popup_button':
      return <ExternalLink className="w-3.5 h-3.5 text-pink-600 shrink-0" />;
    case 'countdown':
      return <Timer className="w-3.5 h-3.5 text-orange-600 shrink-0" />;
    case 'faq':
      return <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    case 'social_links':
      return <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    case 'checkbox':
      return <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    case 'input_field':
      return <TextCursorInput className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
    case 'form_button':
      return <MousePointerClick className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    default:
      return <Box className="w-3.5 h-3.5 text-zinc-500 shrink-0" />;
  }
};

// Helper for element user-friendly name
const getElementName = (el: PageBlockElement) => {
  if (el.content?.text) {
    const clean = el.content.text.replace(/<[^>]*>/g, '').trim();
    if (clean) return clean.length > 20 ? clean.substring(0, 20) + '...' : clean;
  }
  if (el.content?.buttonText) {
    return el.content.buttonText.length > 20
      ? el.content.buttonText.substring(0, 20) + '...'
      : el.content.buttonText;
  }
  switch (el.type) {
    case 'heading':
      return 'Encabezado';
    case 'subheading':
      return 'Subtítulo';
    case 'paragraph':
      return 'Párrafo';
    case 'bullet_list':
      return 'Lista con viñetas';
    case 'rich_text':
      return 'Editor de Texto';
    case 'button':
      return 'Botón';
    case 'image':
      return 'Imagen';
    case 'video':
      return 'Vídeo';
    case 'form':
    case 'simple_form':
      return 'Formulario Completo';
    case 'form_button':
      return 'Botón de Formulario';
    case 'popup_button':
      return 'Botón Pop-up';
    case 'calendar':
      return 'Calendario';
    case 'divider':
      return 'Divisor';
    case 'spacer':
      return 'Espaciador';
    case 'countdown':
      return 'Cuenta Regresiva';
    case 'faq':
      return 'Preguntas Frecuentes';
    case 'social_links':
      return 'Redes Sociales';
    case 'checkbox':
      return 'Casilla de Verificación';
    case 'input_field':
      return 'Campo de Formulario';
    case 'icon':
      return 'Icono';
    case 'audio':
      return 'Audio / Música';
    default:
      return 'Elemento';
  }
};

export const StructureNavigator: React.FC<StructureNavigatorProps> = ({
  sections,
  selectedSectionId,
  selectedRowId,
  selectedElementId,
  onSelectSection,
  onSelectRow,
  onSelectElement,
  onSelectPage,
  onMoveSection,
  onMoveRow,
  onMoveElement,
  onDuplicateSection,
  onDeleteSection,
  onDuplicateRow,
  onDeleteRow,
  onDuplicateElement,
  onDeleteElement,
  onReorderElementsInCol,
  onReorderRowsInSection,
  onReorderSections,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Expanded nodes map: id -> boolean (default all expanded)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec) => {
      initial[sec.id] = true;
      sec.rows.forEach((row) => {
        initial[row.id] = true;
        row.columns.forEach((col) => {
          initial[col.id] = true;
        });
      });
    });
    return initial;
  });

  const toggleNode = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  // Check if everything is currently expanded
  const areAllExpanded = useMemo(() => {
    let all = true;
    for (const sec of sections) {
      if (expandedNodes[sec.id] === false) return false;
      for (const row of sec.rows) {
        if (expandedNodes[row.id] === false) return false;
        for (const col of row.columns) {
          if (expandedNodes[col.id] === false) return false;
        }
      }
    }
    return all;
  }, [sections, expandedNodes]);

  // Master Expand All / Collapse All toggle (User requested: "un botón arribita que es como una flecha para arriba, para abajo... todo se expande y todo se contrae")
  const toggleExpandAll = () => {
    const nextState = !areAllExpanded;
    const updated: Record<string, boolean> = {};
    sections.forEach((sec) => {
      updated[sec.id] = nextState;
      sec.rows.forEach((row) => {
        updated[row.id] = nextState;
        row.columns.forEach((col) => {
          updated[col.id] = nextState;
        });
      });
    });
    setExpandedNodes(updated);
  };

  // Drag and drop state for reordering in tree
  const [draggedItem, setDraggedItem] = useState<{
    type: 'section' | 'row' | 'element';
    id: string;
    sectionId?: string;
    rowId?: string;
    columnId?: string;
    index: number;
  } | null>(null);

  // Counts summary
  const stats = useMemo(() => {
    let totalRows = 0;
    let totalElements = 0;
    sections.forEach((sec) => {
      totalRows += sec.rows.length;
      sec.rows.forEach((r) => {
        r.columns.forEach((c) => {
          totalElements += c.elements.length;
        });
      });
    });
    return {
      sections: sections.length,
      rows: totalRows,
      elements: totalElements,
    };
  }, [sections]);

  // Filter sections by search term if active
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return sections;
    const term = searchTerm.toLowerCase();

    return sections
      .map((sec) => {
        const secMatches = sec.name.toLowerCase().includes(term);
        const filteredRows = sec.rows
          .map((row) => {
            const rowMatches = (row.name || '').toLowerCase().includes(term);
            const filteredCols = row.columns
              .map((col) => {
                const filteredEls = col.elements.filter((el) => {
                  const name = getElementName(el).toLowerCase();
                  const type = el.type.toLowerCase();
                  return name.includes(term) || type.includes(term);
                });
                return { ...col, elements: filteredEls };
              })
              .filter((col) => col.elements.length > 0 || rowMatches);
            return { ...row, columns: filteredCols };
          })
          .filter((row) => row.columns.length > 0 || (row.name || '').toLowerCase().includes(term));

        if (secMatches || filteredRows.length > 0) {
          return { ...sec, rows: filteredRows.length > 0 ? filteredRows : sec.rows };
        }
        return null;
      })
      .filter(Boolean) as PageBlockSection[];
  }, [sections, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white select-none font-['Inter'] text-xs text-zinc-700">
      {/* Elementor-style Top Header */}
      <div className="px-3 py-2.5 border-b border-zinc-200 bg-zinc-50/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Master Expand/Collapse button [▲] / [▼] */}
          <button
            type="button"
            onClick={toggleExpandAll}
            className="p-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer shadow-2xs"
            title={areAllExpanded ? 'Contraer todo el árbol' : 'Expandir todos los elementos'}
          >
            {areAllExpanded ? (
              <ChevronsDownUp className="w-3.5 h-3.5 text-zinc-600" />
            ) : (
              <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </button>

          {/* Quick Filter toggle */}
          <button
            type="button"
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchTerm('');
            }}
            className={`p-1 rounded-md border transition-colors cursor-pointer ${
              showSearch
                ? 'bg-blue-50 border-[#2848F0] text-[#2848F0]'
                : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600'
            }`}
            title="Buscar elemento en la estructura"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title: Estructura */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#2848F0]" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-900 font-['Poppins']">
            Estructura
          </h2>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-md transition-colors cursor-pointer"
          title="Cerrar panel de Estructura"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Optional Search / Filter Input */}
      {showSearch && (
        <div className="p-2 border-b border-zinc-200 bg-white animate-in fade-in duration-150">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nombre o tipo..."
              className="w-full pl-7 pr-6 py-1 text-xs border border-zinc-200 rounded-md bg-zinc-50 focus:bg-white focus:outline-[#2848F0]"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {/* Root Page Node */}
        <div
          onClick={onSelectPage}
          className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors group ${
            !selectedSectionId && !selectedRowId && !selectedElementId
              ? 'bg-blue-50/80 text-[#2848F0] font-semibold border border-blue-200'
              : 'hover:bg-zinc-100 text-zinc-800'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <Layout className="w-3.5 h-3.5 text-[#2848F0] shrink-0" />
            <span className="font-semibold text-[11px] truncate">Página (Lienzo Global)</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {stats.sections} sec
          </span>
        </div>

        {/* Section List */}
        {filteredSections.map((section, secIdx) => {
          const isSectionExpanded = expandedNodes[section.id] ?? true;
          const isSectionActive =
            selectedSectionId === section.id && !selectedRowId && !selectedElementId;

          return (
            <div key={section.id} className="pt-0.5">
              {/* SECTION NODE */}
              <div
                draggable
                onDragStart={() => {
                  setDraggedItem({ type: 'section', id: section.id, index: secIdx });
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={() => {
                  if (draggedItem && draggedItem.type === 'section' && onReorderSections) {
                    onReorderSections(draggedItem.index, secIdx);
                    setDraggedItem(null);
                  }
                }}
                onClick={() => onSelectSection(section.id)}
                className={`flex items-center justify-between px-1.5 py-1 rounded-md cursor-pointer transition-colors group ${
                  isSectionActive
                    ? 'bg-blue-50 text-[#2848F0] font-semibold ring-1 ring-blue-300'
                    : 'hover:bg-zinc-100/90 text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0 truncate">
                  {/* Expand / Collapse toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleNode(section.id, e)}
                    className="p-0.5 hover:bg-zinc-200 rounded text-zinc-400 hover:text-zinc-700 cursor-pointer shrink-0"
                  >
                    {isSectionExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <Folder className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate text-[11px]">
                    {section.name || `Sección ${secIdx + 1}`}
                  </span>
                </div>

                {/* Section Quick Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection('up', section.id);
                    }}
                    disabled={secIdx === 0}
                    className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Subir sección"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection('down', section.id);
                    }}
                    disabled={secIdx === sections.length - 1}
                    className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Bajar sección"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  {onDuplicateSection && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateSection(section.id);
                      }}
                      className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded cursor-pointer"
                      title="Duplicar sección"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                  {onDeleteSection && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSection(section.id);
                      }}
                      className="p-0.5 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded cursor-pointer"
                      title="Eliminar sección"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION CHILDREN (ROWS / SECCIONES INTERNAS) */}
              {isSectionExpanded && (
                <div className="ml-3 pl-2 border-l border-zinc-200 space-y-0.5 my-0.5">
                  {section.rows.map((row, rowIdx) => {
                    const isRowExpanded = expandedNodes[row.id] ?? true;
                    const isRowActive =
                      selectedRowId === row.id && !selectedElementId;

                    return (
                      <div key={row.id}>
                        {/* ROW NODE (SECCIÓN INTERNA / BLOQUE DIV) */}
                        <div
                          draggable
                          onDragStart={() => {
                            setDraggedItem({
                              type: 'row',
                              id: row.id,
                              sectionId: section.id,
                              index: rowIdx,
                            });
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={() => {
                            if (
                              draggedItem &&
                              draggedItem.type === 'row' &&
                              draggedItem.sectionId === section.id &&
                              onReorderRowsInSection
                            ) {
                              onReorderRowsInSection(section.id, draggedItem.index, rowIdx);
                              setDraggedItem(null);
                            }
                          }}
                          onClick={() => onSelectRow(section.id, row.id)}
                          className={`flex items-center justify-between px-1.5 py-1 rounded-md cursor-pointer transition-colors group ${
                            isRowActive
                              ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-300'
                              : 'hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-1 min-w-0 truncate">
                            <button
                              type="button"
                              onClick={(e) => toggleNode(row.id, e)}
                              className="p-0.5 hover:bg-zinc-200 rounded text-zinc-400 hover:text-zinc-700 cursor-pointer shrink-0"
                            >
                              {isRowExpanded ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </button>
                            <Box className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate text-[11px]">
                              {row.name || 'Bloque div'}
                            </span>
                          </div>

                          {/* Row Quick Actions */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveRow('up', section.id, row.id);
                              }}
                              disabled={rowIdx === 0}
                              className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Subir fila"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveRow('down', section.id, row.id);
                              }}
                              disabled={rowIdx === section.rows.length - 1}
                              className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Bajar fila"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            {onDuplicateRow && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDuplicateRow(row.id);
                                }}
                                className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded cursor-pointer"
                                title="Duplicar bloque div"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                            {onDeleteRow && section.rows.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteRow(row.id);
                                }}
                                className="p-0.5 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded cursor-pointer"
                                title="Eliminar bloque div"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* ROW CHILDREN (COLUMNS & ELEMENTS) */}
                        {isRowExpanded && (
                          <div className="ml-3 pl-2 border-l border-indigo-100 space-y-0.5 my-0.5">
                            {row.columns.map((column, colIdx) => {
                              const isColExpanded = expandedNodes[column.id] ?? true;
                              const hasElements = column.elements.length > 0;

                              return (
                                <div key={column.id}>
                                  {/* If row has more than 1 column, render Column node */}
                                  {row.columns.length > 1 && (
                                    <div
                                      onClick={(e) => toggleNode(column.id, e)}
                                      className="flex items-center justify-between px-1.5 py-0.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 rounded cursor-pointer"
                                    >
                                      <div className="flex items-center gap-1 min-w-0">
                                        <button
                                          type="button"
                                          onClick={(e) => toggleNode(column.id, e)}
                                          className="p-0.5 text-zinc-400 hover:text-zinc-600"
                                        >
                                          {isColExpanded ? (
                                            <ChevronDown className="w-2.5 h-2.5" />
                                          ) : (
                                            <ChevronRight className="w-2.5 h-2.5" />
                                          )}
                                        </button>
                                        <Columns className="w-3 h-3 text-zinc-400" />
                                        <span className="text-[10px] font-mono text-zinc-500">
                                          Columna {colIdx + 1} ({column.widthPercentage}%)
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* ELEMENTS INSIDE COLUMN */}
                                  {(row.columns.length === 1 || isColExpanded) && (
                                    <div className={row.columns.length > 1 ? 'ml-3 pl-2 border-l border-zinc-200 space-y-0.5' : 'space-y-0.5'}>
                                      {!hasElements ? (
                                        <div className="px-2 py-1 text-[11px] text-zinc-400 italic">
                                          Vacío
                                        </div>
                                      ) : (
                                        column.elements.map((element, elIdx) => {
                                          const isElementActive =
                                            selectedElementId === element.id;

                                          return (
                                            <div
                                              key={element.id}
                                              draggable
                                              onDragStart={() => {
                                                setDraggedItem({
                                                  type: 'element',
                                                  id: element.id,
                                                  sectionId: section.id,
                                                  rowId: row.id,
                                                  columnId: column.id,
                                                  index: elIdx,
                                                });
                                              }}
                                              onDragOver={(e) => {
                                                e.preventDefault();
                                              }}
                                              onDrop={() => {
                                                if (
                                                  draggedItem &&
                                                  draggedItem.type === 'element' &&
                                                  draggedItem.columnId === column.id &&
                                                  onReorderElementsInCol
                                                ) {
                                                  onReorderElementsInCol(column.id, draggedItem.index, elIdx);
                                                  setDraggedItem(null);
                                                }
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectElement(
                                                  section.id,
                                                  row.id,
                                                  column.id,
                                                  element.id
                                                );
                                                // Scroll element smoothly on canvas
                                                const domEl = document.getElementById(element.id);
                                                if (domEl) {
                                                  domEl.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'center',
                                                  });
                                                }
                                              }}
                                              className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-all group ${
                                                isElementActive
                                                  ? 'bg-[#2848F0] text-white font-medium shadow-2xs'
                                                  : 'hover:bg-zinc-100 text-zinc-800'
                                              }`}
                                            >
                                              <div className="flex items-center gap-1.5 min-w-0 truncate">
                                                <div className="cursor-grab active:cursor-grabbing text-zinc-400 group-hover:text-zinc-600">
                                                  <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                                </div>
                                                <div className={isElementActive ? 'text-white' : ''}>
                                                  {getElementIcon(element.type)}
                                                </div>
                                                <span className={`truncate text-[11px] ${isElementActive ? 'text-white font-semibold' : ''}`}>
                                                  {getElementName(element)}
                                                </span>
                                              </div>

                                              {/* Element Quick Actions: Move up/down, duplicate, delete */}
                                              <div
                                                className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                                                  isElementActive ? 'opacity-100' : ''
                                                }`}
                                              >
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onMoveElement('up', element.id);
                                                  }}
                                                  disabled={elIdx === 0}
                                                  className={`p-0.5 rounded cursor-pointer disabled:opacity-30 ${
                                                    isElementActive
                                                      ? 'hover:bg-blue-700 text-white'
                                                      : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
                                                  }`}
                                                  title="Subir elemento"
                                                >
                                                  <ArrowUp className="w-3 h-3" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onMoveElement('down', element.id);
                                                  }}
                                                  disabled={elIdx === column.elements.length - 1}
                                                  className={`p-0.5 rounded cursor-pointer disabled:opacity-30 ${
                                                    isElementActive
                                                      ? 'hover:bg-blue-700 text-white'
                                                      : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
                                                  }`}
                                                  title="Bajar elemento"
                                                >
                                                  <ArrowDown className="w-3 h-3" />
                                                </button>
                                                {onDuplicateElement && (
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      onDuplicateElement(element.id);
                                                    }}
                                                    className={`p-0.5 rounded cursor-pointer ${
                                                      isElementActive
                                                        ? 'hover:bg-blue-700 text-white'
                                                        : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
                                                    }`}
                                                    title="Duplicar elemento"
                                                  >
                                                    <Copy className="w-3 h-3" />
                                                  </button>
                                                )}
                                                {onDeleteElement && (
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      onDeleteElement(element.id);
                                                    }}
                                                    className={`p-0.5 rounded cursor-pointer ${
                                                      isElementActive
                                                        ? 'hover:bg-red-500 text-white'
                                                        : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'
                                                    }`}
                                                    title="Eliminar elemento"
                                                  >
                                                    <Trash2 className="w-3 h-3" />
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info & Summary */}
      <div className="p-2 border-t border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 flex items-center justify-between shrink-0">
        <span className="font-mono">
          {stats.sections} secciones • {stats.rows} bloques • {stats.elements} widgets
        </span>
        <button
          type="button"
          onClick={onSelectPage}
          className="text-[#2848F0] hover:underline font-semibold cursor-pointer"
        >
          Ajustes Lienzo
        </button>
      </div>
    </div>
  );
};
