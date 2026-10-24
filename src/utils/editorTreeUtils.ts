import React from 'react';
import {
  PageBlockSection,
  PageBlockRow,
  PageBlockColumn,
  PageBlockElement,
} from '../types';

const uid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

export const cloneElementWithFreshIds = (el: PageBlockElement): PageBlockElement => {
  const copy: PageBlockElement = JSON.parse(JSON.stringify(el));
  copy.id = uid('el');
  if (copy.type === 'inner_columns' && copy.nestedRow) {
    copy.nestedRow = cloneRowWithFreshIds(copy.nestedRow);
  }
  return copy;
};

export const cloneRowWithFreshIds = (row: PageBlockRow): PageBlockRow => {
  const copy: PageBlockRow = JSON.parse(JSON.stringify(row));
  copy.id = uid('row');
  copy.columns = copy.columns.map((col) => ({
    ...col,
    id: uid('col'),
    elements: col.elements.map((el) => cloneElementWithFreshIds(el)),
  }));
  return copy;
};

export const formatRowDisplayName = (
  name?: string,
  fallback = 'Sección Interna'
): string => {
  const cleaned = (name || '')
    .replace(/\s*\(\d+\s*(?:col|columnas?)\)\s*$/i, '')
    .trim();
  return cleaned || fallback;
};

export const createInnerColumnsRow = (numCols: number): PageBlockRow => {
  const count = Math.max(1, Math.min(4, numCols));
  const widthPercentage = Number((100 / count).toFixed(2));
  const newColumns: PageBlockColumn[] = Array.from({ length: count }, (_, i) => ({
    id: uid(`col_${i + 1}`),
    name: `Columna ${i + 1}`,
    widthPercentage,
    elements: [],
  }));

  return {
    id: uid('row'),
    name: 'Sección Interna',
    marginTop: 0,
    marginBottom: 16,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    columns: newColumns,
  };
};

export const createInnerColumnsElement = (numCols: number): PageBlockElement => {
  const nestedRow = createInnerColumnsRow(numCols);
  return {
    id: uid('el_cols'),
    type: 'inner_columns',
    nestedRow,
    content: {},
    styles: {
      marginTop: 0,
      marginBottom: 16,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  };
};

// Recursively map elements at depth 0 and depth 1
const mapRowElements = (
  row: PageBlockRow,
  fn: (el: PageBlockElement, col: PageBlockColumn, depth: 0 | 1) => PageBlockElement,
  depth: 0 | 1
): PageBlockRow => ({
  ...row,
  columns: row.columns.map((col) => ({
    ...col,
    elements: col.elements.map((el) => {
      let nextEl = fn(el, col, depth);
      if (depth === 0 && nextEl.type === 'inner_columns' && nextEl.nestedRow) {
        nextEl = {
          ...nextEl,
          nestedRow: mapRowElements(nextEl.nestedRow, fn, 1),
        };
      }
      return nextEl;
    }),
  })),
});

export const updateElementInSections = (
  sections: PageBlockSection[],
  elementId: string,
  updater: (el: PageBlockElement) => PageBlockElement
): PageBlockSection[] =>
  sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowElements(
        row,
        (el) => (el.id === elementId ? updater(el) : el),
        0
      )
    ),
  }));

const mapRowColumns = (
  row: PageBlockRow,
  fn: (col: PageBlockColumn, depth: 0 | 1) => PageBlockColumn,
  depth: 0 | 1
): PageBlockRow => ({
  ...row,
  columns: row.columns.map((col) => {
    const updatedCol = fn(col, depth);
    if (depth === 0) {
      return {
        ...updatedCol,
        elements: updatedCol.elements.map((el) =>
          el.type === 'inner_columns' && el.nestedRow
            ? { ...el, nestedRow: mapRowColumns(el.nestedRow, fn, 1) }
            : el
        ),
      };
    }
    return updatedCol;
  }),
});

export const updateColumnInSections = (
  sections: PageBlockSection[],
  columnId: string,
  updatedProps: Partial<PageBlockColumn>
): PageBlockSection[] =>
  sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowColumns(
        row,
        (col) => (col.id === columnId ? { ...col, ...updatedProps } : col),
        0
      )
    ),
  }));

export const updateRowInSections = (
  sections: PageBlockSection[],
  rowId: string,
  updatedProps: Partial<PageBlockRow>
): PageBlockSection[] =>
  sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) => {
      if (row.id === rowId) {
        return { ...row, ...updatedProps };
      }
      return {
        ...row,
        columns: row.columns.map((col) => ({
          ...col,
          elements: col.elements.map((el) => {
            if (el.type === 'inner_columns' && el.nestedRow?.id === rowId) {
              return {
                ...el,
                nestedRow: { ...el.nestedRow, ...updatedProps },
              };
            }
            return el;
          }),
        })),
      };
    }),
  }));

