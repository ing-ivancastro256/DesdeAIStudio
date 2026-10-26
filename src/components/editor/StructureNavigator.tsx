import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  PageBlockSection,
  PageBlockRow,
  PageBlockColumn,
  PageBlockElement,
  ElementType,
} from '../../types';
import { formatRowDisplayName } from '../../utils/editorTreeUtils';
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
  Smile,
  Headphones,
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
  selectedColumnId?: string | null;
  selectedElementId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectRow: (sectionId: string, rowId: string) => void;
  onSelectColumn?: (sectionId: string, rowId: string, columnId: string) => void;
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
  onMoveElementToColumn?: (elementId: string, targetColId: string, targetIndex: number) => void;
  onMoveRowToSection?: (rowId: string, targetSectionId: string, targetRowIndex: number) => void;
  onPromoteInnerColumnsToRow?: (
    wrapperElementId: string,
    targetSectionId: string,
    targetRowIndex: number
  ) => void;
  onMoveSectionToIndex?: (sectionId: string, targetIndex: number) => void;
  onClose: () => void;
}

type TreeDragItem =
  | {
      kind: 'element';
      elementId: string;
      isInnerColumns: boolean;
      nestedRowId?: string;
      sourceColId: string;
    }
  | {
      kind: 'row';
      rowId: string;
      sourceSectionId: string;
    }
  | {
      kind: 'section';
      sectionId: string;
    };

type TreeDropAction =
  | { type: 'move-section'; sectionId: string; targetIdx: number }
  | { type: 'move-row'; rowId: string; targetSectionId: string; targetRowIdx: number }
  | {
      type: 'promote-inner-to-row';
      elementId: string;
      targetSectionId: string;
      targetRowIdx: number;
    }
  | { type: 'move-element'; elementId: string; targetColId: string; targetIdx: number };

interface TreeDropTarget {
  anchorType:
    | 'section'
    | 'section-header'
    | 'row'
    | 'row-header'
    | 'nested-row'
    | 'row-tail'
    | 'column'
    | 'element'
    | 'empty-col';
  anchorId: string;
  position: 'before' | 'after';
  action: TreeDropAction;
}

const isSameDropTarget = (a: TreeDropTarget | null, b: TreeDropTarget | null): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.anchorType !== b.anchorType || a.anchorId !== b.anchorId || a.position !== b.position) {
    return false;
  }
  return JSON.stringify(a.action) === JSON.stringify(b.action);
};

// Pure blue horizontal drop indicator line (strictly line only, no text)
const TreeDropLine: React.FC<{ position: 'before' | 'after' }> = ({ position }) => (
  <div
    className={`absolute left-0 right-0 h-[2px] bg-[#2848F0] rounded-full z-30 pointer-events-none shadow-[0_0_4px_rgba(40,72,240,0.45)] ${
      position === 'before' ? '-top-[2px]' : '-bottom-[2px]'
    }`}
  />
);

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
    case 'inner_columns':
      return formatRowDisplayName(el.nestedRow?.name, 'Sección Interna');
    default:
      return 'Elemento';
  }
};

