import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FunnelPage,
  PageBlockSection,
  PageBlockElement,
  PageBlockRow,
  PageBlockColumn,
  ElementType,
  PopupModal,
  SimpleFormFieldConfig,
  FunnelPageGlobalSettings,
  AVAILABLE_FONTS,
} from '../../types';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Image as ImageIcon,
  Video,
  CreditCard,
  Columns as ColumnsIcon,
  Calendar,
  ClipboardList,
  Eye,
  Smartphone,
  Monitor,
  Undo2,
  Redo2,
  Save,
  ArrowLeft,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Sliders,
  Palette,
  Layout,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Move,
  GripVertical,
  Underline as UnderlineIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Upload,
  RotateCw,
  RotateCcw,
  ImagePlus,
  Link as LinkIcon,
  Layers,
  Plus,
  AlertCircle,
  Music,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  FileText,
  Smile,
  Radio as RadioIcon,
  HelpCircle,
  Box,
  Maximize2,
  Minimize2,
  Settings,
  LayoutTemplate,
  Check,
  CheckCircle2,
  Square,
  ArrowRight,
  Star,
  Zap,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { SectionInspector } from './SectionInspector';
import { PageSettingsInspector } from './PageSettingsInspector';
import { RowInspector } from './RowInspector';
import { StructureNavigator } from './StructureNavigator';
import { RichTextElement } from './elements/RichTextElement';
import { WordPressWysiwygEditor } from './elements/WordPressWysiwygEditor';
import { AudioPlayerElement } from './elements/AudioPlayerElement';
import { IconElement, POPULAR_ICONS } from './elements/IconElement';
import { SimpleFormElement } from './elements/SimpleFormElement';
import { PopupButtonElement } from './elements/PopupButtonElement';
import { PopupEditorModal } from './elements/PopupEditorModal';
import { PAGE_TEMPLATES, PageTemplate } from '../../data/pageTemplates';
import { EmbeddedVideoPlayer } from '../common/EmbeddedVideoPlayer';
import { getEmbedVideoInfo, getEmbedVideoUrl } from '../../utils/videoUtils';
import { InlineEditableText } from './elements/InlineEditableText';
import { NumberControl } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';

interface VisualEditorProps {
  initialPage?: FunnelPage;
  funnelId?: string;
  onExit: () => void;
}


const PREBUILT_BLOCK_DEFS = [
  {
    type: 'header',
    title: '🔝 Cabecera de Página (Header & Nav)',
    badge: 'Cabecera',
    badgeColor: 'bg-blue-50 text-[#2848F0]',
    desc: 'Logotipo de marca a la izquierda, menú de navegación central y botón de llamada a la acción destacado.',
  },
  {
    type: 'offer',
    title: '📦 Presentación de la Oferta (Stack)',
    badge: 'Carta de Venta',
    badgeColor: 'bg-emerald-50 text-emerald-700',
    desc: 'Mockup / imagen de producto, bullet points de valor acumulado y desglose de precio de lanzamiento.',
  },
  {
    type: 'fascinations',
    title: '🎯 Bullets de Fascinación y Beneficios',
    badge: 'Copywriting',
    badgeColor: 'bg-indigo-50 text-indigo-700',
    desc: '2 columnas con viñetas de alta curiosidad que enganchan y explican lo que descubrirán.',
  },
  {
    type: 'guarantee',
    title: '🛡️ Garantía 100% Incondicional',
    badge: 'Riesgo Cero',
    badgeColor: 'bg-blue-50 text-[#2848F0]',
    desc: 'Sello de seguridad, garantía de satisfacción de 30 días y reversión total del riesgo.',
  },
  {
    type: 'comparison',
    title: '⚖️ Comparativa: Antes vs Después',
    badge: 'Contraste',
    badgeColor: 'bg-zinc-100 text-zinc-700',
    desc: 'Contraste directo entre el método antiguo disperso y tu sistema integrado de alto rendimiento.',
  },
  {
    type: 'bonuses',
    title: '🎁 Bonos Exclusivos (Bonus Stack)',
    badge: '3 Tarjetas',
    badgeColor: 'bg-purple-50 text-purple-700',
    desc: '3 columnas con bonos de acción rápida (scripts, automatizaciones, soporte) valorados en USD.',
  },
  {
    type: 'vsl',
    title: '🎬 Bloque VSL Principal',
    badge: 'Video',
    badgeColor: 'bg-red-50 text-red-700',
    desc: 'Titular provocador, reproductor de video centrado y botón de llamada a la acción.',
  },
  {
    type: 'bio',
    title: '👤 Sobre el Autor / Quién Soy',
    badge: 'Autoridad',
    badgeColor: 'bg-sky-50 text-sky-700',
    desc: 'Foto del consultor, credenciales, historia de origen y justificación de por qué escucharte.',
  },
  {
    type: 'testimonials',
    title: '💬 Testimonios y Prueba Social',
    badge: 'Casos Reales',
    badgeColor: 'bg-teal-50 text-teal-700',
    desc: '2 columnas con citas de clientes, nombres de negocio y resultados cuantificables.',
  },
  {
    type: 'faq',
    title: '❓ Preguntas Frecuentes (FAQ)',
    badge: 'Objeciones',
    badgeColor: 'bg-amber-50 text-amber-700',
    desc: 'Derribo de objeciones comunes sobre conocimientos técnicos, tiempos y resultados esperados.',
  },
  {
    type: 'urgency',
    title: '⏳ Urgencia y Cupos Limitados',
    badge: 'Escasez',
    badgeColor: 'bg-orange-50 text-orange-700',
    desc: 'Fondo oscuro contrastante con aviso de cupos limitados mensuales y botón de acción inmediata.',
  },
  {
    type: 'cta',
    title: '⚡ Llamada a la Acción de Cierre',
    badge: 'Cierre',
    badgeColor: 'bg-blue-50 text-blue-800',
    desc: 'Fondo oscuro, recordatorio de plazas limitadas y botón de alta conversión.',
  },
  {
    type: 'footer',
    title: '🔻 Pie de Página (Footer Completo)',
    badge: 'Footer',
    badgeColor: 'bg-zinc-800 text-zinc-100',
    desc: 'Logotipo, enlaces rápidos de navegación, botón de WhatsApp, aviso legal y copyright.',
  },
];

import { BULLET_ICON_OPTIONS, renderBulletIcon } from '../../utils/bulletIcons';
export { BULLET_ICON_OPTIONS, renderBulletIcon };