export const resizeRowColumnsCount = (
  row: PageBlockRow,
  targetCount: number
): PageBlockRow => {
  const count = Math.max(1, Math.min(4, targetCount));
  const widthPercentage = Number((100 / count).toFixed(2));
  const currentCols = [...row.columns];

  if (count === currentCols.length) {
    return {
      ...row,
      columns: currentCols.map((c) => ({ ...c, widthPercentage })),
    };
  }

  if (count > currentCols.length) {
    const added: PageBlockColumn[] = Array.from(
      { length: count - currentCols.length },
      (_, idx) => ({
        id: uid(`col_${currentCols.length + idx + 1}`),
        name: `Columna ${currentCols.length + idx + 1}`,
        widthPercentage,
        elements: [],
      })
    );
    return {
      ...row,
      name: row.name?.startsWith('Sección Interna')
        ? 'Sección Interna'
        : row.name,
      columns: [...currentCols.map((c) => ({ ...c, widthPercentage })), ...added],
    };
  }

  // Merging overflow columns' elements into the last surviving column so no content is lost
  const kept = currentCols.slice(0, count).map((c) => ({ ...c, widthPercentage }));
  const removed = currentCols.slice(count);
  const overflowElements = removed.flatMap((c) => c.elements);
  if (overflowElements.length > 0) {
    const lastIdx = kept.length - 1;
    kept[lastIdx] = {
      ...kept[lastIdx],
      elements: [...kept[lastIdx].elements, ...overflowElements],
    };
  }
  return {
    ...row,
    name: row.name?.startsWith('Sección Interna')
      ? 'Sección Interna'
      : row.name,
    columns: kept,
  };
};

export const insertElementIntoColumn = (
  sections: PageBlockSection[],
  colId: string,
  atIndex: number,
  newElement: PageBlockElement
): PageBlockSection[] =>
  sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowColumns(
        row,
        (col) => {
          if (col.id !== colId) return col;
          const updatedElements = [...col.elements];
          const clamped = Math.max(0, Math.min(updatedElements.length, atIndex));
          updatedElements.splice(clamped, 0, newElement);
          return { ...col, elements: updatedElements };
        },
        0
      )
    ),
  }));

export const findColumnDepth = (
  sections: PageBlockSection[],
  colId: string
): 0 | 1 | null => {
  for (const sec of sections) {
    for (const row of sec.rows) {
      for (const col of row.columns) {
        if (col.id === colId) return 0;
        for (const el of col.elements) {
          if (el.type === 'inner_columns' && el.nestedRow) {
            if (el.nestedRow.columns.some((nc) => nc.id === colId)) {
              return 1;
            }
          }
        }
      }
    }
  }
  return null;
};

export const findElementById = (
  sections: PageBlockSection[],
  elementId: string
): PageBlockElement | null => {
  for (const sec of sections) {
    for (const row of sec.rows) {
      for (const col of row.columns) {
        for (const el of col.elements) {
          if (el.id === elementId) return el;
          if (el.type === 'inner_columns' && el.nestedRow) {
            for (const nc of el.nestedRow.columns) {
              const found = nc.elements.find((ne) => ne.id === elementId);
              if (found) return found;
            }
          }
        }
      }
    }
  }
  return null;
};

export const removeElementFromSections = (
  sections: PageBlockSection[],
  elementId: string
): { nextSections: PageBlockSection[]; removedElement: PageBlockElement | null; sourceColId: string | null; sourceIndex: number } => {
  let removedElement: PageBlockElement | null = null;
  let sourceColId: string | null = null;
  let sourceIndex = -1;

  const nextSections = sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowColumns(
        row,
        (col) => {
          const idx = col.elements.findIndex((e) => e.id === elementId);
          if (idx !== -1) {
            removedElement = col.elements[idx];
            sourceColId = col.id;
            sourceIndex = idx;
            return {
              ...col,
              elements: col.elements.filter((e) => e.id !== elementId),
            };
          }
          return col;
        },
        0
      )
    ),
  }));

  return { nextSections, removedElement, sourceColId, sourceIndex };
};