export const StructureNavigator: React.FC<StructureNavigatorProps> = ({
  sections,
  selectedSectionId,
  selectedRowId,
  selectedColumnId,
  selectedElementId,
  onSelectSection,
  onSelectRow,
  onSelectColumn,
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
  onMoveElementToColumn,
  onMoveRowToSection,
  onPromoteInnerColumnsToRow,
  onMoveSectionToIndex,
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
          col.elements.forEach((el) => {
            if (el.type === 'inner_columns' && el.nestedRow) {
              initial[el.nestedRow.id] = true;
              el.nestedRow.columns.forEach((nc) => {
                initial[nc.id] = true;
              });
            }
          });
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

  // Drag and drop state + synchronous refs for flicker-free precision
  const [draggedItem, setDraggedItem] = useState<TreeDragItem | null>(null);
  const [dropTarget, setDropTarget] = useState<TreeDropTarget | null>(null);
  const draggedItemRef = useRef<TreeDragItem | null>(null);
  const dropTargetRef = useRef<TreeDropTarget | null>(null);

  const updateDropTarget = (next: TreeDropTarget | null) => {
    if (!isSameDropTarget(dropTargetRef.current, next)) {
      dropTargetRef.current = next;
      setDropTarget(next);
    }
  };

  const clearTreeDragState = () => {
    draggedItemRef.current = null;
    dropTargetRef.current = null;
    setDraggedItem(null);
    setDropTarget(null);
  };

  useEffect(() => {
    let cleanupTimer: ReturnType<typeof setTimeout> | null = null;
    const handleGlobalDragEnd = () => {
      clearTreeDragState();
    };
    const handleGlobalDrop = () => {
      if (cleanupTimer) clearTimeout(cleanupTimer);
      cleanupTimer = setTimeout(() => {
        clearTreeDragState();
      }, 0);
    };
    window.addEventListener('dragend', handleGlobalDragEnd, true);
    window.addEventListener('drop', handleGlobalDrop, true);
    return () => {
      if (cleanupTimer) clearTimeout(cleanupTimer);
      window.removeEventListener('dragend', handleGlobalDragEnd, true);
      window.removeEventListener('drop', handleGlobalDrop, true);
    };
  }, []);

  // Exact index/node lookups against the authoritative `sections` tree
  const getRealSectionIndex = (sectionId: string): number => {
    const idx = sections.findIndex((s) => s.id === sectionId);
    return idx === -1 ? 0 : idx;
  };

  const getRealRowIndex = (sectionId: string, rowId: string): number => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return 0;
    const idx = sec.rows.findIndex((r) => r.id === rowId);
    return idx === -1 ? 0 : idx;
  };

  const getRealColumnById = (
    colId: string
  ): { col: PageBlockColumn; depth: 0 | 1; sectionId: string; rowId: string; nestedRowId?: string } | null => {
    for (const sec of sections) {
      for (const row of sec.rows) {
        for (const col of row.columns) {
          if (col.id === colId) {
            return { col, depth: 0, sectionId: sec.id, rowId: row.id };
          }
          for (const el of col.elements) {
            if (el.type === 'inner_columns' && el.nestedRow) {
              for (const nCol of el.nestedRow.columns) {
                if (nCol.id === colId) {
                  return {
                    col: nCol,
                    depth: 1,
                    sectionId: sec.id,
                    rowId: row.id,
                    nestedRowId: el.nestedRow.id,
                  };
                }
              }
            }
          }
        }
      }
    }
    return null;
  };

  const getRealElementIndexInCol = (colId: string, elementId: string): number => {
    const found = getRealColumnById(colId);
    if (!found) return 0;
    const idx = found.col.elements.findIndex((el) => el.id === elementId);
    return idx === -1 ? found.col.elements.length : idx;
  };

  // Auto-expand ancestor containers when dropping an item inside a collapsed node
  const expandAncestorsForColumn = (colId: string) => {
    const found = getRealColumnById(colId);
    if (!found) return;
    setExpandedNodes((prev) => ({
      ...prev,
      [found.sectionId]: true,
      [found.rowId]: true,
      ...(found.nestedRowId ? { [found.nestedRowId]: true } : {}),
      [colId]: true,
    }));
  };

  const commitDrop = (e: React.DragEvent) => {
    if (!draggedItemRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const target = dropTargetRef.current;
    const drag = draggedItemRef.current;
    clearTreeDragState();

    if (!target) return;

    const { action } = target;
    if (action.type === 'move-element') {
      expandAncestorsForColumn(action.targetColId);
      if (onMoveElementToColumn) {
        onMoveElementToColumn(action.elementId, action.targetColId, action.targetIdx);
      } else if (
        drag.kind === 'element' &&
        drag.sourceColId === action.targetColId &&
        onReorderElementsInCol
      ) {
        const fromIdx = getRealElementIndexInCol(drag.sourceColId, action.elementId);
        const toIdx = fromIdx < action.targetIdx ? action.targetIdx - 1 : action.targetIdx;
        onReorderElementsInCol(action.targetColId, fromIdx, toIdx);
      }
    } else if (action.type === 'promote-inner-to-row') {
      setExpandedNodes((prev) => ({ ...prev, [action.targetSectionId]: true }));
      if (onPromoteInnerColumnsToRow) {
        onPromoteInnerColumnsToRow(action.elementId, action.targetSectionId, action.targetRowIdx);
      }
    } else if (action.type === 'move-row') {
      setExpandedNodes((prev) => ({ ...prev, [action.targetSectionId]: true }));
      if (onMoveRowToSection) {
        onMoveRowToSection(action.rowId, action.targetSectionId, action.targetRowIdx);
      } else if (
        drag.kind === 'row' &&
        drag.sourceSectionId === action.targetSectionId &&
        onReorderRowsInSection
      ) {
        const fromIdx = getRealRowIndex(drag.sourceSectionId, action.rowId);
        const toIdx = fromIdx < action.targetRowIdx ? action.targetRowIdx - 1 : action.targetRowIdx;
        onReorderRowsInSection(action.targetSectionId, fromIdx, toIdx);
      }
    } else if (action.type === 'move-section') {
      if (onMoveSectionToIndex) {
        onMoveSectionToIndex(action.sectionId, action.targetIdx);
      } else if (onReorderSections) {
        const fromIdx = getRealSectionIndex(action.sectionId);
        const toIdx = fromIdx < action.targetIdx ? action.targetIdx - 1 : action.targetIdx;
        onReorderSections(fromIdx, toIdx);
      }
    }
  };

  // Check if everything is currently expanded
  const areAllExpanded = useMemo(() => {
    for (const sec of sections) {
      if (expandedNodes[sec.id] === false) return false;
      for (const row of sec.rows) {
        if (expandedNodes[row.id] === false) return false;
        for (const col of row.columns) {
          if (expandedNodes[col.id] === false) return false;
          for (const el of col.elements) {
            if (el.type === 'inner_columns' && el.nestedRow) {
              if (expandedNodes[el.nestedRow.id] === false) return false;
              for (const nc of el.nestedRow.columns) {
                if (expandedNodes[nc.id] === false) return false;
              }
            }
          }
        }
      }
    }
    return true;
  }, [sections, expandedNodes]);

  // Master Expand All / Collapse All toggle
  const toggleExpandAll = () => {
    const nextState = !areAllExpanded;
    const updated: Record<string, boolean> = {};
    sections.forEach((sec) => {
      updated[sec.id] = nextState;
      sec.rows.forEach((row) => {
        updated[row.id] = nextState;
        row.columns.forEach((col) => {
          updated[col.id] = nextState;
          col.elements.forEach((el) => {
            if (el.type === 'inner_columns' && el.nestedRow) {
              updated[el.nestedRow.id] = nextState;
              el.nestedRow.columns.forEach((nc) => {
                updated[nc.id] = nextState;
              });
            }
          });
        });
      });
    });
    setExpandedNodes(updated);
  };

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
      <div
        className="flex-1 overflow-y-auto p-1.5 space-y-0.5"
        onDragOver={(e) => {
          if (draggedItemRef.current) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }
        }}
        onDragLeave={(e) => {
          const related = e.relatedTarget as Node | null;
          if (!related || !e.currentTarget.contains(related)) {
            updateDropTarget(null);
          }
        }}
        onDrop={commitDrop}
      >
        {/* Root Page Node */}
        <div
          onClick={onSelectPage}
          className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors group ${
            !selectedSectionId && !selectedRowId && !selectedColumnId && !selectedElementId
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
            selectedSectionId === section.id && !selectedRowId && !selectedColumnId && !selectedElementId;
          const isDraggingSection =
            draggedItem?.kind === 'section' && draggedItem.sectionId === section.id;

          const showSectionBefore =
            dropTarget?.anchorType === 'section' &&
            dropTarget.anchorId === section.id &&
            dropTarget.position === 'before';
          const showSectionAfter =
            dropTarget?.anchorType === 'section' &&
            dropTarget.anchorId === section.id &&
            dropTarget.position === 'after';
          const showSectionHeaderAfter =
            dropTarget?.anchorType === 'section-header' &&
            dropTarget.anchorId === section.id &&
            dropTarget.position === 'after';

          return (
            <div
              key={section.id}
              className={`pt-0.5 relative ${isDraggingSection ? 'opacity-45' : ''}`}
              onDragOver={(e) => {
                const drag = draggedItemRef.current;
                if (!drag || drag.kind !== 'section') return;
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
                if (drag.sectionId === section.id) {
                  updateDropTarget(null);
                  return;
                }
                const rect = e.currentTarget.getBoundingClientRect();
                const pos: 'before' | 'after' =
                  e.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
                const realSecIdx = getRealSectionIndex(section.id);
                updateDropTarget({
                  anchorType: 'section',
                  anchorId: section.id,
                  position: pos,
                  action: {
                    type: 'move-section',
                    sectionId: drag.sectionId,
                    targetIdx: pos === 'before' ? realSecIdx : realSecIdx + 1,
                  },
                });
              }}
              onDrop={commitDrop}
            >
              {showSectionBefore && <TreeDropLine position="before" />}
              {showSectionAfter && <TreeDropLine position="after" />}

              {/* SECTION HEADER NODE */}
              <div
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', section.id);
                  const item: TreeDragItem = { kind: 'section', sectionId: section.id };
                  draggedItemRef.current = item;
                  setDraggedItem(item);
                }}
                onDragEnd={() => {
                  clearTreeDragState();
                }}
                onDragOver={(e) => {
                  const drag = draggedItemRef.current;
                  if (!drag) return;
                  if (drag.kind === 'section') {
                    return; // Handled by outer section container
                  }
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = 'move';

                  if (drag.kind === 'row') {
                    updateDropTarget({
                      anchorType: 'section-header',
                      anchorId: section.id,
                      position: 'after',
                      action: {
                        type: 'move-row',
                        rowId: drag.rowId,
                        targetSectionId: section.id,
                        targetRowIdx: 0,
                      },
                    });
                    return;
                  }

                  if (drag.kind === 'element') {
                    if (drag.isInnerColumns) {
                      updateDropTarget({
                        anchorType: 'section-header',
                        anchorId: section.id,
                        position: 'after',
                        action: {
                          type: 'promote-inner-to-row',
                          elementId: drag.elementId,
                          targetSectionId: section.id,
                          targetRowIdx: 0,
                        },
                      });
                    } else {
                      const realSec = sections.find((s) => s.id === section.id) || section;
                      const firstColId = realSec.rows[0]?.columns[0]?.id;
                      if (firstColId) {
                        updateDropTarget({
                          anchorType: 'section-header',
                          anchorId: section.id,
                          position: 'after',
                          action: {
                            type: 'move-element',
                            elementId: drag.elementId,
                            targetColId: firstColId,
                            targetIdx: 0,
                          },
                        });
                      }
                    }
                  }
                }}
                onDrop={commitDrop}
                onClick={() => onSelectSection(section.id)}
                className={`relative flex items-center justify-between px-1.5 py-1 rounded-md cursor-pointer transition-colors group ${
                  isSectionActive
                    ? 'bg-blue-50 text-[#2848F0] font-semibold ring-1 ring-blue-300'
                    : 'hover:bg-zinc-100/90 text-zinc-800'
                }`}
              >
                {showSectionHeaderAfter && <TreeDropLine position="after" />}

                <div className="flex items-center gap-1 min-w-0 truncate">
                  <div className="cursor-grab active:cursor-grabbing text-zinc-400 group-hover:text-zinc-600 shrink-0">
                    <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </div>
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

              {/* SECTION CHILDREN (ROWS / BLOQUES DIV) */}
              {isSectionExpanded && (
                <div className="ml-3 pl-2 border-l border-zinc-200 space-y-0.5 my-0.5">
                  {section.rows.map((row, rowIdx) => {
                    const isRowExpanded = expandedNodes[row.id] ?? true;
                    const isRowActive =
                      selectedRowId === row.id && !selectedColumnId && !selectedElementId;
                    const isDraggingRow =
                      draggedItem?.kind === 'row' && draggedItem.rowId === row.id;

                    const showRowBefore =
                      dropTarget?.anchorType === 'row' &&
                      dropTarget.anchorId === row.id &&
                      dropTarget.position === 'before';
                    const showRowAfter =
                      dropTarget?.anchorType === 'row' &&
                      dropTarget.anchorId === row.id &&
                      dropTarget.position === 'after';
                    const showRowHeaderAfter =
                      dropTarget?.anchorType === 'row-header' &&
                      dropTarget.anchorId === row.id &&
                      dropTarget.position === 'after';

                    const renderElementLeaf = (
                      parentRowId: string,
                      parentCol: PageBlockColumn,
                      element: PageBlockElement,
                      elIdx: number,
                      colDepth: 0 | 1
                    ) => {
                      const isElementActive = selectedElementId === element.id;
                      const isDraggingElement =
                        draggedItem?.kind === 'element' && draggedItem.elementId === element.id;
                      const showElBefore =
                        dropTarget?.anchorType === 'element' &&
                        dropTarget.anchorId === element.id &&
                        dropTarget.position === 'before';
                      const showElAfter =
                        dropTarget?.anchorType === 'element' &&
                        dropTarget.anchorId === element.id &&
                        dropTarget.position === 'after';

                      return (
                        <div
                          key={element.id}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', element.id);
                            const item: TreeDragItem = {
                              kind: 'element',
                              elementId: element.id,
                              isInnerColumns: false,
                              sourceColId: parentCol.id,
                            };
                            draggedItemRef.current = item;
                            setDraggedItem(item);
                          }}
                          onDragEnd={() => {
                            clearTreeDragState();
                          }}
                          onDragOver={(e) => {
                            const drag = draggedItemRef.current;
                            if (!drag || drag.kind !== 'element') return;
                            e.preventDefault();
                            e.stopPropagation();

                            if (drag.isInnerColumns && colDepth === 1) {
                              updateDropTarget(null);
                              return;
                            }
                            if (drag.elementId === element.id) {
                              updateDropTarget(null);
                              return;
                            }

                            e.dataTransfer.dropEffect = 'move';
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos: 'before' | 'after' =
                              e.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
                            const realElIdx = getRealElementIndexInCol(parentCol.id, element.id);
                            updateDropTarget({
                              anchorType: 'element',
                              anchorId: element.id,
                              position: pos,
                              action: {
                                type: 'move-element',
                                elementId: drag.elementId,
                                targetColId: parentCol.id,
                                targetIdx: pos === 'before' ? realElIdx : realElIdx + 1,
                              },
                            });
                          }}
                          onDrop={commitDrop}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectElement(
                              section.id,
                              parentRowId,
                              parentCol.id,
                              element.id
                            );
                            const domEl = document.getElementById(element.id);
                            if (domEl) {
                              domEl.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                              });
                            }
                          }}
                          className={`relative flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-all group ${
                            isDraggingElement ? 'opacity-45' : ''
                          } ${
                            isElementActive
                              ? 'bg-[#2848F0] text-white font-medium shadow-2xs'
                              : 'hover:bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {showElBefore && <TreeDropLine position="before" />}
                          {showElAfter && <TreeDropLine position="after" />}

                          <div className="flex items-center gap-1.5 min-w-0 truncate">
                            <div
                              className={`cursor-grab active:cursor-grabbing shrink-0 ${
                                isElementActive
                                  ? 'text-blue-200 group-hover:text-white'
                                  : 'text-zinc-400 group-hover:text-zinc-600'
                              }`}
                            >
                              <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                            </div>
                            <div className={isElementActive ? 'text-white' : ''}>
                              {getElementIcon(element.type)}
                            </div>
                            <span
                              className={`truncate text-[11px] ${
                                isElementActive ? 'text-white font-semibold' : ''
                              }`}
                            >
                              {getElementName(element)}
                            </span>
                          </div>

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
                              disabled={elIdx === parentCol.elements.length - 1}
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
                    };

                    return (
                      <div
                        key={row.id}
                        className={`relative ${isDraggingRow ? 'opacity-45' : ''}`}
                        onDragOver={(e) => {
                          const drag = draggedItemRef.current;
                          if (!drag || drag.kind !== 'row') return;
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = 'move';
                          if (drag.rowId === row.id) {
                            updateDropTarget(null);
                            return;
                          }
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pos: 'before' | 'after' =
                            e.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
                          const realRowIdx = getRealRowIndex(section.id, row.id);
                          updateDropTarget({
                            anchorType: 'row',
                            anchorId: row.id,
                            position: pos,
                            action: {
                              type: 'move-row',
                              rowId: drag.rowId,
                              targetSectionId: section.id,
                              targetRowIdx: pos === 'before' ? realRowIdx : realRowIdx + 1,
                            },
                          });
                        }}
                        onDrop={commitDrop}
                      >
                        {showRowBefore && <TreeDropLine position="before" />}
                        {showRowAfter && <TreeDropLine position="after" />}

                        {/* ROW HEADER NODE (BLOQUE DIV) */}
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', row.id);
                            const item: TreeDragItem = {
                              kind: 'row',
                              rowId: row.id,
                              sourceSectionId: section.id,
                            };
                            draggedItemRef.current = item;
                            setDraggedItem(item);
                          }}
                          onDragEnd={() => {
                            clearTreeDragState();
                          }}
                          onDragOver={(e) => {
                            const drag = draggedItemRef.current;
                            if (!drag) return;
                            if (drag.kind === 'section' || drag.kind === 'row') {
                              return; // Handled by outer section or row wrapper
                            }

                            e.preventDefault();
                            e.stopPropagation();
                            e.dataTransfer.dropEffect = 'move';

                            const rect = e.currentTarget.getBoundingClientRect();
                            const relY = e.clientY - rect.top;
                            const realSec = sections.find((s) => s.id === section.id) || section;
                            const realRow = realSec.rows.find((r) => r.id === row.id) || row;
                            const targetOuterCol = realRow.columns[0];
                            if (!targetOuterCol) return;

                            if (drag.isInnerColumns) {
                              if (relY < rect.height / 2) {
                                const realRowIdx = getRealRowIndex(section.id, row.id);
                                updateDropTarget({
                                  anchorType: 'row',
                                  anchorId: row.id,
                                  position: 'before',
                                  action: {
                                    type: 'promote-inner-to-row',
                                    elementId: drag.elementId,
                                    targetSectionId: section.id,
                                    targetRowIdx: realRowIdx,
                                  },
                                });
                              } else {
                                const insertAt = isRowExpanded ? 0 : targetOuterCol.elements.length;
                                updateDropTarget({
                                  anchorType: 'row-header',
                                  anchorId: row.id,
                                  position: 'after',
                                  action: {
                                    type: 'move-element',
                                    elementId: drag.elementId,
                                    targetColId: targetOuterCol.id,
                                    targetIdx: insertAt,
                                  },
                                });
                              }
                              return;
                            }

                            // Regular element dropped onto Bloque div header -> moves up/into Bloque div
                            const insertAt = isRowExpanded ? 0 : targetOuterCol.elements.length;
                            updateDropTarget({
                              anchorType: 'row-header',
                              anchorId: row.id,
                              position: 'after',
                              action: {
                                type: 'move-element',
                                elementId: drag.elementId,
                                targetColId: targetOuterCol.id,
                                targetIdx: insertAt,
                              },
                            });
                          }}
                          onDrop={commitDrop}
                          onClick={() => onSelectRow(section.id, row.id)}
                          className={`relative flex items-center justify-between px-1.5 py-1 rounded-md cursor-pointer transition-colors group ${
                            isRowActive
                              ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-300'
                              : 'hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {showRowHeaderAfter && <TreeDropLine position="after" />}

                          <div className="flex items-center gap-1 min-w-0 truncate">
                            <div className="cursor-grab active:cursor-grabbing text-zinc-400 group-hover:text-zinc-600 shrink-0">
                              <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                            </div>
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
                              {formatRowDisplayName(row.name, 'Bloque div')}
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
                              const isColActive =
                                selectedColumnId === column.id && !selectedElementId;
                              const showOuterColHeaderAfter =
                                dropTarget?.anchorType === 'column' &&
                                dropTarget.anchorId === column.id &&
                                dropTarget.position === 'after';
                              const showOuterEmptyCol =
                                dropTarget?.anchorType === 'empty-col' &&
                                dropTarget.anchorId === column.id;

                              return (
                                <div key={column.id}>
                                  {/* Render Column node when >1 column or column has custom styling */}
                                  {(row.columns.length > 1 || column.bgColor || column.bgGradient) && (
                                    <div
                                      onDragOver={(e) => {
                                        const drag = draggedItemRef.current;
                                        if (!drag || drag.kind !== 'element') return;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.dataTransfer.dropEffect = 'move';
                                        const realCol = getRealColumnById(column.id)?.col || column;
                                        const targetIdx = isColExpanded ? 0 : realCol.elements.length;
                                        updateDropTarget({
                                          anchorType: 'column',
                                          anchorId: column.id,
                                          position: 'after',
                                          action: {
                                            type: 'move-element',
                                            elementId: drag.elementId,
                                            targetColId: column.id,
                                            targetIdx,
                                          },
                                        });
                                      }}
                                      onDrop={commitDrop}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelectColumn) {
                                          onSelectColumn(section.id, row.id, column.id);
                                        } else {
                                          toggleNode(column.id, e);
                                        }
                                      }}
                                      className={`relative flex items-center justify-between px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                        isColActive
                                          ? 'bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-300'
                                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                      }`}
                                    >
                                      {showOuterColHeaderAfter && <TreeDropLine position="after" />}
                                      <div className="flex items-center gap-1 min-w-0">
                                        <button
                                          type="button"
                                          onClick={(e) => toggleNode(column.id, e)}
                                          className="p-0.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                                        >
                                          {isColExpanded ? (
                                            <ChevronDown className="w-2.5 h-2.5" />
                                          ) : (
                                            <ChevronRight className="w-2.5 h-2.5" />
                                          )}
                                        </button>
                                        <Columns className="w-3 h-3 text-teal-600 shrink-0" />
                                        <span className="text-[10px] font-mono truncate">
                                          Columna {colIdx + 1} ({Math.round(column.widthPercentage)}%)
                                        </span>
                                        {(column.bgColor || column.bgGradient) && (
                                          <span
                                            style={
                                              column.bgGradient
                                                ? { backgroundImage: column.bgGradient }
                                                : { backgroundColor: column.bgColor }
                                            }
                                            className="w-2.5 h-2.5 rounded-full border border-zinc-300 shrink-0"
                                          />
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* ELEMENTS INSIDE COLUMN */}
                                  {(row.columns.length === 1 && !column.bgColor && !column.bgGradient
                                    ? true
                                    : isColExpanded) && (
                                    <div
                                      className={
                                        row.columns.length > 1 || column.bgColor || column.bgGradient
                                          ? 'ml-3 pl-2 border-l border-zinc-200 space-y-0.5'
                                          : 'space-y-0.5'
                                      }
                                    >
                                      {!hasElements ? (
                                        <div
                                          onDragOver={(e) => {
                                            const drag = draggedItemRef.current;
                                            if (!drag || drag.kind !== 'element') return;
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.dataTransfer.dropEffect = 'move';
                                            updateDropTarget({
                                              anchorType: 'empty-col',
                                              anchorId: column.id,
                                              position: 'before',
                                              action: {
                                                type: 'move-element',
                                                elementId: drag.elementId,
                                                targetColId: column.id,
                                                targetIdx: 0,
                                              },
                                            });
                                          }}
                                          onDrop={commitDrop}
                                          className="relative px-2 py-1 text-[11px] text-zinc-400 italic rounded hover:bg-zinc-50"
                                        >
                                          {showOuterEmptyCol && <TreeDropLine position="before" />}
                                          Vacío
                                        </div>
                                      ) : (
                                        column.elements.map((element, elIdx) => {
                                          if (element.type === 'inner_columns' && element.nestedRow) {
                                            const nRow = element.nestedRow;
                                            const isNestedRowExpanded = expandedNodes[nRow.id] ?? true;
                                            const isNestedRowActive =
                                              selectedRowId === nRow.id &&
                                              !selectedColumnId &&
                                              !selectedElementId;
                                            const isDraggingNested =
                                              draggedItem?.kind === 'element' &&
                                              draggedItem.elementId === element.id;

                                            const showNestedBefore =
                                              dropTarget?.anchorType === 'nested-row' &&
                                              dropTarget.anchorId === nRow.id &&
                                              dropTarget.position === 'before';
                                            const showNestedAfter =
                                              dropTarget?.anchorType === 'nested-row' &&
                                              dropTarget.anchorId === nRow.id &&
                                              dropTarget.position === 'after';
                                            const showNestedTailAfter =
                                              dropTarget?.anchorType === 'row-tail' &&
                                              dropTarget.anchorId === element.id &&
                                              dropTarget.position === 'after';

                                            return (
                                              <div
                                                key={element.id}
                                                className={`relative space-y-0.5 ${
                                                  isDraggingNested ? 'opacity-45' : ''
                                                }`}
                                              >
                                                <div
                                                  draggable
                                                  onDragStart={(e) => {
                                                    e.stopPropagation();
                                                    e.dataTransfer.effectAllowed = 'move';
                                                    e.dataTransfer.setData('text/plain', element.id);
                                                    const item: TreeDragItem = {
                                                      kind: 'element',
                                                      elementId: element.id,
                                                      isInnerColumns: true,
                                                      nestedRowId: nRow.id,
                                                      sourceColId: column.id,
                                                    };
                                                    draggedItemRef.current = item;
                                                    setDraggedItem(item);
                                                  }}
                                                  onDragEnd={() => {
                                                    clearTreeDragState();
                                                  }}
                                                  onDragOver={(e) => {
                                                    const drag = draggedItemRef.current;
                                                    if (!drag || drag.kind !== 'element') return;
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    if (drag.elementId === element.id) {
                                                      updateDropTarget(null);
                                                      return;
                                                    }

                                                    e.dataTransfer.dropEffect = 'move';
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const relY = e.clientY - rect.top;
                                                    const realWrapperIdx = getRealElementIndexInCol(
                                                      column.id,
                                                      element.id
                                                    );

                                                    if (drag.isInnerColumns) {
                                                      const pos: 'before' | 'after' =
                                                        relY < rect.height / 2 ? 'before' : 'after';
                                                      updateDropTarget({
                                                        anchorType:
                                                          pos === 'after' && isNestedRowExpanded
                                                            ? 'row-tail'
                                                            : 'nested-row',
                                                        anchorId:
                                                          pos === 'after' && isNestedRowExpanded
                                                            ? element.id
                                                            : nRow.id,
                                                        position: pos,
                                                        action: {
                                                          type: 'move-element',
                                                          elementId: drag.elementId,
                                                          targetColId: column.id,
                                                          targetIdx:
                                                            pos === 'before'
                                                              ? realWrapperIdx
                                                              : realWrapperIdx + 1,
                                                        },
                                                      });
                                                      return;
                                                    }

                                                    // Regular element over Sección Interna header:
                                                    // If collapsed -> before/after in parent Bloque div column (subir de nivel)
                                                    if (!isNestedRowExpanded) {
                                                      const pos: 'before' | 'after' =
                                                        relY < rect.height / 2 ? 'before' : 'after';
                                                      updateDropTarget({
                                                        anchorType: 'nested-row',
                                                        anchorId: nRow.id,
                                                        position: pos,
                                                        action: {
                                                          type: 'move-element',
                                                          elementId: drag.elementId,
                                                          targetColId: column.id,
                                                          targetIdx:
                                                            pos === 'before'
                                                              ? realWrapperIdx
                                                              : realWrapperIdx + 1,
                                                        },
                                                      });
                                                      return;
                                                    }

                                                    // If expanded -> top 65% places BEFORE Sección Interna in parent Bloque div (subir de nivel),
                                                    // bottom 35% places into first nested column
                                                    if (relY < rect.height * 0.65 || !nRow.columns[0]) {
                                                      updateDropTarget({
                                                        anchorType: 'nested-row',
                                                        anchorId: nRow.id,
                                                        position: 'before',
                                                        action: {
                                                          type: 'move-element',
                                                          elementId: drag.elementId,
                                                          targetColId: column.id,
                                                          targetIdx: realWrapperIdx,
                                                        },
                                                      });
                                                    } else {
                                                      updateDropTarget({
                                                        anchorType: 'nested-row',
                                                        anchorId: nRow.id,
                                                        position: 'after',
                                                        action: {
                                                          type: 'move-element',
                                                          elementId: drag.elementId,
                                                          targetColId: nRow.columns[0].id,
                                                          targetIdx: 0,
                                                        },
                                                      });
                                                    }
                                                  }}
                                                  onDrop={commitDrop}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectRow(section.id, nRow.id);
                                                  }}
                                                  className={`relative flex items-center justify-between px-1.5 py-1 rounded-md cursor-pointer transition-colors group ${
                                                    isNestedRowActive
                                                      ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-300'
                                                      : 'hover:bg-zinc-100 text-zinc-700'
                                                  }`}
                                                >
                                                  {showNestedBefore && <TreeDropLine position="before" />}
                                                  {showNestedAfter && <TreeDropLine position="after" />}

                                                  <div className="flex items-center gap-1 min-w-0 truncate">
                                                    <div className="cursor-grab active:cursor-grabbing text-zinc-400 group-hover:text-zinc-600 shrink-0">
                                                      <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                                    </div>
                                                    <button
                                                      type="button"
                                                      onClick={(e) => toggleNode(nRow.id, e)}
                                                      className="p-0.5 hover:bg-zinc-200 rounded text-zinc-400 hover:text-zinc-700 cursor-pointer shrink-0"
                                                    >
                                                      {isNestedRowExpanded ? (
                                                        <ChevronDown className="w-3 h-3" />
                                                      ) : (
                                                        <ChevronRight className="w-3 h-3" />
                                                      )}
                                                    </button>
                                                    <Box className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                    <span className="truncate text-[11px]">
                                                      {formatRowDisplayName(nRow.name, 'Sección Interna')}
                                                    </span>
                                                  </div>

                                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        onMoveElement('up', element.id);
                                                      }}
                                                      disabled={elIdx === 0}
                                                      className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded disabled:opacity-30 cursor-pointer"
                                                      title="Subir sección interna"
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
                                                      className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded disabled:opacity-30 cursor-pointer"
                                                      title="Bajar sección interna"
                                                    >
                                                      <ArrowDown className="w-3 h-3" />
                                                    </button>
                                                    {onDuplicateRow && (
                                                      <button
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          onDuplicateRow(nRow.id);
                                                        }}
                                                        className="p-0.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 rounded cursor-pointer"
                                                        title="Duplicar sección interna"
                                                      >
                                                        <Copy className="w-3 h-3" />
                                                      </button>
                                                    )}
                                                    {onDeleteRow && (
                                                      <button
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          onDeleteRow(nRow.id);
                                                        }}
                                                        className="p-0.5 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded cursor-pointer"
                                                        title="Eliminar sección interna"
                                                      >
                                                        <Trash2 className="w-3 h-3" />
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>

                                                {isNestedRowExpanded && (
                                                  <div className="ml-3 pl-2 border-l border-indigo-100 space-y-0.5">
                                                    {nRow.columns.map((nCol, nColIdx) => {
                                                      const isNColExpanded = expandedNodes[nCol.id] ?? true;
                                                      const isNColActive =
                                                        selectedColumnId === nCol.id && !selectedElementId;
                                                      const showNColHeaderAfter =
                                                        dropTarget?.anchorType === 'column' &&
                                                        dropTarget.anchorId === nCol.id &&
                                                        dropTarget.position === 'after';
                                                      const showNColEmpty =
                                                        dropTarget?.anchorType === 'empty-col' &&
                                                        dropTarget.anchorId === nCol.id;

                                                      return (
                                                        <div key={nCol.id}>
                                                          <div
                                                            onDragOver={(e) => {
                                                              const drag = draggedItemRef.current;
                                                              if (!drag || drag.kind !== 'element') return;
                                                              e.preventDefault();
                                                              e.stopPropagation();
                                                              if (drag.isInnerColumns) {
                                                                updateDropTarget(null);
                                                                return;
                                                              }
                                                              e.dataTransfer.dropEffect = 'move';
                                                              const realNCol =
                                                                getRealColumnById(nCol.id)?.col || nCol;
                                                              const targetIdx = isNColExpanded
                                                                ? 0
                                                                : realNCol.elements.length;
                                                              updateDropTarget({
                                                                anchorType: 'column',
                                                                anchorId: nCol.id,
                                                                position: 'after',
                                                                action: {
                                                                  type: 'move-element',
                                                                  elementId: drag.elementId,
                                                                  targetColId: nCol.id,
                                                                  targetIdx,
                                                                },
                                                              });
                                                            }}
                                                            onDrop={commitDrop}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              if (onSelectColumn) {
                                                                onSelectColumn(section.id, nRow.id, nCol.id);
                                                              }
                                                            }}
                                                            className={`relative flex items-center justify-between px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                                              isNColActive
                                                                ? 'bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-300'
                                                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                                            }`}
                                                          >
                                                            {showNColHeaderAfter && (
                                                              <TreeDropLine position="after" />
                                                            )}
                                                            <div className="flex items-center gap-1 min-w-0">
                                                              <button
                                                                type="button"
                                                                onClick={(e) => toggleNode(nCol.id, e)}
                                                                className="p-0.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                                                              >
                                                                {isNColExpanded ? (
                                                                  <ChevronDown className="w-2.5 h-2.5" />
                                                                ) : (
                                                                  <ChevronRight className="w-2.5 h-2.5" />
                                                                )}
                                                              </button>
                                                              <Columns className="w-3 h-3 text-teal-600 shrink-0" />
                                                              <span className="text-[10px] font-mono truncate">
                                                                Columna {nColIdx + 1} (
                                                                {Math.round(nCol.widthPercentage)}%)
                                                              </span>
                                                              {(nCol.bgColor || nCol.bgGradient) && (
                                                                <span
                                                                  style={
                                                                    nCol.bgGradient
                                                                      ? { backgroundImage: nCol.bgGradient }
                                                                      : { backgroundColor: nCol.bgColor }
                                                                  }
                                                                  className="w-2.5 h-2.5 rounded-full border border-zinc-300 shrink-0"
                                                                />
                                                              )}
                                                            </div>
                                                          </div>

                                                          {isNColExpanded && (
                                                            <div className="ml-3 pl-2 border-l border-zinc-200 space-y-0.5">
                                                              {nCol.elements.length === 0 ? (
                                                                <div
                                                                  onDragOver={(e) => {
                                                                    const drag = draggedItemRef.current;
                                                                    if (!drag || drag.kind !== 'element')
                                                                      return;
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    if (drag.isInnerColumns) {
                                                                      updateDropTarget(null);
                                                                      return;
                                                                    }
                                                                    e.dataTransfer.dropEffect = 'move';
                                                                    updateDropTarget({
                                                                      anchorType: 'empty-col',
                                                                      anchorId: nCol.id,
                                                                      position: 'before',
                                                                      action: {
                                                                        type: 'move-element',
                                                                        elementId: drag.elementId,
                                                                        targetColId: nCol.id,
                                                                        targetIdx: 0,
                                                                      },
                                                                    });
                                                                  }}
                                                                  onDrop={commitDrop}
                                                                  className="relative px-2 py-1 text-[11px] text-zinc-400 italic rounded hover:bg-zinc-50"
                                                                >
                                                                  {showNColEmpty && (
                                                                    <TreeDropLine position="before" />
                                                                  )}
                                                                  Vacío
                                                                </div>
                                                              ) : (
                                                                nCol.elements.map((nEl, nElIdx) =>
                                                                  renderElementLeaf(
                                                                    nRow.id,
                                                                    nCol,
                                                                    nEl,
                                                                    nElIdx,
                                                                    1
                                                                  )
                                                                )
                                                              )}
                                                            </div>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                )}

                                                {/* Tail drop strip right below expanded Sección Interna to easily move an element up a level AFTER Sección Interna */}
                                                {isNestedRowExpanded && (
                                                  <div
                                                    onDragOver={(e) => {
                                                      const drag = draggedItemRef.current;
                                                      if (!drag || drag.kind !== 'element') return;
                                                      if (drag.elementId === element.id) return;
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      e.dataTransfer.dropEffect = 'move';
                                                      const realWrapperIdx = getRealElementIndexInCol(
                                                        column.id,
                                                        element.id
                                                      );
                                                      updateDropTarget({
                                                        anchorType: 'row-tail',
                                                        anchorId: element.id,
                                                        position: 'after',
                                                        action: {
                                                          type: 'move-element',
                                                          elementId: drag.elementId,
                                                          targetColId: column.id,
                                                          targetIdx: realWrapperIdx + 1,
                                                        },
                                                      });
                                                    }}
                                                    onDrop={commitDrop}
                                                    className="relative h-1.5 w-full"
                                                  >
                                                    {showNestedTailAfter && (
                                                      <TreeDropLine position="after" />
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          }

                                          return renderElementLeaf(row.id, column, element, elIdx, 0);
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