export const VisualEditor: React.FC<VisualEditorProps> = ({ initialPage, funnelId: propFunnelId, onExit }) => {
  const { funnels, activeFunnel, updateFunnelPage, showToast } = useApp();

  const currentFunnel =
    (propFunnelId ? funnels.find((f) => f.id === propFunnelId) : null) ||
    (initialPage?.funnel_id ? funnels.find((f) => f.id === initialPage.funnel_id) : null) ||
    activeFunnel ||
    funnels[0];

  const currentPage =
    initialPage ||
    (currentFunnel?.pages && currentFunnel.pages.length > 0 ? currentFunnel.pages[0] : ({} as FunnelPage));

  const [activeTab, setActiveTab] = useState<'page' | 'elements' | 'blocks' | 'templates'>('page');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [showStructurePanel, setShowStructurePanel] = useState<boolean>(true);
  const [fullscreenWysiwygElementId, setFullscreenWysiwygElementId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [templateToApply, setTemplateToApply] = useState<PageTemplate | null>(null);
  const [showTemplateConfirmModal, setShowTemplateConfirmModal] = useState<boolean>(false);
  const [templatePreviewModal, setTemplatePreviewModal] = useState<PageTemplate | null>(null);

  // Global Page settings (Canvas width, Google Fonts, default H1-H4 sizes, colors)
  const [pageSettings, setPageSettings] = useState<FunnelPageGlobalSettings>(() => ({
    pageWidthType: currentPage.settings?.pageWidthType || 'boxed',
    pageContentMaxWidth: currentPage.settings?.pageContentMaxWidth || 1200,
    pageBorderRadius: currentPage.settings?.pageBorderRadius !== undefined ? currentPage.settings?.pageBorderRadius : 16,
    pageBgColor: currentPage.settings?.pageBgColor || '#FFFFFF',
    primaryColor: currentPage.settings?.primaryColor || '#2848F0',
    textColor: currentPage.settings?.textColor || '#121111',
    headingFontFamily: currentPage.settings?.headingFontFamily || 'Poppins',
    bodyFontFamily: currentPage.settings?.bodyFontFamily || 'Inter',
    defaultH1Size: currentPage.settings?.defaultH1Size || 36,
    defaultH2Size: currentPage.settings?.defaultH2Size || 28,
    defaultH3Size: currentPage.settings?.defaultH3Size || 22,
    defaultH4Size: currentPage.settings?.defaultH4Size || 18,
    pagePaddingTop: currentPage.settings?.pagePaddingTop || 0,
    pagePaddingBottom: currentPage.settings?.pagePaddingBottom || 40,
    seo_title: currentPage.settings?.seo_title || '',
    seo_description: currentPage.settings?.seo_description || '',
  }));

  // Page sections state with history for Undo/Redo
  const [sections, setSections] = useState<PageBlockSection[]>(() => {
    return currentPage.sections && currentPage.sections.length > 0
      ? JSON.parse(JSON.stringify(currentPage.sections))
      : [
          {
            id: 'sec_default',
            name: 'Sección Principal',
            bgColor: '#FFFFFF',
            paddingY: 40,
            rows: [
              {
                id: 'row_def_1',
                columns: [
                  {
                    id: 'col_def_1',
                    widthPercentage: 100,
                    elements: [
                      {
                        id: 'el_def_h',
                        type: 'heading',
                        content: { text: 'Tu Gran Titular Comercial Aquí', level: 'h1' },
                        styles: {
                          fontSize: 34,
                          fontFamily: 'Poppins',
                          textColor: '#121111',
                          isBold: true,
                          textAlign: 'center',
                          marginBottom: 16,
                          marginTop: 0,
                          marginLeft: 0,
                          marginRight: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                          paddingLeft: 0,
                          paddingRight: 0,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
  });

  const [history, setHistory] = useState<PageBlockSection[][]>([sections]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Selected element for Property Inspector
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Drag-and-drop state & Visual Placement Indicator Line (Req 2)
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    colId: string;
    index: number;
    position: 'before' | 'after';
  } | null>(null);

  // Section & Prebuilt Block Drag-and-Drop state & Placement indicator
  const [draggingSectionId, setDraggingSectionId] = useState<string | null>(null);
  const [draggingBlockType, setDraggingBlockType] = useState<string | null>(null);
  const [draggingSectionLayout, setDraggingSectionLayout] = useState<'1col' | '2col' | '3col' | '4col' | null>(null);
  const [sectionDropIndicator, setSectionDropIndicator] = useState<{
    sectionId: string;
    index: number;
    position: 'before' | 'after';
  } | null>(null);

  // Popups configuration and active popup editor modal
  const [funnelPopups, setFunnelPopups] = useState<PopupModal[]>(() => {
    if (initialPage?.popups && initialPage.popups.length > 0) {
      return initialPage.popups;
    }
    return [
      {
        id: 'popup_1',
        name: 'Pop-up Principal',
        title: '¡Espera! Tenemos una oferta especial para ti',
        subtitle: 'Déjanos tus datos a continuación para acceder al beneficio exclusivo:',
        width: 'md',
        bgColor: '#FFFFFF',
        elements: [
          {
            id: 'pop_el_head',
            type: 'heading',
            content: { text: '¡Oferta Exclusiva por Tiempo Limitado!', level: 'h2' },
            styles: {
              fontSize: 22,
              fontFamily: 'Poppins',
              textColor: '#18181b',
              isBold: true,
              textAlign: 'center',
              marginBottom: 8,
            },
          },
          {
            id: 'pop_el_p',
            type: 'paragraph',
            content: {
              text: 'Completa tus datos para recibir acceso prioritario y agendar tu sesión de cortesía hoy mismo.',
            },
            styles: {
              fontSize: 14,
              fontFamily: 'Inter',
              textColor: '#52525b',
              textAlign: 'center',
              marginBottom: 16,
            },
          },
          {
            id: 'pop_el_form',
            type: 'simple_form',
            content: {
              formTitle: 'Registro Rápido',
              showNameField: true,
              nameRequired: false,
              showPhoneField: false,
              phoneRequired: false,
              emailRequired: true,
              submitButtonText: 'Obtener Beneficio Ahora 👉',
            },
            styles: {
              marginTop: 0,
              marginBottom: 0,
            },
          },
        ],
      },
    ];
  });
  const [editingPopupModal, setEditingPopupModal] = useState<PopupModal | null>(null);

  // Unsaved changes tracking & confirmation modal (Req 3)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);

  // File input ref for direct image uploads from browser
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collapsible accordions in Properties panel
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    typography: true,
    colors: true,
    spacing: true,
    margin: true,
    padding: true,
    action: true,
    imageSource: true,
    imageAdjustments: true,
    imageBorder: true,
    videoSource: true,
    videoSettings: true,
    dividerSettings: true,
    formSettings: true,
    calendarSettings: true,
    spacerSettings: true,
    audioSettings: true,
    iconSettings: true,
    simpleFormSettings: true,
    popupButtonSettings: true,
    richTextSettings: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Push new state to history for undo/redo
  const pushHistory = (newSections: PageBlockSection[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.parse(JSON.stringify(newSections)));
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setSections(newSections);
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setSections(JSON.parse(JSON.stringify(history[prev])));
      showToast('Deshecho');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setSections(JSON.parse(JSON.stringify(history[next])));
      showToast('Rehecho');
    }
  };

  // Find currently selected element and its container
  let selectedElement: PageBlockElement | null = null;
  let selectedCol: PageBlockColumn | null = null;
  let selectedRow: PageBlockRow | null = null;
  let selectedSec: PageBlockSection | null = null;

  for (const sec of sections) {
    if (sec.id === selectedSectionId) {
      selectedSec = sec;
    }
    for (const row of sec.rows) {
      if (row.id === selectedRowId) {
        selectedRow = row;
        selectedSec = sec;
      }
      for (const col of row.columns) {
        for (const el of col.elements) {
          if (el.id === selectedElementId) {
            selectedElement = el;
            selectedCol = col;
            selectedRow = row;
            selectedSec = sec;
            break;
          }
        }
      }
    }
  }

  // Find element being edited in Fullscreen WordPress WYSIWYG
  let fullscreenWysiwygElement: PageBlockElement | null = null;
  if (fullscreenWysiwygElementId) {
    for (const sec of sections) {
      for (const row of sec.rows) {
        for (const col of row.columns) {
          for (const el of col.elements) {
            if (el.id === fullscreenWysiwygElementId) {
              fullscreenWysiwygElement = el;
              break;
            }
          }
        }
      }
    }
  }

  // Active Row instance for inspector (when row is selected and element is not selected)
  const activeRowForInspector = !selectedElement && selectedRowId
    ? selectedRow
    : null;

  // Selected Section instance for inspector (when element and row are not selected)
  const activeSectionForInspector = !selectedElement && !selectedRowId && selectedSectionId
    ? sections.find((s) => s.id === selectedSectionId) || null
    : null;

  // Ref for debouncing history saves during fast continuous updates (like dragging color picker)
  const historyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update element styles or content in live state
  const updateSelectedElement = (
    updatedStyles: Partial<PageBlockElement['styles']>,
    updatedContent?: Partial<PageBlockElement['content']>
  ) => {
    if (!selectedElementId) return;

    let updatedSections: PageBlockSection[] = [];
    setSections((prev) => {
      const next = prev.map((sec) => ({
        ...sec,
        rows: sec.rows.map((row) => ({
          ...row,
          columns: row.columns.map((col) => ({
            ...col,
            elements: col.elements.map((el) => {
              if (el.id !== selectedElementId) return el;
              return {
                ...el,
                styles: { ...el.styles, ...updatedStyles },
                content: updatedContent ? { ...el.content, ...updatedContent } : el.content,
              };
            }),
          })),
        })),
      }));
      updatedSections = next;
      return next;
    });

    setHasUnsavedChanges(true);

    // Debounce history snapshot slightly (250ms) so continuous dragging in color pickers
    // or sliders updates the canvas instantly at 60fps without deep-clone overhead!
    if (historyDebounceRef.current) {
      clearTimeout(historyDebounceRef.current);
    }
    historyDebounceRef.current = setTimeout(() => {
      if (updatedSections.length > 0) {
        pushHistory(updatedSections);
      }
    }, 250);
  };

  // Directly update element content by ID (ensures robust sync without history thrashing)
  const updateElementContent = (
    elementId: string,
    updatedContent: Partial<PageBlockElement['content']>
  ) => {
    setSections((prevSections) =>
      prevSections.map((sec) => ({
        ...sec,
        rows: sec.rows.map((row) => ({
          ...row,
          columns: row.columns.map((col) => ({
            ...col,
            elements: col.elements.map((el) => {
              if (el.id !== elementId) return el;
              return {
                ...el,
                content: { ...el.content, ...updatedContent },
              };
            }),
          })),
        })),
      }))
    );
    setHasUnsavedChanges(true);
  };

  // Active text selection tracking so color or formatting can be applied
  // specifically to shaded/selected text portion in heading, subheading, paragraph, or bullet list
  const activeTextSelectionRef = useRef<{
    range: Range;
    editableEl: HTMLElement;
    bulletIdx: number | null;
    elementId: string;
  } | null>(null);

  // Active target span when inline text color is being changed via HexColorPicker
  const activeColoredTargetRef = useRef<{
    span: HTMLElement;
    editableEl: HTMLElement;
    bulletIdx: number | null;
    elementId: string;
    originalColor: string;
    isNewSpan: boolean;
  } | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      if (sel.isCollapsed) {
        return;
      }

      const text = sel.toString().trim();
      if (text.length === 0) return;

      const anchorNode = sel.anchorNode;
      const editableEl = anchorNode
        ? (anchorNode.nodeType === Node.ELEMENT_NODE
            ? (anchorNode as HTMLElement).closest('[contenteditable="true"]')
            : anchorNode.parentElement?.closest('[contenteditable="true"]'))
        : null;

      if (editableEl) {
        const bulletIdx = editableEl.getAttribute('data-bullet-index');
        const elId = editableEl.getAttribute('data-element-id') || selectedElementId;
        if (elId) {
          activeTextSelectionRef.current = {
            range: sel.getRangeAt(0).cloneRange(),
            editableEl: editableEl as HTMLElement,
            bulletIdx: bulletIdx !== null ? parseInt(bulletIdx, 10) : null,
            elementId: elId,
          };
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [selectedElementId]);

  // Called when the color picker opens: prepares the selected text for inline coloring
  const handleColorPickerOpen = () => {
    if (!selectedElement) return;

    const sel = window.getSelection();
    let targetRange: Range | null = null;
    let targetEditableEl: HTMLElement | null = null;
    let targetBulletIdx: number | null = null;

    // 1. Live document selection
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed && sel.toString().trim().length > 0) {
      const anchorNode = sel.anchorNode;
      const liveEditable = anchorNode
        ? (anchorNode.nodeType === Node.ELEMENT_NODE
            ? (anchorNode as HTMLElement).closest('[contenteditable="true"]')
            : anchorNode.parentElement?.closest('[contenteditable="true"]'))
        : null;

      if (liveEditable) {
        targetRange = sel.getRangeAt(0).cloneRange();
        targetEditableEl = liveEditable as HTMLElement;
        const bIdx = liveEditable.getAttribute('data-bullet-index');
        targetBulletIdx = bIdx !== null ? parseInt(bIdx, 10) : null;
      }
    }

    // 2. Saved selection fallback
    if (
      !targetRange &&
      activeTextSelectionRef.current &&
      activeTextSelectionRef.current.elementId === selectedElement.id
    ) {
      targetRange = activeTextSelectionRef.current.range;
      targetEditableEl = activeTextSelectionRef.current.editableEl;
      targetBulletIdx = activeTextSelectionRef.current.bulletIdx;
    }

    if (targetRange && targetEditableEl && targetRange.toString().trim().length > 0) {
      try {
        // Clear any previous temporary data-inline-color-target markers
        targetEditableEl.querySelectorAll('[data-inline-color-target]').forEach((el) => {
          el.removeAttribute('data-inline-color-target');
        });

        // Wrap the highlighted range into a dedicated span
        const span = document.createElement('span');
        span.setAttribute('data-inline-color-target', 'true');

        const fragment = targetRange.extractContents();
        span.appendChild(fragment);
        targetRange.insertNode(span);

        activeColoredTargetRef.current = {
          span,
          editableEl: targetEditableEl,
          bulletIdx: targetBulletIdx,
          elementId: selectedElement.id,
          originalColor: span.style.color || '',
          isNewSpan: true,
        };

        // Clear selection range so user sees the text cleanly
        sel?.removeAllRanges();
        return;
      } catch (err) {
        console.warn('Could not wrap range with span, will fallback:', err);
      }
    }

    // No text selected: we will color the whole element
    activeColoredTargetRef.current = null;
  };

  // Called while dragging or changing color: updates the inline span if text was shaded,
  // or updates the whole element's textColor if no text was shaded
  const handleTextColorChange = (color: string) => {
    if (!selectedElement) return;

    // 1. Partial inline text selection is targeted
    if (activeColoredTargetRef.current) {
      const { span, editableEl } = activeColoredTargetRef.current;
      if (span && editableEl && editableEl.contains(span)) {
        span.style.color = color;
        // Also override any child elements with hardcoded colors
        span.querySelectorAll('*').forEach((child) => {
          if ((child as HTMLElement).style?.color) {
            (child as HTMLElement).style.color = color;
          }
        });
        return;
      }
    }

    // Check if an inline target span exists on canvas
    const existingTarget = document.querySelector('[data-inline-color-target="true"]') as HTMLElement | null;
    if (existingTarget) {
      existingTarget.style.color = color;
      return;
    }

    // 2. No inline text targeted: update whole element style
    updateSelectedElement({ textColor: color });
  };

  // Called when the color picker closes (OK / Cancel / outside click)
  const handleColorPickerClose = (applied: boolean) => {
    if (activeColoredTargetRef.current) {
      const { span, editableEl, bulletIdx, originalColor, isNewSpan } = activeColoredTargetRef.current;
      if (span && editableEl) {
        if (!applied) {
          // Revert on cancel
          if (originalColor) {
            span.style.color = originalColor;
            span.removeAttribute('data-inline-color-target');
          } else if (isNewSpan) {
            span.removeAttribute('data-inline-color-target');
            while (span.firstChild) {
              span.parentNode?.insertBefore(span.firstChild, span);
            }
            span.remove();
          }
        } else {
          // Commit applied color: remove marker and save HTML to state
          span.removeAttribute('data-inline-color-target');
          if (bulletIdx !== null && bulletIdx !== undefined) {
            const newItems = [...(selectedElement?.content.items || [])];
            newItems[bulletIdx] = editableEl.innerHTML;
            updateSelectedElement({}, { items: newItems });
          } else {
            updateSelectedElement(
              {},
              { html: editableEl.innerHTML, text: editableEl.innerText }
            );
          }
        }
      }
      activeColoredTargetRef.current = null;
    }
  };

  // Apply formatting (bold, italic, underline) ONLY to shaded/selected text portion in active element,
  // or fallback to toggling whole-element style if no text range is shaded
  const handleToggleInlineFormat = (format: 'bold' | 'italic' | 'underline') => {
    if (!selectedElement) return;

    const sel = window.getSelection();
    let targetRange: Range | null = null;
    let editableEl: HTMLElement | null = null;
    let bulletIdx: number | null = null;

    if (sel && !sel.isCollapsed && sel.rangeCount > 0 && sel.toString().trim().length > 0) {
      const anchorNode = sel.anchorNode;
      const liveEl = anchorNode
        ? (anchorNode.nodeType === Node.ELEMENT_NODE
            ? (anchorNode as HTMLElement).closest('[contenteditable="true"]')
            : anchorNode.parentElement?.closest('[contenteditable="true"]'))
        : null;
      if (liveEl) {
        targetRange = sel.getRangeAt(0).cloneRange();
        editableEl = liveEl as HTMLElement;
        const bIdx = liveEl.getAttribute('data-bullet-index');
        bulletIdx = bIdx !== null ? parseInt(bIdx, 10) : null;
      }
    }

    if (
      !targetRange &&
      activeTextSelectionRef.current &&
      activeTextSelectionRef.current.elementId === selectedElement.id
    ) {
      targetRange = activeTextSelectionRef.current.range;
      editableEl = activeTextSelectionRef.current.editableEl;
      bulletIdx = activeTextSelectionRef.current.bulletIdx;
    }

    if (targetRange && editableEl && targetRange.toString().trim().length > 0) {
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(targetRange);
      }
      document.execCommand(format, false);
      if (bulletIdx !== null && bulletIdx !== undefined) {
        const newItems = [...(selectedElement.content.items || [])];
        newItems[bulletIdx] = editableEl.innerHTML;
        updateSelectedElement({}, { items: newItems });
      } else {
        updateSelectedElement(
          {},
          { html: editableEl.innerHTML, text: (editableEl as HTMLElement).innerText }
        );
      }
    } else {
      // 2. No text is shaded: toggle whole-element style as fallback
      if (format === 'bold') {
        updateSelectedElement({ isBold: !selectedElement.styles.isBold });
      } else if (format === 'italic') {
        updateSelectedElement({ isItalic: !selectedElement.styles.isItalic });
      } else if (format === 'underline') {
        updateSelectedElement({ isUnderline: !selectedElement.styles.isUnderline });
      }
    }
  };

  // Element Actions: Move up, down, duplicate, delete
  const moveElement = (direction: 'up' | 'down', targetId?: string) => {
    const idToMove = targetId || selectedElementId;
    if (!idToMove) return;

    let targetColId: string | null = null;
    for (const sec of sections) {
      for (const row of sec.rows) {
        for (const col of row.columns) {
          if (col.elements.some((e) => e.id === idToMove)) {
            targetColId = col.id;
            break;
          }
        }
      }
    }
    if (!targetColId) return;

    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== targetColId) return col;
          const idx = col.elements.findIndex((e) => e.id === idToMove);
          if (idx === -1) return col;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= col.elements.length) return col;

          const updatedElements = [...col.elements];
          const [moved] = updatedElements.splice(idx, 1);
          updatedElements.splice(targetIdx, 0, moved);

          return { ...col, elements: updatedElements };
        }),
      })),
    }));

    pushHistory(nextSections);
    showToast(`Elemento movido hacia ${direction === 'up' ? 'arriba' : 'abajo'}`);
  };

  const duplicateElement = (targetId?: string) => {
    const idToDuplicate = targetId || selectedElementId;
    if (!idToDuplicate) return;

    let targetColId: string | null = null;
    let newElementId = '';
    for (const sec of sections) {
      for (const row of sec.rows) {
        for (const col of row.columns) {
          if (col.elements.some((e) => e.id === idToDuplicate)) {
            targetColId = col.id;
            break;
          }
        }
      }
    }
    if (!targetColId) return;

    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== targetColId) return col;
          const idx = col.elements.findIndex((e) => e.id === idToDuplicate);
          if (idx === -1) return col;
          const original = col.elements[idx];
          newElementId = `el_${Date.now()}_copy`;
          const duplicated: PageBlockElement = {
            ...JSON.parse(JSON.stringify(original)),
            id: newElementId,
          };
          const updatedElements = [...col.elements];
          updatedElements.splice(idx + 1, 0, duplicated);
          return { ...col, elements: updatedElements };
        }),
      })),
    }));

    pushHistory(nextSections);
    if (newElementId) {
      setSelectedElementId(newElementId);
    }
    showToast('Elemento duplicado / clonado con éxito');
  };

  const deleteElement = (targetId?: string) => {
    const idToDelete = targetId || selectedElementId;
    if (!idToDelete) return;

    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => ({
          ...col,
          elements: col.elements.filter((e) => e.id !== idToDelete),
        })),
      })),
    }));

    if (selectedElementId === idToDelete) {
      setSelectedElementId(null);
    }
    pushHistory(nextSections);
    showToast('Elemento eliminado');
  };

  // Section Management Functions (update, reorder, clone, delete, insert)
  const updateSection = (secId: string, updatedProps: Partial<PageBlockSection>) => {
    const nextSections = sections.map((sec) => {
      if (sec.id !== secId) return sec;
      return { ...sec, ...updatedProps };
    });
    pushHistory(nextSections);
  };

  const moveSection = (direction: 'up' | 'down', secId?: string) => {
    const targetId = secId || selectedSectionId;
    if (!targetId) return;

    const idx = sections.findIndex((s) => s.id === targetId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;

    const newSections = [...sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const [moved] = newSections.splice(idx, 1);
    newSections.splice(targetIdx, 0, moved);

    pushHistory(newSections);
    setSelectedSectionId(targetId);
    showToast(`Sección movida ${direction === 'up' ? 'arriba' : 'abajo'}`);
  };

  const reorderCanvasSection = (sourceSecId: string, targetIdx: number) => {
    const fromIdx = sections.findIndex((s) => s.id === sourceSecId);
    if (fromIdx === -1) return;

    const movingSec = sections[fromIdx];
    const newSections = [...sections];
    newSections.splice(fromIdx, 1);

    const adjustedIdx = targetIdx > fromIdx ? targetIdx - 1 : targetIdx;
    const clampedIdx = Math.max(0, Math.min(adjustedIdx, newSections.length));

    newSections.splice(clampedIdx, 0, movingSec);
    pushHistory(newSections);
    setSelectedSectionId(movingSec.id);
    setSelectedElementId(null);
    showToast(`Sección "${movingSec.name}" reordenada`);
  };

  const duplicateSection = (secId?: string) => {
    const targetId = secId || selectedSectionId;
    if (!targetId) return;

    const idx = sections.findIndex((s) => s.id === targetId);
    if (idx === -1) return;

    const original = sections[idx];
    const newSecId = `sec_${Date.now()}`;
    const duplicatedSec: PageBlockSection = JSON.parse(JSON.stringify(original));
    duplicatedSec.id = newSecId;
    duplicatedSec.name = `${original.name} (Copia)`;

    // Regenerate unique IDs for rows, columns, and elements to prevent collision
    duplicatedSec.rows = duplicatedSec.rows.map((row, rIdx) => ({
      ...row,
      id: `row_${Date.now()}_${rIdx}`,
      columns: row.columns.map((col, cIdx) => ({
        ...col,
        id: `col_${Date.now()}_${rIdx}_${cIdx}`,
        elements: col.elements.map((el, eIdx) => ({
          ...el,
          id: `el_${Date.now()}_${rIdx}_${cIdx}_${eIdx}`,
        })),
      })),
    }));

    const newSections = [...sections];
    newSections.splice(idx + 1, 0, duplicatedSec);

    pushHistory(newSections);
    setSelectedSectionId(newSecId);
    setSelectedElementId(null);
    showToast('Sección duplicada exitosamente');
  };

  const deleteSection = (secId?: string) => {
    const targetId = secId || selectedSectionId;
    if (!targetId) return;

    const nextSections = sections.filter((s) => s.id !== targetId);
    pushHistory(nextSections);
    setSelectedSectionId(null);
    setSelectedRowId(null);
    setSelectedElementId(null);
    setHasUnsavedChanges(true);
    showToast('Sección eliminada');
  };

  // Update inner section / row styles
  const updateSelectedRow = (updatedProps: Partial<PageBlockRow>) => {
    if (!selectedRowId) return;
    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => {
        if (row.id !== selectedRowId) return row;
        return {
          ...row,
          ...updatedProps,
        };
      }),
    }));
    pushHistory(nextSections);
    setHasUnsavedChanges(true);
  };

  const duplicateRow = (rowId?: string) => {
    const targetRowId = rowId || selectedRowId;
    if (!targetRowId) return;

    let clonedId: string | null = null;
    const nextSections = sections.map((sec) => {
      const rowIdx = sec.rows.findIndex((r) => r.id === targetRowId);
      if (rowIdx === -1) return sec;
      const targetRow = sec.rows[rowIdx];
      clonedId = `row_${Date.now()}`;
      const clonedRow: PageBlockRow = {
        ...JSON.parse(JSON.stringify(targetRow)),
        id: clonedId,
        name: `${targetRow.name || 'Sección Interna'} (Copia)`,
        columns: targetRow.columns.map((c) => ({
          ...c,
          id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          elements: c.elements.map((el) => ({
            ...el,
            id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          })),
        })),
      };
      const newRows = [...sec.rows];
      newRows.splice(rowIdx + 1, 0, clonedRow);
      return {
        ...sec,
        rows: newRows,
      };
    });
    pushHistory(nextSections);
    if (clonedId) {
      setSelectedRowId(clonedId);
      setSelectedElementId(null);
    }
    setHasUnsavedChanges(true);
    showToast('Sección interna duplicada');
  };

  const deleteRow = (rowId?: string) => {
    const targetRowId = rowId || selectedRowId;
    if (!targetRowId) return;

    let rowDeleted = false;
    const nextSections = sections
      .map((sec) => {
        const remainingRows = sec.rows.filter((r) => r.id !== targetRowId);
        if (remainingRows.length !== sec.rows.length) {
          rowDeleted = true;
        }
        return {
          ...sec,
          rows: remainingRows,
        };
      })
      .filter((sec) => sec.rows.length > 0);

    if (rowDeleted) {
      pushHistory(nextSections);
      setSelectedRowId(null);
      setSelectedElementId(null);
      setHasUnsavedChanges(true);
      showToast('Sección / Fila eliminada');
    }
  };

  // Template handling: Request confirmation if page has content, then apply
  const handleRequestApplyTemplate = (template: PageTemplate) => {
    const hasExistingContent =
      sections.length > 0 &&
      sections.some((s) => s.rows && s.rows.some((r) => r.columns && r.columns.some((c) => c.elements && c.elements.length > 0)));

    if (hasExistingContent) {
      setTemplateToApply(template);
      setShowTemplateConfirmModal(true);
    } else {
      executeApplyTemplate(template);
    }
  };

  const executeApplyTemplate = (template: PageTemplate) => {
    const newSections: PageBlockSection[] = template.sections.map((sec, sIdx) => ({
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec_${Date.now()}_${sIdx}`,
      rows: sec.rows.map((row, rIdx) => ({
        ...JSON.parse(JSON.stringify(row)),
        id: `row_${Date.now()}_${sIdx}_${rIdx}`,
        columns: row.columns.map((col, cIdx) => ({
          ...JSON.parse(JSON.stringify(col)),
          id: `col_${Date.now()}_${sIdx}_${rIdx}_${cIdx}`,
          elements: col.elements.map((el, eIdx) => ({
            ...JSON.parse(JSON.stringify(el)),
            id: `el_${Date.now()}_${sIdx}_${rIdx}_${cIdx}_${eIdx}`,
          })),
        })),
      })),
    }));

    if (template.pageSettings) {
      setPageSettings((prev) => ({
        ...prev,
        ...template.pageSettings,
      }));
    }

    pushHistory(newSections);
    setSelectedElementId(null);
    setSelectedRowId(null);
    setSelectedSectionId(null);
    setHasUnsavedChanges(true);
    setShowTemplateConfirmModal(false);
    setTemplateToApply(null);
    setTemplatePreviewModal(null);
    showToast(`Plantilla "${template.name}" cargada correctamente`);
  };

  const moveRow = (direction: 'up' | 'down', secId?: string, rowId?: string) => {
    const idToMove = rowId || selectedRowId;
    if (!idToMove) return;

    let moved = false;
    const nextSections = sections.map((sec) => {
      const idx = sec.rows.findIndex((r) => r.id === idToMove);
      if (idx === -1) return sec;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= sec.rows.length) return sec;

      const newRows = [...sec.rows];
      const [r] = newRows.splice(idx, 1);
      newRows.splice(targetIdx, 0, r);
      moved = true;
      return { ...sec, rows: newRows };
    });

    if (moved) {
      pushHistory(nextSections);
      setSelectedRowId(idToMove);
      showToast(`Fila movida hacia ${direction === 'up' ? 'arriba' : 'abajo'}`);
    }
  };

  const reorderRowsInSection = (sectionId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const nextSections = sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newRows = [...sec.rows];
      const [moved] = newRows.splice(fromIndex, 1);
      newRows.splice(toIndex, 0, moved);
      return { ...sec, rows: newRows };
    });
    pushHistory(nextSections);
    showToast('Orden de bloques actualizado');
  };

  const reorderElementsInCol = (colId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== colId) return col;
          const newElements = [...col.elements];
          const [moved] = newElements.splice(fromIndex, 1);
          newElements.splice(toIndex, 0, moved);
          return { ...col, elements: newElements };
        }),
      })),
    }));
    pushHistory(nextSections);
    showToast('Orden de elementos actualizado');
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    pushHistory(newSections);
    showToast('Orden de secciones actualizado');
  };

  const updatePageSettings = (newSettings: Partial<FunnelPageGlobalSettings>) => {
    setPageSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    setHasUnsavedChanges(true);
  };

  const insertNewSection = (
    type: 'blank' | '1col' | '2col' | '3col' | '4col' = '1col',
    atIndex?: number
  ) => {
    let newRows: PageBlockRow[] = [];

    if (type === 'blank' || type === '1col') {
      newRows = [
        {
          id: `row_${Date.now()}`,
          columns: [
            {
              id: `col_${Date.now()}`,
              widthPercentage: 100,
              elements: [
                {
                  id: `el_h_${Date.now()}`,
                  type: 'heading',
                  content: { text: 'Nueva Sección de Alto Impacto', level: 'h2' },
                  styles: {
                    fontSize: 28,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 16,
                  },
                },
                {
                  id: `el_p_${Date.now()}`,
                  type: 'paragraph',
                  content: {
                    text: 'Agrega aquí el contenido de esta sección. Puedes cambiar el fondo por un color sólido, degradado o imagen.',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    textAlign: 'center',
                    marginBottom: 20,
                  },
                },
              ],
            },
          ],
        },
      ];
    } else if (type === '2col') {
      newRows = [
        {
          id: `row_${Date.now()}`,
          columns: [
            {
              id: `col_${Date.now()}_1`,
              widthPercentage: 50,
              elements: [
                {
                  id: `el_h1_${Date.now()}`,
                  type: 'heading',
                  content: { text: 'Beneficio o Característica 1', level: 'h3' },
                  styles: { fontSize: 20, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 12 },
                },
                {
                  id: `el_p1_${Date.now()}`,
                  type: 'paragraph',
                  content: { text: 'Describe a detalle cómo ayudas a tus clientes y por qué deben confiar en ti.' },
                  styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 16 },
                },
              ],
            },
            {
              id: `col_${Date.now()}_2`,
              widthPercentage: 50,
              elements: [
                {
                  id: `el_h2_${Date.now()}`,
                  type: 'heading',
                  content: { text: 'Beneficio o Característica 2', level: 'h3' },
                  styles: { fontSize: 20, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 12 },
                },
                {
                  id: `el_p2_${Date.now()}`,
                  type: 'paragraph',
                  content: { text: 'Provee datos duros, estadísticas o credenciales relevantes de tu oferta.' },
                  styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 16 },
                },
              ],
            },
          ],
        },
      ];
    } else if (type === '3col') {
      newRows = [
        {
          id: `row_${Date.now()}`,
          columns: [1, 2, 3].map((num) => ({
            id: `col_${Date.now()}_${num}`,
            widthPercentage: 33.33,
            elements: [
              {
                id: `el_h_${Date.now()}_${num}`,
                type: 'heading',
                content: { text: `Paso 0${num}`, level: 'h3' },
                styles: { fontSize: 18, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true, marginBottom: 8 },
              },
              {
                id: `el_p_${Date.now()}_${num}`,
                type: 'paragraph',
                content: { text: `Explicación clave del paso ${num} para alcanzar el objetivo.` },
                styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 12 },
              },
            ],
          })),
        },
      ];
    } else if (type === '4col') {
      newRows = [
        {
          id: `row_${Date.now()}`,
          columns: [1, 2, 3, 4].map((num) => ({
            id: `col_${Date.now()}_${num}`,
            widthPercentage: 25,
            elements: [
              {
                id: `el_h_${Date.now()}_${num}`,
                type: 'heading',
                content: { text: `0${num}`, level: 'h3' },
                styles: { fontSize: 18, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true, marginBottom: 8, textAlign: 'center' },
              },
              {
                id: `el_p_${Date.now()}_${num}`,
                type: 'paragraph',
                content: { text: `Característica o pilar clave número ${num}.` },
                styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 12, textAlign: 'center' },
              },
            ],
          })),
        },
      ];
    }

    const newSec: PageBlockSection = {
      id: `sec_${Date.now()}`,
      name: `Sección ${sections.length + 1}`,
      bgType: 'solid',
      bgColor: '#FFFFFF',
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 24,
      paddingRight: 24,
      paddingY: 48,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      rows: newRows,
    };

    const nextSections = [...sections];
    if (typeof atIndex === 'number' && atIndex >= 0 && atIndex <= sections.length) {
      nextSections.splice(atIndex, 0, newSec);
    } else {
      nextSections.push(newSec);
    }
    pushHistory(nextSections);
    setSelectedSectionId(newSec.id);
    setSelectedElementId(null);
    showToast(`Nueva sección "${newSec.name}" insertada`);
  };

  // Build a new element blueprint based on ElementType and optional options
  const createNewElement = (
    type: ElementType,
    options?: { level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' }
  ): PageBlockElement => {
    const newElement: PageBlockElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      content: {},
      styles: {
        fontSize: 16,
        fontFamily: 'Inter',
        textColor: '#121111',
        textAlign: 'left',
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

    switch (type) {
      case 'heading': {
        const lvl = options?.level || 'h1';
        const isH1 = lvl === 'h1';
        const isH2 = lvl === 'h2';
        const isH3 = lvl === 'h3';
        const isH4 = lvl === 'h4';
        const isH5 = lvl === 'h5';
        const text = isH1
          ? 'Titular Principal de Alto Impacto'
          : isH2
          ? 'Nuevo Título H2 de Alto Impacto'
          : isH3
          ? 'Encabezado H3 de Sección'
          : isH4
          ? 'Subencabezado H4'
          : 'Encabezado H5';
        const fontSize = isH1 ? 36 : isH2 ? 28 : isH3 ? 22 : isH4 ? 18 : 16;
        newElement.content = { text, level: lvl };
        newElement.styles = {
          fontSize,
          fontFamily: 'Poppins',
          textColor: '#121111',
          isBold: true,
          textAlign: 'center',
          marginTop: 0,
          marginBottom: isH4 || isH5 ? 10 : isH3 ? 12 : 16,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        };
        break;
      }
      case 'subheading':
        newElement.content = { text: 'Subtítulo explicativo o beneficio clave' };
        newElement.styles = {
          fontSize: 20,
          fontFamily: 'Inter',
          textColor: '#5B5B66',
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'paragraph':
        newElement.content = {
          text: 'Escribe aquí la descripción detallada de tu oferta, metodología o caso de estudio para convencer a tus prospectos.\n\nPuedes agregar saltos de línea con la tecla Enter y se mantendrán siempre visibles.',
        };
        newElement.styles = {
          fontSize: 16,
          lineHeight: 1.6,
          fontFamily: 'Inter',
          textColor: '#5B5B66',
          textAlign: 'left',
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'bullet_list':
        newElement.content = {
          items: [
            'Metodología probada paso a paso sin improvisar',
            'Soporte directo de expertos con acompañamiento real',
            'Herramientas e infraestructura comercial lista para usar',
          ],
        };
        newElement.styles = {
          fontSize: 15,
          fontFamily: 'Inter',
          textColor: '#121111',
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'rich_text':
        newElement.content = {
          html: '<p>Este es tu <strong>editor de texto</strong>. Puedes redactar, dar formato y personalizar tu contenido con total libertad.</p>',
        };
        newElement.styles = {
          fontSize: 16,
          fontFamily: 'Inter',
          textColor: '#121111',
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'button':
        newElement.content = { buttonText: '👉 Quiero Agendar Mi Sesión Estratégica' };
        newElement.styles = {
          fontSize: 16,
          fontFamily: 'Poppins',
          textColor: '#FFFFFF',
          bgColor: '#2848F0',
          isBold: true,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 32,
          paddingRight: 32,
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
          borderRadius: 8,
          textAlign: 'center',
          buttonDestination: 'next_page',
        };
        break;
      case 'image':
        newElement.content = {
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
          alt: 'Reunión de estrategia comercial',
        };
        newElement.styles = {
          borderRadius: 12,
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'video':
        newElement.content = {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        };
        newElement.styles = {
          maxWidth: '750px',
          marginTop: 0,
          marginBottom: 24,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'divider':
        newElement.content = {};
        newElement.styles = {
          borderWidth: 1,
          borderColor: '#E4E4E7',
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'spacer':
        newElement.content = { spacerHeight: 40 };
        newElement.styles = {
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'audio':
        newElement.content = {
          audioType: 'direct',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          audioTitle: 'Audio Explicativo / Música',
          audioArtist: 'Scale Sales Pro',
          audioAutoplay: false,
          audioLoop: false,
        };
        newElement.styles = {
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'icon':
        newElement.content = {
          iconName: 'Star',
          iconSize: 40,
          iconColor: '#2848F0',
          iconBgColor: '#EFF6FF',
          iconShape: 'circle',
        };
        newElement.styles = {
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'simple_form':
        newElement.content = {
          formTitle: '¿Quieres recibir más información?',
          formSubtitle: 'Déjanos tus datos y nos pondremos en contacto contigo de inmediato.',
          showNameField: true,
          nameRequired: false,
          showPhoneField: false,
          phoneRequired: false,
          emailRequired: true,
          submitButtonText: '👉 Enviar Información',
          submitButtonBg: '#2848F0',
          submitButtonTextColor: '#FFFFFF',
          formSuccessMessage: '¡Gracias por registrarte! Hemos recibido tus datos.',
          extraFields: [
            {
              id: `q_${Date.now()}`,
              type: 'radio',
              label: '¿Cuál es tu objetivo prioritario?',
              required: true,
              options: [
                'Aumentar las ventas de mi negocio',
                'Automatizar la captación de clientes',
                'Aprender a escalar con embudos',
              ],
            },
          ],
        };
        newElement.styles = {
          marginTop: 0,
          marginBottom: 24,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'popup_button':
        newElement.content = {
          popupButtonText: '🎁 Abrir Oferta en Pop-up',
          popupId: 'popup_1',
        };
        newElement.styles = {
          fontSize: 16,
          fontFamily: 'Poppins',
          textColor: '#FFFFFF',
          bgColor: '#2848F0',
          isBold: true,
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 28,
          paddingRight: 28,
          borderRadius: 8,
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'form':
        newElement.content = { formId: 'form_qualification_1' };
        newElement.styles = {
          maxWidth: '600px',
          marginTop: 0,
          marginBottom: 24,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'calendar':
        newElement.content = {};
        newElement.styles = {
          maxWidth: '750px',
          marginTop: 0,
          marginBottom: 24,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      default:
        break;
    }

    return newElement;
  };

  // Add new element by clicking on sidebar library
  const addElement = (type: ElementType, options?: { level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' }) => {
    const newElement = createNewElement(type, options);
    const targetSection = sections[0];
    if (!targetSection) {
      const brandNewSection: PageBlockSection = {
        id: `sec_${Date.now()}`,
        name: 'Sección 1',
        bgType: 'solid',
        bgColor: '#FFFFFF',
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        rows: [
          {
            id: `row_${Date.now()}`,
            name: 'Contenedor',
            widthType: 'boxed',
            maxWidth: 1200,
            columns: [
              {
                id: `col_${Date.now()}`,
                widthPercentage: 100,
                elements: [newElement],
              },
            ],
          },
        ],
      };
      pushHistory([brandNewSection]);
      setSelectedSectionId(brandNewSection.id);
      setSelectedElementId(newElement.id);
      const label = options?.level ? options.level.toUpperCase() : type.toUpperCase();
      showToast(`Elemento ${label} añadido al lienzo`);
      return;
    }

    const nextSections = sections.map((sec, secIdx) => {
      if (secIdx !== 0) return sec;
      return {
        ...sec,
        rows: sec.rows.map((row, rowIdx) => {
          if (rowIdx !== 0) return row;
          return {
            ...row,
            columns: row.columns.map((col, colIdx) => {
              if (colIdx !== 0) return col;
              return { ...col, elements: [...col.elements, newElement] };
            }),
          };
        }),
      };
    });

    pushHistory(nextSections);
    setSelectedElementId(newElement.id);
    const label = options?.level ? options.level.toUpperCase() : type.toUpperCase();
    showToast(`Elemento ${label} añadido al lienzo`);
  };

  // Insert element dropped from sidebar into a specific column and index
  const insertElementAt = (
    type: ElementType,
    colId: string,
    atIndex: number,
    options?: { level?: 'h1' | 'h2' | 'h3' | 'h4' }
  ) => {
    const newElement = createNewElement(type, options);

    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== colId) return col;
          const updatedElements = [...col.elements];
          updatedElements.splice(atIndex, 0, newElement);
          return { ...col, elements: updatedElements };
        }),
      })),
    }));

    pushHistory(nextSections);
    setSelectedElementId(newElement.id);
  };

  // Reorder existing element within canvas when dragged
  const reorderCanvasElement = (sourceId: string, targetColId: string, targetIdx: number) => {
    let movedElement: PageBlockElement | null = null;

    // Remove source element
    const sectionsWithoutMoved = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          const found = col.elements.find((e) => e.id === sourceId);
          if (found) {
            movedElement = found;
            return {
              ...col,
              elements: col.elements.filter((e) => e.id !== sourceId),
            };
          }
          return col;
        }),
      })),
    }));

    if (!movedElement) return;

    // Insert into target column at target index
    const finalSections = sectionsWithoutMoved.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== targetColId) return col;
          const updatedElements = [...col.elements];
          const insertPos = Math.max(0, Math.min(updatedElements.length, targetIdx));
          updatedElements.splice(insertPos, 0, movedElement!);
          return { ...col, elements: updatedElements };
        }),
      })),
    }));

    pushHistory(finalSections);
    setSelectedElementId(sourceId);
    showToast('Orden del elemento actualizado');
  };

  // Add layout row with 1, 2, 3 or 4 columns
  const addColumnsLayout = (numCols: number) => {
    const widthPercentage = 100 / numCols;
    const newColumns: PageBlockColumn[] = Array.from({ length: numCols }, (_, i) => ({
      id: `col_${Date.now()}_${i}`,
      widthPercentage,
      elements: [
        {
          id: `el_placeholder_${Date.now()}_${i}`,
          type: 'paragraph',
          content: { text: `Columna ${i + 1}: Haz clic para editar o arrastra elementos aquí.` },
          styles: {
            fontSize: 14,
            fontFamily: 'Inter',
            textColor: '#5B5B66',
            textAlign: 'center',
            paddingTop: 16,
            paddingBottom: 16,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
          },
        },
      ],
    }));

    const newRow: PageBlockRow = {
      id: `row_${Date.now()}`,
      name: `Fila de ${numCols} columna(s)`,
      columns: newColumns,
    };

    if (sections.length === 0) {
      const brandNewSection: PageBlockSection = {
        id: `sec_${Date.now()}`,
        name: 'Sección 1',
        bgType: 'solid',
        bgColor: '#FFFFFF',
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        rows: [newRow],
      };
      pushHistory([brandNewSection]);
      showToast(`Fila de ${numCols} columna(s) insertada`);
      return;
    }

    const nextSections = sections.map((sec, idx) => {
      if (idx !== 0) return sec;
      return { ...sec, rows: [...sec.rows, newRow] };
    });

    pushHistory(nextSections);
    showToast(`Fila de ${numCols} columna(s) insertada`);
  };

  // Insert Pre-built Blocks (supports specific target index or append)
  const insertPrebuiltBlock = (blockType: string, targetIndex?: number) => {
    let newSection: PageBlockSection;

    if (blockType === 'header') {
      newSection = {
        id: `sec_hdr_${Date.now()}`,
        name: 'Cabecera de Página (Header)',
        bgColor: '#FFFFFF',
        paddingY: 16,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 24,
        paddingRight: 24,
        borderBottomWidth: 1,
        borderColor: '#E4E4E7',
        rows: [
          {
            id: `row_hdr_${Date.now()}`,
            name: 'Barra de Navegación',
            widthType: 'boxed',
            maxWidth: 1200,
            columns: [
              {
                id: `col_hdr_brand_${Date.now()}`,
                widthPercentage: 32,
                elements: [
                  {
                    id: `el_hdr_logo_${Date.now()}`,
                    type: 'heading',
                    content: { text: '✦ MiNegocio Pro', level: 'h3' },
                    styles: {
                      fontSize: 20,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      marginBottom: 2,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                  {
                    id: `el_hdr_tagline_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Soluciones Digitales de Alta Conversión' },
                    styles: {
                      fontSize: 11,
                      fontFamily: 'Inter',
                      textColor: '#71717A',
                      marginBottom: 0,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                ],
              },
              {
                id: `col_hdr_nav_${Date.now()}`,
                widthPercentage: 40,
                elements: [
                  {
                    id: `el_hdr_links_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Inicio   •   Servicios   •   Testimonios   •   Contacto' },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Inter',
                      textColor: '#52525B',
                      textAlign: 'center',
                      isBold: false,
                      marginBottom: 0,
                      marginTop: 10,
                    },
                  },
                ],
              },
              {
                id: `col_hdr_cta_${Date.now()}`,
                widthPercentage: 28,
                elements: [
                  {
                    id: `el_hdr_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '👉 Agendar Llamada' },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      bgColor: '#2848F0',
                      isBold: true,
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 8,
                      textAlign: 'right',
                      marginBottom: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'footer') {
      newSection = {
        id: `sec_ftr_${Date.now()}`,
        name: 'Pie de Página (Footer)',
        bgColor: '#09090B',
        paddingY: 48,
        paddingTop: 48,
        paddingBottom: 36,
        paddingLeft: 24,
        paddingRight: 24,
        borderTopWidth: 1,
        borderColor: '#27272A',
        rows: [
          {
            id: `row_ftr_main_${Date.now()}`,
            name: 'Contenido Principal Footer',
            widthType: 'boxed',
            maxWidth: 1200,
            marginBottom: 20,
            columns: [
              {
                id: `col_ftr_info_${Date.now()}`,
                widthPercentage: 40,
                elements: [
                  {
                    id: `el_ftr_brand_${Date.now()}`,
                    type: 'heading',
                    content: { text: '✦ MiNegocio Pro', level: 'h3' },
                    styles: {
                      fontSize: 18,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      isBold: true,
                      marginBottom: 8,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                  {
                    id: `el_ftr_desc_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Ayudamos a profesionales, consultores y empresas a escalar sus resultados con sistemas predecibles y tecnología de vanguardia.',
                    },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Inter',
                      textColor: '#94A3B8',
                      lineHeight: 1.6,
                      marginBottom: 12,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                  {
                    id: `el_ftr_email_${Date.now()}`,
                    type: 'subheading',
                    content: { text: '✉️ Contacto: soporte@minegocio.com' },
                    styles: {
                      fontSize: 12,
                      fontFamily: 'Inter',
                      textColor: '#CBD5E1',
                      marginBottom: 0,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                ],
              },
              {
                id: `col_ftr_links_${Date.now()}`,
                widthPercentage: 30,
                elements: [
                  {
                    id: `el_ftr_links_title_${Date.now()}`,
                    type: 'subheading',
                    content: { text: 'ENLACES RÁPIDOS' },
                    styles: {
                      fontSize: 11,
                      fontFamily: 'Inter',
                      textColor: '#64748B',
                      isBold: true,
                      letterSpacing: 1,
                      marginBottom: 8,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                  {
                    id: `el_ftr_nav_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: '• Página Principal\n• Método y Beneficios\n• Casos de Éxito\n• Preguntas Frecuentes',
                    },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Inter',
                      textColor: '#E2E8F0',
                      lineHeight: 1.8,
                      marginBottom: 0,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                ],
              },
              {
                id: `col_ftr_cta_${Date.now()}`,
                widthPercentage: 30,
                elements: [
                  {
                    id: `el_ftr_cta_title_${Date.now()}`,
                    type: 'subheading',
                    content: { text: 'ATENCIÓN AL CLIENTE' },
                    styles: {
                      fontSize: 11,
                      fontFamily: 'Inter',
                      textColor: '#64748B',
                      isBold: true,
                      letterSpacing: 1,
                      marginBottom: 8,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                  {
                    id: `el_ftr_cta_text_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: '¿Tienes preguntas o requieres asistencia personalizada? Estamos a un mensaje de distancia.',
                    },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Inter',
                      textColor: '#94A3B8',
                      lineHeight: 1.5,
                      marginBottom: 14,
                      marginTop: 0,
                      textAlign: 'left',
                    },
                  },
                  {
                    id: `el_ftr_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '💬 Contactar por WhatsApp' },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      bgColor: '#22C55E',
                      isBold: true,
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 18,
                      paddingRight: 18,
                      borderRadius: 8,
                      textAlign: 'center',
                      marginBottom: 0,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: `row_ftr_legal_${Date.now()}`,
            name: 'Avisos Legales y Derechos',
            widthType: 'boxed',
            maxWidth: 1200,
            columns: [
              {
                id: `col_ftr_legal_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_ftr_div_${Date.now()}`,
                    type: 'divider',
                    content: {},
                    styles: {
                      borderColor: '#27272A',
                      marginTop: 16,
                      marginBottom: 20,
                    },
                  },
                  {
                    id: `el_ftr_copy_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: `Este sitio web no forma parte de Facebook™ ni Google™. Facebook es una marca registrada de Meta, Inc.\n\n© 2026 MiNegocio Pro. Todos los derechos reservados. | Políticas de Privacidad | Términos y Condiciones | Aviso Legal`,
                    },
                    styles: {
                      fontSize: 11,
                      fontFamily: 'Inter',
                      textColor: '#64748B',
                      textAlign: 'center',
                      lineHeight: 1.6,
                      marginBottom: 0,
                      marginTop: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'vsl') {
      newSection = {
        id: `sec_vsl_${Date.now()}`,
        name: 'Bloque VSL con Video',
        bgColor: '#FAFAFB',
        paddingY: 48,
        rows: [
          {
            id: `row_vsl_${Date.now()}`,
            columns: [
              {
                id: `col_vsl_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_vsl_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Descubre el Método Exacto de 3 Fases en Este Video', level: 'h2' },
                    styles: {
                      fontSize: 30,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 16,
                      marginTop: 0,
                    },
                  },
                  {
                    id: `el_vsl_vid_${Date.now()}`,
                    type: 'video',
                    content: { videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                    styles: { maxWidth: '750px', marginBottom: 24, marginTop: 0 },
                  },
                  {
                    id: `el_vsl_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '👉 Solicitar Mi Sesión de Diagnóstico Gratis' },
                    styles: {
                      fontSize: 17,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      bgColor: '#2848F0',
                      isBold: true,
                      paddingTop: 16,
                      paddingBottom: 16,
                      paddingLeft: 32,
                      paddingRight: 32,
                      borderRadius: 8,
                      textAlign: 'center',
                      buttonDestination: 'next_page',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'testimonials') {
      newSection = {
        id: `sec_test_${Date.now()}`,
        name: 'Testimonios y Prueba Social',
        bgColor: '#FFFFFF',
        paddingY: 44,
        rows: [
          {
            id: `row_test_title_${Date.now()}`,
            columns: [
              {
                id: `col_test_t_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_t_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Resultados Comprobados de Clientes Reales', level: 'h2' },
                    styles: {
                      fontSize: 26,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 28,
                      marginTop: 0,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: `row_test_cols_${Date.now()}`,
            columns: [
              {
                id: `col_t1_${Date.now()}`,
                widthPercentage: 50,
                elements: [
                  {
                    id: `el_t1_p_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: '"Logramos llenar nuestro calendario con 14 llamadas estratégicas en las primeras dos semanas sin invertir un solo centavo extra en pauta."',
                    },
                    styles: {
                      fontSize: 15,
                      fontFamily: 'Inter',
                      textColor: '#121111',
                      isItalic: true,
                      marginBottom: 8,
                      marginTop: 0,
                    },
                  },
                  {
                    id: `el_t1_author_${Date.now()}`,
                    type: 'subheading',
                    content: { text: '— Martín Estrada, Consultor Financiero' },
                    styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#2848F0', isBold: true },
                  },
                ],
              },
              {
                id: `col_t2_${Date.now()}`,
                widthPercentage: 50,
                elements: [
                  {
                    id: `el_t2_p_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: '"Antes tenía todo regado entre Calendly, formularios y hojas de Excel. Con Scale Sales Pro centralicé todo y duplicamos las conversiones."',
                    },
                    styles: {
                      fontSize: 15,
                      fontFamily: 'Inter',
                      textColor: '#121111',
                      isItalic: true,
                      marginBottom: 8,
                      marginTop: 0,
                    },
                  },
                  {
                    id: `el_t2_author_${Date.now()}`,
                    type: 'subheading',
                    content: { text: '— Andrea Morales, Coach Ejecutiva' },
                    styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#2848F0', isBold: true },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'offer') {
      // Direct Response Sales Letter - Offer Presentation Stack
      newSection = {
        id: `sec_offer_${Date.now()}`,
        name: 'Presentación de la Oferta y Stack de Valor',
        bgColor: '#FFFFFF',
        paddingY: 52,
        rows: [
          {
            id: `row_off_title_${Date.now()}`,
            columns: [
              {
                id: `col_off_t_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_off_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Todo Lo Que Recibes Al Unirte Hoy', level: 'h2' },
                    styles: {
                      fontSize: 30,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 8,
                      marginTop: 0,
                    },
                  },
                  {
                    id: `el_off_sub_${Date.now()}`,
                    type: 'subheading',
                    content: { text: 'Un sistema llave en mano probado para captar, calificar y cerrar clientes de alto valor.' },
                    styles: {
                      fontSize: 16,
                      fontFamily: 'Inter',
                      textColor: '#5B5B66',
                      textAlign: 'center',
                      marginBottom: 32,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: `row_off_body_${Date.now()}`,
            columns: [
              {
                id: `col_off_img_${Date.now()}`,
                widthPercentage: 45,
                elements: [
                  {
                    id: `el_off_img_${Date.now()}`,
                    type: 'image',
                    content: {
                      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
                      alt: 'Stack de la Oferta',
                    },
                    styles: { maxWidth: '100%', borderRadius: 12, marginBottom: 12 },
                  },
                  {
                    id: `el_off_caption_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: '✨ Acceso instantáneo a la plataforma y todos los recursos descargables.' },
                    styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#5B5B66', isItalic: true, textAlign: 'center' },
                  },
                ],
              },
              {
                id: `col_off_list_${Date.now()}`,
                widthPercentage: 55,
                elements: [
                  {
                    id: `el_off_stack_title_${Date.now()}`,
                    type: 'subheading',
                    content: { text: 'Desglose detallado del paquete:' },
                    styles: { fontSize: 18, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 12 },
                  },
                  {
                    id: `el_off_bullets_${Date.now()}`,
                    type: 'bullet_list',
                    content: {
                      items: [
                        '📦 Sistema de Captación High-Ticket Paso a Paso (Valor: $1,497 USD)',
                        '📋 Plantillas de Cartas de Ventas y Embudos Listos (Valor: $997 USD)',
                        '⚡ Plataforma Scale Sales Pro con CRM y Calendario (Valor: $1,200 USD)',
                        '🎯 Sesiones Semanales de Mentoría Estratégica en Vivo (Valor: $2,500 USD)',
                      ],
                    },
                    styles: { marginBottom: 16 },
                  },
                  {
                    id: `el_off_div_${Date.now()}`,
                    type: 'divider',
                    content: {},
                    styles: { marginBottom: 14 },
                  },
                  {
                    id: `el_off_price_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Valor Total Acumulado: $6,194 USD. Tu inversión hoy: Solo una fracción con precio de lanzamiento.',
                    },
                    styles: { fontSize: 15, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true, marginBottom: 16 },
                  },
                  {
                    id: `el_off_cta_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '👉 Quiero Mi Acceso Completo a la Oferta' },
                    styles: {
                      fontSize: 16,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      bgColor: '#2848F0',
                      isBold: true,
                      paddingTop: 16,
                      paddingBottom: 16,
                      paddingLeft: 28,
                      paddingRight: 28,
                      borderRadius: 8,
                      textAlign: 'center',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'fascinations') {
      // Fascinations & Benefit Bullets
      newSection = {
        id: `sec_fasc_${Date.now()}`,
        name: 'Bullets de Fascinación y Beneficios',
        bgColor: '#F8FAFC',
        paddingY: 48,
        rows: [
          {
            id: `row_fasc_title_${Date.now()}`,
            columns: [
              {
                id: `col_fasc_t_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_fasc_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Esto Es Exactamente Lo Que Descubrirás Dentro', level: 'h2' },
                    styles: {
                      fontSize: 28,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 8,
                    },
                  },
                  {
                    id: `el_fasc_sub_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Estrategias de respuesta directa probadas para eliminar la fricción y multiplicar prospectos.' },
                    styles: { fontSize: 15, fontFamily: 'Inter', textColor: '#5B5B66', textAlign: 'center', marginBottom: 30 },
                  },
                ],
              },
            ],
          },
          {
            id: `row_fasc_cols_${Date.now()}`,
            columns: [
              {
                id: `col_fasc_1_${Date.now()}`,
                widthPercentage: 50,
                elements: [
                  {
                    id: `el_fasc_b1_${Date.now()}`,
                    type: 'bullet_list',
                    content: {
                      items: [
                        '🎯 El secreto de 3 fases para transformar tráfico frío en prospectos ansiosos por agendar.',
                        '🎯 Por qué los embudos tradicionales fallan y cómo este modelo duplica la asistencia.',
                        '🎯 La estructura de guion de 12 minutos que hace que el prospecto se autocalifique solo.',
                      ],
                    },
                    styles: { marginBottom: 16 },
                  },
                ],
              },
              {
                id: `col_fasc_2_${Date.now()}`,
                widthPercentage: 50,
                elements: [
                  {
                    id: `el_fasc_b2_${Date.now()}`,
                    type: 'bullet_list',
                    content: {
                      items: [
                        '🎯 Cómo filtrar curiosos y hablar exclusivamente con clientes con presupuesto real.',
                        '🎯 Automatizaciones nativas de seguimiento por WhatsApp para reducir el absentismo al 10%.',
                        '🎯 El proceso exacto para escalar sin tener que trabajar 14 horas apagando incendios.',
                      ],
                    },
                    styles: { marginBottom: 16 },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'guarantee') {
      // 100% Risk Reversal Guarantee
      newSection = {
        id: `sec_guar_${Date.now()}`,
        name: 'Garantía 100% Incondicional',
        bgColor: '#FFFFFF',
        paddingY: 44,
        rows: [
          {
            id: `row_guar_${Date.now()}`,
            columns: [
              {
                id: `col_guar_badge_${Date.now()}`,
                widthPercentage: 25,
                elements: [
                  {
                    id: `el_guar_img_${Date.now()}`,
                    type: 'image',
                    content: {
                      src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
                      alt: 'Garantía Incondicional',
                    },
                    styles: { maxWidth: '170px', borderRadius: 99, textAlign: 'center', marginBottom: 12 },
                  },
                ],
              },
              {
                id: `col_guar_text_${Date.now()}`,
                widthPercentage: 75,
                elements: [
                  {
                    id: `el_guar_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Nuestra Garantía Incondicional de 30 Días: Cero Riesgo Para Ti', level: 'h3' },
                    styles: { fontSize: 22, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 10 },
                  },
                  {
                    id: `el_guar_p1_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Prueba todo el sistema durante 30 días enteros. Si aplicas los pasos y sientes que no estás consiguiendo prospectos más calificados, o si simplemente no estás 100% fascinado con la experiencia, solo escríbenos y te reembolsaremos la totalidad de tu inversión de inmediato.',
                    },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 10 },
                  },
                  {
                    id: `el_guar_p2_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: '🔒 Sin preguntas incómodas, sin resentimientos. Toda la responsabilidad recae sobre nosotros.' },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#059669', isBold: true },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'comparison') {
      // Comparison: Old Way vs New Way
      newSection = {
        id: `sec_comp_${Date.now()}`,
        name: 'Comparativa: Método Antiguo vs Scale Sales Pro',
        bgColor: '#F4F4F5',
        paddingY: 48,
        rows: [
          {
            id: `row_comp_title_${Date.now()}`,
            columns: [
              {
                id: `col_comp_t_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_comp_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '¿Por Qué Este Enfoque Es Radicalmente Diferente?', level: 'h2' },
                    styles: { fontSize: 28, fontFamily: 'Poppins', textColor: '#121111', isBold: true, textAlign: 'center', marginBottom: 32 },
                  },
                ],
              },
            ],
          },
          {
            id: `row_comp_cols_${Date.now()}`,
            columns: [
              {
                id: `col_comp_old_${Date.now()}`,
                widthPercentage: 50,
                elements: [
                  {
                    id: `el_comp_old_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '❌ El Método Antiguo y Disperso', level: 'h3' },
                    styles: { fontSize: 18, fontFamily: 'Poppins', textColor: '#DC2626', isBold: true, marginBottom: 12 },
                  },
                  {
                    id: `el_comp_old_b_${Date.now()}`,
                    type: 'bullet_list',
                    content: {
                      items: [
                        'Múltiples herramientas inconexas (ClickFunnels + Calendly + Zapier + Excel)',
                        'Leads que se pierden por fallas en webhooks o automatizaciones caídas',
                        'Llamadas eternas con personas sin presupuesto ni poder de decisión',
                        'Costos acumulados de cientos de dólares al mes en suscripciones',
                      ],
                    },
                    styles: { marginBottom: 16 },
                  },
                ],
              },
              {
                id: `col_comp_new_${Date.now()}`,
                widthPercentage: 50,
                elements: [
                  {
                    id: `el_comp_new_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '🚀 El Sistema Integrado Scale Sales Pro', level: 'h3' },
                    styles: { fontSize: 18, fontFamily: 'Poppins', textColor: '#16A34A', isBold: true, marginBottom: 12 },
                  },
                  {
                    id: `el_comp_new_b_${Date.now()}`,
                    type: 'bullet_list',
                    content: {
                      items: [
                        'Todo en una sola suite centralizada: Embudos, Calificación, CRM y Agenda',
                        'Lead scoring automático en tiempo real según respuestas clave',
                        'Solo atiendes reuniones con prospectos calificados con dinero listo',
                        'Ahorro del 70% en costos de software y cero configuración técnica',
                      ],
                    },
                    styles: { marginBottom: 16 },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'bio') {
      // Author / Creator Bio
      newSection = {
        id: `sec_bio_${Date.now()}`,
        name: 'Sobre el Autor / Quién Soy',
        bgColor: '#FFFFFF',
        paddingY: 48,
        rows: [
          {
            id: `row_bio_${Date.now()}`,
            columns: [
              {
                id: `col_bio_img_${Date.now()}`,
                widthPercentage: 35,
                elements: [
                  {
                    id: `el_bio_img_${Date.now()}`,
                    type: 'image',
                    content: {
                      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                      alt: 'Mentor / Fundador',
                    },
                    styles: { maxWidth: '100%', borderRadius: 16, marginBottom: 12 },
                  },
                ],
              },
              {
                id: `col_bio_content_${Date.now()}`,
                widthPercentage: 65,
                elements: [
                  {
                    id: `el_bio_sub_${Date.now()}`,
                    type: 'subheading',
                    content: { text: 'CONOCE A TU GUÍA ESTRATÉGICO' },
                    styles: { fontSize: 12, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true, marginBottom: 6 },
                  },
                  {
                    id: `el_bio_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '¿Quién Diseñó Este Sistema Comercial?', level: 'h2' },
                    styles: { fontSize: 26, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 14 },
                  },
                  {
                    id: `el_bio_p1_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Durante los últimos 6 años he asesorado a más de 300 consultores, agencias y proveedores de servicios B2B, ayudándolos a generar millones de dólares en ventas mediante embudos de respuesta directa.',
                    },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 10 },
                  },
                  {
                    id: `el_bio_p2_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Diseñé Scale Sales Pro porque vi que la gran mayoría de emprendedores no fracasa por su producto, sino por la falta de un sistema predecible que transforme el interés en ventas reales.',
                    },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 18 },
                  },
                  {
                    id: `el_bio_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: 'Conoce Más y Solicita Tu Sesión' },
                    styles: { fontSize: 14, fontFamily: 'Poppins', textColor: '#FFFFFF', bgColor: '#1C1C1C', borderRadius: 8 },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'bonuses') {
      // Fast Action Bonus Stack
      newSection = {
        id: `sec_bonuses_${Date.now()}`,
        name: 'Bonos Exclusivos de Acción Rápida',
        bgColor: '#FAF5FF',
        paddingY: 48,
        rows: [
          {
            id: `row_bon_title_${Date.now()}`,
            columns: [
              {
                id: `col_bon_t_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_bon_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Bonos Exclusivos si Tomas Acción Hoy', level: 'h2' },
                    styles: { fontSize: 28, fontFamily: 'Poppins', textColor: '#581C87', isBold: true, textAlign: 'center', marginBottom: 8 },
                  },
                  {
                    id: `el_bon_sub_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Aceleradores tácticos para que obtengas resultados aún más rápido sin costo adicional.' },
                    styles: { fontSize: 15, fontFamily: 'Inter', textColor: '#7E22CE', textAlign: 'center', marginBottom: 32 },
                  },
                ],
              },
            ],
          },
          {
            id: `row_bon_cards_${Date.now()}`,
            columns: [
              {
                id: `col_bon_1_${Date.now()}`,
                widthPercentage: 33.33,
                elements: [
                  {
                    id: `el_b1_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '🎁 Bono #1: Bóveda de Scripts', level: 'h3' },
                    styles: { fontSize: 16, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 8 },
                  },
                  {
                    id: `el_b1_p_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Preguntas exactas palabra por palabra para cerrar en llamadas sin sonar invasivo.' },
                    styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 10 },
                  },
                  {
                    id: `el_b1_val_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Valor: $497 USD (¡GRATIS HOY!)' },
                    styles: { fontSize: 13, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true },
                  },
                ],
              },
              {
                id: `col_bon_2_${Date.now()}`,
                widthPercentage: 33.33,
                elements: [
                  {
                    id: `el_b2_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '🎁 Bono #2: Secuencias WhatsApp', level: 'h3' },
                    styles: { fontSize: 16, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 8 },
                  },
                  {
                    id: `el_b2_p_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Plantillas de recordatorio automatizado para asegurar una asistencia del 85%.' },
                    styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 10 },
                  },
                  {
                    id: `el_b2_val_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Valor: $297 USD (¡GRATIS HOY!)' },
                    styles: { fontSize: 13, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true },
                  },
                ],
              },
              {
                id: `col_bon_3_${Date.now()}`,
                widthPercentage: 33.33,
                elements: [
                  {
                    id: `el_b3_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '🎁 Bono #3: Plantillas de Copy', level: 'h3' },
                    styles: { fontSize: 16, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 8 },
                  },
                  {
                    id: `el_b3_p_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Estructuras de alta conversión para tus titulares, correos y páginas de captura.' },
                    styles: { fontSize: 13, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 10 },
                  },
                  {
                    id: `el_b3_val_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Valor: $397 USD (¡GRATIS HOY!)' },
                    styles: { fontSize: 13, fontFamily: 'Poppins', textColor: '#2848F0', isBold: true },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'faq') {
      // Frequently Asked Questions
      newSection = {
        id: `sec_faq_${Date.now()}`,
        name: 'Preguntas Frecuentes y Objeciones',
        bgColor: '#FFFFFF',
        paddingY: 48,
        rows: [
          {
            id: `row_faq_title_${Date.now()}`,
            columns: [
              {
                id: `col_faq_t_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_faq_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Preguntas Frecuentes', level: 'h2' },
                    styles: { fontSize: 28, fontFamily: 'Poppins', textColor: '#121111', isBold: true, textAlign: 'center', marginBottom: 8 },
                  },
                  {
                    id: `el_faq_sub_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Respuestas directas a las dudas más comunes de nuestros miembros.' },
                    styles: { fontSize: 15, fontFamily: 'Inter', textColor: '#5B5B66', textAlign: 'center', marginBottom: 32 },
                  },
                ],
              },
            ],
          },
          {
            id: `row_faq_items_${Date.now()}`,
            columns: [
              {
                id: `col_faq_body_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_faq_q1_${Date.now()}`,
                    type: 'heading',
                    content: { text: '❓ ¿Necesito saber de programación o diseño web?', level: 'h3' },
                    styles: { fontSize: 16, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 6 },
                  },
                  {
                    id: `el_faq_a1_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Para nada. La plataforma fue creada para que cualquier usuario pueda editar textos, fondos, colores, bloques y formularios simplemente haciendo clic o arrastrando elementos.' },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 20 },
                  },
                  {
                    id: `el_faq_d1_${Date.now()}`,
                    type: 'divider',
                    content: {},
                    styles: { marginBottom: 18 },
                  },
                  {
                    id: `el_faq_q2_${Date.now()}`,
                    type: 'heading',
                    content: { text: '❓ ¿Cómo funciona la calificación automática de prospectos?', level: 'h3' },
                    styles: { fontSize: 16, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 6 },
                  },
                  {
                    id: `el_faq_a2_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'El cuestionario pondera respuestas de facturación, presupuesto y urgencia. Quienes alcanzan el puntaje mínimo acceden de inmediato a tu calendario; los demás son filtrados con cortesía.' },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 20 },
                  },
                  {
                    id: `el_faq_d2_${Date.now()}`,
                    type: 'divider',
                    content: {},
                    styles: { marginBottom: 18 },
                  },
                  {
                    id: `el_faq_q3_${Date.now()}`,
                    type: 'heading',
                    content: { text: '❓ ¿En cuánto tiempo puedo tener mi embudo al aire?', level: 'h3' },
                    styles: { fontSize: 16, fontFamily: 'Poppins', textColor: '#121111', isBold: true, marginBottom: 6 },
                  },
                  {
                    id: `el_faq_a3_${Date.now()}`,
                    type: 'paragraph',
                    content: { text: 'Con las plantillas y bloques prearmados de Scale Sales Pro, la mayoría de nuestros clientes tienen su embudo completo publicado en menos de una tarde.' },
                    styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#5B5B66', marginBottom: 24 },
                  },
                  {
                    id: `el_faq_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '👉 Agendar Mi Sesión Estratégica' },
                    styles: { fontSize: 15, fontFamily: 'Poppins', textColor: '#FFFFFF', bgColor: '#2848F0', isBold: true, textAlign: 'center' },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (blockType === 'urgency') {
      // Urgency & Limited Capacity
      newSection = {
        id: `sec_urg_${Date.now()}`,
        name: 'Urgencia y Plazas Limitadas',
        bgColor: '#09090B',
        paddingY: 48,
        rows: [
          {
            id: `row_urg_${Date.now()}`,
            columns: [
              {
                id: `col_urg_1_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_urg_sub_${Date.now()}`,
                    type: 'subheading',
                    content: { text: '⚠️ ATENCIÓN: PLAZAS LIMITADAS PARA ESTE MES' },
                    styles: { fontSize: 12, fontFamily: 'Poppins', textColor: '#F59E0B', isBold: true, textAlign: 'center', marginBottom: 8 },
                  },
                  {
                    id: `el_urg_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: 'Solo Aceptamos 15 Clientes Nuevos Este Mes', level: 'h2' },
                    styles: { fontSize: 28, fontFamily: 'Poppins', textColor: '#FFFFFF', isBold: true, textAlign: 'center', marginBottom: 14 },
                  },
                  {
                    id: `el_urg_p_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Para asegurar la máxima calidad de atención y acompañamiento personalizado a cada uno de nuestros clientes, cerramos admisiones una vez alcanzado el cupo máximo de 15 nuevas cuentas.',
                    },
                    styles: { fontSize: 15, fontFamily: 'Inter', textColor: '#A1A1AA', textAlign: 'center', marginBottom: 24 },
                  },
                  {
                    id: `el_urg_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '⚡ Asegurar Mi Cupo Antes de que se Agote' },
                    styles: {
                      fontSize: 16,
                      fontFamily: 'Poppins',
                      textColor: '#09090B',
                      bgColor: '#F59E0B',
                      isBold: true,
                      paddingTop: 16,
                      paddingBottom: 16,
                      paddingLeft: 32,
                      paddingRight: 32,
                      borderRadius: 8,
                      textAlign: 'center',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else {
      // CTA Block
      newSection = {
        id: `sec_cta_${Date.now()}`,
        name: 'Llamada a la Acción de Cierre',
        bgColor: '#1C1C1C',
        paddingY: 48,
        rows: [
          {
            id: `row_cta_${Date.now()}`,
            columns: [
              {
                id: `col_cta_${Date.now()}`,
                widthPercentage: 100,
                elements: [
                  {
                    id: `el_cta_h_${Date.now()}`,
                    type: 'heading',
                    content: { text: '¿Listo Para Multiplicar Tus Citas Calificadas?', level: 'h2' },
                    styles: {
                      fontSize: 30,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 12,
                      marginTop: 0,
                    },
                  },
                  {
                    id: `el_cta_p_${Date.now()}`,
                    type: 'paragraph',
                    content: {
                      text: 'Las plazas para este mes son limitadas. Agenda hoy antes de que se agoten los horarios.',
                    },
                    styles: {
                      fontSize: 16,
                      fontFamily: 'Inter',
                      textColor: '#A1A1AA',
                      textAlign: 'center',
                      marginBottom: 24,
                      marginTop: 0,
                    },
                  },
                  {
                    id: `el_cta_btn_${Date.now()}`,
                    type: 'button',
                    content: { buttonText: '⚡ Reservar Mi Espacio Ahora Mismo' },
                    styles: {
                      fontSize: 16,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      bgColor: '#2848F0',
                      isBold: true,
                      paddingTop: 16,
                      paddingBottom: 16,
                      paddingLeft: 32,
                      paddingRight: 32,
                      borderRadius: 8,
                      textAlign: 'center',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    }

    const newSections = [...sections];
    if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= newSections.length) {
      newSections.splice(targetIndex, 0, newSection);
      pushHistory(newSections);
      setSelectedSectionId(newSection.id);
      setSelectedElementId(null);
      showToast(`Bloque "${newSection.name}" insertado en la posición seleccionada`);
    } else if (blockType === 'header') {
      newSections.unshift(newSection);
      pushHistory(newSections);
      setSelectedSectionId(newSection.id);
      setSelectedElementId(null);
      showToast(`Cabecera "${newSection.name}" añadida al inicio de la página`);
    } else {
      newSections.push(newSection);
      pushHistory(newSections);
      setSelectedSectionId(newSection.id);
      setSelectedElementId(null);
      showToast(`Bloque prearmado "${newSection.name}" añadido al final de la página`);
    }
  };

  const handleSavePage = () => {
    const targetFunnelId = propFunnelId || currentFunnel?.id || activeFunnel?.id || currentPage.funnel_id;
    const targetPageId = currentPage.id || currentFunnel?.pages?.[0]?.id || 'page_landing_1';

    if (targetFunnelId && targetPageId) {
      updateFunnelPage(targetFunnelId, targetPageId, {
        sections,
        popups: funnelPopups,
        page_type: currentPage.page_type,
        title: currentPage.title,
        settings: pageSettings,
      });
      setHasUnsavedChanges(false);
      showToast('Página guardada exitosamente en Scale Sales Pro');
    } else {
      showToast('Error al guardar: no se detectó el embudo');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F4F5] flex flex-col h-screen overflow-hidden text-[#121111]">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (hasUnsavedChanges) {
                setShowExitConfirmModal(true);
              } else {
                onExit();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Salir</span>
            {hasUnsavedChanges && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Cambios sin guardar" />
            )}
          </button>

          <div className="h-4 w-[1px] bg-zinc-200" />

          {/* Interactive Breadcrumb path */}
          <div className="flex items-center text-xs text-[#5B5B66] font-['Inter']">
            <button
              type="button"
              onClick={() => {
                setSelectedElementId(null);
                setSelectedRowId(null);
                setSelectedSectionId(null);
                setActiveTab('page');
              }}
              className="font-semibold text-zinc-900 hover:text-[#2848F0] hover:underline cursor-pointer flex items-center gap-1"
              title="Configuración Global de la Página (Lienzo)"
            >
              <span>{currentPage.title || 'Página'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />

            {selectedSec ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedElementId(null);
                  setSelectedRowId(null);
                  setSelectedSectionId(selectedSec.id);
                }}
                className={`cursor-pointer hover:text-[#2848F0] hover:underline ${
                  !selectedRow && !selectedElement ? 'text-[#2848F0] font-bold' : 'text-zinc-600'
                }`}
                title="Configuración de la Sección Externa"
              >
                {selectedSec.name}
              </button>
            ) : (
              <span className="text-zinc-400">Sección</span>
            )}

            {selectedRow && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedElementId(null);
                    setSelectedRowId(selectedRow.id);
                  }}
                  className={`cursor-pointer hover:text-[#2848F0] hover:underline flex items-center gap-1 ${
                    !selectedElement ? 'text-indigo-600 font-bold' : 'text-zinc-600'
                  }`}
                  title="Configuración de la Sección Interna (Fila)"
                >
                  <Box className="w-3 h-3 text-indigo-500" />
                  <span>{selectedRow.name || 'Sección Interna'}</span>
                </button>
              </>
            )}

            {selectedElement && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />
                <span className="text-[#2848F0] font-bold">
                  {selectedElement.type.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Device View Switcher & Undo/Redo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-zinc-200">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'desktop'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Vista de Escritorio"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'mobile'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Vista Móvil (Smartphones)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-zinc-200" />

          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Deshacer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Rehacer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions: Plantillas, Estructura, Preview & Save */}
        <div className="flex items-center gap-2">
          {!isPreviewMode && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('templates');
                setSelectedElementId(null);
                setSelectedRowId(null);
                setSelectedSectionId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                activeTab === 'templates' && !selectedElement && !selectedRowId && !activeSectionForInspector
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-1 ring-purple-600'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-900'
              }`}
              title="Explorar y cargar plantillas predefinidas en el lienzo"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Plantillas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-900 font-bold">
                Nuevo
              </span>
            </button>
          )}

          {!isPreviewMode && (
            <button
              type="button"
              onClick={() => setShowStructurePanel(!showStructurePanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                showStructurePanel
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs ring-1 ring-zinc-900'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
              title="Mostrar u ocultar la barra de Estructura (Navegador jerárquico de Elementos)"
            >
              <Layers className="w-3.5 h-3.5 text-current" />
              <span>Estructura</span>
            </button>
          )}

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Modo Edición' : 'Vista Previa'}</span>
          </button>

          <button
            onClick={handleSavePage}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Library / Properties Panel */}
        {!isPreviewMode && (
          <aside className="w-80 bg-white border-r border-zinc-200 flex flex-col h-full shrink-0 overflow-hidden shadow-xs z-20">
            {selectedElement ? (
              /* PROPERTY INSPECTOR FOR SELECTED ELEMENT */
              <div className="flex-1 flex flex-col h-full">
                {/* Header with back button */}
                <div className="p-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedElementId(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a Biblioteca</span>
                  </button>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#2848F0] font-semibold">
                    {selectedElement.type}
                  </span>
                </div>

                {/* Quick actions: Move up, down, duplicate, delete */}
                <div className="px-3 py-2 border-b border-zinc-100 flex items-center justify-between bg-white text-zinc-600">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveElement('up')}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                      title="Subir elemento"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveElement('down')}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                      title="Bajar elemento"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateElement()}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                      title="Duplicar elemento"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => deleteElement()}
                    className="p-1 rounded hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title="Eliminar elemento"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>

                {/* Properties Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-['Inter']">
                  {/* Hidden File Input for direct image uploading from PC/explorer */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEv) => {
                          const base64 = uploadEv.target?.result as string;
                          if (base64) {
                            updateSelectedElement({}, { src: base64 });
                            showToast('Imagen cargada correctamente desde tu explorador');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {/* 1. CONTENT FOR TEXT ELEMENTS (Heading, Subheading, Paragraph) */}
                  {(selectedElement.type === 'heading' ||
                    selectedElement.type === 'subheading' ||
                    selectedElement.type === 'paragraph') && (
                    <div className="space-y-2">
                      {selectedElement.type === 'heading' && (
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">Nivel:</label>
                          <select
                            value={selectedElement.content.level || 'h1'}
                            onChange={(e) => {
                              const lvl = e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
                              const defaultSize =
                                lvl === 'h1'
                                  ? pageSettings.defaultH1Size || 36
                                  : lvl === 'h2'
                                  ? pageSettings.defaultH2Size || 28
                                  : lvl === 'h3'
                                  ? pageSettings.defaultH3Size || 22
                                  : lvl === 'h4'
                                  ? pageSettings.defaultH4Size || 18
                                  : 16;
                              updateSelectedElement({ fontSize: defaultSize }, { level: lvl });
                            }}
                            className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0] cursor-pointer"
                          >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="h5">H5</option>
                          </select>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-zinc-700">Texto del contenido:</label>
                        {selectedElement.type === 'paragraph' && (
                          <span className="text-[10px] text-zinc-400">Permite saltos de línea</span>
                        )}
                      </div>
                      <textarea
                        rows={selectedElement.type === 'paragraph' ? 5 : 3}
                        value={selectedElement.content.text || ''}
                        onChange={(e) => updateSelectedElement({}, { text: e.target.value, html: e.target.value })}
                        placeholder={selectedElement.type === 'paragraph' ? "Escribe aquí...\n\nLos saltos de línea se mantendrán." : "Escribe tu texto..."}
                        className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-zinc-50"
                      />
                    </div>
                  )}

                  {/* 2. CONTENT FOR BULLET LIST */}
                  {selectedElement.type === 'bullet_list' && (
                    <div className="space-y-3">
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Tipo de viñeta / Icono:</label>
                        <select
                          value={selectedElement.styles.bulletIcon || 'disc'}
                          onChange={(e) => updateSelectedElement({ bulletIcon: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0] cursor-pointer"
                        >
                          {BULLET_ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <NumberControl
                        label="Distancia icono a texto"
                        value={selectedElement.styles.bulletSpacing ?? 10}
                        min={2}
                        max={48}
                        step={1}
                        unit="px"
                        onChange={(val) => updateSelectedElement({ bulletSpacing: val })}
                      />

                      <HexColorPicker
                        label="Color del icono / viñeta:"
                        value={selectedElement.styles.bulletColor || selectedElement.styles.textColor || '#2848F0'}
                        onOpen={handleColorPickerOpen}
                        onClose={handleColorPickerClose}
                        onChange={(val) => updateSelectedElement({ bulletColor: val })}
                      />

                      <div className="space-y-2 pt-1 border-t border-zinc-100">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-zinc-700">Puntos de la lista:</label>
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...(selectedElement?.content.items || [])];
                              items.push(`Nuevo punto ${items.length + 1}`);
                              updateSelectedElement({}, { items });
                            }}
                            className="text-[11px] text-[#2848F0] hover:underline font-semibold cursor-pointer"
                          >
                            + Añadir punto
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {(selectedElement.content.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="text-zinc-500 flex items-center justify-center w-4 shrink-0">
                                {renderBulletIcon(
                                  selectedElement.styles.bulletIcon || 'disc',
                                  13,
                                  selectedElement.styles.bulletColor || selectedElement.styles.textColor
                                )}
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const items = [...(selectedElement?.content.items || [])];
                                  items[idx] = e.target.value;
                                  updateSelectedElement({}, { items });
                                }}
                                className="flex-1 p-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const items = (selectedElement?.content.items || []).filter((_, i) => i !== idx);
                                  updateSelectedElement({}, { items });
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                title="Eliminar este punto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. CONTENT FOR BUTTON */}
                  {selectedElement.type === 'button' && (
                    <div className="space-y-3">
                      <div>
                        <label className="font-semibold text-zinc-700">Texto del botón:</label>
                        <input
                          type="text"
                          value={selectedElement.content.buttonText || ''}
                          onChange={(e) => updateSelectedElement({}, { buttonText: e.target.value })}
                          className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-zinc-700">Destino de la acción comercial:</label>
                        <select
                          value={selectedElement.styles.buttonDestination || 'next_page'}
                          onChange={(e) =>
                            updateSelectedElement({
                              buttonDestination: e.target.value as any,
                            })
                          }
                          className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        >
                          <option value="next_page">Siguiente página del embudo (Recomendado)</option>
                          <option value="calendar">Ir directo al calendario de citas</option>
                          <option value="url">Abrir enlace externo (URL)</option>
                        </select>
                      </div>
                      {selectedElement.styles.buttonDestination === 'url' && (
                        <div>
                          <label className="font-semibold text-zinc-700">URL del enlace:</label>
                          <input
                            type="text"
                            placeholder="https://wa.me/... o https://..."
                            value={selectedElement.styles.buttonUrl || ''}
                            onChange={(e) => updateSelectedElement({ buttonUrl: e.target.value })}
                            className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. CONTENT & SOURCE FOR IMAGE (NO TIPOGRAFÍA!) */}
                  {selectedElement.type === 'image' && (
                    <div className="space-y-3.5 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#2848F0]" />
                          <span>Origen de la Imagen</span>
                        </label>
                        <span className="text-[10px] text-zinc-400 font-mono">JPG / PNG / WebP</span>
                      </div>

                      {/* File upload button triggering system file dialog */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 bg-white border border-[#2848F0] text-[#2848F0] hover:bg-blue-50/70 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Subir imagen desde explorador</span>
                      </button>

                      {/* Or direct URL input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-zinc-600">O pegar URL de imagen:</span>
                          <span className="text-[10px] text-zinc-400">Web / CDN</span>
                        </div>
                        <input
                          type="text"
                          value={selectedElement.content.src || ''}
                          onChange={(e) => updateSelectedElement({}, { src: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        />
                      </div>

                      {/* Image Preview thumbnail */}
                      {selectedElement.content.src && (
                        <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-white p-1">
                          <img
                            src={selectedElement.content.src}
                            alt="Miniatura"
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="text-[10px] text-zinc-400 text-center mt-1">
                            Vista previa del recurso
                          </div>
                        </div>
                      )}

                      {/* Alt text for accessibility */}
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Texto alternativo (Alt / SEO):</label>
                        <input
                          type="text"
                          value={selectedElement.content.alt || ''}
                          onChange={(e) => updateSelectedElement({}, { alt: e.target.value })}
                          placeholder="Descripción de la imagen"
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        />
                      </div>

                      {/* Quick demo presets */}
                      <div>
                        <span className="text-[11px] text-zinc-500 font-medium block mb-1.5">Imágenes rápidas de muestra:</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({}, {
                                src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
                                alt: 'Reunión de estrategia comercial',
                              })
                            }
                            className="p-1 text-[10px] bg-white border border-zinc-200 rounded hover:border-[#2848F0] text-zinc-700 cursor-pointer text-center"
                          >
                            Reunión
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({}, {
                                src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
                                alt: 'Consultora ejecutiva profesional',
                              })
                            }
                            className="p-1 text-[10px] bg-white border border-zinc-200 rounded hover:border-[#2848F0] text-zinc-700 cursor-pointer text-center"
                          >
                            Consultora
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({}, {
                                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
                                alt: 'Gráfico de resultados y crecimiento',
                              })
                            }
                            className="p-1 text-[10px] bg-white border border-zinc-200 rounded hover:border-[#2848F0] text-zinc-700 cursor-pointer text-center"
                          >
                            Resultados
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. CONTENT & SOURCE FOR VIDEO (NO TIPOGRAFÍA!) */}
                  {selectedElement.type === 'video' && (() => {
                    const currentInfo = getEmbedVideoInfo(selectedElement.content.videoUrl);
                    return (
                      <div className="space-y-3.5 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-red-500" />
                            <span>Origen del Video</span>
                          </label>
                          <span className="text-[10px] text-zinc-500 font-mono bg-zinc-200/60 px-2 py-0.5 rounded-full">
                            YouTube / Vimeo / MP4
                          </span>
                        </div>

                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">URL del video:</label>
                          <input
                            type="text"
                            value={selectedElement.content.videoUrl || ''}
                            onChange={(e) => updateSelectedElement({}, { videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                          />
                          <p className="text-[11px] text-zinc-500 mt-1">
                            Pega el enlace de tu video de YouTube (ej. <span className="font-mono text-zinc-700">https://www.youtube.com/watch?v=...</span> o <span className="font-mono text-zinc-700">https://youtu.be/...</span>). El video se reproducirá directamente en el lienzo y en la vista previa.
                          </p>
                        </div>

                        {/* Format detection status badge */}
                        {selectedElement.content.videoUrl && (
                          <div className="flex items-center gap-1.5 text-xs p-2 rounded-lg bg-white border border-zinc-200">
                            {currentInfo.isValid ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                                <span className="text-emerald-700 font-medium">
                                  {currentInfo.type === 'youtube'
                                    ? '✓ Video de YouTube válido detectado (Listo para reproducir)'
                                    : currentInfo.type === 'vimeo'
                                    ? '✓ Video de Vimeo válido detectado'
                                    : currentInfo.type === 'loom'
                                    ? '✓ Video de Loom válido detectado'
                                    : '✓ Video directo detectable'}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                <span className="text-amber-700 font-medium text-[11px]">
                                  Ingresa una URL válida de YouTube para cargar la vista previa interactiva.
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Quick Sample Video Buttons */}
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({}, {
                              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                            })
                          }
                          className="w-full py-1.5 text-[11px] font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:text-[#2848F0] cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <RefreshCw className="w-3 h-3 text-[#2848F0]" />
                          <span>Cargar enlace de video de prueba (YouTube)</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* 6. CONTENT FOR FORM */}
                  {selectedElement.type === 'form' && (
                    <div className="space-y-3.5 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-purple-600" />
                          <span>Formulario de Calificación SSP</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Formulario vinculado:</label>
                        <select
                          value={selectedElement.content.formId || 'form_qualification_1'}
                          onChange={(e) => updateSelectedElement({}, { formId: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        >
                          <option value="form_qualification_1">Diagnóstico Comercial y Cualificación B2B</option>
                          <option value="form_audit_high_ticket">Filtro de Clientes High-Ticket</option>
                          <option value="form_consulting">Evaluación de Madurez de Negocio</option>
                        </select>
                      </div>

                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-[#2848F0]">
                        Este formulario aplica el sistema de puntaje por reglas para calificar prospectos automáticamente y enviarlos al calendario.
                      </div>
                    </div>
                  )}

                  {/* 7. CONTENT FOR CALENDAR */}
                  {selectedElement.type === 'calendar' && (
                    <div className="space-y-3.5 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>Widget de Calendario Nativo SSP</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Tipo de cita mostrada:</label>
                        <select
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                          defaultValue="30"
                        >
                          <option value="15">Llamada de Triaje (15 minutos)</option>
                          <option value="30">Sesión Estratégica 1 a 1 (30 minutos)</option>
                          <option value="45">Auditoría Comercial Completa (45 minutos)</option>
                          <option value="60">Consultoría Diagnóstica (60 minutos)</option>
                        </select>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
                        Los horarios disponibles se sincronizan en vivo con tu configuración de disponibilidad en el menú Calendario.
                      </div>
                    </div>
                  )}

                  {/* 8. CONTENT FOR DIVIDER */}
                  {selectedElement.type === 'divider' && (
                    <div className="space-y-3 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-zinc-600" />
                        <span>Ajustes del Separador</span>
                      </label>

                      <HexColorPicker
                        label="Color de línea:"
                        value={selectedElement.styles.borderColor || '#E4E4E7'}
                        onChange={(val) => updateSelectedElement({ borderColor: val })}
                      />

                      <NumberControl
                        label="Grosor de línea"
                        value={selectedElement.styles.borderWidth || 1}
                        min={1}
                        max={16}
                        onChange={(val) => updateSelectedElement({ borderWidth: val })}
                      />

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Estilo de línea:</label>
                        <select
                          value={selectedElement.styles.borderStyle || 'solid'}
                          onChange={(e) => updateSelectedElement({ borderStyle: e.target.value as any })}
                          className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                        >
                          <option value="solid">Sólido continuo</option>
                          <option value="dashed">Rayado (Dashed)</option>
                          <option value="dotted">Punteado (Dotted)</option>
                        </select>
                      </div>

                      <NumberControl
                        label="Ancho relativo"
                        value={selectedElement.styles.imageWidth || 100}
                        min={10}
                        max={100}
                        unit="%"
                        onChange={(val) => updateSelectedElement({ imageWidth: val })}
                      />

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Alineación del separador:</label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateSelectedElement({ textAlign: 'left' })}
                            className={`flex-1 py-1 px-2 rounded border text-[11px] cursor-pointer ${
                              selectedElement.styles.textAlign === 'left' ? 'bg-[#2848F0] text-white' : 'border-zinc-200 bg-white'
                            }`}
                          >
                            Izquierda
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSelectedElement({ textAlign: 'center' })}
                            className={`flex-1 py-1 px-2 rounded border text-[11px] cursor-pointer ${
                              (!selectedElement.styles.textAlign || selectedElement.styles.textAlign === 'center') ? 'bg-[#2848F0] text-white' : 'border-zinc-200 bg-white'
                            }`}
                          >
                            Centro
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSelectedElement({ textAlign: 'right' })}
                            className={`flex-1 py-1 px-2 rounded border text-[11px] cursor-pointer ${
                              selectedElement.styles.textAlign === 'right' ? 'bg-[#2848F0] text-white' : 'border-zinc-200 bg-white'
                            }`}
                          >
                            Derecha
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 9. CONTENT FOR RICH TEXT */}
                  {selectedElement.type === 'rich_text' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-xs text-zinc-800 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Editor de Texto</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFullscreenWysiwygElementId(selectedElement.id)}
                          className="text-[11px] font-bold text-[#2848F0] hover:text-[#1f38bf] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Pantalla Completa</span>
                        </button>
                      </div>

                      <WordPressWysiwygEditor
                        variant="sidebar"
                        title="Editor de Texto"
                        value={selectedElement.content.html || ''}
                        onChange={(html) => {
                          updateElementContent(selectedElement.id, { html });
                        }}
                        onToggleFullscreen={() => setFullscreenWysiwygElementId(selectedElement.id)}
                        elementStyles={selectedElement.styles}
                        showMediaButton={true}
                      />
                    </div>
                  )}

                  {/* 10. CONTENT FOR SPACER */}
                  {selectedElement.type === 'spacer' && (
                    <div className="space-y-3.5 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                          <span>Altura del Espaciador</span>
                        </label>
                        <span className="text-xs font-mono font-bold text-teal-700">
                          {selectedElement.content.spacerHeight || 40}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={200}
                        step={5}
                        value={selectedElement.content.spacerHeight || 40}
                        onChange={(e) => updateSelectedElement({}, { spacerHeight: Number(e.target.value) })}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                        <span>10px (Mínimo)</span>
                        <span>100px</span>
                        <span>200px (Máximo)</span>
                      </div>
                    </div>
                  )}

                  {/* 11. CONTENT FOR AUDIO / MUSIC PLAYER */}
                  {selectedElement.type === 'audio' && (
                    <div className="space-y-3.5 border border-amber-200 rounded-xl p-3 bg-amber-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Music className="w-4 h-4 text-amber-600" />
                          <span>Reproductor de Música y Audio</span>
                        </label>
                      </div>

                      {/* Source Mode Selector */}
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Tipo de Reproductor:</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(['direct', 'spotify', 'soundcloud'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateSelectedElement({}, { audioType: type })}
                              className={`py-1 text-xs font-bold rounded-lg border capitalize cursor-pointer ${
                                (selectedElement.content.audioType || 'direct') === type
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                              }`}
                            >
                              {type === 'direct' ? 'MP3 Directo' : type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* URL input */}
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">
                          {(selectedElement.content.audioType || 'direct') === 'direct'
                            ? 'URL del archivo MP3 / Audio:'
                            : (selectedElement.content.audioType || 'direct') === 'spotify'
                            ? 'URL del Track o Playlist en Spotify:'
                            : 'URL del Track en SoundCloud:'}
                        </label>
                        <input
                          type="text"
                          value={selectedElement.content.audioUrl || ''}
                          onChange={(e) => updateSelectedElement({}, { audioUrl: e.target.value })}
                          placeholder={
                            (selectedElement.content.audioType || 'direct') === 'direct'
                              ? 'https://.../audio.mp3'
                              : 'https://open.spotify.com/track/...'
                          }
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                        />
                      </div>

                      {(selectedElement.content.audioType || 'direct') === 'direct' && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1">Título:</label>
                              <input
                                type="text"
                                value={selectedElement.content.audioTitle || ''}
                                onChange={(e) => updateSelectedElement({}, { audioTitle: e.target.value })}
                                placeholder="Título del audio"
                                className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                              />
                            </div>
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1">Artista / Autor:</label>
                              <input
                                type="text"
                                value={selectedElement.content.audioArtist || ''}
                                onChange={(e) => updateSelectedElement({}, { audioArtist: e.target.value })}
                                placeholder="Scale Sales Pro"
                                className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-semibold text-zinc-700">Repetir en bucle (Loop):</span>
                            <input
                              type="checkbox"
                              checked={selectedElement.content.audioLoop ?? false}
                              onChange={(e) => updateSelectedElement({}, { audioLoop: e.target.checked })}
                              className="w-4 h-4 text-[#2848F0] rounded cursor-pointer"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* 12. CONTENT FOR ICON */}
                  {selectedElement.type === 'icon' && (
                    <div className="space-y-3.5 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Smile className="w-4 h-4 text-indigo-600" />
                          <span>Selector de Icono Vectorial</span>
                        </label>
                      </div>

                      {/* Icon grid catalog */}
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1.5">Icono seleccionado:</label>
                        <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-white border border-zinc-200 rounded-xl">
                          {POPULAR_ICONS.map((name) => {
                            const isCurr = (selectedElement.content.iconName || 'Star') === name;
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => updateSelectedElement({}, { iconName: name })}
                                className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-xs ${
                                  isCurr
                                    ? 'bg-[#2848F0] text-white shadow-xs'
                                    : 'hover:bg-zinc-100 text-zinc-700'
                                }`}
                                title={name}
                              >
                                <span className="text-[10px] font-bold truncate">{name.substring(0, 4)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Size */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-zinc-700">Tamaño del Icono:</span>
                          <span className="font-mono text-xs font-bold text-indigo-600">
                            {selectedElement.content.iconSize || 40}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={96}
                          step={4}
                          value={selectedElement.content.iconSize || 40}
                          onChange={(e) => updateSelectedElement({}, { iconSize: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      {/* Colors */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <HexColorPicker
                            label="Color del Icono"
                            value={selectedElement.content.iconColor || '#2848F0'}
                            onChange={(val) => updateSelectedElement({}, { iconColor: val })}
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">Forma del Contenedor:</label>
                          <select
                            value={selectedElement.content.iconShape || 'circle'}
                            onChange={(e) => updateSelectedElement({}, { iconShape: e.target.value as any })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          >
                            <option value="none">Sin fondo</option>
                            <option value="circle">Círculo</option>
                            <option value="rounded">Redondeado</option>
                            <option value="square">Cuadrado</option>
                          </select>
                        </div>
                      </div>

                      {selectedElement.content.iconShape && selectedElement.content.iconShape !== 'none' && (
                        <div>
                          <HexColorPicker
                            label="Color de Fondo del Contenedor"
                            value={selectedElement.content.iconBgColor || '#EFF6FF'}
                            onChange={(val) => updateSelectedElement({}, { iconBgColor: val })}
                          />
                        </div>
                      )}

                      {/* Alignment */}
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Alineación:</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => updateSelectedElement({ textAlign: align })}
                              className={`py-1 text-xs font-medium rounded-lg border capitalize cursor-pointer ${
                                (selectedElement.styles.textAlign || 'center') === align
                                  ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                              }`}
                            >
                              {align === 'left' ? 'Izquierda' : align === 'center' ? 'Centro' : 'Derecha'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 13. CONTENT FOR SIMPLE FORM */}
                  {selectedElement.type === 'simple_form' && (
                    <div className="space-y-3.5 border border-emerald-200 rounded-xl p-3 bg-emerald-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>Formulario Simple de Captación</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Título del formulario:</label>
                        <input
                          type="text"
                          value={selectedElement.content.formTitle || ''}
                          onChange={(e) => updateSelectedElement({}, { formTitle: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Subtítulo explicativo:</label>
                        <input
                          type="text"
                          value={selectedElement.content.formSubtitle || ''}
                          onChange={(e) => updateSelectedElement({}, { formSubtitle: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        />
                      </div>

                      {/* Fields Toggles */}
                      <div className="p-2.5 bg-white border border-zinc-200 rounded-xl space-y-2">
                        <div className="text-xs font-bold text-zinc-700">Campos del Formulario:</div>

                        <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                          <span className="text-xs text-zinc-700">Correo Electrónico (Email)</span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            Obligatorio
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                          <span className="text-xs text-zinc-700">Campo Nombre</span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[11px] text-zinc-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedElement.content.showNameField ?? true}
                                onChange={(e) => updateSelectedElement({}, { showNameField: e.target.checked })}
                                className="w-3.5 h-3.5 text-[#2848F0] rounded"
                              />
                              <span>Activar</span>
                            </label>
                            {selectedElement.content.showNameField && (
                              <label className="flex items-center gap-1 text-[11px] text-zinc-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedElement.content.nameRequired ?? false}
                                  onChange={(e) => updateSelectedElement({}, { nameRequired: e.target.checked })}
                                  className="w-3.5 h-3.5 text-[#2848F0] rounded"
                                />
                                <span>Requerido</span>
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-zinc-700">Campo Teléfono / WhatsApp</span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[11px] text-zinc-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedElement.content.showPhoneField ?? false}
                                onChange={(e) => updateSelectedElement({}, { showPhoneField: e.target.checked })}
                                className="w-3.5 h-3.5 text-[#2848F0] rounded"
                              />
                              <span>Activar</span>
                            </label>
                            {selectedElement.content.showPhoneField && (
                              <label className="flex items-center gap-1 text-[11px] text-zinc-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedElement.content.phoneRequired ?? false}
                                  onChange={(e) => updateSelectedElement({}, { phoneRequired: e.target.checked })}
                                  className="w-3.5 h-3.5 text-[#2848F0] rounded"
                                />
                                <span>Requerido</span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Radio button question configurator */}
                      <div className="p-2.5 bg-white border border-zinc-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                            <RadioIcon className="w-3.5 h-3.5 text-[#2848F0]" />
                            Pregunta con Radio Buttons:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const extras = [...(selectedElement.content.extraFields || [])];
                              if (extras.length === 0) {
                                extras.push({
                                  id: `q_${Date.now()}`,
                                  type: 'radio',
                                  label: '¿Cuál es tu consulta principal?',
                                  required: true,
                                  options: ['Opción 1', 'Opción 2', 'Opción 3'],
                                });
                              } else {
                                extras[0].options = [...(extras[0].options || []), `Nueva opción ${(extras[0].options?.length || 0) + 1}`];
                              }
                              updateSelectedElement({}, { extraFields: extras });
                            }}
                            className="text-[11px] font-bold text-[#2848F0] hover:underline cursor-pointer"
                          >
                            + Añadir Opción
                          </button>
                        </div>

                        {selectedElement.content.extraFields && selectedElement.content.extraFields.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <div>
                              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Título de la pregunta:</label>
                              <input
                                type="text"
                                value={selectedElement.content.extraFields[0].label || ''}
                                onChange={(e) => {
                                  const extras = [...(selectedElement.content.extraFields || [])];
                                  extras[0].label = e.target.value;
                                  updateSelectedElement({}, { extraFields: extras });
                                }}
                                className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              {(selectedElement.content.extraFields[0].options || []).map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-1.5">
                                  <span className="text-xs text-zinc-400 font-bold">🔘</span>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const extras = [...(selectedElement.content.extraFields || [])];
                                      const opts = [...(extras[0].options || [])];
                                      opts[oIdx] = e.target.value;
                                      extras[0].options = opts;
                                      updateSelectedElement({}, { extraFields: extras });
                                    }}
                                    className="flex-1 p-1 text-xs border border-zinc-200 rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const extras = [...(selectedElement.content.extraFields || [])];
                                      extras[0].options = (extras[0].options || []).filter((_, i) => i !== oIdx);
                                      updateSelectedElement({}, { extraFields: extras });
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                    title="Eliminar opción"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit Button Settings */}
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Texto del botón de envío:</label>
                        <input
                          type="text"
                          value={selectedElement.content.submitButtonText || '👉 Enviar Información'}
                          onChange={(e) => updateSelectedElement({}, { submitButtonText: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* 14. CONTENT FOR POPUP BUTTON */}
                  {selectedElement.type === 'popup_button' && (
                    <div className="space-y-3.5 border border-blue-200 rounded-xl p-3 bg-blue-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[#2848F0]" />
                          <span>Botón Disparador de Pop-up</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Texto del botón:</label>
                        <input
                          type="text"
                          value={selectedElement.content.popupButtonText || '🎁 Abrir Oferta (Pop-up)'}
                          onChange={(e) => updateSelectedElement({}, { popupButtonText: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Pop-up vinculado:</label>
                        <select
                          value={selectedElement.content.popupId || funnelPopups[0]?.id || 'popup_1'}
                          onChange={(e) => updateSelectedElement({}, { popupId: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-medium"
                        >
                          {funnelPopups.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action buttons: Edit popup & create new */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const target =
                              funnelPopups.find((p) => p.id === (selectedElement.content.popupId || 'popup_1')) ||
                              funnelPopups[0];
                            setEditingPopupModal(target);
                          }}
                          className="py-2 px-3 bg-[#2848F0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Editar Pop-up</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newId = `popup_${Date.now()}`;
                            const newPop: PopupModal = {
                              id: newId,
                              name: `Pop-up ${funnelPopups.length + 1}`,
                              title: '¡Nueva Oferta Exclusiva!',
                              subtitle: 'Ingresa tus datos para acceder inmediatamente:',
                              width: 'md',
                              elements: [
                                {
                                  id: `el_h_${Date.now()}`,
                                  type: 'heading',
                                  content: { text: '¡Oferta Exclusiva!', level: 'h2' },
                                  styles: { fontSize: 24, fontFamily: 'Poppins', textColor: '#18181b', isBold: true, textAlign: 'center', marginBottom: 8 },
                                },
                                {
                                  id: `el_p_${Date.now()}`,
                                  type: 'paragraph',
                                  content: { text: 'Completa este formulario rápido para obtener acceso prioritario.' },
                                  styles: { fontSize: 14, fontFamily: 'Inter', textColor: '#52525b', textAlign: 'center', marginBottom: 16 },
                                },
                                {
                                  id: `el_f_${Date.now()}`,
                                  type: 'simple_form',
                                  content: {
                                    formTitle: 'Regístrate aquí',
                                    showNameField: true,
                                    emailRequired: true,
                                    submitButtonText: 'Acceder Ahora 👉',
                                  },
                                  styles: { marginTop: 0, marginBottom: 0 },
                                },
                              ],
                            };
                            setFunnelPopups((prev) => [...prev, newPop]);
                            updateSelectedElement({}, { popupId: newId });
                            setEditingPopupModal(newPop);
                            showToast(`Nuevo Pop-up creado y vinculado`);
                          }}
                          className="py-2 px-3 bg-white hover:bg-blue-50 border border-blue-200 text-[#2848F0] rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Crear Nuevo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* ACCORDION: TIPOGRAFÍA (SOLO PARA ELEMENTOS DE TEXTO Y BOTÓN) */}
                  {/* EXCLUIDO ESTRICTAMENTE DE IMÁGENES, VIDEOS, SEPARADORES, ETC.  */}
                  {/* ============================================================== */}
                  {(selectedElement.type === 'heading' ||
                    selectedElement.type === 'subheading' ||
                    selectedElement.type === 'paragraph' ||
                    selectedElement.type === 'bullet_list' ||
                    selectedElement.type === 'button') && (
                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleAccordion('typography')}
                        className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5 text-zinc-500" />
                          Tipografía y Formato
                        </span>
                        {openSections.typography ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      {openSections.typography && (
                        <div className="p-3 space-y-3 bg-white">
                          <NumberControl
                            label="Tamaño de fuente"
                            value={selectedElement.styles.fontSize || 16}
                            min={1}
                            max={120}
                            onChange={(val) => updateSelectedElement({ fontSize: val })}
                          />

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="font-semibold text-zinc-700 block">Tipo de fuente (Google Fonts):</label>
                              <span className="text-[10px] text-zinc-400">14 fuentes</span>
                            </div>
                            <select
                              value={selectedElement.styles.fontFamily || ''}
                              onChange={(e) => updateSelectedElement({ fontFamily: (e.target.value || undefined) as any })}
                              className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0]"
                            >
                              <option value="">Por defecto global ({selectedElement.type === 'heading' ? (pageSettings.headingFontFamily || 'Poppins') : (pageSettings.bodyFontFamily || 'Inter')})</option>
                              {AVAILABLE_FONTS.map((font) => (
                                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                  {font.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Transformación:</label>
                            <select
                              value={selectedElement.styles.textTransform || ''}
                              onChange={(e) => updateSelectedElement({ textTransform: (e.target.value || undefined) as any })}
                              className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0] cursor-pointer"
                            >
                              <option value="">Por defecto</option>
                              <option value="uppercase">Mayúsculas</option>
                              <option value="lowercase">Minúsculas</option>
                              <option value="capitalize">Iniciales en mayúscula</option>
                              <option value="none">Normal</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1.5">Formato:</label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleToggleInlineFormat('bold');
                                }}
                                className={`p-1.5 px-2.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                                  selectedElement.styles.isBold ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                }`}
                                title="Negrita"
                              >
                                <BoldIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleToggleInlineFormat('italic');
                                }}
                                className={`p-1.5 px-2.5 rounded-lg border italic cursor-pointer transition-colors ${
                                  selectedElement.styles.isItalic ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                }`}
                                title="Cursiva"
                              >
                                <ItalicIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleToggleInlineFormat('underline');
                                }}
                                className={`p-1.5 px-2.5 rounded-lg border cursor-pointer transition-colors ${
                                  selectedElement.styles.isUnderline ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                }`}
                                title="Subrayado"
                              >
                                <UnderlineIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1.5">Alineación:</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ textAlign: 'left' })}
                                className={`py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                  selectedElement.styles.textAlign === 'left' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                }`}
                              >
                                <AlignLeft className="w-3.5 h-3.5" />
                                <span>Izquierda</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ textAlign: 'center' })}
                                className={`py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                  selectedElement.styles.textAlign === 'center' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                }`}
                              >
                                <AlignCenter className="w-3.5 h-3.5" />
                                <span>Centro</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ textAlign: 'right' })}
                                className={`py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                  selectedElement.styles.textAlign === 'right' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                }`}
                              >
                                <AlignRight className="w-3.5 h-3.5" />
                                <span>Derecha</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* ACCORDION: COLOR Y FONDO (TEXTO Y BOTÓN) */}
                  {/* ============================================================== */}
                  {(selectedElement.type === 'heading' ||
                    selectedElement.type === 'subheading' ||
                    selectedElement.type === 'paragraph' ||
                    selectedElement.type === 'bullet_list' ||
                    selectedElement.type === 'button') && (
                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleAccordion('colors')}
                        className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-zinc-500" />
                          Color y Fondo
                        </span>
                        {openSections.colors ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      {openSections.colors && (
                        <div className="p-3 space-y-3 bg-white">
                          <HexColorPicker
                            label="Color de texto:"
                            value={selectedElement.styles.textColor || '#121111'}
                            onOpen={handleColorPickerOpen}
                            onClose={handleColorPickerClose}
                            onChange={(val) => handleTextColorChange(val)}
                          />

                          {selectedElement.type === 'button' && (
                            <>
                              <HexColorPicker
                                label="Color de fondo del botón:"
                                value={selectedElement.styles.bgColor || '#2848F0'}
                                onChange={(val) => updateSelectedElement({ bgColor: val })}
                              />
                              <NumberControl
                                label="Borde redondeado (Radio)"
                                value={selectedElement.styles.borderRadius || 8}
                                min={0}
                                max={48}
                                onChange={(val) => updateSelectedElement({ borderRadius: val })}
                              />
                            </>
                          )}

                          {selectedElement.type === 'bullet_list' && (
                            <HexColorPicker
                              label="Color del icono / viñeta:"
                              value={selectedElement.styles.bulletColor || selectedElement.styles.textColor || '#2848F0'}
                              onOpen={handleColorPickerOpen}
                              onClose={handleColorPickerClose}
                              onChange={(val) => updateSelectedElement({ bulletColor: val })}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* ACCORDION: AJUSTES Y TRANSFORMACIÓN DE IMAGEN (SOLO PARA IMAGEN) */}
                  {/* ROTAR, REDONDEAR BORDES, TAMAÑO/ANCHO, ALINEACIÓN, SOMBRA, OPACIDAD */}
                  {/* ============================================================== */}
                  {selectedElement.type === 'image' && (
                    <>
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleAccordion('imageAdjustments')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-[#2848F0]" />
                            Ajustes y Forma de la Imagen
                          </span>
                          {openSections.imageAdjustments ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        {openSections.imageAdjustments && (
                          <div className="p-3 space-y-4 bg-white">
                            {/* 1. ROTACIÓN DE IMAGEN */}
                            <div className="space-y-2">
                              <NumberControl
                                label="Rotar imagen (Grados)"
                                value={selectedElement.styles.rotation || 0}
                                min={0}
                                max={360}
                                unit="°"
                                onChange={(val) => updateSelectedElement({ rotation: val })}
                              />
                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = selectedElement?.styles.rotation || 0;
                                    updateSelectedElement({ rotation: (current - 90 + 360) % 360 });
                                  }}
                                  className="flex-1 py-1 px-2 border border-zinc-200 hover:border-[#2848F0] hover:bg-blue-50/50 rounded text-[11px] font-semibold text-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
                                  title="Girar 90 grados a la izquierda"
                                >
                                  <RotateCcw className="w-3 h-3 text-[#2848F0]" />
                                  <span>-90°</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = selectedElement?.styles.rotation || 0;
                                    updateSelectedElement({ rotation: (current + 90) % 360 });
                                  }}
                                  className="flex-1 py-1 px-2 border border-zinc-200 hover:border-[#2848F0] hover:bg-blue-50/50 rounded text-[11px] font-semibold text-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
                                  title="Girar 90 grados a la derecha"
                                >
                                  <RotateCw className="w-3 h-3 text-[#2848F0]" />
                                  <span>+90°</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ rotation: 0 })}
                                  className="px-2 py-1 border border-zinc-200 hover:bg-zinc-100 rounded text-[11px] text-zinc-500 cursor-pointer"
                                  title="Restablecer ángulo normal"
                                >
                                  0° Reset
                                </button>
                              </div>
                            </div>

                            {/* 2. REDONDEAR BORDES DE IMAGEN */}
                            <div className="space-y-2">
                              <NumberControl
                                label="Bordes redondeados (Radio)"
                                value={selectedElement.styles.borderRadius || 0}
                                min={0}
                                max={150}
                                onChange={(val) => updateSelectedElement({ borderRadius: val })}
                              />
                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ borderRadius: 0 })}
                                  className={`flex-1 py-1 px-1.5 border rounded text-[11px] font-semibold cursor-pointer ${
                                    (selectedElement.styles.borderRadius || 0) === 0 ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                  }`}
                                >
                                  Cuadrado (0)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ borderRadius: 16 })}
                                  className={`flex-1 py-1 px-1.5 border rounded text-[11px] font-semibold cursor-pointer ${
                                    selectedElement.styles.borderRadius === 16 ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                  }`}
                                >
                                  Suave (16px)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ borderRadius: 999 })}
                                  className={`flex-1 py-1 px-1.5 border rounded text-[11px] font-semibold cursor-pointer ${
                                    (selectedElement.styles.borderRadius || 0) >= 150 ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                  }`}
                                >
                                  Círculo (Avatar)
                                </button>
                              </div>
                            </div>

                            {/* 3. TAMAÑO / ANCHO DE IMAGEN */}
                            <div className="space-y-2">
                              <NumberControl
                                label="Ancho de imagen"
                                value={selectedElement.styles.imageWidth || 450}
                                min={50}
                                max={900}
                                onChange={(val) => updateSelectedElement({ imageWidth: val })}
                              />
                              <div className="grid grid-cols-4 gap-1 pt-1">
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ imageWidth: 200 })}
                                  className="py-1 px-1 border border-zinc-200 rounded text-[10px] text-center bg-white hover:border-[#2848F0] cursor-pointer"
                                >
                                  200px
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ imageWidth: 380 })}
                                  className="py-1 px-1 border border-zinc-200 rounded text-[10px] text-center bg-white hover:border-[#2848F0] cursor-pointer"
                                >
                                  380px
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ imageWidth: 550 })}
                                  className="py-1 px-1 border border-zinc-200 rounded text-[10px] text-center bg-white hover:border-[#2848F0] cursor-pointer"
                                >
                                  550px
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ imageWidth: 800 })}
                                  className="py-1 px-1 border border-zinc-200 rounded text-[10px] text-center bg-white hover:border-[#2848F0] cursor-pointer"
                                >
                                  Max (800)
                                </button>
                              </div>
                            </div>

                            {/* 4. ALINEACIÓN DE LA IMAGEN */}
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1">Alineación de la imagen:</label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'left' })}
                                  className={`flex-1 py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer ${
                                    selectedElement.styles.textAlign === 'left' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                  }`}
                                >
                                  Izquierda
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'center' })}
                                  className={`flex-1 py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer ${
                                    (!selectedElement.styles.textAlign || selectedElement.styles.textAlign === 'center') ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                  }`}
                                >
                                  Centrado
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'right' })}
                                  className={`flex-1 py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer ${
                                    selectedElement.styles.textAlign === 'right' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                  }`}
                                >
                                  Derecha
                                </button>
                              </div>
                            </div>

                            {/* 5. SOMBRA Y OPACIDAD */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1">Sombra:</label>
                                <select
                                  value={selectedElement.styles.shadow || 'none'}
                                  onChange={(e) => updateSelectedElement({ shadow: e.target.value as any })}
                                  className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                                >
                                  <option value="none">Sin sombra</option>
                                  <option value="sm">Suave (sm)</option>
                                  <option value="md">Media (md)</option>
                                  <option value="lg">Pronunciada (lg)</option>
                                  <option value="xl">Elevada (xl)</option>
                                </select>
                              </div>
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1">Opacidad:</label>
                                <select
                                  value={selectedElement.styles.opacity ?? 1}
                                  onChange={(e) => updateSelectedElement({ opacity: Number(e.target.value) })}
                                  className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                                >
                                  <option value={1}>100% (Normal)</option>
                                  <option value={0.85}>85%</option>
                                  <option value={0.7}>70%</option>
                                  <option value={0.5}>50%</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* BORDE EXTERIOR DE IMAGEN */}
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleAccordion('imageBorder')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-emerald-600" />
                            Borde Exterior de Imagen
                          </span>
                          {openSections.imageBorder ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        {openSections.imageBorder && (
                          <div className="p-3 space-y-3 bg-white">
                            <NumberControl
                              label="Grosor de borde"
                              value={selectedElement.styles.borderWidth || 0}
                              min={0}
                              max={16}
                              onChange={(val) => updateSelectedElement({ borderWidth: val })}
                            />
                            <HexColorPicker
                              label="Color del borde:"
                              value={selectedElement.styles.borderColor || '#E4E4E7'}
                              onChange={(val) => updateSelectedElement({ borderColor: val })}
                            />
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1">Estilo de borde:</label>
                              <select
                                value={selectedElement.styles.borderStyle || 'solid'}
                                onChange={(e) => updateSelectedElement({ borderStyle: e.target.value as any })}
                                className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                              >
                                <option value="solid">Sólido</option>
                                <option value="dashed">Rayado (Dashed)</option>
                                <option value="dotted">Punteado (Dotted)</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ============================================================== */}
                  {/* ACCORDION: AJUSTES DE VIDEO (SOLO PARA VIDEO) */}
                  {/* ANCHO MÁXIMO, RELACIÓN DE ASPECTO, BORDES, ALINEACIÓN */}
                  {/* ============================================================== */}
                  {selectedElement.type === 'video' && (
                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleAccordion('videoSettings')}
                        className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-red-500" />
                          Ajustes del Reproductor de Video
                        </span>
                        {openSections.videoSettings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      {openSections.videoSettings && (
                        <div className="p-3 space-y-3.5 bg-white">
                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Relación de aspecto (Formato):</label>
                            <select
                              value={selectedElement.styles.aspectRatio || '16/9'}
                              onChange={(e) => updateSelectedElement({ aspectRatio: e.target.value as any })}
                              className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                            >
                              <option value="16/9">16:9 Panorámico estándar (YouTube / Vimeo VSL)</option>
                              <option value="4/3">4:3 Clásico</option>
                              <option value="9/16">9:16 Vertical (Reels / TikTok / Shorts)</option>
                              <option value="1/1">1:1 Cuadrado</option>
                            </select>
                          </div>

                          <NumberControl
                            label="Bordes redondeados del marco"
                            value={selectedElement.styles.borderRadius || 12}
                            min={0}
                            max={40}
                            onChange={(val) => updateSelectedElement({ borderRadius: val })}
                          />

                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Ancho máximo del reproductor:</label>
                            <div className="grid grid-cols-4 gap-1 mb-2">
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ maxWidth: '480px' })}
                                className={`py-1 px-1 border rounded text-[11px] font-semibold cursor-pointer ${
                                  selectedElement.styles.maxWidth === '480px' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                480px
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ maxWidth: '640px' })}
                                className={`py-1 px-1 border rounded text-[11px] font-semibold cursor-pointer ${
                                  selectedElement.styles.maxWidth === '640px' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                640px
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ maxWidth: '750px' })}
                                className={`py-1 px-1 border rounded text-[11px] font-semibold cursor-pointer ${
                                  (!selectedElement.styles.maxWidth || selectedElement.styles.maxWidth === '750px') ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                750px
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ maxWidth: '100%' })}
                                className={`py-1 px-1 border rounded text-[11px] font-semibold cursor-pointer ${
                                  selectedElement.styles.maxWidth === '100%' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                100%
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Alineación del video:</label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ textAlign: 'left' })}
                                className={`flex-1 py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer ${
                                  selectedElement.styles.textAlign === 'left' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                Izquierda
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ textAlign: 'center' })}
                                className={`flex-1 py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer ${
                                  (!selectedElement.styles.textAlign || selectedElement.styles.textAlign === 'center') ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                Centrado
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({ textAlign: 'right' })}
                                className={`flex-1 py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer ${
                                  selectedElement.styles.textAlign === 'right' ? 'bg-[#2848F0] text-white border-[#2848F0]' : 'border-zinc-200 bg-white text-zinc-700'
                                }`}
                              >
                                Derecha
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* ============================================================== */}
                  {/* ACCORDION: ESPACIADO (MARGEN Y RELLENO - AGRUPADOS EN 1 LÍNEA) */}
                  {/* ============================================================== */}
                  <div className="border border-zinc-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('spacing')}
                      className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5 text-[#2848F0]" />
                        Disposición
                      </span>
                      {openSections.spacing !== false ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {openSections.spacing !== false && (
                      <div className="p-3 bg-white">
                        <BoxModelSpacingControl
                          marginTop={selectedElement.styles.marginTop ?? 0}
                          marginRight={selectedElement.styles.marginRight ?? 0}
                          marginBottom={selectedElement.styles.marginBottom ?? 16}
                          marginLeft={selectedElement.styles.marginLeft ?? 0}
                          paddingTop={selectedElement.styles.paddingTop ?? 0}
                          paddingRight={selectedElement.styles.paddingRight ?? 0}
                          paddingBottom={selectedElement.styles.paddingBottom ?? 0}
                          paddingLeft={selectedElement.styles.paddingLeft ?? 0}
                          onChangeMargin={(margins) => updateSelectedElement(margins)}
                          onChangePadding={(paddings) => updateSelectedElement(paddings)}
                          showPadding={selectedElement.type !== 'divider'}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeRowForInspector ? (
              /* DEDICATED ROW INSPECTOR (SECCIÓN INTERNA) */
              <RowInspector
                row={activeRowForInspector}
                sectionName={selectedSec?.name}
                onUpdate={(props) => updateSelectedRow(props)}
                onDuplicate={() => duplicateRow(activeRowForInspector.id)}
                onDelete={() => deleteRow(activeRowForInspector.id)}
                onClose={() => setSelectedRowId(null)}
              />
            ) : activeSectionForInspector ? (
              /* DEDICATED SECTION INSPECTOR (WHEN SECTION IS SELECTED) */
              <SectionInspector
                section={activeSectionForInspector}
                onUpdate={(props) => updateSection(activeSectionForInspector.id, props)}
                onMoveUp={() => moveSection('up', activeSectionForInspector.id)}
                onMoveDown={() => moveSection('down', activeSectionForInspector.id)}
                onDuplicate={() => duplicateSection(activeSectionForInspector.id)}
                onDelete={() => deleteSection(activeSectionForInspector.id)}
                onClose={() => setSelectedSectionId(null)}
                canMoveUp={sections.findIndex((s) => s.id === activeSectionForInspector.id) > 0}
                canMoveDown={
                  sections.findIndex((s) => s.id === activeSectionForInspector.id) < sections.length - 1
                }
              />
            ) : (
              /* TABBED LIBRARY: ELEMENTS, BLOCKS & PAGE SETTINGS */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Tabs Header - Order: Página, Elementos, Bloques, Plantillas */}
                <div className="flex border-b border-zinc-200 bg-zinc-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('page');
                      setSelectedElementId(null);
                      setSelectedRowId(null);
                      setSelectedSectionId(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'page'
                        ? 'border-[#2848F0] text-[#2848F0] bg-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Página
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('elements');
                      setSelectedElementId(null);
                      setSelectedRowId(null);
                      setSelectedSectionId(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'elements'
                        ? 'border-[#2848F0] text-[#2848F0] bg-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Elementos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('blocks');
                      setSelectedElementId(null);
                      setSelectedRowId(null);
                      setSelectedSectionId(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'blocks'
                        ? 'border-[#2848F0] text-[#2848F0] bg-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Bloques
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('templates');
                      setSelectedElementId(null);
                      setSelectedRowId(null);
                      setSelectedSectionId(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer relative ${
                      activeTab === 'templates'
                        ? 'border-purple-600 text-purple-700 bg-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <span>Plantillas</span>
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-purple-600 inline-block align-middle" />
                  </button>
                </div>

                {activeTab === 'page' ? (
                  <div className="flex-1 overflow-y-auto">
                    <PageSettingsInspector
                      settings={pageSettings}
                      pageTitle={currentPage.title}
                      onUpdate={updatePageSettings}
                      onClose={() => setActiveTab('elements')}
                    />
                  </div>
                ) : activeTab === 'templates' ? (
                  /* PLANTILLAS TAB */
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 font-['Inter']">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-['Inter'] flex items-center gap-1.5">
                          <LayoutTemplate className="w-3.5 h-3.5 text-purple-600" />
                          Plantillas de Embudo
                        </span>
                        <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                          100% Editables
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-['Inter'] leading-relaxed">
                        Carga una estructura completa y persuasiva. Todo el contenido queda en el lienzo listo para que puedas editar textos, videos, colores y botones.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {PAGE_TEMPLATES.map((tpl) => (
                        <div
                          key={tpl.id}
                          className={`rounded-xl border transition-all p-3.5 flex flex-col gap-3 group bg-white shadow-2xs ${
                            tpl.id === 'tpl_carta_ventas_redes_sociales'
                              ? 'border-amber-300 ring-1 ring-amber-200/70 hover:border-amber-500 hover:shadow-md'
                              : tpl.id === 'tpl_vsl_coaching_exact'
                              ? 'border-purple-300 ring-1 ring-purple-200/70 hover:border-purple-500 hover:shadow-md'
                              : 'border-zinc-200 hover:border-zinc-300 hover:shadow-xs'
                          }`}
                        >
                          {/* Header with Title and Badge */}
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tpl.badgeColor}`}>
                                {tpl.badge}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-medium">
                                {tpl.category}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-900 font-['Poppins'] group-hover:text-[#2848F0] transition-colors leading-snug">
                              {tpl.name}
                            </h4>
                          </div>

                          {/* Mini Visual Preview Card */}
                          <div className="w-full rounded-lg bg-zinc-50 border border-zinc-200 p-2.5 overflow-hidden text-[10px] space-y-1.5 select-none shadow-2xs">
                            {tpl.id === 'tpl_carta_ventas_redes_sociales' ? (
                              <div className="bg-black text-white p-2.5 rounded-lg border border-zinc-800 space-y-2 select-none shadow-md">
                                <div className="bg-[#DC2626] text-white text-[8px] font-bold py-1 px-2 text-center rounded tracking-tight truncate shadow-xs">
                                  ⚠️ Finalmente... Un sistema Real... DESDE TU CASA!
                                </div>
                                <div className="text-center font-bold text-[9px] leading-tight text-white px-1">
                                  "Descubre el Novedoso Sistema que te permite <span className="text-[#FACC15]">ganar $1000 Dólares Mensuales a más</span> <span className="italic">Trabajando desde Casa...</span> <span className="underline italic">Usando Solamente Tus Redes Sociales</span>"
                                </div>
                                <div className="text-[8px] text-zinc-300 text-center">
                                  Sin Procesos Técnicos Complicados... <span className="italic font-semibold">Incluso sin Tener Experiencia</span>
                                </div>
                                <div className="bg-zinc-950 rounded-md border-2 border-[#FACC15] aspect-video flex flex-col items-center justify-center text-white max-w-[210px] mx-auto shadow-md">
                                  <Video className="w-5 h-5 text-red-500 mb-0.5" />
                                  <span className="text-[8px] font-semibold text-zinc-300">Video con Marco Dorado</span>
                                </div>
                                <div className="text-[7.5px] text-zinc-400 text-center leading-tight">
                                  Redes Sociales... <span className="underline font-bold text-white">Desde hoy vas a Ganar Dinero por Usarlas!</span>
                                </div>
                                <div className="bg-[#16A34A] text-white font-bold text-[8px] py-1.5 px-3 text-center rounded-md shadow-xs max-w-[220px] mx-auto">
                                  ➜ ¡SÍ, QUIERO APROVECHAR!
                                </div>
                              </div>
                            ) : tpl.id === 'tpl_vsl_coaching_exact' ? (
                              <div className="space-y-2">
                                <div className="bg-[#2563EB] text-white text-[9px] font-bold py-1 px-2 text-center rounded tracking-wider shadow-2xs">
                                  VÍDEO GRATIS - 17 MINUTOS
                                </div>
                                <div className="bg-white p-2 rounded border border-zinc-200 text-center font-bold text-[10px] leading-tight text-zinc-900 shadow-2xs">
                                  Descubre el sistema <span className="underline decoration-emerald-500 decoration-2">llave en mano</span> en <span className="text-[#00BFA5] italic">negocios de coaching</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 items-center bg-white p-2 rounded border border-zinc-100">
                                  <div className="bg-zinc-900 rounded-md aspect-video flex flex-col items-center justify-center text-white">
                                    <Video className="w-5 h-5 text-red-500 mb-0.5" />
                                    <span className="text-[8px] font-semibold text-zinc-300">Video</span>
                                  </div>
                                  <div className="space-y-1 text-[8px] text-zinc-700">
                                    <div className="flex items-start gap-1">
                                      <span className="text-blue-600 font-bold leading-none">✔</span>
                                      <span className="truncate">Algoritmo 90% trabajo</span>
                                    </div>
                                    <div className="flex items-start gap-1">
                                      <span className="text-blue-600 font-bold leading-none">✔</span>
                                      <span className="truncate">Publicidad rentable</span>
                                    </div>
                                    <div className="bg-[#00C49F] text-white font-bold text-[8px] py-1 text-center rounded-full shadow-xs mt-1">
                                      VER VÍDEO AHORA
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="py-4 text-center text-zinc-400 flex flex-col items-center justify-center">
                                <LayoutTemplate className="w-6 h-6 text-zinc-400 mb-1" />
                                <span className="text-[10px] font-medium">{tpl.sections.length} Secciones Estructuradas</span>
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] text-zinc-600 font-['Inter'] leading-relaxed">
                            {tpl.description}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                            <button
                              type="button"
                              onClick={() => setTemplatePreviewModal(tpl)}
                              className="flex-1 py-1.5 px-2 text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                              title="Previsualizar plantilla antes de cargar"
                            >
                              <Eye className="w-3 h-3 text-zinc-500" />
                              <span>Vista Previa</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestApplyTemplate(tpl)}
                              className="flex-1 py-1.5 px-2 text-[11px] font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                              title="Cargar esta plantilla en el canvas"
                            >
                              <Check className="w-3 h-3" />
                              <span>Cargar Plantilla</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {activeTab === 'elements' ? (
                    <>
                      {/* 1. SECCIÓN (PRIORIDAD #1 - DRAGGABLE & CLICKABLE) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-['Inter'] flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#2848F0]" />
                            Sección
                          </span>
                          <span className="text-[10px] text-[#2848F0] font-semibold bg-blue-100/70 px-1.5 py-0.5 rounded">
                            Arrastra al lienzo
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mb-2.5 font-['Inter']">
                          Arrastra una sección con columnas a cualquier altura del lienzo o haz clic para insertarla al final:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingSectionLayout('1col');
                              e.dataTransfer.setData('application/ssp-section-layout', '1col');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => setDraggingSectionLayout(null)}
                            onClick={() => insertNewSection('1col')}
                            className="p-2.5 bg-white border border-blue-200 hover:border-[#2848F0] hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra al lienzo o haz clic para añadir sección de 1 columna"
                          >
                            <div className="w-full h-5 rounded bg-blue-100 border border-blue-300 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-blue-700">100%</span>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-[#2848F0]">1 Columna</span>
                          </div>

                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingSectionLayout('2col');
                              e.dataTransfer.setData('application/ssp-section-layout', '2col');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => setDraggingSectionLayout(null)}
                            onClick={() => insertNewSection('2col')}
                            className="p-2.5 bg-white border border-blue-200 hover:border-[#2848F0] hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra al lienzo o haz clic para añadir sección de 2 columnas"
                          >
                            <div className="w-full h-5 rounded flex gap-1">
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[9px] font-bold text-blue-700">50%</span>
                              </div>
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[9px] font-bold text-blue-700">50%</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-[#2848F0]">2 Columnas</span>
                          </div>

                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingSectionLayout('3col');
                              e.dataTransfer.setData('application/ssp-section-layout', '3col');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => setDraggingSectionLayout(null)}
                            onClick={() => insertNewSection('3col')}
                            className="p-2.5 bg-white border border-blue-200 hover:border-[#2848F0] hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra al lienzo o haz clic para añadir sección de 3 columnas"
                          >
                            <div className="w-full h-5 rounded flex gap-0.5">
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-blue-700">33%</span>
                              </div>
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-blue-700">33%</span>
                              </div>
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-blue-700">33%</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-[#2848F0]">3 Columnas</span>
                          </div>

                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingSectionLayout('4col');
                              e.dataTransfer.setData('application/ssp-section-layout', '4col');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => setDraggingSectionLayout(null)}
                            onClick={() => insertNewSection('4col')}
                            className="p-2.5 bg-white border border-blue-200 hover:border-[#2848F0] hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra al lienzo o haz clic para añadir sección de 4 columnas"
                          >
                            <div className="w-full h-5 rounded flex gap-0.5">
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-blue-700">25%</span>
                              </div>
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-blue-700">25%</span>
                              </div>
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-blue-700">25%</span>
                              </div>
                              <div className="flex-1 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-blue-700">25%</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-[#2848F0]">4 Columnas</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. TEXTO (H1, H2, H3, H4, PÁRRAFO, LISTA, WYSIWYG) */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Texto
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'heading');
                              e.dataTransfer.setData('application/ssp-element-level', 'h1');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('heading', { level: 'h1' })}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <span className="w-5 h-5 flex items-center justify-center font-bold text-lg font-['Poppins'] text-zinc-900 group-hover:scale-110 transition-transform leading-none">
                              T
                            </span>
                            <span className="text-[11px] font-semibold font-['Poppins']">Titular</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'paragraph');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('paragraph')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <AlignLeft className="w-5 h-5 text-zinc-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Párrafo (Multilínea)</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'bullet_list');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('bullet_list')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <List className="w-5 h-5 text-zinc-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Lista de Viñetas</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'rich_text');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('rich_text')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <FileText className="w-5 h-5 text-zinc-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium font-['Poppins']">Editor de Texto</span>
                          </button>
                        </div>
                      </div>

                      {/* 3. MULTIMEDIA (BOTÓN, VIDEO, IMAGEN, SEPARADOR, ESPACIADOR, AUDIO/MÚSICA, ICONO) */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Multimedia
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'button');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('button')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <CreditCard className="w-5 h-5 text-[#2848F0] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Botón Acción</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'video');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('video')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Video className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Video</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'image');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('image')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <ImageIcon className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Imagen</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'divider');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('divider')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <div className="w-6 h-0.5 bg-zinc-400 my-2" />
                            <span className="text-[11px] font-medium">Separador</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'spacer');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('spacer')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <SlidersHorizontal className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Espaciador</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'audio');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('audio')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Music className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Música / Audio</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'icon');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('icon')}
                            className="col-span-2 p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Smile className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">Icono Vectorial</span>
                          </button>
                        </div>
                      </div>

                      {/* 4. FORMULARIOS (FORMULARIO SIMPLE + BOTÓN POP-UP) */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Formularios
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'simple_form');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('simple_form')}
                            className="p-2.5 border border-emerald-200 bg-emerald-50/20 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-emerald-950 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <FileText className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">Formulario Simple</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'popup_button');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('popup_button')}
                            className="p-2.5 border border-blue-200 bg-blue-50/30 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-blue-950 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Layers className="w-5 h-5 text-[#2848F0] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">Botón Pop-up</span>
                          </button>
                        </div>
                      </div>

                      {/* 5. CONVERSIÓN SSP */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Conversión SSP
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'form');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('form')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <ClipboardList className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Formulario SSP</span>
                          </button>
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'calendar');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('calendar')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Calendar className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Calendario SSP</span>
                          </button>
                        </div>
                      </div>

                      {/* 6. DISEÑO DE COLUMNAS */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Diseño de Columnas
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            onClick={() => addColumnsLayout(1)}
                            className="p-2 border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:bg-blue-50 text-center text-xs font-semibold cursor-pointer"
                          >
                            1 Col
                          </button>
                          <button
                            onClick={() => addColumnsLayout(2)}
                            className="p-2 border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:bg-blue-50 text-center text-xs font-semibold cursor-pointer"
                          >
                            2 Col
                          </button>
                          <button
                            onClick={() => addColumnsLayout(3)}
                            className="p-2 border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:bg-blue-50 text-center text-xs font-semibold cursor-pointer"
                          >
                            3 Col
                          </button>
                          <button
                            onClick={() => addColumnsLayout(4)}
                            className="p-2 border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:bg-blue-50 text-center text-xs font-semibold cursor-pointer"
                          >
                            4 Col
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* BLOCKS TAB */
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 font-['Inter']">
                        Bloques Prearmados de Alta Conversión
                      </div>

                      {PREBUILT_BLOCK_DEFS.map((block) => (
                        <div
                          key={block.type}
                          draggable
                          onDragStart={(e) => {
                            setDraggingBlockType(block.type);
                            e.dataTransfer.setData('application/ssp-prebuilt-block', block.type);
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onDragEnd={() => {
                            setDraggingBlockType(null);
                            setSectionDropIndicator(null);
                          }}
                          onClick={() => insertPrebuiltBlock(block.type)}
                          className="p-3 rounded-xl border border-zinc-200 hover:border-[#2848F0] hover:shadow-xs transition-all cursor-grab active:cursor-grabbing bg-white group shadow-2xs select-none"
                          title="Haz clic para añadir al final o arrastra para soltar en cualquier posición del lienzo"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <GripVertical className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#2848F0] shrink-0" />
                              <span className="font-semibold text-xs text-zinc-900 group-hover:text-[#2848F0] truncate">
                                {block.title}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${block.badgeColor}`}>
                              {block.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1 pl-5">
                            {block.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </aside>
        )}

        {/* Central Live Canvas Area with robust vertical scrolling & drop zones */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-10 flex flex-col items-center bg-[#F4F4F5] relative scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-100"
          style={{ scrollBehavior: 'smooth' }}
          onClick={(e) => {
            // Unselect when clicking background outside elements and open Page settings
            if (e.target === e.currentTarget && !isPreviewMode) {
              setSelectedElementId(null);
              setSelectedRowId(null);
              setSelectedSectionId(null);
              setActiveTab('page');
            }
          }}
        >
          <div
            className={`transition-all duration-300 shadow-xl border flex flex-col relative w-full ${
              isPreviewMode
                ? 'min-h-screen mb-16 shadow-2xl overflow-visible'
                : 'min-h-[500px] mb-32 overflow-visible'
            } ${viewportMode === 'mobile' ? 'max-w-[390px] my-4' : ''}`}
            style={{
              maxWidth:
                viewportMode === 'mobile'
                  ? '390px'
                  : pageSettings.pageWidthType === 'full'
                  ? '100%'
                  : `${pageSettings.pageContentMaxWidth || 1200}px`,
              borderRadius: `${pageSettings.pageBorderRadius ?? 16}px`,
              backgroundColor: pageSettings.pageBgColor || '#FFFFFF',
              fontFamily: pageSettings.bodyFontFamily || 'Inter',
              color: pageSettings.textColor || '#121111',
              borderColor: '#E4E4E7',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isPreviewMode) {
                setSelectedElementId(null);
                setSelectedRowId(null);
                setSelectedSectionId(null);
                setActiveTab('page');
              }
            }}
          >
            {sections.length === 0 ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const prebuiltType = e.dataTransfer.getData('application/ssp-prebuilt-block');
                  const elType = e.dataTransfer.getData('application/ssp-element-type') as ElementType;
                  const layout = e.dataTransfer.getData('application/ssp-section-layout') as '1col' | '2col' | '3col' | '4col' | undefined;
                  if (prebuiltType) {
                    insertPrebuiltBlock(prebuiltType);
                  } else if (layout) {
                    insertNewSection(layout);
                  } else if (elType) {
                    addElement(elType);
                  }
                }}
                className="min-h-[460px] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-full max-w-lg p-8 border-2 border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50 hover:bg-zinc-50 hover:border-[#2848F0]/40 transition-all flex flex-col items-center justify-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2848F0] flex items-center justify-center mb-3.5 shadow-2xs">
                    <Plus className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1 font-['Poppins']">
                    Agrega tu primer elemento o bloque
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mb-5 font-['Inter'] leading-relaxed">
                    El lienzo está completamente en blanco. Arrastra cualquier elemento o bloque aquí, o selecciona una opción para comenzar:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => insertNewSection('1col')}
                      className="px-3.5 py-2 rounded-lg bg-[#2848F0] hover:bg-[#1E36B9] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nueva Sección</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('blocks')}
                      className="px-3.5 py-2 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Layout className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Explorar Bloques</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="px-3.5 py-2 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-800 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5 text-purple-600" />
                      <span>Cargar Plantilla VSL</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              sections.map((section, secIdx) => {
              const isSectionSelected = !isPreviewMode && selectedSectionId === section.id && !selectedElementId;
              const effectiveBgType = section.bgType || (section.bgGradient ? 'gradient' : section.bgImageUrl ? 'image' : 'solid');
              const canvasRadius = pageSettings.pageBorderRadius !== undefined ? pageSettings.pageBorderRadius : 16;
              const isFirstSection = secIdx === 0;
              const isLastSection = secIdx === sections.length - 1;

              // Compute background styles
              const sectionStyle: React.CSSProperties = {
                paddingTop: `${section.paddingTop ?? section.paddingY ?? 48}px`,
                paddingBottom: `${section.paddingBottom ?? section.paddingY ?? 48}px`,
                paddingLeft: `${section.paddingLeft ?? 24}px`,
                paddingRight: `${section.paddingRight ?? 24}px`,
                marginTop: `${section.marginTop ?? 0}px`,
                marginBottom: `${section.marginBottom ?? 0}px`,
                marginLeft: `${section.marginLeft ?? 0}px`,
                marginRight: `${section.marginRight ?? 0}px`,
                borderTop: section.borderTopWidth ? `${section.borderTopWidth}px solid ${section.borderColor || '#E4E4E7'}` : undefined,
                borderBottom: section.borderBottomWidth ? `${section.borderBottomWidth}px solid ${section.borderColor || '#E4E4E7'}` : undefined,
                borderTopLeftRadius: isFirstSection && canvasRadius > 0 ? `${canvasRadius}px` : undefined,
                borderTopRightRadius: isFirstSection && canvasRadius > 0 ? `${canvasRadius}px` : undefined,
                borderBottomLeftRadius: isLastSection && canvasRadius > 0 ? `${canvasRadius}px` : undefined,
                borderBottomRightRadius: isLastSection && canvasRadius > 0 ? `${canvasRadius}px` : undefined,
                position: 'relative',
              };

              if (effectiveBgType === 'solid') {
                sectionStyle.backgroundColor = section.bgColor || '#FFFFFF';
              } else if (effectiveBgType === 'gradient') {
                sectionStyle.background = section.bgGradient || 'linear-gradient(135deg, #18181B 0%, #09090B 100%)';
              } else if (effectiveBgType === 'image' && section.bgImageUrl) {
                sectionStyle.backgroundImage = `url("${section.bgImageUrl}")`;
                sectionStyle.backgroundSize = 'cover';
                sectionStyle.backgroundPosition = 'center';
                sectionStyle.backgroundRepeat = 'no-repeat';
              }

              return (
                <React.Fragment key={section.id}>
                  {/* SECTION & PREBUILT BLOCK DROP INDICATOR (BEFORE) */}
                  {sectionDropIndicator &&
                    sectionDropIndicator.sectionId === section.id &&
                    sectionDropIndicator.position === 'before' && (
                      <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-40">
                        <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <span>Soltar aquí</span>
                        </div>
                      </div>
                    )}

                  <div
                    id={section.id}
                    style={sectionStyle}
                    onDragOver={(e) => {
                      const isPrebuilt =
                        draggingBlockType || e.dataTransfer.types.includes('application/ssp-prebuilt-block');
                      const isSectionDrag =
                        draggingSectionId || e.dataTransfer.types.includes('application/ssp-section-id');
                      const isSectionLayout =
                        draggingSectionLayout || e.dataTransfer.types.includes('application/ssp-section-layout');
                      if (!isPrebuilt && !isSectionDrag && !isSectionLayout) return;
                      e.preventDefault();
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const relativeY = e.clientY - rect.top;
                      const position = relativeY < rect.height / 2 ? 'before' : 'after';
                      setSectionDropIndicator({
                        sectionId: section.id,
                        index: secIdx,
                        position,
                      });
                    }}
                    onDrop={(e) => {
                      const layoutType =
                        (e.dataTransfer.getData('application/ssp-section-layout') || draggingSectionLayout) as
                          | '1col'
                          | '2col'
                          | '3col'
                          | '4col'
                          | undefined;
                      const prebuiltType =
                        e.dataTransfer.getData('application/ssp-prebuilt-block') || draggingBlockType;
                      const sourceSecId =
                        e.dataTransfer.getData('application/ssp-section-id') || draggingSectionId;

                      if (layoutType) {
                        e.preventDefault();
                        e.stopPropagation();
                        const targetIdx =
                          sectionDropIndicator && sectionDropIndicator.sectionId === section.id
                            ? sectionDropIndicator.position === 'before'
                              ? sectionDropIndicator.index
                              : sectionDropIndicator.index + 1
                            : secIdx;
                        setDraggingSectionLayout(null);
                        setSectionDropIndicator(null);
                        insertNewSection(layoutType, targetIdx);
                        return;
                      }

                      if (prebuiltType) {
                        e.preventDefault();
                        e.stopPropagation();
                        const targetIdx =
                          sectionDropIndicator && sectionDropIndicator.sectionId === section.id
                            ? sectionDropIndicator.position === 'before'
                              ? sectionDropIndicator.index
                              : sectionDropIndicator.index + 1
                            : secIdx;
                        setDraggingBlockType(null);
                        setSectionDropIndicator(null);
                        insertPrebuiltBlock(prebuiltType, targetIdx);
                        return;
                      }

                      if (sourceSecId) {
                        e.preventDefault();
                        e.stopPropagation();
                        const targetIdx =
                          sectionDropIndicator && sectionDropIndicator.sectionId === section.id
                            ? sectionDropIndicator.position === 'before'
                              ? sectionDropIndicator.index
                              : sectionDropIndicator.index + 1
                            : secIdx;
                        setDraggingSectionId(null);
                        setSectionDropIndicator(null);
                        reorderCanvasSection(sourceSecId, targetIdx);
                        return;
                      }
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return;
                      e.stopPropagation();
                      setSelectedSectionId(section.id);
                      setSelectedElementId(null);
                    }}
                    className={`relative transition-all ${
                      draggingSectionId === section.id
                        ? 'opacity-40 scale-[0.99] border-2 border-dashed border-amber-500'
                        : ''
                    } ${
                      !isPreviewMode
                        ? isSectionSelected
                          ? 'ring-2 ring-amber-500 ring-offset-2 z-10'
                          : 'hover:outline-1 hover:outline-dashed hover:outline-amber-400 cursor-pointer'
                        : ''
                    }`}
                    onMouseEnter={() => setHoveredSectionId(section.id)}
                    onMouseLeave={() => setHoveredSectionId(null)}
                  >
                    {/* OVERLAY LAYER FOR BACKGROUND IMAGE */}
                    {effectiveBgType === 'image' && (section.bgOverlayType || 'dark') !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                          backgroundColor: (section.bgOverlayType || 'dark') === 'dark' ? '#000000' : '#FFFFFF',
                          opacity: (section.bgOverlayOpacity ?? 60) / 100,
                        }}
                      />
                    )}

                    {/* FLOATING ACTION TOOLBAR FOR SELECTED OR HOVERED SECTION */}
                    {!isPreviewMode && (isSectionSelected || hoveredSectionId === section.id) && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-7 right-3 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-t-md uppercase tracking-wider z-30 flex items-center gap-1.5 shadow-md select-none"
                      >
                        {/* Draggable handle for section with Move icon */}
                        <div
                          draggable={!isPreviewMode}
                          onDragStart={(e) => {
                            if (isPreviewMode) return;
                            e.stopPropagation();
                            setDraggingSectionId(section.id);
                            e.dataTransfer.setData('application/ssp-section-id', section.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={() => {
                            setDraggingSectionId(null);
                            setSectionDropIndicator(null);
                          }}
                          className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing hover:bg-amber-700 px-1 py-0.5 rounded transition-colors"
                          title="Haz clic y arrastra hacia arriba o abajo para mover y reordenar esta sección"
                        >
                          <Move className="w-3.5 h-3.5 text-white" />
                          <span className="font-['Poppins'] font-bold">{section.name || `Sección ${secIdx + 1}`}</span>
                        </div>

                      <div className="w-[1px] h-3.5 bg-amber-400 mx-0.5" />

                      {/* Duplicate Section */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSection(section.id);
                        }}
                        className="p-1 rounded hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center"
                        title="Duplicar o clonar sección completa"
                      >
                        <Copy className="w-3.5 h-3.5 text-white" />
                      </button>

                      <div className="w-[1px] h-3.5 bg-amber-400 mx-0.5" />

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection('up', section.id);
                        }}
                        disabled={secIdx === 0}
                        className="p-0.5 rounded hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="Subir sección"
                      >
                        <ArrowUp className="w-3 h-3 text-white" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection('down', section.id);
                        }}
                        disabled={secIdx === sections.length - 1}
                        className="p-0.5 rounded hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="Bajar sección"
                      >
                        <ArrowDown className="w-3 h-3 text-white" />
                      </button>

                      <div className="w-[1px] h-3.5 bg-amber-400 mx-0.5" />

                      {/* Delete Section */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="p-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                        title="Eliminar esta sección"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}

                  {/* Relative content container above overlay */}
                  <div className="relative z-1">
                {section.rows.map((row, rIdx) => {
                  const isRowSelected = !isPreviewMode && selectedRowId === row.id && !selectedElementId;
                  const rowShadowClass =
                    row.shadow === 'sm'
                      ? 'shadow-xs'
                      : row.shadow === 'md'
                      ? 'shadow-md'
                      : row.shadow === 'lg'
                      ? 'shadow-xl'
                      : row.shadow === 'xl'
                      ? 'shadow-2xl'
                      : '';

                  const rowStyle: React.CSSProperties = {
                    maxWidth:
                      row.widthType === 'boxed' && row.maxWidth
                        ? `${row.maxWidth}px`
                        : row.widthType === 'full'
                        ? '100%'
                        : undefined,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: row.marginTop !== undefined ? `${row.marginTop}px` : undefined,
                    marginBottom: row.marginBottom !== undefined ? `${row.marginBottom}px` : '24px',
                    paddingTop: row.paddingTop !== undefined ? `${row.paddingTop}px` : undefined,
                    paddingBottom: row.paddingBottom !== undefined ? `${row.paddingBottom}px` : undefined,
                    paddingLeft: row.paddingLeft !== undefined ? `${row.paddingLeft}px` : undefined,
                    paddingRight: row.paddingRight !== undefined ? `${row.paddingRight}px` : undefined,
                    backgroundColor: row.bgColor || undefined,
                    borderRadius: row.borderRadius !== undefined ? `${row.borderRadius}px` : undefined,
                    borderWidth: row.borderWidth !== undefined ? `${row.borderWidth}px` : undefined,
                    borderColor: row.borderColor || undefined,
                    borderStyle: row.borderStyle || (row.borderWidth ? 'solid' : undefined),
                  };

                  return (
                    <div
                      id={row.id}
                      key={row.id || rIdx}
                      style={rowStyle}
                      onClick={(e) => {
                        if (isPreviewMode) return;
                        e.stopPropagation();
                        setSelectedRowId(row.id);
                        setSelectedElementId(null);
                        setSelectedSectionId(null);
                      }}
                      className={`relative transition-all group/row ${rowShadowClass} ${
                        !isPreviewMode
                          ? isRowSelected
                            ? 'ring-2 ring-indigo-600 rounded-xl bg-indigo-50/10'
                            : 'hover:ring-1 hover:ring-indigo-300 hover:ring-dashed rounded-xl'
                          : ''
                      }`}
                    >
                      {/* FLOATING ACTION TOOLBAR FOR SELECTED INTERNAL SECTION (ROW) */}
                      {!isPreviewMode && isRowSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -top-7 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-t-md uppercase tracking-wider z-30 flex items-center gap-1.5 shadow-md select-none"
                        >
                          <div className="flex items-center gap-1">
                            <Box className="w-3.5 h-3.5 text-white" />
                            <span>{row.name || `Sección Interna (${row.columns.length} Col)`}</span>
                          </div>
                          <div className="w-[1px] h-3 bg-indigo-400 mx-0.5" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateRow(row.id);
                            }}
                            className="p-1 hover:bg-indigo-700 rounded transition-colors cursor-pointer flex items-center"
                            title="Duplicar sección interna"
                          >
                            <Copy className="w-3 h-3 text-white" />
                          </button>
                          <div className="w-[1px] h-3 bg-indigo-400 mx-0.5" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRow(row.id);
                            }}
                            disabled={section.rows.length <= 1}
                            className="p-1 hover:bg-red-600 disabled:opacity-40 rounded transition-colors cursor-pointer flex items-center text-white"
                            title="Eliminar sección interna"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      )}

                      <div
                        className={`flex flex-wrap -mx-3 ${
                          viewportMode === 'mobile' ? 'flex-col gap-4' : ''
                        }`}
                      >
                    {row.columns.map((column) => {
                      return (
                        <div
                          key={column.id}
                          style={{
                            width: viewportMode === 'mobile' ? '100%' : `${column.widthPercentage}%`,
                          }}
                          className="px-3"
                          onDragOver={(e) => {
                            const isBlockOrSectionDrag =
                              draggingBlockType ||
                              draggingSectionId ||
                              draggingSectionLayout ||
                              e.dataTransfer.types.includes('application/ssp-prebuilt-block') ||
                              e.dataTransfer.types.includes('application/ssp-section-id') ||
                              e.dataTransfer.types.includes('application/ssp-section-layout');
                            if (isBlockOrSectionDrag) {
                              return; // Allow bubble to section
                            }
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            const isBlockOrSectionDrag =
                              draggingBlockType ||
                              draggingSectionId ||
                              draggingSectionLayout ||
                              e.dataTransfer.types.includes('application/ssp-prebuilt-block') ||
                              e.dataTransfer.types.includes('application/ssp-section-id') ||
                              e.dataTransfer.types.includes('application/ssp-section-layout');
                            if (isBlockOrSectionDrag) {
                              return; // Allow bubble to section
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            const targetIdx = dropIndicator && dropIndicator.colId === column.id
                              ? dropIndicator.position === 'before' ? dropIndicator.index : dropIndicator.index + 1
                              : column.elements.length;
                            setDropIndicator(null);

                            // Handle sidebar drop
                            const droppedType = e.dataTransfer.getData('application/ssp-element-type') as ElementType;
                            const droppedLevel = e.dataTransfer.getData('application/ssp-element-level') as
                              | 'h1'
                              | 'h2'
                              | 'h3'
                              | 'h4'
                              | undefined;
                            if (droppedType) {
                              insertElementAt(droppedType, column.id, targetIdx, droppedLevel ? { level: droppedLevel } : undefined);
                              return;
                            }

                            // Handle canvas internal reorder
                            const sourceId = e.dataTransfer.getData('application/ssp-element-id');
                            if (sourceId) {
                              reorderCanvasElement(sourceId, column.id, targetIdx);
                            }
                          }}
                        >
                          <div
                            className={`transition-all ${
                              isPreviewMode
                                ? 'border-none p-0 min-h-0'
                                : `min-h-[70px] p-2.5 rounded-xl border ${
                                    dropIndicator?.colId === column.id
                                      ? 'border-2 border-dashed border-[#2848F0] bg-blue-50/20'
                                      : 'border border-dashed border-zinc-300/80 hover:border-zinc-400'
                                  }`
                            }`}
                          >
                            {!isPreviewMode && column.elements.length === 0 && (
                              <div className="text-center py-6 text-xs text-zinc-400 italic">
                                Arrastra y suelta un elemento aquí
                              </div>
                            )}

                            {column.elements.map((element, elIdx) => {
                              const isSelected = selectedElementId === element.id;
                              const isDraggingThis = draggingElementId === element.id;

                              return (
                                <React.Fragment key={element.id}>
                                  {/* HORIZONTAL PLACEMENT DROP LINE INDICATOR (BEFORE) - REQ 2 */}
                                  {dropIndicator &&
                                    dropIndicator.colId === column.id &&
                                    dropIndicator.index === elIdx &&
                                    dropIndicator.position === 'before' && (
                                      <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-30">
                                        <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                          <span>Soltar aquí</span>
                                        </div>
                                      </div>
                                    )}

                                  <div
                                    id={element.id}
                                    draggable={!isPreviewMode}
                                    onDragStart={(e) => {
                                      if (isPreviewMode) return;
                                      e.stopPropagation();
                                      setDraggingElementId(element.id);
                                      e.dataTransfer.setData('application/ssp-element-id', element.id);
                                      e.dataTransfer.effectAllowed = 'move';
                                    }}
                                    onDragEnd={() => {
                                      setDraggingElementId(null);
                                      setDropIndicator(null);
                                    }}
                                    onDragOver={(e) => {
                                      const isBlockOrSectionDrag =
                                        draggingBlockType ||
                                        draggingSectionId ||
                                        draggingSectionLayout ||
                                        e.dataTransfer.types.includes('application/ssp-prebuilt-block') ||
                                        e.dataTransfer.types.includes('application/ssp-section-id') ||
                                        e.dataTransfer.types.includes('application/ssp-section-layout');
                                      if (isBlockOrSectionDrag) {
                                        return;
                                      }
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const relativeY = e.clientY - rect.top;
                                      const position = relativeY < rect.height / 2 ? 'before' : 'after';
                                      setDropIndicator({
                                        colId: column.id,
                                        index: elIdx,
                                        position,
                                      });
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isPreviewMode) {
                                        setSelectedElementId(element.id);
                                        setSelectedSectionId(section.id);
                                      }
                                    }}
                                    style={{
                                      marginTop: `${element.styles.marginTop || 0}px`,
                                      marginBottom: `${element.styles.marginBottom ?? 16}px`,
                                      marginLeft: `${element.styles.marginLeft || 0}px`,
                                      marginRight: `${element.styles.marginRight || 0}px`,
                                      paddingTop: `${element.styles.paddingTop || 0}px`,
                                      paddingBottom: `${element.styles.paddingBottom || 0}px`,
                                      paddingLeft: `${element.styles.paddingLeft || 0}px`,
                                      paddingRight: `${element.styles.paddingRight || 0}px`,
                                      textAlign: element.styles.textAlign || 'left',
                                    }}
                                    className={`relative transition-all ${
                                      isDraggingThis ? 'opacity-30 scale-95 border-2 border-dashed border-[#2848F0]' : ''
                                    } ${
                                      !isPreviewMode
                                        ? isSelected
                                          ? 'ring-2 ring-[#2848F0] rounded-lg p-2 bg-blue-50/15'
                                          : 'hover:ring-1 hover:ring-zinc-300 rounded-lg p-2 cursor-pointer'
                                        : ''
                                    }`}
                                  >
                                    {/* FLOATING ACTION BADGE WITH MOVE HANDLE, CLONE (REQ 1), UP/DOWN & TRASH BUTTON */}
                                    {!isPreviewMode && isSelected && (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute -top-7 left-0 bg-[#2848F0] text-white text-[11px] font-bold px-2 py-0.5 rounded-t-md uppercase tracking-wider z-20 flex items-center gap-1.5 shadow-md select-none"
                                      >
                                        {/* Drag Handle with 4 arrows */}
                                        <div
                                          title="Haz clic y arrastra hacia arriba o abajo para reordenar"
                                          className="flex items-center gap-1 cursor-grab active:cursor-grabbing hover:bg-blue-600 px-1 py-0.5 rounded transition-colors"
                                        >
                                          <Move className="w-3.5 h-3.5 text-white" />
                                          <span className="font-['Poppins'] font-bold">{element.type}</span>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-[1px] h-3.5 bg-blue-400" />

                                        {/* DUPLICATE / CLONE BUTTON RIGHT BEFORE ARROW UP (REQ 1) */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateElement(element.id);
                                          }}
                                          className="p-1 rounded hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center"
                                          title="Duplicar o clonar este elemento"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-white" />
                                        </button>

                                        {/* Divider */}
                                        <div className="w-[1px] h-3.5 bg-blue-400" />

                                        {/* Quick Move Up button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            moveElement('up', element.id);
                                          }}
                                          disabled={elIdx === 0}
                                          className="p-0.5 rounded hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                          title="Subir elemento un lugar"
                                        >
                                          <ArrowUp className="w-3 h-3 text-white" />
                                        </button>

                                        {/* Quick Move Down button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            moveElement('down', element.id);
                                          }}
                                          disabled={elIdx === column.elements.length - 1}
                                          className="p-0.5 rounded hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                          title="Bajar elemento un lugar"
                                        >
                                          <ArrowDown className="w-3 h-3 text-white" />
                                        </button>

                                        {/* Divider */}
                                        <div className="w-[1px] h-3.5 bg-blue-400" />

                                        {/* Direct Trash Can Delete Button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteElement(element.id);
                                          }}
                                          className="p-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                                          title="Eliminar este elemento directamente"
                                        >
                                          <Trash2 className="w-3 h-3 text-white" />
                                        </button>
                                      </div>
                                    )}

                                    {/* INLINE FORMATTING TOOLBAR IN CANVAS: ONLY TEXT/BUTTON SHOW TYPOGRAPHY (REQ 3/5) */}
                                    {!isPreviewMode && isSelected && (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute -top-7 right-0 bg-white border border-zinc-200 text-zinc-700 text-xs px-1.5 py-0.5 rounded-t-md shadow-md z-20 flex items-center gap-1 select-none"
                                      >
                                        {(element.type === 'heading' ||
                                          element.type === 'subheading' ||
                                          element.type === 'paragraph' ||
                                          element.type === 'bullet_list' ||
                                          element.type === 'button') && (
                                          <>
                                            <button
                                              type="button"
                                              onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleToggleInlineFormat('bold');
                                              }}
                                              className={`p-1 rounded hover:bg-zinc-100 cursor-pointer ${
                                                element.styles.isBold ? 'bg-blue-100 text-[#2848F0] font-bold' : ''
                                              }`}
                                              title="Negrita (B) - Si sombreas texto, aplica solo a la selección"
                                            >
                                              <BoldIcon className="w-3 h-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleToggleInlineFormat('italic');
                                              }}
                                              className={`p-1 rounded hover:bg-zinc-100 cursor-pointer ${
                                                element.styles.isItalic ? 'bg-blue-100 text-[#2848F0]' : ''
                                              }`}
                                              title="Cursiva (I) - Si sombreas texto, aplica solo a la selección"
                                            >
                                              <ItalicIcon className="w-3 h-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleToggleInlineFormat('underline');
                                              }}
                                              className={`p-1 rounded hover:bg-zinc-100 cursor-pointer ${
                                                element.styles.isUnderline ? 'bg-blue-100 text-[#2848F0]' : ''
                                              }`}
                                              title="Subrayado (U) - Si sombreas texto, aplica solo a la selección"
                                            >
                                              <UnderlineIcon className="w-3 h-3" />
                                            </button>
                                            <div className="w-[1px] h-3.5 bg-zinc-200" />
                                            <HexColorPicker
                                              compact
                                              value={element.styles.textColor || '#121111'}
                                              onOpen={handleColorPickerOpen}
                                              onClose={handleColorPickerClose}
                                              onChange={(val) => handleTextColorChange(val)}
                                            />
                                          </>
                                        )}

                                        {element.type === 'image' && (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const currentRot = element.styles.rotation || 0;
                                                updateSelectedElement({ rotation: (currentRot + 90) % 360 });
                                              }}
                                              className="p-1 px-1.5 rounded hover:bg-zinc-100 text-[#2848F0] flex items-center gap-1 cursor-pointer font-semibold text-[10px]"
                                              title="Girar imagen +90°"
                                            >
                                              <RotateCw className="w-3 h-3" />
                                              <span>+90°</span>
                                            </button>
                                            <div className="w-[1px] h-3 bg-zinc-200" />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const currentRad = element.styles.borderRadius || 0;
                                                updateSelectedElement({ borderRadius: currentRad > 0 ? 0 : 16 });
                                              }}
                                              className="p-1 px-1.5 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer text-[10px] font-medium"
                                              title="Alternar esquinas redondeadas"
                                            >
                                              {element.styles.borderRadius ? 'Borde Recto' : 'Redondear'}
                                            </button>
                                            <div className="w-[1px] h-3 bg-zinc-200" />
                                            <button
                                              type="button"
                                              onClick={() => fileInputRef.current?.click()}
                                              className="p-1 px-1.5 rounded hover:bg-blue-50 text-[#2848F0] flex items-center gap-1 cursor-pointer font-semibold text-[10px]"
                                              title="Subir archivo desde explorador"
                                            >
                                              <Upload className="w-3 h-3" />
                                              <span>Subir</span>
                                            </button>
                                          </>
                                        )}

                                        {element.type === 'video' && (
                                          <div className="px-1.5 py-0.5 text-[10px] text-red-600 font-semibold flex items-center gap-1">
                                            <Video className="w-3 h-3" />
                                            <span>Ajustes de Video</span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* RENDER BY ELEMENT TYPE WITH DIRECT IN-PLACE EDITING (REQ 3 & 5) */}
                                    {element.type === 'heading' && (() => {
                                      const lvl = element.content.level || 'h1';
                                      const HeadingTag = lvl === 'h1' ? 'h1' : lvl === 'h3' ? 'h3' : lvl === 'h4' ? 'h4' : lvl === 'h5' ? 'h5' : 'h2';
                                      const defaultSize =
                                        lvl === 'h1'
                                          ? pageSettings.defaultH1Size || 36
                                          : lvl === 'h3'
                                          ? pageSettings.defaultH3Size || 22
                                          : lvl === 'h4'
                                          ? pageSettings.defaultH4Size || 18
                                          : lvl === 'h5'
                                          ? 16
                                          : pageSettings.defaultH2Size || 28;
                                      return (
                                        <InlineEditableText
                                          key={`${element.id}_${HeadingTag}`}
                                          as={HeadingTag}
                                          elementId={element.id}
                                          html={element.content.html}
                                          text={element.content.text}
                                          fallbackText="Titular de la Página"
                                          isEditable={!isPreviewMode && isSelected}
                                          isSelected={isSelected}
                                          onSave={(newHtml, newText) => {
                                            updateSelectedElement({}, { html: newHtml, text: newText });
                                          }}
                                          style={{
                                            fontSize: `${element.styles.fontSize || defaultSize}px`,
                                            fontFamily: element.styles.fontFamily || pageSettings.headingFontFamily || 'Poppins',
                                            color: element.styles.textColor || pageSettings.textColor || '#121111',
                                            fontWeight: element.styles.isBold ? 700 : 500,
                                            fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                            textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                            textTransform: element.styles.textTransform || 'none',
                                            textAlign: element.styles.textAlign || 'center',
                                            lineHeight: element.styles.lineHeight || 1.3,
                                            outline: isSelected ? 'none' : undefined,
                                          }}
                                        />
                                      );
                                    })()}

                                    {element.type === 'subheading' && (
                                      <InlineEditableText
                                        as="p"
                                        elementId={element.id}
                                        html={element.content.html}
                                        text={element.content.text}
                                        fallbackText="Subtítulo descriptivo"
                                        isEditable={!isPreviewMode && isSelected}
                                        isSelected={isSelected}
                                        onSave={(newHtml, newText) => {
                                          updateSelectedElement({}, { html: newHtml, text: newText });
                                        }}
                                        style={{
                                          fontSize: `${element.styles.fontSize || 18}px`,
                                          fontFamily: element.styles.fontFamily || pageSettings.bodyFontFamily || 'Inter',
                                          color: element.styles.textColor || pageSettings.textColor || '#5B5B66',
                                          fontWeight: element.styles.isBold ? 600 : 400,
                                          fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                          textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                          textTransform: element.styles.textTransform || 'none',
                                          textAlign: element.styles.textAlign || 'center',
                                          outline: isSelected ? 'none' : undefined,
                                        }}
                                      />
                                    )}

                                    {element.type === 'paragraph' && (
                                      <InlineEditableText
                                        as="p"
                                        elementId={element.id}
                                        html={element.content.html}
                                        text={element.content.text}
                                        fallbackText="Texto de párrafo."
                                        isEditable={!isPreviewMode && isSelected}
                                        isSelected={isSelected}
                                        onSave={(newHtml, newText) => {
                                          updateSelectedElement({}, { html: newHtml, text: newText });
                                        }}
                                        style={{
                                          fontSize: `${element.styles.fontSize || 16}px`,
                                          fontFamily: element.styles.fontFamily || pageSettings.bodyFontFamily || 'Inter',
                                          color: element.styles.textColor || pageSettings.textColor || '#5B5B66',
                                          fontWeight: element.styles.isBold ? 600 : 400,
                                          fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                          textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                          textTransform: element.styles.textTransform || 'none',
                                          textAlign: element.styles.textAlign || 'left',
                                          lineHeight: element.styles.lineHeight || 1.6,
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                          outline: isSelected ? 'none' : undefined,
                                        }}
                                      />
                                    )}

                                    {element.type === 'rich_text' && (
                                      <div className="w-full">
                                        <RichTextElement
                                          element={element}
                                          isEditable={!isPreviewMode}
                                          isSelected={isSelected}
                                          onChange={(html) => updateElementContent(element.id, { html })}
                                          onOpenFullscreen={() => setFullscreenWysiwygElementId(element.id)}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'bullet_list' && (
                                      <ul
                                        className="space-y-2.5 list-none p-0 m-0"
                                        style={{
                                          textAlign: element.styles.textAlign || 'left',
                                        }}
                                      >
                                        {(element.content.items || ['Elemento 1', 'Elemento 2']).map(
                                          (item, i) => (
                                            <li
                                              key={i}
                                              className={`flex items-start ${
                                                element.styles.textAlign === 'center'
                                                  ? 'justify-center'
                                                  : element.styles.textAlign === 'right'
                                                  ? 'justify-end'
                                                  : 'justify-start'
                                              }`}
                                              style={{
                                                textAlign: element.styles.textAlign || 'left',
                                              }}
                                            >
                                              <span
                                                className="shrink-0 flex items-center justify-center select-none"
                                                style={{
                                                  marginRight: element.styles.textAlign === 'right' ? undefined : `${element.styles.bulletSpacing ?? 10}px`,
                                                  marginLeft: element.styles.textAlign === 'right' ? `${element.styles.bulletSpacing ?? 10}px` : undefined,
                                                  order: element.styles.textAlign === 'right' ? 2 : 1,
                                                  marginTop: `${Math.max(2, Math.round((element.styles.fontSize || 15) * 0.18))}px`,
                                                }}
                                              >
                                                {renderBulletIcon(
                                                  element.styles.bulletIcon || 'disc',
                                                  element.styles.fontSize || 15,
                                                  element.styles.bulletColor || element.styles.textColor || pageSettings.textColor || '#121111'
                                                )}
                                              </span>
                                              <div
                                                style={{
                                                  order: element.styles.textAlign === 'right' ? 1 : 2,
                                                  flex: element.styles.textAlign === 'center' ? '0 1 auto' : '1 1 auto',
                                                  minWidth: 0,
                                                }}
                                              >
                                                <InlineEditableText
                                                  as="div"
                                                  dataBulletIndex={i}
                                                  elementId={`${element.id}_bullet_${i}`}
                                                  html={item}
                                                  fallbackText={`Elemento ${i + 1}`}
                                                  isEditable={!isPreviewMode && isSelected}
                                                  isSelected={isSelected}
                                                  onSave={(newHtml) => {
                                                    const newItems = [...(element.content.items || [])];
                                                    newItems[i] = newHtml;
                                                    updateSelectedElement({}, { items: newItems });
                                                  }}
                                                  style={{
                                                    fontSize: `${element.styles.fontSize || 15}px`,
                                                    fontFamily: element.styles.fontFamily || pageSettings.bodyFontFamily || 'Inter',
                                                    color: element.styles.textColor || pageSettings.textColor || '#121111',
                                                    fontWeight: element.styles.isBold ? 700 : 400,
                                                    fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                                    textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                                    textTransform: (element.styles.textTransform as any) || 'none',
                                                    textAlign: element.styles.textAlign || 'left',
                                                    lineHeight: element.styles.lineHeight ? `${element.styles.lineHeight}` : 1.5,
                                                    outline: isSelected ? 'none' : undefined,
                                                  }}
                                                />
                                              </div>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}

                                    {element.type === 'button' && (
                                      <div style={{ textAlign: element.styles.textAlign || 'center' }}>
                                        <button
                                          style={{
                                            backgroundColor: element.styles.bgColor || pageSettings.primaryColor || '#2848F0',
                                            color: element.styles.textColor || '#FFFFFF',
                                            fontSize: `${element.styles.fontSize || 16}px`,
                                            fontFamily: element.styles.fontFamily || pageSettings.bodyFontFamily || 'Poppins',
                                            fontWeight: element.styles.isBold ? 700 : 500,
                                            fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                            textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                            paddingTop: `${element.styles.paddingTop || 14}px`,
                                            paddingBottom: `${element.styles.paddingBottom || 14}px`,
                                            paddingLeft: `${element.styles.paddingLeft || 28}px`,
                                            paddingRight: `${element.styles.paddingRight || 28}px`,
                                            borderRadius: `${element.styles.borderRadius || 8}px`,
                                            outline: isSelected ? 'none' : undefined,
                                          }}
                                          className="shadow-sm hover:opacity-95 transition-all inline-block font-semibold cursor-pointer"
                                        >
                                          <span
                                            contentEditable={!isPreviewMode && isSelected}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => {
                                              const newText = e.currentTarget.innerText;
                                              updateSelectedElement({}, { buttonText: newText });
                                            }}
                                          >
                                            {element.content.buttonText || 'Botón de Acción'}
                                          </span>
                                        </button>
                                      </div>
                                    )}

                                    {element.type === 'video' && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent:
                                            element.styles.textAlign === 'left'
                                              ? 'flex-start'
                                              : element.styles.textAlign === 'right'
                                              ? 'flex-end'
                                              : 'center',
                                        }}
                                      >
                                        <EmbeddedVideoPlayer
                                          videoUrl={element.content.videoUrl}
                                          aspectRatio={element.styles.aspectRatio || '16/9'}
                                          borderRadius={element.styles.borderRadius ?? 12}
                                          maxWidth={element.styles.maxWidth || '750px'}
                                          borderWidth={element.styles.borderWidth}
                                          borderColor={element.styles.borderColor}
                                          borderStyle={element.styles.borderStyle}
                                          isEditable={!isPreviewMode}
                                          isSelected={!isPreviewMode && isSelected}
                                          onSelect={() => {
                                            setSelectedSectionId(section.id);
                                            setSelectedRowId(row.id);
                                            setSelectedElementId(element.id);
                                            setActiveTab('elements');
                                          }}
                                          onSetSampleVideo={(sampleUrl) => {
                                            updateElementContent(element.id, { videoUrl: sampleUrl });
                                          }}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'image' && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent:
                                            element.styles.textAlign === 'left'
                                              ? 'flex-start'
                                              : element.styles.textAlign === 'right'
                                              ? 'flex-end'
                                              : 'center',
                                        }}
                                      >
                                        <div
                                          style={{
                                            transform: `rotate(${element.styles.rotation || 0}deg)`,
                                            transition: 'transform 0.2s ease',
                                            display: 'inline-block',
                                            maxWidth: '100%',
                                          }}
                                        >
                                          <img
                                            src={
                                              element.content.src ||
                                              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'
                                            }
                                            alt={element.content.alt || 'Imagen Scale Sales Pro'}
                                            style={{
                                              borderRadius: `${element.styles.borderRadius || 0}px`,
                                              width: element.styles.imageWidth ? `${element.styles.imageWidth}px` : '450px',
                                              maxWidth: '100%',
                                              opacity: element.styles.opacity ?? 1,
                                              border: element.styles.borderWidth
                                                ? `${element.styles.borderWidth}px ${element.styles.borderStyle || 'solid'} ${
                                                    element.styles.borderColor || '#E4E4E7'
                                                  }`
                                                : undefined,
                                              boxShadow:
                                                element.styles.shadow === 'sm'
                                                  ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                                                  : element.styles.shadow === 'md'
                                                  ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                  : element.styles.shadow === 'lg'
                                                  ? '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                                  : element.styles.shadow === 'xl'
                                                  ? '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                                  : undefined,
                                            }}
                                            className="h-auto object-cover select-none pointer-events-none transition-all"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {element.type === 'divider' && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent:
                                            element.styles.textAlign === 'left'
                                              ? 'flex-start'
                                              : element.styles.textAlign === 'right'
                                              ? 'flex-end'
                                              : 'center',
                                        }}
                                      >
                                        <hr
                                          style={{
                                            borderColor: element.styles.borderColor || '#E4E4E7',
                                            borderTopWidth: `${element.styles.borderWidth || 1}px`,
                                            borderStyle: element.styles.borderStyle || 'solid',
                                            width: `${element.styles.imageWidth || 100}%`,
                                          }}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'spacer' && (
                                      <div
                                        style={{ height: `${element.content.spacerHeight || 40}px` }}
                                        className={`w-full flex items-center justify-center transition-all ${
                                          !isPreviewMode
                                            ? 'border-y border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 select-none'
                                            : ''
                                        }`}
                                      >
                                        {!isPreviewMode && (
                                          <span className="text-[10px] font-mono text-zinc-400">
                                            Espaciador ({element.content.spacerHeight || 40}px)
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {element.type === 'audio' && (
                                      <div className="w-full">
                                        <AudioPlayerElement element={element} isEditable={!isPreviewMode} />
                                      </div>
                                    )}

                                    {element.type === 'icon' && (
                                      <div className="w-full">
                                        <IconElement element={element} isEditable={!isPreviewMode} />
                                      </div>
                                    )}

                                    {element.type === 'simple_form' && (
                                      <div className="w-full">
                                        <SimpleFormElement
                                          element={element}
                                          isEditable={!isPreviewMode}
                                          onSubmitSuccess={() => {
                                            showToast('¡Información enviada con éxito!');
                                          }}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'popup_button' && (
                                      <div className="w-full">
                                        <PopupButtonElement
                                          element={element}
                                          isEditable={!isPreviewMode}
                                          popups={funnelPopups}
                                          onOpenEditor={() => {
                                            const p =
                                              funnelPopups.find(
                                                (pop) => pop.id === (element.content.popupId || 'popup_1')
                                              ) || funnelPopups[0];
                                            setEditingPopupModal(p);
                                          }}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'form' && (
                                      <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 text-center">
                                        <ClipboardList className="w-8 h-8 text-[#2848F0] mx-auto mb-2" />
                                        <div className="font-bold text-sm text-zinc-900">
                                          Formulario de Calificación por Reglas SSP
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-1">
                                          Evalúa respuestas con puntaje mínimo configurado para filtrar leads.
                                        </p>
                                      </div>
                                    )}

                                    {element.type === 'calendar' && (
                                      <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 text-center">
                                        <Calendar className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                        <div className="font-bold text-sm text-zinc-900">
                                          Widget de Calendario Nativo SSP
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-1">
                                          Muestra días y horas disponibles según tus reglas configuradas.
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* HORIZONTAL PLACEMENT DROP LINE INDICATOR (AFTER) - REQ 2 */}
                                  {dropIndicator &&
                                    dropIndicator.colId === column.id &&
                                    dropIndicator.index === elIdx &&
                                    dropIndicator.position === 'after' && (
                                      <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-30">
                                        <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                          <span>Soltar aquí</span>
                                        </div>
                                      </div>
                                    )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
                </div>
              </div>

              {/* SECTION & PREBUILT BLOCK DROP INDICATOR (AFTER) */}
              {sectionDropIndicator &&
                sectionDropIndicator.sectionId === section.id &&
                sectionDropIndicator.position === 'after' && (
                  <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-40">
                    <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span>Soltar aquí</span>
                    </div>
                  </div>
                )}
            </React.Fragment>
          );
        }))}
        </div>
        </main>

        {/* RIGHT SIDEBAR: ESTRUCTURA / ARBOL JERÁRQUICO DE ELEMENTOS (ESTILO ELEMENTOR) */}
        {!isPreviewMode && showStructurePanel && (
          <aside className="w-72 sm:w-80 bg-white border-l border-zinc-200 flex flex-col h-full shrink-0 overflow-hidden shadow-xs z-20 animate-in slide-in-from-right duration-200">
            <StructureNavigator
              sections={sections}
              selectedSectionId={selectedSectionId}
              selectedRowId={selectedRowId}
              selectedElementId={selectedElementId}
              onSelectSection={(secId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(null);
                setSelectedElementId(null);
              }}
              onSelectRow={(secId, rId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(rId);
                setSelectedElementId(null);
              }}
              onSelectElement={(secId, rId, cId, elId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(rId);
                setSelectedElementId(elId);
              }}
              onSelectPage={() => {
                setSelectedSectionId(null);
                setSelectedRowId(null);
                setSelectedElementId(null);
                setActiveTab('page');
              }}
              onMoveSection={(dir, secId) => moveSection(dir, secId)}
              onMoveRow={(dir, secId, rowId) => moveRow(dir, secId, rowId)}
              onMoveElement={(dir, elId) => moveElement(dir, elId)}
              onDuplicateSection={(secId) => duplicateSection(secId)}
              onDeleteSection={(secId) => deleteSection(secId)}
              onDuplicateRow={(rowId) => duplicateRow(rowId)}
              onDeleteRow={(rowId) => deleteRow(rowId)}
              onDuplicateElement={(elId) => duplicateElement(elId)}
              onDeleteElement={(elId) => deleteElement(elId)}
              onReorderElementsInCol={(colId, fromIdx, toIdx) => reorderElementsInCol(colId, fromIdx, toIdx)}
              onReorderRowsInSection={(secId, fromIdx, toIdx) => reorderRowsInSection(secId, fromIdx, toIdx)}
              onReorderSections={(fromIdx, toIdx) => reorderSections(fromIdx, toIdx)}
              onClose={() => setShowStructurePanel(false)}
            />
          </aside>
        )}
      </div>

      {/* EXIT WITHOUT SAVING CONFIRMATION MODAL - REQ 3 */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-zinc-900">
                  ¿Quieres salir sin guardar?
                </h3>
                <p className="text-xs text-zinc-500 font-['Inter']">
                  Tienes cambios sin guardar en tu página.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 font-['Inter'] my-3">
              Si sales ahora sin guardar, las modificaciones que hiciste en la página se perderán. ¿Deseas guardar los cambios antes de salir?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
              >
                Seguir editando
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  onExit();
                }}
                className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer"
              >
                Salir sin guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSavePage();
                  setShowExitConfirmModal(false);
                  onExit();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm cursor-pointer"
              >
                Guardar y Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL BUILDER & EDITOR */}
      {editingPopupModal && (
        <PopupEditorModal
          popup={editingPopupModal}
          isOpen={true}
          onClose={() => setEditingPopupModal(null)}
          onSave={(updatedPopup) => {
            setFunnelPopups((prev) => {
              const idx = prev.findIndex((p) => p.id === updatedPopup.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = updatedPopup;
                return next;
              }
              return [...prev, updatedPopup];
            });
            setEditingPopupModal(null);
            setHasUnsavedChanges(true);
            showToast(`Pop-up "${updatedPopup.name}" guardado exitosamente`);
          }}
        />
      )}

      {/* FULLSCREEN TEXT EDITOR */}
      {fullscreenWysiwygElement && (
        <WordPressWysiwygEditor
          variant="fullscreen"
          title={`Editor de Texto • ${currentPage.title || 'Página'}`}
          value={fullscreenWysiwygElement.content.html || ''}
          onChange={(html) => {
            const targetId = fullscreenWysiwygElementId;
            if (!targetId) return;
            updateElementContent(targetId, { html });
          }}
          onCloseFullscreen={() => setFullscreenWysiwygElementId(null)}
          elementStyles={fullscreenWysiwygElement.styles}
          showMediaButton={true}
        />
      )}

      {/* CONFIRMATION MODAL BEFORE APPLYING TEMPLATE */}
      {showTemplateConfirmModal && templateToApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200 shadow-2xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 font-['Poppins']">
              ¿Deseas agregar esta plantilla?
            </h3>
            <p className="text-sm text-zinc-600 mb-6 font-['Inter'] leading-relaxed">
              Se borrará todo lo que tenías previo en esta página y se cargará la estructura completa de la plantilla <strong className="text-zinc-900 font-semibold">"{templateToApply.name}"</strong>.
              <br /><br />
              <span className="text-xs text-zinc-500 block bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                💡 Nota: Todo el contenido quedará en el lienzo y será 100% editable (textos, videos, colores y botones). Podrás usar el botón "Deshacer" si deseas volver atrás.
              </span>
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowTemplateConfirmModal(false);
                  setTemplateToApply(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => executeApplyTemplate(templateToApply)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aceptar y Cargar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE PREVIEW MODAL */}
      {templatePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden min-h-0 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between shrink-0 z-10 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 font-['Poppins']">
                      {templatePreviewModal.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${templatePreviewModal.badgeColor}`}>
                      {templatePreviewModal.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-['Inter']">
                    {templatePreviewModal.category} • {templatePreviewModal.sections.length} secciones estructuradas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setTemplatePreviewModal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tpl = templatePreviewModal;
                    setTemplatePreviewModal(null);
                    handleRequestApplyTemplate(tpl);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Seleccionar y Cargar Plantilla</span>
                </button>
              </div>
            </div>

            {/* Preview Body - Scrollable Container */}
            <div
              className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 bg-zinc-200/80 flex flex-col items-center scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-200"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div
                className="w-full max-w-[900px] rounded-2xl shadow-xl border border-zinc-300/40 overflow-hidden shrink-0 mb-10 transition-colors"
                style={{
                  backgroundColor: templatePreviewModal.pageSettings?.pageBgColor || '#FFFFFF',
                }}
              >
                {templatePreviewModal.sections.map((sec, idx) => {
                  const isDark =
                    sec.bgColor === '#000000' ||
                    sec.bgColor === '#09090B' ||
                    sec.bgColor === '#2563EB' ||
                    sec.bgColor === '#DC2626' ||
                    sec.bgColor === '#18181B' ||
                    (sec.bgColor && ['#0', '#1', '#2'].some((prefix) => sec.bgColor?.startsWith(prefix)));
                  return (
                    <div
                      key={idx}
                      className="p-6 sm:p-8"
                      style={{
                        backgroundColor: sec.bgColor || '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-wider font-bold opacity-60 mb-2">
                        {sec.name}
                      </div>
                    {sec.rows.map((r, rIdx) => (
                      <div key={rIdx} className="flex flex-wrap gap-6 py-2">
                        {r.columns.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            style={{ flex: c.widthPercentage >= 50 ? '1 1 320px' : '1 1 240px', minWidth: '260px' }}
                            className="space-y-4"
                          >
                            {c.elements.map((el, elIdx) => (
                              <div key={elIdx}>
                                {el.type === 'heading' && (
                                  <h2
                                    style={{ fontSize: `${el.styles?.fontSize || 22}px`, color: el.styles?.textColor || 'inherit', fontWeight: 'bold' }}
                                    dangerouslySetInnerHTML={{ __html: el.content.html || el.content.text || '' }}
                                  />
                                )}
                                {el.type === 'subheading' && (
                                  <div
                                    style={{ fontSize: `${el.styles?.fontSize || 13}px`, color: el.styles?.textColor || 'inherit', fontWeight: 'bold', letterSpacing: '1px' }}
                                    dangerouslySetInnerHTML={{ __html: el.content.html || el.content.text || '' }}
                                  />
                                )}
                                {el.type === 'paragraph' && (
                                  <p
                                    style={{ fontSize: `${el.styles?.fontSize || 14}px`, color: el.styles?.textColor || 'inherit' }}
                                    dangerouslySetInnerHTML={{ __html: el.content.html || el.content.text || '' }}
                                  />
                                )}
                                {el.type === 'rich_text' && (
                                  <div
                                    className="leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: el.content.html || '' }}
                                  />
                                )}
                                {el.type === 'video' && (
                                  <div className="w-full flex justify-center py-2">
                                    <EmbeddedVideoPlayer
                                      videoUrl={el.content.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                                      aspectRatio={el.styles?.aspectRatio || '16/9'}
                                      borderRadius={el.styles?.borderRadius ?? 12}
                                      maxWidth={el.styles?.maxWidth || '750px'}
                                      borderWidth={el.styles?.borderWidth}
                                      borderColor={el.styles?.borderColor}
                                      borderStyle={el.styles?.borderStyle}
                                    />
                                  </div>
                                )}
                                {el.type === 'button' && (
                                  <button
                                    type="button"
                                    style={{
                                      backgroundColor: el.styles?.bgColor || '#00C49F',
                                      color: el.styles?.textColor || '#FFFFFF',
                                      borderRadius: `${el.styles?.borderRadius || 8}px`,
                                      padding: `${el.styles?.paddingTop || 14}px ${el.styles?.paddingLeft || 28}px`,
                                      fontWeight: 'bold',
                                    }}
                                    className="shadow-md text-sm font-bold uppercase tracking-wider cursor-default w-full sm:w-auto text-center"
                                  >
                                    {el.content.buttonText || 'Botón de Acción'}
                                  </button>
                                )}
                                {el.type === 'simple_form' && (
                                  <div className="p-4 border border-zinc-200 rounded-lg bg-zinc-50 text-xs text-zinc-600">
                                    [Formulario de Captura de Prospectos]
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