export const moveElementInSections = (
  sections: PageBlockSection[],
  elementId: string,
  direction: 'up' | 'down'
): { nextSections: PageBlockSection[]; moved: boolean } => {
  let moved = false;
  const nextSections = sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowColumns(
        row,
        (col) => {
          const idx = col.elements.findIndex((e) => e.id === elementId);
          if (idx === -1) return col;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= col.elements.length) return col;
          const updated = [...col.elements];
          const [item] = updated.splice(idx, 1);
          updated.splice(targetIdx, 0, item);
          moved = true;
          return { ...col, elements: updated };
        },
        0
      )
    ),
  }));
  return { nextSections, moved };
};

export const duplicateElementInSections = (
  sections: PageBlockSection[],
  elementId: string
): { nextSections: PageBlockSection[]; newElement: PageBlockElement | null } => {
  let newElement: PageBlockElement | null = null;
  const nextSections = sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowColumns(
        row,
        (col) => {
          const idx = col.elements.findIndex((e) => e.id === elementId);
          if (idx === -1) return col;
          const cloned = cloneElementWithFreshIds(col.elements[idx]);
          newElement = cloned;
          const updated = [...col.elements];
          updated.splice(idx + 1, 0, cloned);
          return { ...col, elements: updated };
        },
        0
      )
    ),
  }));
  return { nextSections, newElement };
};

export const reorderElementsInColInSections = (
  sections: PageBlockSection[],
  colId: string,
  fromIndex: number,
  toIndex: number
): PageBlockSection[] => {
  if (fromIndex === toIndex) return sections;
  return sections.map((sec) => ({
    ...sec,
    rows: sec.rows.map((row) =>
      mapRowColumns(
        row,
        (col) => {
          if (col.id !== colId) return col;
          if (
            fromIndex < 0 ||
            fromIndex >= col.elements.length ||
            toIndex < 0 ||
            toIndex >= col.elements.length
          ) {
            return col;
          }
          const updated = [...col.elements];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return { ...col, elements: updated };
        },
        0
      )
    ),
  }));
};

export const duplicateRowInSections = (
  sections: PageBlockSection[],
  rowId: string
): { nextSections: PageBlockSection[]; newRowId: string | null } => {
  let newRowId: string | null = null;

  const nextSections = sections.map((sec) => {
    const topIdx = sec.rows.findIndex((r) => r.id === rowId);
    if (topIdx !== -1) {
      const cloned = cloneRowWithFreshIds(sec.rows[topIdx]);
      cloned.name = `${sec.rows[topIdx].name || 'Sección Interna'} (Copia)`;
      newRowId = cloned.id;
      const newRows = [...sec.rows];
      newRows.splice(topIdx + 1, 0, cloned);
      return { ...sec, rows: newRows };
    }

    // Check nested rows inside depth-0 columns
    return {
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          const nestedElIdx = col.elements.findIndex(
            (el) => el.type === 'inner_columns' && el.nestedRow?.id === rowId
          );
          if (nestedElIdx === -1) return col;
          const clonedEl = cloneElementWithFreshIds(col.elements[nestedElIdx]);
          if (clonedEl.nestedRow) {
            clonedEl.nestedRow.name = `${
              col.elements[nestedElIdx].nestedRow?.name || 'Sección Interna'
            } (Copia)`;
            newRowId = clonedEl.nestedRow.id;
          }
          const updatedEls = [...col.elements];
          updatedEls.splice(nestedElIdx + 1, 0, clonedEl);
          return { ...col, elements: updatedEls };
        }),
      })),
    };
  });

  return { nextSections, newRowId };
};

export const deleteRowInSections = (
  sections: PageBlockSection[],
  rowId: string
): { nextSections: PageBlockSection[]; deleted: boolean } => {
  let deleted = false;

  const nextSections = sections
    .map((sec) => {
      if (sec.rows.some((r) => r.id === rowId)) {
        const remaining = sec.rows.filter((r) => r.id !== rowId);
        if (remaining.length !== sec.rows.length) {
          deleted = true;
        }
        return { ...sec, rows: remaining };
      }

      return {
        ...sec,
        rows: sec.rows.map((row) => ({
          ...row,
          columns: row.columns.map((col) => {
            const hasNested = col.elements.some(
              (el) => el.type === 'inner_columns' && el.nestedRow?.id === rowId
            );
            if (!hasNested) return col;
            deleted = true;
            return {
              ...col,
              elements: col.elements.filter(
                (el) => !(el.type === 'inner_columns' && el.nestedRow?.id === rowId)
              ),
            };
          }),
        })),
      };
    })
    .filter((sec) => sec.rows.length > 0);

  return { nextSections, deleted };
};

export const moveRowInSections = (
  sections: PageBlockSection[],
  rowId: string,
  direction: 'up' | 'down'
): { nextSections: PageBlockSection[]; moved: boolean } => {
  let moved = false;

  const nextSections = sections.map((sec) => {
    const topIdx = sec.rows.findIndex((r) => r.id === rowId);
    if (topIdx !== -1) {
      const targetIdx = direction === 'up' ? topIdx - 1 : topIdx + 1;
      if (targetIdx < 0 || targetIdx >= sec.rows.length) return sec;
      const newRows = [...sec.rows];
      const [r] = newRows.splice(topIdx, 1);
      newRows.splice(targetIdx, 0, r);
      moved = true;
      return { ...sec, rows: newRows };
    }

    return {
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          const elIdx = col.elements.findIndex(
            (el) => el.type === 'inner_columns' && el.nestedRow?.id === rowId
          );
          if (elIdx === -1) return col;
          const targetIdx = direction === 'up' ? elIdx - 1 : elIdx + 1;
          if (targetIdx < 0 || targetIdx >= col.elements.length) return col;
          const updated = [...col.elements];
          const [movedEl] = updated.splice(elIdx, 1);
          updated.splice(targetIdx, 0, movedEl);
          moved = true;
          return { ...col, elements: updated };
        }),
      })),
    };
  });

  return { nextSections, moved };
};

export interface EditorSelectionContext {
  selectedSec: PageBlockSection | null;
  outerRow: PageBlockRow | null;
  outerCol: PageBlockColumn | null;
  nestedRow: PageBlockRow | null;
  nestedWrapperElement: PageBlockElement | null;
  selectedRow: PageBlockRow | null;
  selectedCol: PageBlockColumn | null;
  selectedColIndex: number;
  selectedColParentRow: PageBlockRow | null;
  selectedElement: PageBlockElement | null;
  isNestedRow: boolean;
  canMoveRowUp: boolean;
  canMoveRowDown: boolean;
  canDeleteRow: boolean;
}

export const findEditorSelectionContext = (
  sections: PageBlockSection[],
  ids: {
    selectedSectionId: string | null;
    selectedRowId: string | null;
    selectedColumnId: string | null;
    selectedElementId: string | null;
  }
): EditorSelectionContext => {
  const ctx: EditorSelectionContext = {
    selectedSec: null,
    outerRow: null,
    outerCol: null,
    nestedRow: null,
    nestedWrapperElement: null,
    selectedRow: null,
    selectedCol: null,
    selectedColIndex: 0,
    selectedColParentRow: null,
    selectedElement: null,
    isNestedRow: false,
    canMoveRowUp: false,
    canMoveRowDown: false,
    canDeleteRow: false,
  };

  for (const sec of sections) {
    if (sec.id === ids.selectedSectionId && !ctx.selectedSec) {
      ctx.selectedSec = sec;
    }

    for (let rIdx = 0; rIdx < sec.rows.length; rIdx++) {
      const row = sec.rows[rIdx];

      if (row.id === ids.selectedRowId && !ids.selectedElementId && !ids.selectedColumnId) {
        ctx.selectedSec = sec;
        ctx.outerRow = row;
        ctx.selectedRow = row;
        ctx.isNestedRow = false;
        ctx.canMoveRowUp = rIdx > 0;
        ctx.canMoveRowDown = rIdx < sec.rows.length - 1;
        ctx.canDeleteRow = sec.rows.length > 1;
      }

      for (let cIdx = 0; cIdx < row.columns.length; cIdx++) {
        const col = row.columns[cIdx];

        if (col.id === ids.selectedColumnId && !ids.selectedElementId) {
          ctx.selectedSec = sec;
          ctx.outerRow = row;
          ctx.outerCol = col;
          ctx.selectedRow = row;
          ctx.selectedCol = col;
          ctx.selectedColIndex = cIdx;
          ctx.selectedColParentRow = row;
          ctx.isNestedRow = false;
          ctx.canMoveRowUp = rIdx > 0;
          ctx.canMoveRowDown = rIdx < sec.rows.length - 1;
          ctx.canDeleteRow = sec.rows.length > 1;
        }

        for (let eIdx = 0; eIdx < col.elements.length; eIdx++) {
          const el = col.elements[eIdx];

          if (el.id === ids.selectedElementId) {
            if (el.type === 'inner_columns' && el.nestedRow) {
              ctx.selectedSec = sec;
              ctx.outerRow = row;
              ctx.outerCol = col;
              ctx.nestedRow = el.nestedRow;
              ctx.nestedWrapperElement = el;
              ctx.selectedRow = el.nestedRow;
              ctx.isNestedRow = true;
              ctx.canMoveRowUp = eIdx > 0;
              ctx.canMoveRowDown = eIdx < col.elements.length - 1;
              ctx.canDeleteRow = true;
            } else {
              ctx.selectedSec = sec;
              ctx.outerRow = row;
              ctx.outerCol = col;
              ctx.selectedRow = row;
              ctx.selectedCol = col;
              ctx.selectedColIndex = cIdx;
              ctx.selectedColParentRow = row;
              ctx.selectedElement = el;
            }
          }

          if (el.type === 'inner_columns' && el.nestedRow) {
            const nRow = el.nestedRow;

            if (nRow.id === ids.selectedRowId && !ids.selectedElementId && !ids.selectedColumnId) {
              ctx.selectedSec = sec;
              ctx.outerRow = row;
              ctx.outerCol = col;
              ctx.nestedRow = nRow;
              ctx.nestedWrapperElement = el;
              ctx.selectedRow = nRow;
              ctx.isNestedRow = true;
              ctx.canMoveRowUp = eIdx > 0;
              ctx.canMoveRowDown = eIdx < col.elements.length - 1;
              ctx.canDeleteRow = true;
            }

            for (let ncIdx = 0; ncIdx < nRow.columns.length; ncIdx++) {
              const nCol = nRow.columns[ncIdx];

              if (nCol.id === ids.selectedColumnId && !ids.selectedElementId) {
                ctx.selectedSec = sec;
                ctx.outerRow = row;
                ctx.outerCol = col;
                ctx.nestedRow = nRow;
                ctx.nestedWrapperElement = el;
                ctx.selectedRow = nRow;
                ctx.selectedCol = nCol;
                ctx.selectedColIndex = ncIdx;
                ctx.selectedColParentRow = nRow;
                ctx.isNestedRow = true;
                ctx.canMoveRowUp = eIdx > 0;
                ctx.canMoveRowDown = eIdx < col.elements.length - 1;
                ctx.canDeleteRow = true;
              }

              for (const nEl of nCol.elements) {
                if (nEl.id === ids.selectedElementId) {
                  ctx.selectedSec = sec;
                  ctx.outerRow = row;
                  ctx.outerCol = col;
                  ctx.nestedRow = nRow;
                  ctx.nestedWrapperElement = el;
                  ctx.selectedRow = nRow;
                  ctx.selectedCol = nCol;
                  ctx.selectedColIndex = ncIdx;
                  ctx.selectedColParentRow = nRow;
                  ctx.selectedElement = nEl;
                  ctx.isNestedRow = true;
                  ctx.canMoveRowUp = eIdx > 0;
                  ctx.canMoveRowDown = eIdx < col.elements.length - 1;
                  ctx.canDeleteRow = true;
                }
              }
            }
          }
        }
      }
    }
  }

  return ctx;
};

export const getColumnShadowClass = (_shadow?: PageBlockColumn['shadow']): string => {
  return '';
};

export const getColumnSurfaceStyle = (
  column: PageBlockColumn,
  options: { isPreview: boolean }
): React.CSSProperties => {
  const hasCustomVisual =
    Boolean(column.bgColor) ||
    Boolean(column.bgGradient) ||
    Boolean(column.borderWidth && column.borderWidth > 0);

  const effectiveBgType = column.bgType || (column.bgGradient ? 'gradient' : 'solid');

  const defaultPad = options.isPreview ? (hasCustomVisual ? 16 : 0) : 10;

  const style: React.CSSProperties = {
    paddingTop: `${column.paddingTop ?? defaultPad}px`,
    paddingBottom: `${column.paddingBottom ?? defaultPad}px`,
    paddingLeft: `${column.paddingLeft ?? defaultPad}px`,
    paddingRight: `${column.paddingRight ?? defaultPad}px`,
    marginTop: column.marginTop !== undefined ? `${column.marginTop}px` : undefined,
    marginBottom: column.marginBottom !== undefined ? `${column.marginBottom}px` : undefined,
    borderRadius: `${column.borderRadius ?? 0}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent:
      column.verticalAlign === 'center'
        ? 'center'
        : column.verticalAlign === 'bottom'
        ? 'flex-end'
        : 'flex-start',
    height: '100%',
  };

  if (effectiveBgType === 'gradient' && column.bgGradient) {
    style.backgroundImage = column.bgGradient;
  } else if (column.bgColor) {
    style.backgroundColor = column.bgColor;
  }

  if (column.borderWidth && column.borderWidth > 0) {
    style.borderWidth = `${column.borderWidth}px`;
    style.borderStyle = column.borderStyle || 'solid';
    style.borderColor = column.borderColor || '#E4E4E7';
  }

  if (options.isPreview && column.elements.length === 0 && hasCustomVisual) {
    style.minHeight = '64px';
  }

  return style;
};
