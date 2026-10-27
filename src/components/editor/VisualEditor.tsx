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
  FaqItem,
  SocialLinkItem,
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
  X,
  CheckCircle2,
  Square,
  ArrowRight,
  Star,
  Zap,
  Minus,
  RefreshCw,
  Timer,
  Share2,
  CheckSquare,
  TextCursorInput,
  Clock,
  Lock,
  Unlock,
  Play,
  PlayCircle,
  Film,
  MousePointerClick,
  ArrowDownRight,
  CornerRightDown,
  Tv,
  Flame,
  Heart,
  Disc,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DelayedAppearance } from '../common/DelayedAppearance';
import { SectionInspector } from './SectionInspector';
import { PageSettingsInspector } from './PageSettingsInspector';
import { RowInspector } from './RowInspector';
import { ColumnInspector } from './ColumnInspector';
import { StructureNavigator } from './StructureNavigator';
import { RichTextElement } from './elements/RichTextElement';
import { WordPressWysiwygEditor } from './elements/WordPressWysiwygEditor';
import { AudioPlayerElement } from './elements/AudioPlayerElement';
import { IconElement, POPULAR_ICONS } from './elements/IconElement';
import { SimpleFormElement } from './elements/SimpleFormElement';
import { InlineFormElement } from './elements/InlineFormElement';
import { CompleteFormInspector } from './CompleteFormInspector';
import { InlineFormInspector } from './InlineFormInspector';
import {
  createDefaultCompleteFormFields,
  createDefaultInlineButtonStyles,
  createDefaultInlineFieldStyle,
  DEFAULT_EMAIL_PLACEHOLDER,
  DEFAULT_POLICY_ERROR_TEXT,
  DEFAULT_POLICY_HTML,
} from '../../utils/completeFormUtils';
import { PopupButtonElement, formatCtaDisplayText } from './elements/PopupButtonElement';
import { PopupEditorModal } from './elements/PopupEditorModal';
import { PAGE_TEMPLATES, PageTemplate } from '../../data/pageTemplates';
import { EmbeddedVideoPlayer } from '../common/EmbeddedVideoPlayer';
import { ConfiguredImage } from '../common/ConfiguredImage';
import { getEmbedVideoInfo, getEmbedVideoUrl } from '../../utils/videoUtils';
import { InlineEditableText } from './elements/InlineEditableText';
import { NumberControl, InlineSliderInput, FreeNumberInput } from '../common/NumberControl';
import { HexColorPicker } from '../common/HexColorPicker';
import { BoxModelSpacingControl } from '../common/BoxModelSpacingControl';
import {
  CountdownTimerWidget,
  FaqAccordionWidget,
  SocialLinksWidget,
  CheckboxWidget,
  InputFieldWidget,
} from './elements/ConversionWidgets';
import {
  cloneRowWithFreshIds,
  createInnerColumnsRow,
  createInnerColumnsElement,
  updateElementInSections,
  updateColumnInSections,
  updateRowInSections,
  resizeRowColumnsCount,
  resizeColumnWidthInSections,
  insertElementIntoColumn,
  findColumnDepth,
  findElementById,
  removeElementFromSections,
  moveElementInSections,
  duplicateElementInSections,
  reorderElementsInColInSections,
  duplicateRowInSections,
  deleteRowInSections,
  moveRowInSections,
  findEditorSelectionContext,
  getColumnSurfaceStyle,
  getColumnShadowClass,
  formatRowDisplayName,
  isSectionBoxed,
  getSectionEffectiveMaxWidth,
  clampRowTreeToLimit,
  clampSectionsHierarchy,
} from '../../utils/editorTreeUtils';

interface VisualEditorProps {
  initialPage?: FunnelPage;
  funnelId?: string;
  onExit: () => void;
}

const CTA_BUTTON_ICONS = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUpRight',
  'ChevronRight',
  'ExternalLink',
  'Send',
  'CheckCircle',
  'Check',
  'Sparkles',
  'Zap',
  'Rocket',
  'Flame',
  'Play',
  'PlayCircle',
  'Calendar',
  'Clock',
  'Phone',
  'MessageCircle',
  'Mail',
  'Video',
  'ShoppingCart',
  'ShoppingBag',
  'CreditCard',
  'DollarSign',
  'Download',
  'Gift',
  'Lock',
  'ShieldCheck',
  'Award',
  'Star',
  'Heart',
  'ThumbsUp',
  'Users',
  'Eye',
  'Bell',
  'Crown',
];

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
  const [previewResetCount, setPreviewResetCount] = useState<number>(0);
  const [showStructurePanel, setShowStructurePanel] = useState<boolean>(true);
  const [fullscreenWysiwygElementId, setFullscreenWysiwygElementId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);
  const [templateToApply, setTemplateToApply] = useState<PageTemplate | null>(null);
  const [showTemplateConfirmModal, setShowTemplateConfirmModal] = useState<boolean>(false);
  const [templatePreviewModal, setTemplatePreviewModal] = useState<PageTemplate | null>(null);

  // Global Page settings (Canvas width, Google Fonts, default H1-H4 sizes, colors, background image, 4-side padding)
  const [pageSettings, setPageSettings] = useState<FunnelPageGlobalSettings>(() => ({
    pageWidthType: currentPage.settings?.pageWidthType || 'boxed',
    pageContentMaxWidth: currentPage.settings?.pageContentMaxWidth || 1200,
    pageBorderRadius:
      (currentPage.settings?.pageBorderRadius !== undefined && currentPage.settings?.pageBorderRadius !== 16)
        ? currentPage.settings.pageBorderRadius
        : 0,
    pageBgColor: currentPage.settings?.pageBgColor || '#FFFFFF',
    pageBgImageUrl: currentPage.settings?.pageBgImageUrl || '',
    pageBgImageOpacity: currentPage.settings?.pageBgImageOpacity ?? 100,
    pageBgImageSize: currentPage.settings?.pageBgImageSize || 'cover',
    pageBgImagePosition: currentPage.settings?.pageBgImagePosition || 'center',
    pageBgImageRepeat: currentPage.settings?.pageBgImageRepeat || 'no-repeat',
    pageBgImageAttachment: currentPage.settings?.pageBgImageAttachment || 'scroll',
    primaryColor: currentPage.settings?.primaryColor || '#2848F0',
    textColor: currentPage.settings?.textColor || '#121111',
    headingFontFamily: currentPage.settings?.headingFontFamily || 'Poppins',
    bodyFontFamily: currentPage.settings?.bodyFontFamily || 'Inter',
    defaultH1Size: currentPage.settings?.defaultH1Size || 36,
    defaultH2Size: currentPage.settings?.defaultH2Size || 28,
    defaultH3Size: currentPage.settings?.defaultH3Size || 22,
    defaultH4Size: currentPage.settings?.defaultH4Size || 18,
    pagePaddingTop: currentPage.settings?.pagePaddingTop ?? 0,
    pagePaddingRight: currentPage.settings?.pagePaddingRight ?? 0,
    pagePaddingBottom:
      currentPage.settings?.pagePaddingBottom !== undefined && currentPage.settings?.pagePaddingBottom !== 40
        ? currentPage.settings.pagePaddingBottom
        : 0,
    pagePaddingLeft: currentPage.settings?.pagePaddingLeft ?? 0,
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
            bgColor: 'transparent',
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

  // Selected element / column / row / section for Property Inspector
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
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
  const [draggingInnerCols, setDraggingInnerCols] = useState<number | null>(null);
  const [sectionDropIndicator, setSectionDropIndicator] = useState<{
    sectionId: string;
    index: number;
    position: 'before' | 'after';
  } | null>(null);
  const [rowDropIndicator, setRowDropIndicator] = useState<{
    sectionId: string;
    rowIndex: number;
    position: 'before' | 'after';
  } | null>(null);

  const clearAllDragStates = () => {
    setDraggingElementId(null);
    setDropIndicator(null);
    setDraggingSectionId(null);
    setDraggingBlockType(null);
    setDraggingSectionLayout(null);
    setDraggingInnerCols(null);
    setSectionDropIndicator(null);
    setRowDropIndicator(null);
  };

  useEffect(() => {
    let dropCleanupTimer: ReturnType<typeof setTimeout> | null = null;
    const handleGlobalDragEnd = () => {
      clearAllDragStates();
    };
    const handleGlobalDrop = () => {
      if (dropCleanupTimer) clearTimeout(dropCleanupTimer);
      dropCleanupTimer = setTimeout(() => {
        clearAllDragStates();
      }, 0);
    };
    window.addEventListener('dragend', handleGlobalDragEnd, true);
    window.addEventListener('drop', handleGlobalDrop, true);
    return () => {
      if (dropCleanupTimer) clearTimeout(dropCleanupTimer);
      window.removeEventListener('dragend', handleGlobalDragEnd, true);
      window.removeEventListener('drop', handleGlobalDrop, true);
    };
  }, []);

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

  // File input refs for direct image, video, and audio uploads from browser
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoCoverInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingAudioFile, setIsDraggingAudioFile] = useState<boolean>(false);
  const [isDraggingVideoFile, setIsDraggingVideoFile] = useState<boolean>(false);
  const [isDraggingVideoCover, setIsDraggingVideoCover] = useState<boolean>(false);

  // Canvas DOM measurement for governing maximum width of inner containers / div blocks
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [measuredCanvasWidth, setMeasuredCanvasWidth] = useState<number>(1200);

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const syncCanvasWidth = () => {
      if (viewportMode === 'mobile') return;
      const width = Math.round(el.getBoundingClientRect().width);
      if (width > 0) {
        setMeasuredCanvasWidth(width);
      }
    };
    syncCanvasWidth();
    const observer = new ResizeObserver(() => {
      syncCanvasWidth();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [
    viewportMode,
    pageSettings.pageWidthType,
    pageSettings.pageContentMaxWidth,
    showStructurePanel,
    isPreviewMode,
  ]);

  const effectiveCanvasMaxWidth =
    pageSettings.pageWidthType === 'full'
      ? Math.max(320, measuredCanvasWidth || 1200)
      : Math.max(320, pageSettings.pageContentMaxWidth || 1200);

  // Automatically clamp External Sections and child Rows/Inner Containers whenever Canvas max width changes
  useEffect(() => {
    setSections((prevSections) => {
      const { sections: nextSections, changed } = clampSectionsHierarchy(
        prevSections,
        effectiveCanvasMaxWidth
      );
      return changed ? nextSections : prevSections;
    });
  }, [effectiveCanvasMaxWidth]);

  // Collapsible accordions in Properties panel
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    typography: true,
    colors: true,
    buttonBorder: true,
    spacing: true,
    margin: true,
    padding: true,
    action: true,
    imageSource: true,
    imageAdjustments: true,
    imageLink: true,
    imageBorder: true,
    videoSource: true,
    videoSettings: true,
    videoOptions: true,
    videoCover: true,
    dividerSettings: true,
    formSettings: true,
    calendarSettings: true,
    spacerSettings: true,
    audioSettings: true,
    audioColors: true,
    audioControls: true,
    audioShape: true,
    iconSettings: true,
    simpleFormSettings: true,
    popupButtonSettings: true,
    richTextSettings: true,
  });

  const [buttonColorStateTab, setButtonColorStateTab] = useState<'normal' | 'hover'>('normal');
  const [showButtonIconPicker, setShowButtonIconPicker] = useState<boolean>(false);
  const [editingCanvasButtonId, setEditingCanvasButtonId] = useState<string | null>(null);
  const dirtyCanvasButtonTextRef = useRef<string | null>(null);

  useEffect(() => {
    setShowButtonIconPicker(false);
    setButtonColorStateTab('normal');
  }, [selectedElementId]);

  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !(prev[key] !== false) }));
  };

  const handleReturnToLibrary = () => {
    setSelectedElementId(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setSelectedSectionId(null);
    setShowButtonIconPicker(false);
    setEditingCanvasButtonId(null);
    setActiveTab('elements');
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

  // Full 2-level selection context (supports outer sections, rows, nested inner_columns rows, columns, and elements)
  const selectionCtx = findEditorSelectionContext(sections, {
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
  });

  const selectedElement = selectionCtx.selectedElement;
  const selectedCol = selectionCtx.selectedCol;
  const selectedRow = selectionCtx.selectedRow;
  const selectedSec = selectionCtx.selectedSec;

  // Find element being edited in Fullscreen WordPress WYSIWYG
  const fullscreenWysiwygElement = fullscreenWysiwygElementId
    ? findElementById(sections, fullscreenWysiwygElementId)
    : null;

  // Active Column instance for inspector (when a column is selected and no element is selected)
  const activeColForInspector =
    !selectedElement && selectedColumnId ? selectionCtx.selectedCol : null;

  // Active Row instance for inspector (when row is selected and neither element nor column is selected)
  const activeRowForInspector =
    !selectedElement && !activeColForInspector ? selectionCtx.selectedRow : null;

  // Selected Section instance for inspector (when element, column, and row are not selected)
  const activeSectionForInspector =
    !selectedElement && !activeColForInspector && !activeRowForInspector && selectedSectionId
      ? sections.find((s) => s.id === selectedSectionId) || null
      : null;

  // Ref for debouncing history saves during fast continuous updates (like dragging color picker)
  const historyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update element styles or content in live state (supports depth 0 & depth 1)
  const updateSelectedElement = (
    updatedStyles: Partial<PageBlockElement['styles']>,
    updatedContent?: Partial<PageBlockElement['content']>
  ) => {
    if (!selectedElementId) return;

    let updatedSections: PageBlockSection[] = [];
    setSections((prev) => {
      const next = updateElementInSections(prev, selectedElementId, (el) => ({
        ...el,
        styles: { ...el.styles, ...updatedStyles },
        content: updatedContent ? { ...el.content, ...updatedContent } : el.content,
      }));
      updatedSections = next;
      return next;
    });

    setHasUnsavedChanges(true);

    if (historyDebounceRef.current) {
      clearTimeout(historyDebounceRef.current);
    }
    historyDebounceRef.current = setTimeout(() => {
      if (updatedSections.length > 0) {
        pushHistory(updatedSections);
      }
    }, 250);
  };

  // Update individual column styles in live state (supports depth 0 & depth 1)
  const updateSelectedColumn = (updatedProps: Partial<PageBlockColumn>) => {
    if (!selectedColumnId) return;

    let updatedSections: PageBlockSection[] = [];
    setSections((prev) => {
      const next = updateColumnInSections(prev, selectedColumnId, updatedProps);
      updatedSections = next;
      return next;
    });

    setHasUnsavedChanges(true);

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
      updateElementInSections(prevSections, elementId, (el) => ({
        ...el,
        content: { ...el.content, ...updatedContent },
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
    if (
      selectedElement.type === 'button' ||
      selectedElement.type === 'popup_button' ||
      selectedElement.type === 'form_button'
    ) {
      activeColoredTargetRef.current = null;
      return;
    }

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

  // Element Actions: Move up, down, duplicate, delete (supports depth 0 & depth 1)
  const moveElement = (direction: 'up' | 'down', targetId?: string) => {
    const idToMove = targetId || selectedElementId;
    if (!idToMove) return;

    const { nextSections, moved } = moveElementInSections(sections, idToMove, direction);
    if (!moved) return;

    pushHistory(nextSections);
    showToast(`Elemento movido hacia ${direction === 'up' ? 'arriba' : 'abajo'}`);
  };

  const duplicateElement = (targetId?: string) => {
    const idToDuplicate = targetId || selectedElementId;
    if (!idToDuplicate) return;

    const { nextSections, newElement } = duplicateElementInSections(sections, idToDuplicate);
    if (!newElement) return;

    pushHistory(nextSections);
    setSelectedColumnId(null);
    setSelectedElementId(newElement.id);
    showToast('Elemento duplicado / clonado con éxito');
  };

  const deleteElement = (targetId?: string) => {
    const idToDelete = targetId || selectedElementId;
    if (!idToDelete) return;

    const { nextSections } = removeElementFromSections(sections, idToDelete);
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
      let merged: PageBlockSection = { ...sec, ...updatedProps };
      if (typeof merged.maxWidth === 'number' && merged.maxWidth > effectiveCanvasMaxWidth) {
        merged = { ...merged, maxWidth: effectiveCanvasMaxWidth };
      }
      const secLimit = getSectionEffectiveMaxWidth(merged, effectiveCanvasMaxWidth);
      const clampedRows = merged.rows.map((r) => clampRowTreeToLimit(r, secLimit).row);
      return { ...merged, rows: clampedRows };
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
    clearAllDragStates();
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
    setSelectedRowId(null);
    setSelectedColumnId(null);
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
    duplicatedSec.rows = duplicatedSec.rows.map((row) => cloneRowWithFreshIds(row));

    const newSections = [...sections];
    newSections.splice(idx + 1, 0, duplicatedSec);

    pushHistory(newSections);
    setSelectedSectionId(newSecId);
    setSelectedRowId(null);
    setSelectedColumnId(null);
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
    setSelectedColumnId(null);
    setSelectedElementId(null);
    setHasUnsavedChanges(true);
    showToast('Sección eliminada');
  };

  // Update inner section / row styles (supports outer & nested rows, enforcing parent width hierarchy)
  const updateSelectedRow = (updatedProps: Partial<PageBlockRow>) => {
    const targetRowId = activeRowForInspector?.id || selectedRowId;
    if (!targetRowId) return;
    const rawUpdated = updateRowInSections(sections, targetRowId, updatedProps);
    const { sections: nextSections } = clampSectionsHierarchy(rawUpdated, effectiveCanvasMaxWidth);
    pushHistory(nextSections);
    setHasUnsavedChanges(true);
  };

  const changeRowColumnsCount = (rowId: string, count: number) => {
    const nextSections = sections.map((sec) => ({
      ...sec,
      rows: sec.rows.map((row) => {
        if (row.id === rowId) {
          return resizeRowColumnsCount(row, count);
        }
        return {
          ...row,
          columns: row.columns.map((col) => ({
            ...col,
            elements: col.elements.map((el) =>
              el.type === 'inner_columns' && el.nestedRow?.id === rowId
                ? { ...el, nestedRow: resizeRowColumnsCount(el.nestedRow, count) }
                : el
            ),
          })),
        };
      }),
    }));
    pushHistory(nextSections);
    setHasUnsavedChanges(true);
    showToast(`Distribución actualizada a ${count} ${count === 1 ? 'columna' : 'columnas'}`);
  };

  const duplicateRow = (rowId?: string) => {
    const targetRowId = rowId || activeRowForInspector?.id || selectedRowId;
    if (!targetRowId) return;

    const { nextSections, newRowId } = duplicateRowInSections(sections, targetRowId);
    if (!newRowId) return;

    pushHistory(nextSections);
    setSelectedRowId(newRowId);
    setSelectedColumnId(null);
    setSelectedElementId(null);
    setHasUnsavedChanges(true);
    showToast('Sección interna duplicada');
  };

  const deleteRow = (rowId?: string) => {
    const targetRowId = rowId || activeRowForInspector?.id || selectedRowId;
    if (!targetRowId) return;

    const { nextSections, deleted } = deleteRowInSections(sections, targetRowId);
    if (deleted) {
      pushHistory(nextSections);
      setSelectedRowId(null);
      setSelectedColumnId(null);
      setSelectedElementId(null);
      setHasUnsavedChanges(true);
      showToast('Sección interna eliminada');
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
      rows: sec.rows.map((row) => cloneRowWithFreshIds(row)),
    }));

    if (template.pageSettings) {
      setPageSettings((prev) => ({
        ...prev,
        ...template.pageSettings,
      }));
    }

    pushHistory(newSections);
    setSelectedElementId(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setSelectedSectionId(null);
    setHasUnsavedChanges(true);
    setShowTemplateConfirmModal(false);
    setTemplateToApply(null);
    setTemplatePreviewModal(null);
    showToast(`Plantilla "${template.name}" cargada correctamente`);
  };

  const moveRow = (direction: 'up' | 'down', _secId?: string, rowId?: string) => {
    const idToMove = rowId || activeRowForInspector?.id || selectedRowId;
    if (!idToMove) return;

    const { nextSections, moved } = moveRowInSections(sections, idToMove, direction);
    if (moved) {
      pushHistory(nextSections);
      setSelectedRowId(idToMove);
      showToast(`Sección interna movida hacia ${direction === 'up' ? 'arriba' : 'abajo'}`);
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

  const moveCanvasRowToSection = (
    rowId: string,
    targetSectionId: string,
    targetRowIndex: number
  ) => {
    clearAllDragStates();
    let sourceSecIdx = -1;
    let sourceRowIdx = -1;
    for (let s = 0; s < sections.length; s++) {
      const rIdx = sections[s].rows.findIndex((r) => r.id === rowId);
      if (rIdx !== -1) {
        sourceSecIdx = s;
        sourceRowIdx = rIdx;
        break;
      }
    }
    if (sourceSecIdx === -1 || sourceRowIdx === -1) return;

    const sourceSec = sections[sourceSecIdx];
    const movingRow = sourceSec.rows[sourceRowIdx];

    if (sourceSec.id === targetSectionId) {
      const adjustedIdx =
        sourceRowIdx < targetRowIndex ? targetRowIndex - 1 : targetRowIndex;
      const clampedIdx = Math.max(0, Math.min(sourceSec.rows.length - 1, adjustedIdx));
      if (clampedIdx === sourceRowIdx) return;

      const nextSections = sections.map((sec) => {
        if (sec.id !== targetSectionId) return sec;
        const newRows = [...sec.rows];
        newRows.splice(sourceRowIdx, 1);
        newRows.splice(clampedIdx, 0, movingRow);
        return { ...sec, rows: newRows };
      });
      pushHistory(nextSections);
      setSelectedSectionId(targetSectionId);
      setSelectedRowId(rowId);
      setSelectedColumnId(null);
      setSelectedElementId(null);
      showToast('Orden de bloques actualizado');
      return;
    }

    const rawSections = sections.map((sec) => {
      if (sec.id === sourceSec.id) {
        const remaining = sec.rows.filter((r) => r.id !== rowId);
        if (remaining.length === 0) {
          const fallbackRow = createInnerColumnsRow(1);
          fallbackRow.name = 'Bloque div';
          return { ...sec, rows: [fallbackRow] };
        }
        return { ...sec, rows: remaining };
      }
      if (sec.id === targetSectionId) {
        const newRows = [...sec.rows];
        const clampedIdx = Math.max(0, Math.min(newRows.length, targetRowIndex));
        newRows.splice(clampedIdx, 0, movingRow);
        return { ...sec, rows: newRows };
      }
      return sec;
    });

    const { sections: finalSections } = clampSectionsHierarchy(
      rawSections,
      effectiveCanvasMaxWidth
    );
    pushHistory(finalSections);
    setSelectedSectionId(targetSectionId);
    setSelectedRowId(rowId);
    setSelectedColumnId(null);
    setSelectedElementId(null);
    showToast('Bloque movido a la sección seleccionada');
  };

  const promoteInnerColumnsToRow = (
    wrapperElementId: string,
    targetSectionId: string,
    targetRowIndex: number
  ) => {
    clearAllDragStates();
    const { nextSections, removedElement } = removeElementFromSections(
      sections,
      wrapperElementId
    );
    if (!removedElement || removedElement.type !== 'inner_columns' || !removedElement.nestedRow) {
      return;
    }

    const promotedRow: PageBlockRow = {
      ...removedElement.nestedRow,
      name: formatRowDisplayName(removedElement.nestedRow.name, 'Bloque div'),
    };

    const withInsertedRow = nextSections.map((sec) => {
      if (sec.id !== targetSectionId) return sec;
      const newRows = [...sec.rows];
      const clampedIdx = Math.max(0, Math.min(newRows.length, targetRowIndex));
      newRows.splice(clampedIdx, 0, promotedRow);
      return { ...sec, rows: newRows };
    });

    const { sections: finalSections } = clampSectionsHierarchy(
      withInsertedRow,
      effectiveCanvasMaxWidth
    );
    pushHistory(finalSections);
    setSelectedSectionId(targetSectionId);
    setSelectedRowId(promotedRow.id);
    setSelectedColumnId(null);
    setSelectedElementId(null);
    showToast('Sección interna subida de nivel');
  };

  const reorderElementsInCol = (colId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const nextSections = reorderElementsInColInSections(sections, colId, fromIndex, toIndex);
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
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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
      bgColor: 'transparent',
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
    setSelectedRowId(null);
    setSelectedColumnId(null);
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
        newElement.content = {
          buttonText: 'Quiero Agendar Mi Sesión Estratégica',
          buttonSubtextEnabled: false,
          buttonSubtext: '',
          buttonSubtextColor: 'rgba(255, 255, 255, 0.85)',
          buttonSubtextFontSize: 12,
          buttonSubtextGap: 4,
          buttonSubtextIcon: '',
          buttonIcon: '',
          buttonIconPosition: 'before',
          buttonIconSpacing: 8,
          buttonIconSize: 18,
        };
        newElement.styles = {
          fontSize: 16,
          fontFamily: 'Poppins',
          textColor: '#FFFFFF',
          bgColor: '#2848F0',
          isBold: true,
          buttonPaddingY: 14,
          buttonPaddingX: 28,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
          borderRadius: 0,
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: '#18181B',
          textAlign: 'center',
          fullWidth: false,
          buttonDestination: 'next_page',
          buttonOpenNewTab: false,
        };
        break;
      case 'image':
        newElement.content = {
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
          alt: '',
        };
        newElement.styles = {
          borderRadius: 0,
          imageWidth: 450,
          imageFit: 'contain',
          imagePosition: 'center',
          imageRepeat: 'no-repeat',
          textAlign: 'center',
          opacity: 1,
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'video':
        newElement.content = {
          videoUrl: '',
          videoFileName: '',
          videoSource: 'youtube',
          videoCoverType: 'none',
        };
        newElement.styles = {
          maxWidth: '750px',
          borderRadius: 0,
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
          audioSource: 'external',
          audioUrl: '',
          audioFileName: '',
          audioTitle: 'Audio Explicativo / Música',
          audioArtist: 'Scale Sales Pro',
          audioAutoplay: false,
          audioLoop: false,
          audioBgType: 'solid',
          audioBgColor: '#18181B',
          audioBgColorEnd: '#1E293B',
          audioTitleColor: '#FFFFFF',
          audioArtistColor: '#A1A1AA',
          audioTitleSize: 13,
          audioFontFamily: 'Poppins',
          audioPlayButtonBg: '#2848F0',
          audioPlayIconColor: '#FFFFFF',
          audioPlayButtonShape: 'rounded',
          audioProgressColor: '#2848F0',
          audioProgressBgColor: '#3F3F46',
          audioPlayerSize: 'normal',
        };
        newElement.styles = {
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
          borderRadius: 16,
          maxWidth: '100%',
          textAlign: 'center',
          shadow: 'lg',
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
          formName: 'Formulario Principal',
          formFields: createDefaultCompleteFormFields(),
          formInputSize: 'md',
          formShowLabels: true,
          formShowRequiredMark: true,
          formFieldStyles: {
            fontFamily: pageSettings.bodyFontFamily || 'Inter',
            fontSize: 14,
            isBold: false,
            isItalic: false,
            textColor: '#18181B',
            labelColor: '#27272A',
            bgColor: '#FFFFFF',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#D4D4D8',
            borderRadius: 0,
          },
          formButtonStyles: {
            text: 'Enviar Información',
            subtext: '',
            icon: '',
            iconPosition: 'after',
            iconSpacing: 8,
            iconSize: 18,
            paddingY: 14,
            paddingX: 24,
            fontSize: 15,
            fontFamily: pageSettings.bodyFontFamily || 'Poppins',
            textTransform: 'none',
            isBold: true,
            isItalic: false,
            isUnderline: false,
            align: 'center',
            fullWidth: true,
            bgType: 'solid',
            bgColor: pageSettings.primaryColor || '#2848F0',
            bgColor2: '#1E3A8A',
            textColor: '#FFFFFF',
            borderColor: '#18181B',
            borderWidth: 0,
            borderStyle: 'solid',
            borderRadius: 0,
          },
          policyCheckboxEnabled: false,
          policyCheckboxHtml: DEFAULT_POLICY_HTML,
          policyCheckboxFontSize: 12,
          policyCheckboxTextColor: '#3F3F46',
          policyCheckboxErrorText: DEFAULT_POLICY_ERROR_TEXT,
          formPostSubmitActions: {
            goToNextStep: false,
            redirectToUrl: false,
            redirectUrl: '',
            redirectOpenNewTab: false,
            addToCrm: true,
            sendToEmailMarketing: false,
          },
          formSuccessMessage: '¡Gracias! Hemos recibido tus datos correctamente.',
        };
        newElement.styles = {
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        };
        break;
      case 'inline_form': {
        const inlineFieldDefaults = createDefaultInlineFieldStyle(
          pageSettings.bodyFontFamily || 'Inter'
        );
        const inlineBtnDefaults = createDefaultInlineButtonStyles(
          'Comenzar Ahora',
          '',
          '#F5B056',
          pageSettings.bodyFontFamily || 'Poppins'
        );
        newElement.content = {
          formName: 'Formulario Inline',
          inlineFormHeight: 52,
          inlineFormButtonWidthPercent: 30,
          inlineFormGap: 0,
          inlineEmailPlaceholder: DEFAULT_EMAIL_PLACEHOLDER,
          inlineEmailLabel: 'Tu mejor email',
          inlineShowLabel: false,
          formShowRequiredMark: true,
          formFieldStyles: inlineFieldDefaults,
          formButtonStyles: inlineBtnDefaults,
          submitButtonText: inlineBtnDefaults.text,
          submitButtonBg: inlineBtnDefaults.bgColor,
          submitButtonTextColor: inlineBtnDefaults.textColor,
          policyCheckboxEnabled: false,
          policyCheckboxHtml: DEFAULT_POLICY_HTML,
          policyCheckboxFontSize: 12,
          policyCheckboxTextColor: '#3F3F46',
          policyCheckboxErrorText: DEFAULT_POLICY_ERROR_TEXT,
          formPostSubmitActions: {
            goToNextStep: true,
            goToFunnelPage: false,
            targetFunnelPageId: '',
            redirectToUrl: false,
            redirectUrl: '',
            redirectOpenNewTab: false,
            addToCrm: true,
            sendToEmailMarketing: false,
          },
          formSuccessMessage: '¡Gracias! Hemos recibido tu correo correctamente.',
        };
        newElement.styles = {
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        };
        break;
      }
      case 'popup_button':
        newElement.content = {
          popupButtonText: 'Abrir Oferta en Pop-up',
          popupId: 'popup_1',
          buttonIcon: '',
          buttonIconPosition: 'before',
          buttonIconSpacing: 8,
          buttonIconSize: 18,
        };
        newElement.styles = {
          fontSize: 16,
          fontFamily: 'Poppins',
          textColor: '#FFFFFF',
          bgColor: '#2848F0',
          isBold: true,
          buttonPaddingY: 14,
          buttonPaddingX: 28,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: 0,
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: '#18181B',
          textAlign: 'center',
          fullWidth: false,
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
      case 'countdown':
        newElement.content = {
          countdownEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          countdownDaysLabel: 'Días',
          countdownHoursLabel: 'Horas',
          countdownMinutesLabel: 'Minutos',
          countdownSecondsLabel: 'Segundos',
          countdownTheme: 'dark',
        };
        newElement.styles = {
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 24,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'faq':
        newElement.content = {
          faqItems: [
            {
              id: `faq_1_${Date.now()}`,
              question: '¿Cómo funciona el proceso una vez que me registro?',
              answer: 'Inmediatamente recibirás un correo con tus credenciales de acceso y uno de nuestros asesores se pondrá en contacto contigo para coordinar los primeros pasos.',
            },
            {
              id: `faq_2_${Date.now()}`,
              question: '¿Qué garantía tengo con Scale Sales Pro?',
              answer: 'Cuentas con una garantía incondicional de satisfacción. Si durante los primeros 14 días no estás satisfecho, te reembolsamos el 100% de tu inversión sin preguntas.',
            },
            {
              id: `faq_3_${Date.now()}`,
              question: '¿Necesito experiencia técnica o herramientas adicionales?',
              answer: 'No, todo está integrado y listo para usar con plantillas prediseñadas de alta conversión que puedes personalizar en minutos.',
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
      case 'social_links':
        newElement.content = {
          socialLinks: [
            { id: 'fb', platform: 'facebook', url: 'https://facebook.com', enabled: true },
            { id: 'ig', platform: 'instagram', url: 'https://instagram.com', enabled: true },
            { id: 'tt', platform: 'tiktok', url: 'https://tiktok.com', enabled: true },
            { id: 'wa', platform: 'whatsapp', url: 'https://wa.me/', enabled: true },
            { id: 'yt', platform: 'youtube', url: 'https://youtube.com', enabled: true },
          ],
          socialSize: 'md',
          socialStyle: 'colored',
          socialColorMode: 'default',
          socialIconColor: '#FFFFFF',
          socialBgColor: '#2848F0',
          socialShape: 'circle',
        };
        newElement.styles = {
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'checkbox':
        newElement.content = {
          checkboxLabel: 'Acepto los términos y condiciones de la política de privacidad.',
          checkboxChecked: false,
          checkboxRequired: true,
        };
        newElement.styles = {
          fontSize: 14,
          fontFamily: 'Inter',
          textColor: '#374151',
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'input_field':
        newElement.content = {
          fieldLabel: 'Tu Correo Electrónico Principal',
          fieldPlaceholder: 'ejemplo@tudominio.com',
          fieldType: 'email',
          fieldRequired: true,
        };
        newElement.styles = {
          fontSize: 14,
          fontFamily: 'Inter',
          textColor: '#121111',
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
        };
        break;
      case 'form_button':
        newElement.content = {
          buttonText: 'Enviar Información',
          buttonSubtext: '🔒 Tus datos están 100% seguros',
          buttonIcon: 'Send',
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
          marginTop: 0,
          marginBottom: 16,
          marginLeft: 0,
          marginRight: 0,
          borderRadius: 8,
          textAlign: 'center',
          fullWidth: true,
          buttonDestination: 'next_page',
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
            maxWidth: Math.min(1200, effectiveCanvasMaxWidth),
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
      setSelectedColumnId(null);
      setSelectedElementId(newElement.id);
      const label = options?.level ? options.level.toUpperCase() : type.toUpperCase();
      showToast(`Elemento ${label} añadido al lienzo`);
      return;
    }

    let targetColId: string | null = null;
    let targetIndex = 0;

    if (selectionCtx.selectedElement && selectionCtx.selectedCol) {
      targetColId = selectionCtx.selectedCol.id;
      const foundIdx = selectionCtx.selectedCol.elements.findIndex(
        (el) => el.id === selectionCtx.selectedElement!.id
      );
      targetIndex = foundIdx !== -1 ? foundIdx + 1 : selectionCtx.selectedCol.elements.length;
    } else if (selectionCtx.selectedCol) {
      targetColId = selectionCtx.selectedCol.id;
      targetIndex = selectionCtx.selectedCol.elements.length;
    } else if (selectionCtx.selectedRow && selectionCtx.selectedRow.columns.length > 0) {
      targetColId = selectionCtx.selectedRow.columns[0].id;
      targetIndex = selectionCtx.selectedRow.columns[0].elements.length;
    } else if (selectionCtx.selectedSec && selectionCtx.selectedSec.rows[0]?.columns[0]) {
      targetColId = selectionCtx.selectedSec.rows[0].columns[0].id;
      targetIndex = selectionCtx.selectedSec.rows[0].columns[0].elements.length;
    } else if (sections[0]?.rows[0]?.columns[0]) {
      targetColId = sections[0].rows[0].columns[0].id;
      targetIndex = sections[0].rows[0].columns[0].elements.length;
    }

    if (!targetColId) return;

    const nextSections = insertElementIntoColumn(sections, targetColId, targetIndex, newElement);
    pushHistory(nextSections);
    setSelectedColumnId(null);
    setSelectedElementId(newElement.id);
    const label = options?.level ? options.level.toUpperCase() : type.toUpperCase();
    showToast(`Elemento ${label} añadido al lienzo`);
  };

  // Insert element dropped from sidebar into a specific column and index (supports depth 0 & depth 1)
  const insertElementAt = (
    type: ElementType,
    colId: string,
    atIndex: number,
    options?: { level?: 'h1' | 'h2' | 'h3' | 'h4' }
  ) => {
    clearAllDragStates();
    const newElement = createNewElement(type, options);
    const nextSections = insertElementIntoColumn(sections, colId, atIndex, newElement);
    pushHistory(nextSections);
    setSelectedColumnId(null);
    setSelectedElementId(newElement.id);
  };

  // Insert nested inner columns (1-4 cols) at exact drop index inside a depth-0 block column (max 1 nested level)
  const insertNestedColumnsAt = (numCols: number, colId: string, atIndex: number) => {
    clearAllDragStates();
    const depth = findColumnDepth(sections, colId);
    if (depth === null) return;
    if (depth >= 1) {
      showToast('Solo se permite una sección interna dentro de un bloque (máximo 1 nivel)');
      return;
    }

    const innerColsEl = createInnerColumnsElement(numCols);
    const nextSections = insertElementIntoColumn(sections, colId, atIndex, innerColsEl);
    pushHistory(nextSections);

    if (innerColsEl.nestedRow) {
      setSelectedRowId(innerColsEl.nestedRow.id);
    }
    setSelectedColumnId(null);
    setSelectedElementId(null);
    showToast(`Columnas internas (${numCols} Col) insertadas`);
  };

  // Reorder existing element within canvas when dragged (supports depth 0 & depth 1, blocks >1 nested level)
  const reorderCanvasElement = (sourceId: string, targetColId: string, targetIdx: number) => {
    clearAllDragStates();
    const sourceEl = findElementById(sections, sourceId);
    if (!sourceEl) return;

    const targetDepth = findColumnDepth(sections, targetColId);
    if (sourceEl.type === 'inner_columns' && targetDepth === 1) {
      showToast('Solo se permite una sección interna dentro de un bloque (máximo 1 nivel)');
      return;
    }

    const { nextSections, removedElement, sourceColId, sourceIndex } = removeElementFromSections(
      sections,
      sourceId
    );
    if (!removedElement) return;

    const adjustedIdx =
      sourceColId === targetColId && sourceIndex !== -1 && sourceIndex < targetIdx
        ? targetIdx - 1
        : targetIdx;

    if (sourceColId === targetColId && adjustedIdx === sourceIndex) {
      return;
    }

    const insertedSections = insertElementIntoColumn(
      nextSections,
      targetColId,
      adjustedIdx,
      removedElement
    );

    const { sections: finalSections } = clampSectionsHierarchy(
      insertedSections,
      effectiveCanvasMaxWidth
    );

    pushHistory(finalSections);
    setSelectedColumnId(null);
    if (removedElement.type === 'inner_columns' && removedElement.nestedRow) {
      const nextCtx = findEditorSelectionContext(finalSections, {
        selectedSectionId: null,
        selectedRowId: removedElement.nestedRow.id,
        selectedColumnId: null,
        selectedElementId: null,
      });
      if (nextCtx.selectedSec) setSelectedSectionId(nextCtx.selectedSec.id);
      setSelectedRowId(removedElement.nestedRow.id);
      setSelectedElementId(null);
    } else {
      const nextCtx = findEditorSelectionContext(finalSections, {
        selectedSectionId: null,
        selectedRowId: null,
        selectedColumnId: null,
        selectedElementId: sourceId,
      });
      if (nextCtx.selectedSec) setSelectedSectionId(nextCtx.selectedSec.id);
      if (nextCtx.selectedRow) setSelectedRowId(nextCtx.selectedRow.id);
      setSelectedElementId(sourceId);
    }
    showToast('Orden del elemento actualizado');
  };

  // Add layout row (columnas internas) with 1, 2, 3 or 4 columns
  const addColumnsLayout = (numCols: number, targetSectionId?: string, targetRowIndex?: number) => {
    if (sections.length === 0) {
      const newRow = createInnerColumnsRow(numCols);
      const brandNewSection: PageBlockSection = {
        id: `sec_${Date.now()}`,
        name: 'Sección 1',
        bgType: 'solid',
        bgColor: '#FFFFFF',
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        marginTop: 0,
        marginBottom: 0,
        rows: [newRow],
      };
      pushHistory([brandNewSection]);
      setSelectedSectionId(brandNewSection.id);
      setSelectedRowId(newRow.id);
      setSelectedColumnId(null);
      setSelectedElementId(null);
      showToast(`Columnas internas (${numCols} Col) agregadas`);
      return;
    }

    // Explicit row index drop in outer section
    if (typeof targetRowIndex === 'number' && targetSectionId) {
      const newRow = createInnerColumnsRow(numCols);
      const nextSections = sections.map((sec) => {
        if (sec.id !== targetSectionId) return sec;
        const newRows = [...sec.rows];
        const clamped = Math.max(0, Math.min(newRows.length, targetRowIndex));
        newRows.splice(clamped, 0, newRow);
        return { ...sec, rows: newRows };
      });
      pushHistory(nextSections);
      setSelectedSectionId(targetSectionId);
      setSelectedRowId(newRow.id);
      setSelectedColumnId(null);
      setSelectedElementId(null);
      showToast(`Columnas internas (${numCols} Col) agregadas`);
      return;
    }

    // Clicked in sidebar: enforce max 1 nested level inside outer block
    if (selectionCtx.isNestedRow) {
      showToast('Ya estás dentro de una sección interna (máximo 1 nivel por bloque)');
      return;
    }

    if (selectionCtx.outerCol) {
      const insertAt = selectionCtx.selectedElement
        ? (() => {
            const idx = selectionCtx.outerCol!.elements.findIndex(
              (el) => el.id === selectionCtx.selectedElement!.id
            );
            return idx !== -1 ? idx + 1 : selectionCtx.outerCol!.elements.length;
          })()
        : selectionCtx.outerCol.elements.length;
      insertNestedColumnsAt(numCols, selectionCtx.outerCol.id, insertAt);
      return;
    }

    if (selectionCtx.outerRow && selectionCtx.outerRow.columns.length === 1) {
      const col = selectionCtx.outerRow.columns[0];
      insertNestedColumnsAt(numCols, col.id, col.elements.length);
      return;
    }

    const targetSec = selectionCtx.selectedSec || sections[0];
    if (targetSec.rows.length === 1 && targetSec.rows[0].columns.length === 1) {
      const col = targetSec.rows[0].columns[0];
      setSelectedSectionId(targetSec.id);
      insertNestedColumnsAt(numCols, col.id, col.elements.length);
      return;
    }

    const newRow = createInnerColumnsRow(numCols);
    const nextSections = sections.map((sec) => {
      if (sec.id !== targetSec.id) return sec;
      const newRows = [...sec.rows];
      if (selectionCtx.outerRow) {
        const foundIdx = newRows.findIndex((r) => r.id === selectionCtx.outerRow!.id);
        if (foundIdx !== -1) {
          newRows.splice(foundIdx + 1, 0, newRow);
          return { ...sec, rows: newRows };
        }
      }
      newRows.push(newRow);
      return { ...sec, rows: newRows };
    });

    pushHistory(nextSections);
    setSelectedSectionId(targetSec.id);
    setSelectedRowId(newRow.id);
    setSelectedColumnId(null);
    setSelectedElementId(null);
    showToast(`Columnas internas (${numCols} Col) agregadas`);
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
      setSelectedRowId(null);
      setSelectedColumnId(null);
      setSelectedElementId(null);
      showToast(`Bloque "${newSection.name}" insertado en la posición seleccionada`);
    } else if (blockType === 'header') {
      newSections.unshift(newSection);
      pushHistory(newSections);
      setSelectedSectionId(newSection.id);
      setSelectedRowId(null);
      setSelectedColumnId(null);
      setSelectedElementId(null);
      showToast(`Cabecera "${newSection.name}" añadida al inicio de la página`);
    } else {
      newSections.push(newSection);
      pushHistory(newSections);
      setSelectedSectionId(newSection.id);
      setSelectedRowId(null);
      setSelectedColumnId(null);
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
          <div className="flex items-center text-xs text-[#5B5B66] font-['Inter'] overflow-x-auto max-w-[460px] no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedElementId(null);
                setSelectedColumnId(null);
                setSelectedRowId(null);
                setSelectedSectionId(null);
                setActiveTab('page');
              }}
              className="font-semibold text-zinc-900 hover:text-[#2848F0] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
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
                  setSelectedColumnId(null);
                  setSelectedRowId(null);
                  setSelectedSectionId(selectedSec.id);
                }}
                className={`cursor-pointer hover:text-[#2848F0] hover:underline shrink-0 ${
                  !selectedRow && !selectedCol && !selectedElement ? 'text-[#2848F0] font-bold' : 'text-zinc-600'
                }`}
                title="Configuración de la Sección Externa"
              >
                {selectedSec.name}
              </button>
            ) : (
              <span className="text-zinc-400 shrink-0">Sección</span>
            )}

            {selectionCtx.outerRow && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedElementId(null);
                    setSelectedColumnId(null);
                    setSelectedRowId(selectionCtx.outerRow!.id);
                  }}
                  className={`cursor-pointer hover:text-[#2848F0] hover:underline flex items-center gap-1 shrink-0 ${
                    !selectionCtx.isNestedRow && !selectedCol && !selectedElement
                      ? 'text-indigo-600 font-bold'
                      : 'text-zinc-600'
                  }`}
                  title="Configuración del Bloque / Sección Interna"
                >
                  <Box className="w-3 h-3 text-indigo-500" />
                  <span>{selectionCtx.outerRow.name || 'Bloque Interno'}</span>
                </button>
              </>
            )}

            {selectionCtx.isNestedRow && selectionCtx.nestedRow && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedElementId(null);
                    setSelectedColumnId(null);
                    setSelectedRowId(selectionCtx.nestedRow!.id);
                  }}
                  className={`cursor-pointer hover:text-[#2848F0] hover:underline flex items-center gap-1 shrink-0 ${
                    !selectedCol && !selectedElement ? 'text-indigo-600 font-bold' : 'text-zinc-600'
                  }`}
                  title="Configuración de la Sección Interna Anidada"
                >
                  <Box className="w-3 h-3 text-indigo-500" />
                  <span>{selectionCtx.nestedRow.name || 'Sección Interna'}</span>
                </button>
              </>
            )}

            {selectedCol && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedElementId(null);
                    setSelectedColumnId(selectedCol.id);
                    if (selectionCtx.selectedColParentRow) {
                      setSelectedRowId(selectionCtx.selectedColParentRow.id);
                    }
                  }}
                  className={`cursor-pointer hover:text-teal-700 hover:underline flex items-center gap-1 shrink-0 ${
                    !selectedElement ? 'text-teal-600 font-bold' : 'text-zinc-600'
                  }`}
                  title="Editar color y estilo de esta columna"
                >
                  <ColumnsIcon className="w-3 h-3 text-teal-600" />
                  <span>{selectedCol.name || `Columna ${selectionCtx.selectedColIndex + 1}`}</span>
                </button>
              </>
            )}

            {selectedElement && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-400 shrink-0" />
                <span className="text-[#2848F0] font-bold shrink-0">
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

        {/* Right Actions: Plantillas, Preview, Estructura & Save */}
        <div className="flex items-center gap-2">
          {!isPreviewMode && (
            <button
              type="button"
              onClick={() => {
                if (
                  activeTab === 'templates' &&
                  !selectedElementId &&
                  !selectedColumnId &&
                  !selectedRowId &&
                  !selectedSectionId
                ) {
                  setActiveTab('elements');
                } else {
                  setActiveTab('templates');
                  setSelectedElementId(null);
                  setSelectedColumnId(null);
                  setSelectedRowId(null);
                  setSelectedSectionId(null);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                activeTab === 'templates' &&
                !selectedElement &&
                !activeColForInspector &&
                !activeRowForInspector &&
                !activeSectionForInspector
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-1 ring-purple-600'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-900'
              }`}
              title="Explorar y cargar plantillas predefinidas en el lienzo"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Plantillas</span>
            </button>
          )}

          <button
            onClick={() => {
              const nextMode = !isPreviewMode;
              setIsPreviewMode(nextMode);
              if (nextMode) {
                setPreviewResetCount((c) => c + 1);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Modo Edición' : 'Vista Previa'}</span>
          </button>

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
          <aside id="inspector-panel-sidebar" className="w-80 bg-white border-r border-zinc-200 flex flex-col h-full shrink-0 overflow-hidden shadow-xs z-20">
            {selectedElement ? (
              /* PROPERTY INSPECTOR FOR SELECTED ELEMENT */
              <div className="flex-1 flex flex-col h-full">
                {/* Header with back button */}
                <div className="p-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleReturnToLibrary}
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
                            updateSelectedElement(
                              { imageHeight: undefined },
                              { src: base64, alt: '' }
                            );
                            showToast('Imagen cargada correctamente desde tu explorador');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }}
                  />

                  {/* Hidden File Input for direct video uploading (MP4, AVI, MOV, WebM, MKV) */}
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept=".mp4,.avi,.mov,.webm,.mkv,video/mp4,video/x-msvideo,video/avi,video/quicktime,video/webm,video/x-matroska"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const validExt = /\.(mp4|avi|mov|webm|mkv)$/i.test(file.name);
                        const validMime = /^video\/(mp4|webm|quicktime|x-msvideo|avi|msvideo|x-matroska)/i.test(file.type);
                        if (!validExt && !validMime) {
                          showToast('Formato no permitido. Sube un video MP4, AVI, MOV, WebM o MKV');
                          e.target.value = '';
                          return;
                        }
                        const objectUrl = URL.createObjectURL(file);
                        updateSelectedElement(
                          {},
                          {
                            videoUrl: objectUrl,
                            videoFileName: file.name,
                            videoSource: 'upload',
                          }
                        );
                        showToast(`Video "${file.name}" cargado correctamente`);
                      }
                      e.target.value = '';
                    }}
                  />

                  {/* Hidden File Input for Video Cover Image uploading */}
                  <input
                    type="file"
                    ref={videoCoverInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.type.startsWith('image/') && !/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(file.name)) {
                          showToast('Selecciona un archivo de imagen válido');
                          e.target.value = '';
                          return;
                        }
                        if (file.size <= 2 * 1024 * 1024) {
                          const reader = new FileReader();
                          reader.onload = (uploadEv) => {
                            const dataUrl = uploadEv.target?.result as string;
                            if (dataUrl) {
                              updateSelectedElement({}, { videoCoverImage: dataUrl, videoCoverType: 'image' });
                              showToast('Imagen de portada cargada correctamente');
                            }
                          };
                          reader.readAsDataURL(file);
                        } else {
                          const objectUrl = URL.createObjectURL(file);
                          updateSelectedElement({}, { videoCoverImage: objectUrl, videoCoverType: 'image' });
                          showToast('Imagen de portada cargada correctamente');
                        }
                      }
                      e.target.value = '';
                    }}
                  />

                  {/* Hidden File Input for direct audio uploading (MP3, WAV, OGG, M4A) */}
                  <input
                    type="file"
                    ref={audioFileInputRef}
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const cleanName = file.name.replace(/\.[^/.]+$/, '');
                        const shouldUpdateTitle =
                          !selectedElement?.content.audioTitle ||
                          selectedElement.content.audioTitle === 'Audio Explicativo / Música';
                        if (file.size <= 2 * 1024 * 1024) {
                          const reader = new FileReader();
                          reader.onload = (uploadEv) => {
                            const dataUrl = uploadEv.target?.result as string;
                            if (dataUrl) {
                              updateSelectedElement(
                                {},
                                {
                                  audioUrl: dataUrl,
                                  audioFileName: file.name,
                                  audioSource: 'upload',
                                  audioType: 'direct',
                                  ...(shouldUpdateTitle ? { audioTitle: cleanName } : {}),
                                }
                              );
                              showToast(`Audio "${file.name}" cargado correctamente`);
                            }
                          };
                          reader.readAsDataURL(file);
                        } else {
                          const objectUrl = URL.createObjectURL(file);
                          updateSelectedElement(
                            {},
                            {
                              audioUrl: objectUrl,
                              audioFileName: file.name,
                              audioSource: 'upload',
                              audioType: 'direct',
                              ...(shouldUpdateTitle ? { audioTitle: cleanName } : {}),
                            }
                          );
                          showToast(`Audio "${file.name}" cargado correctamente`);
                        }
                      }
                      e.target.value = '';
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
                  {selectedElement.type === 'button' && (() => {
                    const currentBtnIcon = selectedElement.content.buttonIcon || '';
                    const CurrentBtnIconComp = currentBtnIcon ? (LucideIcons as any)[currentBtnIcon] : null;
                    return (
                      <div className="space-y-3">
                        <div>
                          <label className="font-semibold text-zinc-700">Texto del botón:</label>
                          <input
                            type="text"
                            value={selectedElement.content.buttonText || ''}
                            onChange={(e) => updateSelectedElement({}, { buttonText: e.target.value })}
                            className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                          />
                        </div>

                        {/* SUBTEXTO DEL BOTÓN (DESPLAZABLE SÍ / NO — POR DEFECTO EN NO) */}
                        {(() => {
                          const subtextEnabled = Boolean(selectedElement.content.buttonSubtextEnabled);
                          const subtextIcons = [
                            { id: '', label: 'Ninguno', Icon: X },
                            { id: 'Lock', label: 'Seguro', Icon: Lock },
                            { id: 'ShieldCheck', label: 'Garantía', Icon: (LucideIcons as any).ShieldCheck || CheckCircle2 },
                            { id: 'Clock', label: 'Tiempo', Icon: Clock },
                            { id: 'CheckCircle2', label: 'Check', Icon: CheckCircle2 },
                            { id: 'Sparkles', label: 'Destello', Icon: Sparkles },
                            { id: 'Zap', label: 'Rápido', Icon: Zap },
                            { id: 'Flame', label: 'Oferta', Icon: Flame },
                          ];

                          return (
                            <div className="p-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <span className="font-semibold text-zinc-800 block text-xs">Agregar subtexto:</span>
                                  <span className="text-[10px] text-zinc-500">Línea secundaria debajo del texto principal</span>
                                </div>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={subtextEnabled}
                                  onClick={() => {
                                    const nextState = !subtextEnabled;
                                    const updates: Record<string, any> = {
                                      buttonSubtextEnabled: nextState,
                                    };
                                    if (nextState && !selectedElement.content.buttonSubtext) {
                                      updates.buttonSubtext = 'Cupos limitados · 100% sin compromiso';
                                    }
                                    updateSelectedElement({}, updates);
                                  }}
                                  className={`relative inline-flex items-center h-6 w-14 rounded-full transition-colors cursor-pointer shrink-0 px-1 ${
                                    subtextEnabled ? 'bg-[#2848F0]' : 'bg-zinc-300'
                                  }`}
                                  title={subtextEnabled ? 'Desactivar subtexto' : 'Activar subtexto'}
                                >
                                  <span
                                    className={`text-[10px] font-bold select-none transition-opacity ${
                                      subtextEnabled
                                        ? 'text-white pl-1.5 opacity-100'
                                        : 'opacity-0 w-0 overflow-hidden'
                                    }`}
                                  >
                                    Sí
                                  </span>
                                  <span
                                    className={`inline-block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                                      subtextEnabled ? 'translate-x-2.5' : 'translate-x-0'
                                    }`}
                                  />
                                  <span
                                    className={`text-[10px] font-bold text-zinc-700 select-none transition-opacity ${
                                      !subtextEnabled
                                        ? 'pl-1.5 opacity-100'
                                        : 'opacity-0 w-0 overflow-hidden'
                                    }`}
                                  >
                                    No
                                  </span>
                                </button>
                              </div>

                              {subtextEnabled && (
                                <div className="pt-2 border-t border-zinc-200/80 space-y-2.5">
                                  {/* Input del subtexto */}
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      Texto del subtexto:
                                    </label>
                                    <input
                                      type="text"
                                      value={selectedElement.content.buttonSubtext ?? ''}
                                      onChange={(e) =>
                                        updateSelectedElement({}, { buttonSubtext: e.target.value })
                                      }
                                      placeholder="Ej: 100% gratis · Sin tarjeta de crédito"
                                      className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                                    />
                                  </div>

                                  {/* Color del subtexto */}
                                  <HexColorPicker
                                    label="Color del subtexto:"
                                    value={
                                      selectedElement.content.buttonSubtextColor ||
                                      'rgba(255, 255, 255, 0.85)'
                                    }
                                    onChange={(val) =>
                                      updateSelectedElement({}, { buttonSubtextColor: val })
                                    }
                                  />

                                  {/* Tamaño del subtexto */}
                                  <InlineSliderInput
                                    label="Tamaño del subtexto:"
                                    value={selectedElement.content.buttonSubtextFontSize ?? 12}
                                    min={9}
                                    max={28}
                                    inputMin={6}
                                    unit="px"
                                    onChange={(val) =>
                                      updateSelectedElement({}, { buttonSubtextFontSize: val })
                                    }
                                  />

                                  {/* Fuente del subtexto */}
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      Fuente del subtexto:
                                    </label>
                                    <select
                                      value={selectedElement.content.buttonSubtextFontFamily || ''}
                                      onChange={(e) =>
                                        updateSelectedElement(
                                          {},
                                          { buttonSubtextFontFamily: e.target.value || undefined }
                                        )
                                      }
                                      className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0]"
                                    >
                                      <option value="">
                                        Misma fuente del botón ({selectedElement.styles.fontFamily || pageSettings.bodyFontFamily || 'Poppins'})
                                      </option>
                                      {AVAILABLE_FONTS.map((font) => (
                                        <option
                                          key={font.value}
                                          value={font.value}
                                          style={{ fontFamily: font.value }}
                                        >
                                          {font.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Formato y Transformación del subtexto */}
                                  <div className="grid grid-cols-2 gap-2 items-end">
                                    <div>
                                      <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                        Estilo:
                                      </label>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement(
                                              {},
                                              {
                                                buttonSubtextBold:
                                                  !selectedElement.content.buttonSubtextBold,
                                              }
                                            )
                                          }
                                          className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                                            selectedElement.content.buttonSubtextBold
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                          title="Negrita en subtexto"
                                        >
                                          <BoldIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement(
                                              {},
                                              {
                                                buttonSubtextItalic:
                                                  !selectedElement.content.buttonSubtextItalic,
                                              }
                                            )
                                          }
                                          className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                                            selectedElement.content.buttonSubtextItalic
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                          title="Cursiva en subtexto"
                                        >
                                          <ItalicIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement(
                                              {},
                                              {
                                                buttonSubtextUnderline:
                                                  !selectedElement.content.buttonSubtextUnderline,
                                              }
                                            )
                                          }
                                          className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                                            selectedElement.content.buttonSubtextUnderline
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                          title="Subrayado en subtexto"
                                        >
                                          <UnderlineIcon className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                        Transformación:
                                      </label>
                                      <select
                                        value={selectedElement.content.buttonSubtextTransform || 'none'}
                                        onChange={(e) =>
                                          updateSelectedElement(
                                            {},
                                            { buttonSubtextTransform: e.target.value as any }
                                          )
                                        }
                                        className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0]"
                                      >
                                        <option value="none">Normal</option>
                                        <option value="uppercase">Mayúsculas</option>
                                        <option value="lowercase">Minúsculas</option>
                                        <option value="capitalize">Iniciales</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Separación con el texto principal */}
                                  <InlineSliderInput
                                    label="Separación con el texto:"
                                    value={selectedElement.content.buttonSubtextGap ?? 4}
                                    min={0}
                                    max={24}
                                    unit="px"
                                    onChange={(val) =>
                                      updateSelectedElement({}, { buttonSubtextGap: val })
                                    }
                                  />

                                  {/* Mini icono de confianza opcional en el subtexto */}
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      Icono en subtexto (opcional):
                                    </label>
                                    <div className="grid grid-cols-4 gap-1">
                                      {subtextIcons.map(({ id, label, Icon: SubIc }) => {
                                        const isCurrent =
                                          (selectedElement.content.buttonSubtextIcon || '') === id;
                                        return (
                                          <button
                                            key={id || 'none'}
                                            type="button"
                                            onClick={() =>
                                              updateSelectedElement({}, { buttonSubtextIcon: id })
                                            }
                                            className={`py-1.5 px-1 rounded-lg border text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                                              isCurrent
                                                ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                                            }`}
                                            title={label}
                                          >
                                            <SubIc className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate max-w-full">{label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        <div>
                          <label className="font-semibold text-zinc-700">Destino después de hacer clic:</label>
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
                          <div className="space-y-2 p-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl">
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1">URL del enlace:</label>
                              <input
                                type="text"
                                placeholder="https://wa.me/... o https://..."
                                value={selectedElement.styles.buttonUrl || ''}
                                onChange={(e) => updateSelectedElement({ buttonUrl: e.target.value })}
                                className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                              />
                            </div>
                            <label className="flex items-center justify-between pt-0.5 cursor-pointer select-none">
                              <span className="text-[11px] font-semibold text-zinc-700">Abrir en nueva pestaña:</span>
                              <input
                                type="checkbox"
                                checked={selectedElement.styles.buttonOpenNewTab ?? false}
                                onChange={(e) => updateSelectedElement({ buttonOpenNewTab: e.target.checked })}
                                className="w-4 h-4 text-[#2848F0] rounded cursor-pointer accent-[#2848F0]"
                              />
                            </label>
                          </div>
                        )}

                        {/* ICONO DEL BOTÓN */}
                        <div className="space-y-2.5 p-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl">
                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Icono del botón:</label>
                            <button
                              type="button"
                              onClick={() => setShowButtonIconPicker((prev) => !prev)}
                              className="w-full p-2 bg-white border border-zinc-200 hover:border-[#2848F0] rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors"
                            >
                              <span className="flex items-center gap-2 font-medium text-zinc-800">
                                {CurrentBtnIconComp ? (
                                  <>
                                    <CurrentBtnIconComp className="w-4 h-4 text-[#2848F0]" />
                                    <span>{currentBtnIcon}</span>
                                  </>
                                ) : (
                                  <span className="text-zinc-500">Sin icono (Haz clic para seleccionar)</span>
                                )}
                              </span>
                              {showButtonIconPicker ? (
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                              )}
                            </button>

                            {showButtonIconPicker && (
                              <div className="mt-2 p-2 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-2">
                                <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSelectedElement({}, { buttonIcon: '' });
                                      setShowButtonIconPicker(false);
                                    }}
                                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center text-[9px] font-semibold cursor-pointer transition-all ${
                                      !currentBtnIcon
                                        ? 'bg-[#2848F0] text-white shadow-2xs'
                                        : 'hover:bg-zinc-100 text-zinc-500 border border-zinc-100'
                                    }`}
                                    title="Sin icono"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  {CTA_BUTTON_ICONS.map((icName) => {
                                    const IcItem = (LucideIcons as any)[icName] || LucideIcons.ArrowRight;
                                    const isSel = currentBtnIcon === icName;
                                    return (
                                      <button
                                        key={icName}
                                        type="button"
                                        onClick={() => {
                                          updateSelectedElement({}, { buttonIcon: icName });
                                          setShowButtonIconPicker(false);
                                        }}
                                        className={`p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                          isSel
                                            ? 'bg-[#2848F0] text-white shadow-2xs ring-2 ring-[#2848F0]/30'
                                            : 'hover:bg-zinc-100 text-zinc-700 border border-zinc-100'
                                        }`}
                                        title={icName}
                                      >
                                        <IcItem className="w-4 h-4 shrink-0" />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* POSICIÓN DEL ICONO */}
                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Posición del icono:</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({}, { buttonIconPosition: 'before' })}
                                className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                  (selectedElement.content.buttonIconPosition || 'before') === 'before'
                                    ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                }`}
                              >
                                Adelante del texto
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({}, { buttonIconPosition: 'after' })}
                                className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                  selectedElement.content.buttonIconPosition === 'after'
                                    ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                }`}
                              >
                                Después del texto
                              </button>
                            </div>
                          </div>

                          {/* TAMAÑO DEL ICONO */}
                          <InlineSliderInput
                            label="Tamaño del icono:"
                            value={
                              selectedElement.content.buttonIconSize ??
                              Math.max(14, Math.round((selectedElement.styles.fontSize || 16) * 1.05))
                            }
                            min={10}
                            max={64}
                            inputMin={8}
                            unit="px"
                            onChange={(val) => updateSelectedElement({}, { buttonIconSize: val })}
                          />

                          {/* ESPACIADO ENTRE ICONO Y TEXTO */}
                          <InlineSliderInput
                            label="Espaciado entre icono y texto:"
                            value={selectedElement.content.buttonIconSpacing ?? 8}
                            min={0}
                            max={40}
                            unit="px"
                            onChange={(val) => updateSelectedElement({}, { buttonIconSpacing: val })}
                          />
                        </div>

                        {/* RELLENO DEL BOTÓN (INTERNO DESDE EL TEXTO HACIA LOS BORDES) */}
                        <div className="p-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl space-y-2">
                          <div>
                            <span className="font-semibold text-zinc-800 block text-xs">Relleno del botón:</span>
                            <span className="text-[10px] text-zinc-500">Espacio interno desde el texto hacia los bordes del botón</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-semibold text-zinc-600 block mb-1">Vertical (arriba/abajo)</label>
                              <FreeNumberInput
                                value={selectedElement.styles.buttonPaddingY ?? 14}
                                min={0}
                                unit="px"
                                inputClassName="text-center"
                                onChange={(val) => updateSelectedElement({ buttonPaddingY: val })}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-zinc-600 block mb-1">Horizontal (laterales)</label>
                              <FreeNumberInput
                                value={selectedElement.styles.buttonPaddingX ?? 28}
                                min={0}
                                unit="px"
                                inputClassName="text-center"
                                onChange={(val) => updateSelectedElement({ buttonPaddingX: val })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4. MULTIMEDIA - IMAGEN: EXACTAMENTE 5 GRUPOS ORDENADOS */}
                  {/* 1 Origen de la imagen, 2 Ajustes y Forma de Imagen, 3 Link de Imagen, 4 Borde Exterior de Imagen, 5 Disposición */}
                  {selectedElement.type === 'image' && (
                    <div className="space-y-3">
                      {/* 1. ORIGEN DE LA IMAGEN */}
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion('imageSource')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#2848F0]" />
                            1. Origen de la imagen
                          </span>
                          {openSections.imageSource ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        {openSections.imageSource && (
                          <div className="p-3 space-y-3.5 bg-white">
                            {/* File upload button triggering system file dialog */}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-2.5 px-3 bg-white border border-[#2848F0] text-[#2848F0] hover:bg-blue-50/70 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Subir imagen desde explorador</span>
                            </button>

                            {/* Direct URL input */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-semibold text-zinc-600">O pegar URL de imagen:</span>
                                <span className="text-[10px] text-zinc-400">Web / CDN</span>
                              </div>
                              <input
                                type="text"
                                value={selectedElement.content.src || ''}
                                onChange={(e) => updateSelectedElement({}, { src: e.target.value, alt: '' })}
                                placeholder="https://..."
                                className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
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
                              <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Texto alternativo (Alt / SEO):</label>
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
                                      alt: 'Reunión estratégica de equipo',
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
                                      alt: 'Consultora ejecutiva de negocios',
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
                                      alt: 'Panel de resultados y métricas de crecimiento',
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
                      </div>

                      {/* 2. AJUSTES Y FORMA DE IMAGEN (SIN ROTACIÓN, ANCHO Y ALTO CONECTADOS - IMAGEN 1) */}
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion('imageAdjustments')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-[#2848F0]" />
                            2. Ajustes y Forma de Imagen
                          </span>
                          {openSections.imageAdjustments ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        {openSections.imageAdjustments && (() => {
                          const curWidth = selectedElement.styles.imageWidth || 450;
                          const curFit = selectedElement.styles.imageFit || 'contain';
                          const curPosition = selectedElement.styles.imagePosition || 'center';
                          const curRepeat = selectedElement.styles.imageRepeat || 'no-repeat';

                          const handleWidthChange = (val: number) => {
                            const clampedWidth = Math.max(20, Math.min(2400, val));
                            updateSelectedElement({
                              imageWidth: clampedWidth,
                              imageHeight: undefined,
                            });
                          };

                          const handleResetSize = () => {
                            const currentSrc = selectedElement.content.src;
                            if (currentSrc) {
                              const probe = new window.Image();
                              probe.onload = () => {
                                const naturalW =
                                  probe.naturalWidth > 0
                                    ? Math.min(probe.naturalWidth, 1200)
                                    : 450;
                                updateSelectedElement({
                                  imageWidth: naturalW,
                                  imageHeight: undefined,
                                  imageFit: 'contain',
                                  imagePosition: 'center',
                                  imageRepeat: 'no-repeat',
                                });
                              };
                              probe.onerror = () => {
                                updateSelectedElement({
                                  imageWidth: 450,
                                  imageHeight: undefined,
                                  imageFit: 'contain',
                                  imagePosition: 'center',
                                  imageRepeat: 'no-repeat',
                                });
                              };
                              probe.src = currentSrc;
                            } else {
                              updateSelectedElement({
                                imageWidth: 450,
                                imageHeight: undefined,
                                imageFit: 'contain',
                                imagePosition: 'center',
                                imageRepeat: 'no-repeat',
                              });
                            }
                          };

                          return (
                            <div className="p-3 space-y-4 bg-white">
                              {/* ANCHO ÚNICO + RESTAURAR TAMAÑO ORIGINAL (ESCALADO PROPORCIONAL SIN RECORTES) */}
                              <div className="space-y-3 p-3 bg-zinc-50/70 border border-zinc-200 rounded-xl">
                                <span className="text-xs font-bold text-zinc-800 block">
                                  Tamaño de la imagen
                                </span>

                                <InlineSliderInput
                                  label="Ancho"
                                  value={curWidth}
                                  min={40}
                                  max={1200}
                                  inputMin={20}
                                  step={1}
                                  unit="px"
                                  onChange={handleWidthChange}
                                />

                                <button
                                  type="button"
                                  onClick={handleResetSize}
                                  className="w-full py-1.5 px-2 bg-white border border-zinc-200 hover:border-[#2848F0] hover:text-[#2848F0] rounded-lg text-[11px] font-semibold text-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <RotateCcw className="w-3 h-3 text-[#2848F0]" />
                                  <span>Restaurar tamaño original</span>
                                </button>
                              </div>

                              {/* ALINEACIÓN / CENTRADO EN LA COLUMNA */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1.5">
                                  Alineación de la imagen:
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateSelectedElement({ textAlign: 'left' })}
                                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all ${
                                      selectedElement.styles.textAlign === 'left'
                                        ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                                    }`}
                                  >
                                    Izquierda
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateSelectedElement({ textAlign: 'center' })}
                                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all ${
                                      !selectedElement.styles.textAlign ||
                                      selectedElement.styles.textAlign === 'center'
                                        ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                                    }`}
                                  >
                                    Centrado
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateSelectedElement({ textAlign: 'right' })}
                                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all ${
                                      selectedElement.styles.textAlign === 'right'
                                        ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                                    }`}
                                  >
                                    Derecha
                                  </button>
                                </div>
                              </div>

                              {/* AJUSTE DE TAMAÑO (COMPLETO/CONTENER, CUBRIR, ALARGADO, ORIGINAL) */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1.5">
                                  Ajuste de tamaño:
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { val: 'contain' as const, label: 'Completo (Contener)' },
                                    { val: 'cover' as const, label: 'Cubrir (Rellenar)' },
                                    { val: 'stretch' as const, label: 'Alargado (Estirar)' },
                                    { val: 'auto' as const, label: 'Tamaño Original' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.val}
                                      type="button"
                                      onClick={() =>
                                        updateSelectedElement({
                                          imageFit: opt.val,
                                          imageHeight: undefined,
                                        })
                                      }
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                                        curFit === opt.val
                                          ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* POSICIÓN DE LA IMAGEN (CENTRADO, ARRIBA, ABAJO, IZQUIERDA, DERECHA) */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1.5">
                                  Posición del encuadre:
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {[
                                    { val: 'center' as const, label: 'Centrado' },
                                    { val: 'top' as const, label: 'Arriba' },
                                    { val: 'bottom' as const, label: 'Abajo' },
                                    { val: 'left' as const, label: 'Izquierda' },
                                    { val: 'right' as const, label: 'Derecha' },
                                  ].map((pos) => (
                                    <button
                                      key={pos.val}
                                      type="button"
                                      onClick={() =>
                                        updateSelectedElement({ imagePosition: pos.val })
                                      }
                                      className={`py-1.5 px-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                                        curPosition === pos.val
                                          ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                                      }`}
                                    >
                                      {pos.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* REPETICIÓN / PATRÓN */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1.5">
                                  Repetir patrón:
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { val: 'no-repeat' as const, label: 'Sin repetir' },
                                    { val: 'repeat' as const, label: 'En patrón (Mosaico)' },
                                    { val: 'repeat-x' as const, label: 'Repetir horizontal' },
                                    { val: 'repeat-y' as const, label: 'Repetir vertical' },
                                  ].map((rep) => (
                                    <button
                                      key={rep.val}
                                      type="button"
                                      onClick={() => {
                                        const patch: Record<string, any> = {
                                          imageRepeat: rep.val,
                                          imageHeight: undefined,
                                        };
                                        if (rep.val !== 'no-repeat' && curFit !== 'auto') {
                                          patch.imageFit = 'auto';
                                        } else if (rep.val === 'no-repeat' && curFit === 'auto') {
                                          patch.imageFit = 'contain';
                                        }
                                        updateSelectedElement(patch);
                                      }}
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                                        curRepeat === rep.val
                                          ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-2xs'
                                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                                      }`}
                                    >
                                      {rep.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* BORDES REDONDEADOS (RADIO) */}
                              <div className="space-y-2 pt-1 border-t border-zinc-100">
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
                                    onClick={() =>
                                      updateSelectedElement({
                                        borderRadius: 0,
                                        ...(curFit === 'cover' &&
                                        (selectedElement.styles.borderRadius || 0) >= 150
                                          ? { imageFit: 'contain' }
                                          : {}),
                                      })
                                    }
                                    className={`flex-1 py-1 px-1.5 border rounded text-[11px] font-semibold cursor-pointer ${
                                      (selectedElement.styles.borderRadius || 0) === 0
                                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                        : 'border-zinc-200 bg-white text-zinc-700'
                                    }`}
                                  >
                                    Cuadrado (0)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedElement({
                                        borderRadius: 16,
                                        ...(curFit === 'cover' &&
                                        (selectedElement.styles.borderRadius || 0) >= 150
                                          ? { imageFit: 'contain' }
                                          : {}),
                                      })
                                    }
                                    className={`flex-1 py-1 px-1.5 border rounded text-[11px] font-semibold cursor-pointer ${
                                      selectedElement.styles.borderRadius === 16
                                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                        : 'border-zinc-200 bg-white text-zinc-700'
                                    }`}
                                  >
                                    Suave (16px)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedElement({
                                        borderRadius: 999,
                                        imageFit: 'cover',
                                      })
                                    }
                                    className={`flex-1 py-1 px-1.5 border rounded text-[11px] font-semibold cursor-pointer ${
                                      (selectedElement.styles.borderRadius || 0) >= 150
                                        ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                        : 'border-zinc-200 bg-white text-zinc-700'
                                    }`}
                                  >
                                    Círculo (Avatar)
                                  </button>
                                </div>
                              </div>

                              {/* SOMBRA Y OPACIDAD */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1">
                                    Sombra:
                                  </label>
                                  <select
                                    value={selectedElement.styles.shadow || 'none'}
                                    onChange={(e) =>
                                      updateSelectedElement({ shadow: e.target.value as any })
                                    }
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
                                  <label className="font-semibold text-zinc-700 block mb-1">
                                    Opacidad:
                                  </label>
                                  <select
                                    value={String(
                                      [1, 0.9, 0.8, 0.7, 0.5, 0.4, 0.2].includes(
                                        Number(selectedElement.styles.opacity ?? 1)
                                      )
                                        ? Number(selectedElement.styles.opacity ?? 1)
                                        : 1
                                    )}
                                    onChange={(e) =>
                                      updateSelectedElement({ opacity: parseFloat(e.target.value) })
                                    }
                                    className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                                  >
                                    <option value="1">100% (Normal)</option>
                                    <option value="0.9">90%</option>
                                    <option value="0.8">80%</option>
                                    <option value="0.7">70%</option>
                                    <option value="0.5">50%</option>
                                    <option value="0.4">40%</option>
                                    <option value="0.2">20%</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* 3. LINK DE IMAGEN */}
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion('imageLink')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <LinkIcon className="w-3.5 h-3.5 text-[#2848F0]" />
                            3. LINK DE IMAGEN
                          </span>
                          {openSections.imageLink ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        {openSections.imageLink && (
                          <div className="p-3 space-y-3 bg-white">
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">URL de destino al hacer clic:</label>
                              <input
                                type="text"
                                value={selectedElement.styles.linkUrl || selectedElement.content.linkUrl || ''}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  updateSelectedElement({ linkUrl: url }, { linkUrl: url });
                                }}
                                placeholder="https://ejemplo.com/pagina-oferta"
                                className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                              />
                              <p className="text-[10px] text-zinc-400 mt-1">
                                Si se deja en blanco no pasa nada con el clic.
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-semibold text-zinc-700">Abrir en nueva ventana / pestaña:</span>
                              <input
                                type="checkbox"
                                checked={selectedElement.styles.linkOpenNewTab ?? selectedElement.content.linkOpenNewTab ?? true}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  updateSelectedElement({ linkOpenNewTab: checked }, { linkOpenNewTab: checked });
                                }}
                                className="w-4 h-4 text-[#2848F0] rounded cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 4. BORDE EXTERIOR DE IMAGEN */}
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion('imageBorder')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-emerald-600" />
                            4. Borde Exterior de Imagen
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
                    </div>
                  )}

                  {/* 5. MULTIMEDIA - VIDEO: ORIGEN, AJUSTES, OPCIONES, COVER PORTADA */}
                  {selectedElement.type === 'video' && (() => {
                    const rawVideoSource = selectedElement.content.videoSource;
                    const effectiveVideoSource: 'youtube' | 'vimeo' | 'wistia' | 'external' | 'upload' =
                      rawVideoSource === 'vimeo' ||
                      rawVideoSource === 'wistia' ||
                      rawVideoSource === 'external' ||
                      rawVideoSource === 'upload'
                        ? rawVideoSource
                        : 'youtube';

                    const videoUrlPlaceholder =
                      effectiveVideoSource === 'vimeo'
                        ? 'https://vimeo.com/...'
                        : effectiveVideoSource === 'wistia'
                        ? 'https://fast.wistia.net/medias/...'
                        : effectiveVideoSource === 'external'
                        ? 'https://ejemplo.com/video.mp4'
                        : 'https://www.youtube.com/watch?v=...';

                    const handleVideoDrop = (ev: React.DragEvent<HTMLDivElement>) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setIsDraggingVideoFile(false);
                      const file = ev.dataTransfer.files?.[0];
                      if (!file) return;
                      const validExt = /\.(mp4|avi|mov|webm|mkv)$/i.test(file.name);
                      const validMime = /^video\/(mp4|webm|quicktime|x-msvideo|avi|msvideo|x-matroska)/i.test(file.type);
                      if (!validExt && !validMime) {
                        showToast('Formato no permitido. Sube un video MP4, AVI, MOV, WebM o MKV');
                        return;
                      }
                      const objectUrl = URL.createObjectURL(file);
                      updateSelectedElement(
                        {},
                        {
                          videoUrl: objectUrl,
                          videoFileName: file.name,
                          videoSource: 'upload',
                        }
                      );
                      showToast(`Video "${file.name}" cargado correctamente`);
                    };

                    const handleVideoCoverDrop = (ev: React.DragEvent<HTMLDivElement>) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setIsDraggingVideoCover(false);
                      const file = ev.dataTransfer.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/') && !/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(file.name)) {
                        showToast('Selecciona un archivo de imagen válido');
                        return;
                      }
                      if (file.size <= 2 * 1024 * 1024) {
                        const reader = new FileReader();
                        reader.onload = (uploadEv) => {
                          const dataUrl = uploadEv.target?.result as string;
                          if (dataUrl) {
                            updateSelectedElement({}, { videoCoverImage: dataUrl, videoCoverType: 'image' });
                            showToast('Imagen de portada cargada correctamente');
                          }
                        };
                        reader.readAsDataURL(file);
                      } else {
                        const objectUrl = URL.createObjectURL(file);
                        updateSelectedElement({}, { videoCoverImage: objectUrl, videoCoverType: 'image' });
                        showToast('Imagen de portada cargada correctamente');
                      }
                    };

                    const currentCoverBgType = selectedElement.content.videoCoverBgType || 'solid';

                    return (
                      <div className="space-y-3">
                        {/* ORIGEN DE VIDEO */}
                        <div className="border border-zinc-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleAccordion('videoSource')}
                            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-red-500" />
                              Origen del Video
                            </span>
                            {openSections.videoSource ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>

                          {openSections.videoSource && (
                            <div className="p-3 space-y-3 bg-white">
                              {/* Desplegable de Fuente (sin Alojado en el servidor y con Subir Video al final) */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Fuente</label>
                                <select
                                  value={effectiveVideoSource}
                                  onChange={(e) => {
                                    const nextSource = e.target.value as 'youtube' | 'vimeo' | 'wistia' | 'external' | 'upload';
                                    updateSelectedElement(
                                      {},
                                      {
                                        videoSource: nextSource,
                                        videoUrl: '',
                                        videoFileName: '',
                                      }
                                    );
                                  }}
                                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0] cursor-pointer"
                                >
                                  <option value="youtube">YouTube</option>
                                  <option value="vimeo">Vimeo</option>
                                  <option value="wistia">Wistia</option>
                                  <option value="external">Video Externo</option>
                                  <option value="upload">Subir Video</option>
                                </select>
                              </div>

                              {effectiveVideoSource === 'upload' ? (
                                <div className="space-y-2">
                                  <label className="font-semibold text-zinc-700 block text-[11px]">
                                    Subir archivo de video (MP4, AVI, MOV, WebM, MKV):
                                  </label>

                                  <div
                                    onDragOver={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      setIsDraggingVideoFile(true);
                                    }}
                                    onDragLeave={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      setIsDraggingVideoFile(false);
                                    }}
                                    onDrop={handleVideoDrop}
                                    onClick={() => videoFileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                                      isDraggingVideoFile
                                        ? 'border-[#2848F0] bg-blue-50/70'
                                        : 'border-zinc-300 bg-zinc-50/70 hover:border-[#2848F0] hover:bg-blue-50/30'
                                    }`}
                                  >
                                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                      <Upload className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-semibold text-zinc-800">
                                        Arrastra tu video aquí o haz clic para subir
                                      </p>
                                      <p className="text-[10px] text-zinc-500">
                                        Formatos soportados: MP4, AVI, MOV, WebM, MKV
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        videoFileInputRef.current?.click();
                                      }}
                                      className="mt-1 px-3 py-1.5 bg-[#2848F0] hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Subir video</span>
                                    </button>
                                  </div>

                                  {selectedElement.content.videoUrl && (
                                    <div className="flex items-center justify-between gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="text-[11px] font-semibold text-emerald-900 truncate">
                                          {selectedElement.content.videoFileName || 'Video cargado'}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateSelectedElement(
                                            {},
                                            { videoUrl: '', videoFileName: '' }
                                          )
                                        }
                                        className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer shrink-0 transition-colors"
                                        title="Quitar archivo de video"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">URL del video:</label>
                                    <input
                                      type="text"
                                      value={selectedElement.content.videoUrl || ''}
                                      onChange={(e) => updateSelectedElement({}, { videoUrl: e.target.value })}
                                      placeholder={videoUrlPlaceholder}
                                      className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedElement({}, {
                                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                        videoFileName: '',
                                        videoSource: 'youtube',
                                      })
                                    }
                                    className="w-full py-2 text-[11px] font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:text-[#2848F0] cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                                  >
                                    <RefreshCw className="w-3 h-3 text-[#2848F0]" />
                                    <span>Cargar enlace de video de prueba (YouTube)</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* AJUSTES DEL REPRODUCTOR */}
                        <div className="border border-zinc-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleAccordion('videoSettings')}
                            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5 text-red-500" />
                              Ajustes del Reproductor
                            </span>
                            {openSections.videoSettings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>

                          {openSections.videoSettings && (
                            <div className="p-3 space-y-3.5 bg-white">
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Relación de aspecto (Formato):</label>
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

                              {/* BORDES: Espesor, Tipo, Color */}
                              <div className="space-y-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                                <span className="text-xs font-bold text-zinc-800 block">Bordes del reproductor</span>
                                <NumberControl
                                  label="Espesor de borde"
                                  value={selectedElement.styles.borderWidth || 0}
                                  min={0}
                                  max={20}
                                  onChange={(val) => updateSelectedElement({ borderWidth: val })}
                                />
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Tipo de borde:</label>
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
                                <HexColorPicker
                                  label="Color de borde:"
                                  value={selectedElement.styles.borderColor || '#18181b'}
                                  onChange={(val) => updateSelectedElement({ borderColor: val })}
                                />
                              </div>

                              {/* Bordes redondeados en la misma fila para ahorrar espacio */}
                              <InlineSliderInput
                                label="Bordes redondeados (Radio):"
                                value={selectedElement.styles.borderRadius ?? 0}
                                min={0}
                                max={48}
                                unit="px"
                                onChange={(val) => updateSelectedElement({ borderRadius: val })}
                              />

                              {/* Ancho máximo del reproductor: seleccionable y con input para introducir número */}
                              <div className="space-y-1.5">
                                <label className="font-semibold text-zinc-700 block text-[11px]">Ancho máximo del reproductor:</label>
                                <div className="grid grid-cols-4 gap-1">
                                  {['480px', '640px', '750px', '100%'].map((w) => (
                                    <button
                                      key={w}
                                      type="button"
                                      onClick={() => updateSelectedElement({ maxWidth: w })}
                                      className={`py-1 px-1 border rounded text-[11px] font-semibold cursor-pointer ${
                                        selectedElement.styles.maxWidth === w
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                                      }`}
                                    >
                                      {w}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex items-center gap-1.5 pt-1">
                                  <span className="text-[10px] text-zinc-500 shrink-0">O escribir valor:</span>
                                  <input
                                    type="text"
                                    value={selectedElement.styles.maxWidth || '750px'}
                                    onChange={(e) => updateSelectedElement({ maxWidth: e.target.value })}
                                    placeholder="Ej: 750px o 85%"
                                    className="flex-1 p-1.5 text-xs border border-zinc-200 rounded-lg bg-white font-mono focus:outline-[#2848F0]"
                                  />
                                </div>
                              </div>

                              {/* Alineación */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Alineación del video:</label>
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

                        {/* OPCIONES DEL VIDEO: AUTOREPRODUCIR, SILENCIAR, BUCLE */}
                        <div className="border border-zinc-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleAccordion('videoOptions')}
                            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                              OPCIONES DEL VIDEO
                            </span>
                            {openSections.videoOptions ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>

                          {openSections.videoOptions && (
                            <div className="p-3 space-y-2.5 bg-white text-xs">
                              <label className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
                                <div>
                                  <span className="font-semibold text-zinc-800 block">Autoreproducir (Autoplay)</span>
                                  <span className="text-[10px] text-zinc-400">Iniciar automáticamente al cargar la página</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selectedElement.content.videoAutoplay ?? false}
                                  onChange={(e) => updateSelectedElement({}, { videoAutoplay: e.target.checked })}
                                  className="w-4 h-4 text-[#2848F0] rounded cursor-pointer"
                                />
                              </label>

                              <label className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
                                <div>
                                  <span className="font-semibold text-zinc-800 block">Silenciar video (Mute)</span>
                                  <span className="text-[10px] text-zinc-400">Requerido por navegadores para autoplay sin sonido</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selectedElement.content.videoMuted ?? false}
                                  onChange={(e) => updateSelectedElement({}, { videoMuted: e.target.checked })}
                                  className="w-4 h-4 text-[#2848F0] rounded cursor-pointer"
                                />
                              </label>

                              <label className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
                                <div>
                                  <span className="font-semibold text-zinc-800 block">Bucle infinito (Loop)</span>
                                  <span className="text-[10px] text-zinc-400">Reiniciar el video inmediatamente al terminar</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selectedElement.content.videoLoop ?? false}
                                  onChange={(e) => updateSelectedElement({}, { videoLoop: e.target.checked })}
                                  className="w-4 h-4 text-[#2848F0] rounded cursor-pointer"
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        {/* COVER PORTADA */}
                        <div className="border border-zinc-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleAccordion('videoCover')}
                            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              COVER PORTADA
                            </span>
                            {openSections.videoCover ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>

                          {openSections.videoCover && (
                            <div className="p-3 space-y-3.5 bg-white text-xs">
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1">Tipo de Portada:</label>
                                <div className="grid grid-cols-3 gap-1">
                                  {[
                                    { id: 'none', label: 'Sin Portada' },
                                    { id: 'image', label: 'Subir Imagen' },
                                    { id: 'custom', label: 'Sin Imagen con CTA' },
                                  ].map((tab) => (
                                    <button
                                      key={tab.id}
                                      type="button"
                                      onClick={() => updateSelectedElement({}, { videoCoverType: tab.id as any })}
                                      className={`py-1.5 px-1 rounded-lg border text-[11px] font-semibold text-center cursor-pointer transition-colors ${
                                        (selectedElement.content.videoCoverType || 'none') === tab.id
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                                      }`}
                                    >
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* OPCIÓN 1: SUBIR IMAGEN (DRAG & DROP + EXPLORADOR + URL OPCIONAL) */}
                              {selectedElement.content.videoCoverType === 'image' && (
                                <div className="space-y-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">
                                      Imagen de Portada:
                                    </label>
                                    <div
                                      onDragOver={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        setIsDraggingVideoCover(true);
                                      }}
                                      onDragLeave={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        setIsDraggingVideoCover(false);
                                      }}
                                      onDrop={handleVideoCoverDrop}
                                      onClick={() => videoCoverInputRef.current?.click()}
                                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                                        isDraggingVideoCover
                                          ? 'border-[#2848F0] bg-blue-50/70'
                                          : 'border-zinc-300 bg-white hover:border-[#2848F0] hover:bg-blue-50/30'
                                      }`}
                                    >
                                      <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2848F0] flex items-center justify-center">
                                        <ImagePlus className="w-4 h-4" />
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-semibold text-zinc-800">
                                          Arrastra y suelta tu imagen aquí
                                        </p>
                                        <p className="text-[10px] text-zinc-500">
                                          JPG, PNG, WEBP o GIF
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(ev) => {
                                          ev.stopPropagation();
                                          videoCoverInputRef.current?.click();
                                        }}
                                        className="mt-1 px-3 py-1.5 bg-[#2848F0] hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                      >
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Seleccionar imagen</span>
                                      </button>
                                    </div>
                                  </div>

                                  {selectedElement.content.videoCoverImage && (
                                    <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-white p-1.5 flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <img
                                          src={selectedElement.content.videoCoverImage}
                                          alt="Vista previa portada"
                                          className="w-12 h-8 object-cover rounded border border-zinc-200 shrink-0"
                                        />
                                        <span className="text-[11px] font-medium text-zinc-700 truncate">
                                          Portada activa
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => updateSelectedElement({}, { videoCoverImage: '' })}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer shrink-0"
                                        title="Quitar imagen de portada"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}

                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      O pegar URL de imagen:
                                    </label>
                                    <input
                                      type="text"
                                      value={selectedElement.content.videoCoverImage || ''}
                                      onChange={(e) => updateSelectedElement({}, { videoCoverImage: e.target.value })}
                                      placeholder="https://images.unsplash.com/..."
                                      className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-mono"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSelectedElement({}, {
                                        videoCoverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
                                      })
                                    }
                                    className="w-full py-1.5 text-[11px] bg-white border border-zinc-200 rounded-lg hover:border-[#2848F0] text-zinc-700 cursor-pointer"
                                  >
                                    Cargar imagen de muestra
                                  </button>
                                </div>
                              )}

                              {/* OPCIÓN 2: SIN IMAGEN CON CTA */}
                              {selectedElement.content.videoCoverType === 'custom' && (
                                <div className="space-y-4">
                                  <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-[#2848F0]">
                                    Diseño de portada interactiva con llamada a la acción (CTA). Al hacer clic se oculta y arranca el video de inmediato.
                                  </div>

                                  {/* ICONO DE PLAY */}
                                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                                    <div className="font-bold text-zinc-800 text-xs">
                                      <span>Icono de Play</span>
                                    </div>

                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[11px] font-semibold text-zinc-700">Forma del icono:</label>
                                        <span className="text-[10px] text-zinc-500 font-mono">
                                          {selectedElement.content.videoCoverPlayIcon || 'play'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white rounded-lg border border-zinc-200">
                                        {[
                                          { id: 'play', label: 'Play', icon: Play, fill: true },
                                          { id: 'play_circle', label: 'Círculo', icon: PlayCircle },
                                          { id: 'play_square', label: 'Cuadrado', icon: Square },
                                          { id: 'video', label: 'Video', icon: Video },
                                          { id: 'film', label: 'Película', icon: Film },
                                          { id: 'tv', label: 'Pantalla', icon: Tv },
                                          { id: 'sparkle', label: 'Destello', icon: Sparkles },
                                          { id: 'flame', label: 'Fuego', icon: Flame, fill: true },
                                          { id: 'zap', label: 'Rayo', icon: Zap, fill: true },
                                          { id: 'volume_2', label: 'Sonido', icon: Volume2 },
                                          { id: 'eye', label: 'Ver', icon: Eye },
                                          { id: 'heart', label: 'Corazón', icon: Heart, fill: true },
                                        ].map((ic) => {
                                          const IconComp = ic.icon;
                                          const isSelected = (selectedElement.content.videoCoverPlayIcon || 'play') === ic.id;
                                          return (
                                            <button
                                              key={ic.id}
                                              type="button"
                                              onClick={() => updateSelectedElement({}, { videoCoverPlayIcon: ic.id as any })}
                                              className={`p-1.5 rounded-md border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                                isSelected
                                                  ? 'bg-[#2848F0] text-white border-[#2848F0] shadow-xs'
                                                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                                              }`}
                                              title={ic.label}
                                            >
                                              <IconComp className={`w-4 h-4 ${ic.fill ? 'fill-current' : ''}`} />
                                              <span className="text-[9px] font-medium truncate max-w-full">{ic.label}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Forma del botón:</label>
                                      <div className="grid grid-cols-3 gap-1">
                                        {[
                                          { id: 'circle', label: 'Círculo' },
                                          { id: 'rounded', label: 'Redondeado' },
                                          { id: 'square', label: 'Cuadrado' },
                                        ].map((sh) => (
                                          <button
                                            key={sh.id}
                                            type="button"
                                            onClick={() => updateSelectedElement({}, { videoCoverButtonShape: sh.id as any })}
                                            className={`py-1 text-[10px] border font-semibold cursor-pointer ${
                                              sh.id === 'square' ? 'rounded-none' : 'rounded'
                                            } ${
                                              (selectedElement.content.videoCoverButtonShape || 'circle') === sh.id
                                                ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                            }`}
                                          >
                                            {sh.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Selectores de color uno arriba del otro */}
                                    <div className="space-y-2.5">
                                      <HexColorPicker
                                        label="Color del Icono:"
                                        value={selectedElement.content.videoCoverPlayColor || '#FFFFFF'}
                                        onChange={(val) => updateSelectedElement({}, { videoCoverPlayColor: val })}
                                      />
                                      <HexColorPicker
                                        label="Color del Botón:"
                                        value={selectedElement.content.videoCoverPlayBg || '#FF5A5F'}
                                        onChange={(val) => updateSelectedElement({}, { videoCoverPlayBg: val })}
                                      />
                                    </div>

                                    <InlineSliderInput
                                      label="Tamaño del botón:"
                                      value={selectedElement.content.videoCoverPlaySize || 56}
                                      min={36}
                                      max={96}
                                      inputMin={20}
                                      step={2}
                                      unit="px"
                                      onChange={(val) => updateSelectedElement({}, { videoCoverPlaySize: val })}
                                    />
                                  </div>

                                  {/* TEXTO ARRIBA DEL ICONO DE PLAY */}
                                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2.5">
                                    <div className="font-bold text-zinc-800 flex items-center justify-between">
                                      <span>Texto Superior</span>
                                      <span className="text-[10px] text-zinc-400">Encima de play</span>
                                    </div>

                                    <div>
                                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Texto:</label>
                                      <input
                                        type="text"
                                        value={selectedElement.content.videoCoverText ?? 'DALE CLICK AQUÍ'}
                                        onChange={(e) => updateSelectedElement({}, { videoCoverText: e.target.value })}
                                        placeholder="Click Aquí Para Reproducir"
                                        className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Fuente:</label>
                                        <select
                                          value={selectedElement.content.videoCoverTextFont || 'Poppins'}
                                          onChange={(e) => updateSelectedElement({}, { videoCoverTextFont: e.target.value })}
                                          className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                                        >
                                          {AVAILABLE_FONTS.map((f) => (
                                            <option key={f.value} value={f.value}>
                                              {f.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Formato:</label>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement({}, {
                                              videoCoverTextBold: !(selectedElement.content.videoCoverTextBold ?? true),
                                            })
                                          }
                                          className={`w-full py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                                            (selectedElement.content.videoCoverTextBold ?? true)
                                              ? 'bg-blue-50 text-[#2848F0] border-blue-200'
                                              : 'bg-white text-zinc-600 border-zinc-200'
                                          }`}
                                        >
                                          {(selectedElement.content.videoCoverTextBold ?? true) ? 'Negrita Activa' : 'Normal'}
                                        </button>
                                      </div>
                                    </div>

                                    <InlineSliderInput
                                      label="Tamaño del texto:"
                                      value={selectedElement.content.videoCoverTextSize || 22}
                                      min={12}
                                      max={36}
                                      inputMin={8}
                                      unit="px"
                                      onChange={(val) => updateSelectedElement({}, { videoCoverTextSize: val })}
                                    />

                                    {/* Selectores de color uno arriba del otro */}
                                    <div className="space-y-2.5">
                                      <HexColorPicker
                                        label="Color de Texto:"
                                        value={selectedElement.content.videoCoverTextColor || '#121111'}
                                        onChange={(val) => updateSelectedElement({}, { videoCoverTextColor: val })}
                                      />
                                      <HexColorPicker
                                        label="Color de fondo:"
                                        value={selectedElement.content.videoCoverTextBg || '#FFFFFF'}
                                        onChange={(val) => updateSelectedElement({}, { videoCoverTextBg: val })}
                                      />
                                    </div>
                                  </div>

                                  {/* FLECHA QUE SEÑALA EL BOTÓN DE PLAY */}
                                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2.5">
                                    <div className="font-bold text-zinc-800 flex items-center justify-between">
                                      <span>Flecha Señalizadora</span>
                                      <span className="text-[10px] text-zinc-400">Apunta al play</span>
                                    </div>

                                    <div>
                                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Forma de la Flecha:</label>
                                      <div className="grid grid-cols-4 gap-1">
                                        {[
                                          { id: 'curved', label: 'Curva' },
                                          { id: 'straight', label: 'Recta' },
                                          { id: 'corner', label: 'Esquina' },
                                          { id: 'hand', label: 'Puntero' },
                                        ].map((arr) => (
                                          <button
                                            key={arr.id}
                                            type="button"
                                            onClick={() => updateSelectedElement({}, { videoCoverArrowType: arr.id as any })}
                                            className={`py-1 text-[10px] rounded border font-medium cursor-pointer ${
                                              (selectedElement.content.videoCoverArrowType || 'curved') === arr.id
                                                ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                                : 'bg-white text-zinc-700 border-zinc-200'
                                            }`}
                                          >
                                            {arr.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Color de la flecha en su propia fila arriba de Tamaño */}
                                    <div className="space-y-2.5">
                                      <HexColorPicker
                                        label="Color de la Flecha:"
                                        value={selectedElement.content.videoCoverArrowColor || '#121111'}
                                        onChange={(val) => updateSelectedElement({}, { videoCoverArrowColor: val })}
                                      />

                                      <InlineSliderInput
                                        label="Tamaño:"
                                        value={selectedElement.content.videoCoverArrowSize || 26}
                                        min={16}
                                        max={54}
                                        inputMin={8}
                                        unit="px"
                                        onChange={(val) => updateSelectedElement({}, { videoCoverArrowSize: val })}
                                      />
                                    </div>

                                    {/* ROTACIÓN SOBRE SU EJE MEDIO */}
                                    <InlineSliderInput
                                      label="Girar sobre su eje medio:"
                                      value={selectedElement.content.videoCoverArrowRotation || 0}
                                      min={0}
                                      max={360}
                                      strictMax={true}
                                      step={5}
                                      unit="°"
                                      onChange={(val) => updateSelectedElement({}, { videoCoverArrowRotation: val })}
                                    />
                                  </div>

                                  {/* FONDO (SÓLIDO, GRADIENTE DE 2 COLORES, PATRÓN DE 2 COLORES) */}
                                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2.5">
                                    <div className="font-bold text-zinc-800 flex items-center justify-between">
                                      <span>Fondo del Cover</span>
                                      <span className="text-[10px] text-zinc-400">Color y Opacidad</span>
                                    </div>

                                    <div>
                                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Tipo de Fondo:</label>
                                      <div className="grid grid-cols-3 gap-1">
                                        {[
                                          { id: 'solid', label: 'Sólido' },
                                          { id: 'gradient', label: 'Gradiente' },
                                          { id: 'pattern', label: 'Patrón' },
                                        ].map((bg) => (
                                          <button
                                            key={bg.id}
                                            type="button"
                                            onClick={() => updateSelectedElement({}, { videoCoverBgType: bg.id as any })}
                                            className={`py-1 text-[10px] rounded border font-medium cursor-pointer ${
                                              currentCoverBgType === bg.id
                                                ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                                : 'bg-white text-zinc-700 border-zinc-200'
                                            }`}
                                          >
                                            {bg.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Selectores de color apilados uno arriba del otro */}
                                    <div className="space-y-2.5">
                                      {currentCoverBgType === 'solid' && (
                                        <HexColorPicker
                                          label="Color del Fondo:"
                                          value={selectedElement.content.videoCoverBgColor || '#F4F4F5'}
                                          onChange={(val) => updateSelectedElement({}, { videoCoverBgColor: val })}
                                        />
                                      )}

                                      {currentCoverBgType === 'gradient' && (
                                        <>
                                          <HexColorPicker
                                            label="Color 1 del Gradiente:"
                                            value={selectedElement.content.videoCoverBgColor || '#F4F4F5'}
                                            onChange={(val) => updateSelectedElement({}, { videoCoverBgColor: val })}
                                          />
                                          <HexColorPicker
                                            label="Color 2 del Gradiente:"
                                            value={selectedElement.content.videoCoverBgColor2 || '#18181B'}
                                            onChange={(val) => updateSelectedElement({}, { videoCoverBgColor2: val })}
                                          />
                                        </>
                                      )}

                                      {currentCoverBgType === 'pattern' && (
                                        <>
                                          <HexColorPicker
                                            label="Color de Fondo:"
                                            value={selectedElement.content.videoCoverBgColor || '#F4F4F5'}
                                            onChange={(val) => updateSelectedElement({}, { videoCoverBgColor: val })}
                                          />
                                          <HexColorPicker
                                            label="Color del Patrón:"
                                            value={selectedElement.content.videoCoverBgColor2 || '#94A3B8'}
                                            onChange={(val) => updateSelectedElement({}, { videoCoverBgColor2: val })}
                                          />
                                        </>
                                      )}
                                    </div>

                                    <InlineSliderInput
                                      label="Opacidad del Fondo:"
                                      value={selectedElement.content.videoCoverBgOpacity ?? 100}
                                      min={0}
                                      max={100}
                                      strictMax={true}
                                      unit="%"
                                      onChange={(val) => updateSelectedElement({}, { videoCoverBgOpacity: val })}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
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
                        strictMax={true}
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
                    <div className="space-y-3 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                      <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                        <span>Altura del Espaciador</span>
                      </label>
                      <InlineSliderInput
                        value={selectedElement.content.spacerHeight || 40}
                        min={10}
                        max={200}
                        inputMin={1}
                        step={5}
                        unit="px"
                        accentClassName="accent-teal-600"
                        onChange={(val) => updateSelectedElement({}, { spacerHeight: val })}
                      />
                    </div>
                  )}

                  {/* 11. CONTENT FOR AUDIO / MUSIC PLAYER */}
                  {selectedElement.type === 'audio' && (() => {
                    const rawSource = selectedElement.content.audioSource;
                    const effectiveSource: 'soundcloud' | 'spotify' | 'external' | 'upload' =
                      rawSource === 'spotify' || selectedElement.content.audioType === 'spotify'
                        ? 'spotify'
                        : rawSource === 'soundcloud' || selectedElement.content.audioType === 'soundcloud'
                        ? 'soundcloud'
                        : rawSource === 'upload'
                        ? 'upload'
                        : 'external';
                    const isDirectAudio = effectiveSource === 'external' || effectiveSource === 'upload';
                    const currentBgType = selectedElement.content.audioBgType || 'solid';

                    const handleAudioDrop = (ev: React.DragEvent<HTMLDivElement>) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setIsDraggingAudioFile(false);
                      const file = ev.dataTransfer.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('audio/') && !/\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name)) {
                        showToast('Selecciona un archivo de audio válido (MP3, WAV, OGG, M4A)');
                        return;
                      }
                      const cleanName = file.name.replace(/\.[^/.]+$/, '');
                      const shouldUpdateTitle =
                        !selectedElement.content.audioTitle ||
                        selectedElement.content.audioTitle === 'Audio Explicativo / Música';
                      if (file.size <= 2 * 1024 * 1024) {
                        const reader = new FileReader();
                        reader.onload = (uploadEv) => {
                          const dataUrl = uploadEv.target?.result as string;
                          if (dataUrl) {
                            updateSelectedElement(
                              {},
                              {
                                audioUrl: dataUrl,
                                audioFileName: file.name,
                                audioSource: 'upload',
                                audioType: 'direct',
                                ...(shouldUpdateTitle ? { audioTitle: cleanName } : {}),
                              }
                            );
                            showToast(`Audio "${file.name}" cargado correctamente`);
                          }
                        };
                        reader.readAsDataURL(file);
                      } else {
                        const objectUrl = URL.createObjectURL(file);
                        updateSelectedElement(
                          {},
                          {
                            audioUrl: objectUrl,
                            audioFileName: file.name,
                            audioSource: 'upload',
                            audioType: 'direct',
                            ...(shouldUpdateTitle ? { audioTitle: cleanName } : {}),
                          }
                        );
                        showToast(`Audio "${file.name}" cargado correctamente`);
                      }
                    };

                    return (
                      <div className="space-y-3">
                        {/* A. ORIGEN DE AUDIO */}
                        <div className="border border-zinc-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleAccordion('audioSettings')}
                            className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <Music className="w-3.5 h-3.5 text-amber-600" />
                              Origen de Audio
                            </span>
                            {openSections.audioSettings ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {openSections.audioSettings && (
                            <div className="p-3 space-y-3 bg-white text-xs">
                              {/* Desplegable Fuente (sin numeración ni Alojado en Servidor) */}
                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Fuente</label>
                                <select
                                  value={effectiveSource}
                                  onChange={(e) => {
                                    const src = e.target.value as 'soundcloud' | 'spotify' | 'external' | 'upload';
                                    const mappedType =
                                      src === 'spotify'
                                        ? 'spotify'
                                        : src === 'soundcloud'
                                        ? 'soundcloud'
                                        : 'direct';
                                    updateSelectedElement(
                                      {},
                                      {
                                        audioSource: src,
                                        audioType: mappedType,
                                        audioUrl: '',
                                        audioFileName: '',
                                      }
                                    );
                                  }}
                                  className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0] cursor-pointer"
                                >
                                  <option value="soundcloud">SoundCloud</option>
                                  <option value="spotify">Spotify</option>
                                  <option value="external">Audio Externo</option>
                                  <option value="upload">Subir Audio</option>
                                </select>
                              </div>

                              {/* Subir Audio: Zona de arrastrar y botón de subida */}
                              {effectiveSource === 'upload' ? (
                                <div className="space-y-2">
                                  <label className="font-semibold text-zinc-700 block text-[11px]">
                                    Archivo de audio (MP3, WAV, OGG):
                                  </label>

                                  <div
                                    onDragOver={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      setIsDraggingAudioFile(true);
                                    }}
                                    onDragLeave={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      setIsDraggingAudioFile(false);
                                    }}
                                    onDrop={handleAudioDrop}
                                    onClick={() => audioFileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                                      isDraggingAudioFile
                                        ? 'border-[#2848F0] bg-blue-50/70'
                                        : 'border-zinc-300 bg-zinc-50/70 hover:border-[#2848F0] hover:bg-blue-50/30'
                                    }`}
                                  >
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2848F0] flex items-center justify-center">
                                      <Upload className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-semibold text-zinc-800">
                                        Arrastra tu audio aquí o haz clic para subir
                                      </p>
                                      <p className="text-[10px] text-zinc-500">
                                        Formatos soportados: MP3, WAV, OGG, M4A
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        audioFileInputRef.current?.click();
                                      }}
                                      className="mt-1 px-3 py-1.5 bg-[#2848F0] hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Seleccionar audio</span>
                                    </button>
                                  </div>

                                  {selectedElement.content.audioUrl && (
                                    <div className="flex items-center justify-between gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <Music className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="text-[11px] font-semibold text-emerald-900 truncate">
                                          {selectedElement.content.audioFileName || 'Audio cargado'}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateSelectedElement(
                                            {},
                                            { audioUrl: '', audioFileName: '' }
                                          )
                                        }
                                        className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer shrink-0 transition-colors"
                                        title="Quitar archivo de audio"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* URL del audio o playlist (en blanco por defecto y al cambiar de fuente) */
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                    URL del audio o playlist:
                                  </label>
                                  <input
                                    type="text"
                                    value={selectedElement.content.audioUrl || ''}
                                    onChange={(e) =>
                                      updateSelectedElement({}, { audioUrl: e.target.value })
                                    }
                                    placeholder={
                                      effectiveSource === 'spotify'
                                        ? 'https://open.spotify.com/track/... o playlist'
                                        : effectiveSource === 'soundcloud'
                                        ? 'https://soundcloud.com/artista/pista'
                                        : 'https://.../archivo-audio.mp3'
                                    }
                                    className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-mono"
                                  />
                                </div>
                              )}

                              {/* Botón de audio de prueba acorde a la fuente actual */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (effectiveSource === 'spotify') {
                                    updateSelectedElement(
                                      {},
                                      {
                                        audioUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
                                        audioSource: 'spotify',
                                        audioType: 'spotify',
                                      }
                                    );
                                  } else if (effectiveSource === 'soundcloud') {
                                    updateSelectedElement(
                                      {},
                                      {
                                        audioUrl: 'https://soundcloud.com/forss/flickermood',
                                        audioSource: 'soundcloud',
                                        audioType: 'soundcloud',
                                      }
                                    );
                                  } else {
                                    updateSelectedElement(
                                      {},
                                      {
                                        audioUrl:
                                          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                                        audioFileName:
                                          effectiveSource === 'upload'
                                            ? 'audio-demostracion.mp3'
                                            : '',
                                        audioSource: effectiveSource,
                                        audioType: 'direct',
                                        audioTitle:
                                          selectedElement.content.audioTitle || 'Audio Demostración SSP',
                                        audioArtist:
                                          selectedElement.content.audioArtist || 'Scale Sales Pro',
                                      }
                                    );
                                  }
                                }}
                                className="w-full py-1.5 text-[11px] font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-[#2848F0] hover:text-[#2848F0] cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                              >
                                <RefreshCw className="w-3 h-3 text-amber-600" />
                                <span>Cargar audio de prueba</span>
                              </button>

                              {/* Opciones de Título, Artista y Loop para Audio Externo o Subir Audio */}
                              {isDirectAudio && (
                                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      Título del audio:
                                    </label>
                                    <input
                                      type="text"
                                      value={selectedElement.content.audioTitle ?? ''}
                                      onChange={(e) =>
                                        updateSelectedElement({}, { audioTitle: e.target.value })
                                      }
                                      placeholder="Título del audio"
                                      className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                                    />
                                  </div>

                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      Artista / Autor:
                                    </label>
                                    <input
                                      type="text"
                                      value={selectedElement.content.audioArtist ?? ''}
                                      onChange={(e) =>
                                        updateSelectedElement({}, { audioArtist: e.target.value })
                                      }
                                      placeholder="Nombre del autor o marca"
                                      className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                                    />
                                  </div>

                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-xs font-semibold text-zinc-700">
                                      Repetir en bucle (Loop):
                                    </span>
                                    <input
                                      type="checkbox"
                                      checked={selectedElement.content.audioLoop ?? false}
                                      onChange={(e) =>
                                        updateSelectedElement({}, { audioLoop: e.target.checked })
                                      }
                                      className="w-4 h-4 text-[#2848F0] rounded cursor-pointer"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Aviso para playlists de Spotify / SoundCloud */}
                              {!isDirectAudio && (
                                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                                  Las pistas, álbumes y playlists de Spotify y SoundCloud se muestran con su reproductor interactivo embebido.
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* B. COLORES DE FONDO Y LETRAS (Solo Audio Externo o Subir Audio) */}
                        {isDirectAudio && (
                          <div className="border border-zinc-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleAccordion('audioColors')}
                              className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5 text-[#2848F0]" />
                                Colores de Fondo y Letras
                              </span>
                              {openSections.audioColors !== false ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {openSections.audioColors !== false && (
                              <div className="p-3 space-y-3 bg-white text-xs">
                                {/* Tipo de fondo: PRIMERO Color Sólido (seleccionado por defecto), al costado Gradiente Moderno */}
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">
                                    Tipo de fondo:
                                  </label>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateSelectedElement({}, { audioBgType: 'solid' })
                                      }
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                        currentBgType === 'solid'
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                      }`}
                                    >
                                      Color Sólido
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateSelectedElement({}, { audioBgType: 'gradient' })
                                      }
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                        currentBgType === 'gradient'
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                      }`}
                                    >
                                      Gradiente Moderno
                                    </button>
                                  </div>
                                </div>

                                {/* Selectores de color apilados uno debajo del otro (1 por fila) */}
                                <div className="space-y-2.5 pt-1">
                                  {currentBgType === 'solid' ? (
                                    <HexColorPicker
                                      label="Color de fondo:"
                                      value={selectedElement.content.audioBgColor || '#18181B'}
                                      onChange={(val) =>
                                        updateSelectedElement({}, { audioBgColor: val })
                                      }
                                    />
                                  ) : (
                                    <>
                                      <HexColorPicker
                                        label="Color inicial del fondo:"
                                        value={selectedElement.content.audioBgColor || '#18181B'}
                                        onChange={(val) =>
                                          updateSelectedElement({}, { audioBgColor: val })
                                        }
                                      />
                                      <HexColorPicker
                                        label="Color final del fondo:"
                                        value={selectedElement.content.audioBgColorEnd || '#1E293B'}
                                        onChange={(val) =>
                                          updateSelectedElement({}, { audioBgColorEnd: val })
                                        }
                                      />
                                    </>
                                  )}

                                  <HexColorPicker
                                    label="Color del título:"
                                    value={selectedElement.content.audioTitleColor || '#FFFFFF'}
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioTitleColor: val })
                                    }
                                  />

                                  <HexColorPicker
                                    label="Color del artista:"
                                    value={selectedElement.content.audioArtistColor || '#A1A1AA'}
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioArtistColor: val })
                                    }
                                  />
                                </div>

                                {/* Tipografía y tamaño de letra del reproductor */}
                                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                                  <div>
                                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                      Tipografía:
                                    </label>
                                    <select
                                      value={selectedElement.content.audioFontFamily || 'Poppins'}
                                      onChange={(e) =>
                                        updateSelectedElement({}, { audioFontFamily: e.target.value })
                                      }
                                      className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                                    >
                                      {AVAILABLE_FONTS.map((f) => (
                                        <option key={f.value} value={f.value}>
                                          {f.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <InlineSliderInput
                                    label="Tamaño de letra:"
                                    value={selectedElement.content.audioTitleSize ?? 13}
                                    min={11}
                                    max={22}
                                    inputMin={8}
                                    unit="px"
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioTitleSize: val })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* C. BOTÓN DE PLAY & BARRA DE AUDIO (Solo Audio Externo o Subir Audio) */}
                        {isDirectAudio && (
                          <div className="border border-zinc-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleAccordion('audioControls')}
                              className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <PlayCircle className="w-3.5 h-3.5 text-[#2848F0]" />
                                Botón de Play & Barra de Audio
                              </span>
                              {openSections.audioControls !== false ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {openSections.audioControls !== false && (
                              <div className="p-3 space-y-3 bg-white text-xs">
                                {/* Forma del botón Play */}
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">
                                    Forma del botón Play:
                                  </label>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {(
                                      [
                                        { id: 'circle', label: 'Círculo' },
                                        { id: 'rounded', label: 'Redondeado' },
                                        { id: 'square', label: 'Cuadrado' },
                                      ] as const
                                    ).map((shapeOpt) => {
                                      const isSelected =
                                        (selectedElement.content.audioPlayButtonShape || 'rounded') ===
                                        shapeOpt.id;
                                      return (
                                        <button
                                          key={shapeOpt.id}
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement(
                                              {},
                                              { audioPlayButtonShape: shapeOpt.id }
                                            )
                                          }
                                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                            isSelected
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                        >
                                          {shapeOpt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Colores de botón Play y barra apilados uno arriba del otro (1 por fila) */}
                                <div className="space-y-2.5 pt-1">
                                  <HexColorPicker
                                    label="Color del botón Play:"
                                    value={selectedElement.content.audioPlayButtonBg || '#2848F0'}
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioPlayButtonBg: val })
                                    }
                                  />

                                  <HexColorPicker
                                    label="Color del icono Play:"
                                    value={selectedElement.content.audioPlayIconColor || '#FFFFFF'}
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioPlayIconColor: val })
                                    }
                                  />

                                  <HexColorPicker
                                    label="Color de barra de progreso:"
                                    value={selectedElement.content.audioProgressColor || '#2848F0'}
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioProgressColor: val })
                                    }
                                  />

                                  <HexColorPicker
                                    label="Color de fondo de barra:"
                                    value={selectedElement.content.audioProgressBgColor || '#3F3F46'}
                                    onChange={(val) =>
                                      updateSelectedElement({}, { audioProgressBgColor: val })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* D. TAMAÑO Y FORMA DEL REPRODUCTOR (Solo Audio Externo o Subir Audio) */}
                        {isDirectAudio && (
                          <div className="border border-zinc-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleAccordion('audioShape')}
                              className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                            >
                              <span className="flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-600" />
                                Tamaño y Forma del Reproductor
                              </span>
                              {openSections.audioShape !== false ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {openSections.audioShape !== false && (
                              <div className="p-3 space-y-3 bg-white text-xs">
                                {/* Tamaño del reproductor */}
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">
                                    Tamaño del reproductor:
                                  </label>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {(
                                      [
                                        { id: 'compact', label: 'Compacto' },
                                        { id: 'normal', label: 'Normal' },
                                        { id: 'large', label: 'Grande' },
                                      ] as const
                                    ).map((sz) => {
                                      const isSelected =
                                        (selectedElement.content.audioPlayerSize || 'normal') === sz.id;
                                      return (
                                        <button
                                          key={sz.id}
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement({}, { audioPlayerSize: sz.id })
                                          }
                                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                            isSelected
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                        >
                                          {sz.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Ancho máximo */}
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">
                                    Ancho del reproductor:
                                  </label>
                                  <div className="grid grid-cols-4 gap-1 mb-1.5">
                                    {['360px', '480px', '640px', '100%'].map((presetW) => {
                                      const activeW =
                                        (selectedElement.styles.maxWidth || '100%') === presetW;
                                      return (
                                        <button
                                          key={presetW}
                                          type="button"
                                          onClick={() => updateSelectedElement({ maxWidth: presetW })}
                                          className={`py-1 px-1.5 rounded border text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
                                            activeW
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                        >
                                          {presetW}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <input
                                    type="text"
                                    value={selectedElement.styles.maxWidth || '100%'}
                                    onChange={(e) => updateSelectedElement({ maxWidth: e.target.value })}
                                    placeholder="Ej. 520px o 100%"
                                    className="w-full p-1.5 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                                  />
                                </div>

                                {/* Alineación horizontal */}
                                <div>
                                  <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">
                                    Alineación:
                                  </label>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => updateSelectedElement({ textAlign: 'left' })}
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                                        selectedElement.styles.textAlign === 'left'
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                      }`}
                                    >
                                      <AlignLeft className="w-3.5 h-3.5" />
                                      <span>Izquierda</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateSelectedElement({ textAlign: 'center' })}
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                                        !selectedElement.styles.textAlign ||
                                        selectedElement.styles.textAlign === 'center'
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                      }`}
                                    >
                                      <AlignCenter className="w-3.5 h-3.5" />
                                      <span>Centro</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateSelectedElement({ textAlign: 'right' })}
                                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                                        selectedElement.styles.textAlign === 'right'
                                          ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                      }`}
                                    >
                                      <AlignRight className="w-3.5 h-3.5" />
                                      <span>Derecha</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Forma / Redondeo de bordes */}
                                <div className="pt-1 border-t border-zinc-100 space-y-2">
                                  <label className="font-semibold text-zinc-700 block text-[11px]">
                                    Forma / Redondeo del reproductor:
                                  </label>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                      { label: 'Cuadrado', radius: 0 },
                                      { label: 'Suave', radius: 16 },
                                      { label: 'Píldora', radius: 50 },
                                    ].map((sh) => {
                                      const curRad = selectedElement.styles.borderRadius ?? 16;
                                      const activeShape = curRad === sh.radius;
                                      return (
                                        <button
                                          key={sh.label}
                                          type="button"
                                          onClick={() =>
                                            updateSelectedElement({ borderRadius: sh.radius })
                                          }
                                          className={`py-1 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                            activeShape
                                              ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                          }`}
                                        >
                                          {sh.label}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <InlineSliderInput
                                    value={selectedElement.styles.borderRadius ?? 16}
                                    min={0}
                                    max={60}
                                    unit="px"
                                    onChange={(val) => updateSelectedElement({ borderRadius: val })}
                                  />
                                </div>

                                {/* Borde opcional */}
                                <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-zinc-700 text-[11px]">
                                      Agregar borde:
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={(selectedElement.styles.borderWidth ?? 0) > 0}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            updateSelectedElement({
                                              borderWidth: 2,
                                              borderStyle:
                                                selectedElement.styles.borderStyle || 'solid',
                                              borderColor:
                                                selectedElement.styles.borderColor || '#2848F0',
                                            });
                                          } else {
                                            updateSelectedElement({ borderWidth: 0 });
                                          }
                                        }}
                                        className="sr-only peer"
                                      />
                                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2848F0]"></div>
                                    </label>
                                  </div>

                                  {(selectedElement.styles.borderWidth ?? 0) > 0 && (
                                    <div className="space-y-2.5">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-[10px] font-semibold text-zinc-600 block mb-1">
                                            Grosor (px):
                                          </label>
                                          <FreeNumberInput
                                            value={selectedElement.styles.borderWidth ?? 2}
                                            min={1}
                                            unit="px"
                                            onChange={(val) => updateSelectedElement({ borderWidth: val })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[10px] font-semibold text-zinc-600 block mb-1">
                                            Tipo de borde:
                                          </label>
                                          <select
                                            value={selectedElement.styles.borderStyle || 'solid'}
                                            onChange={(e) =>
                                              updateSelectedElement({
                                                borderStyle: e.target.value as any,
                                              })
                                            }
                                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                                          >
                                            <option value="solid">Sólido</option>
                                            <option value="dashed">Guiones</option>
                                            <option value="dotted">Puntos</option>
                                          </select>
                                        </div>
                                      </div>

                                      <HexColorPicker
                                        label="Color del borde:"
                                        value={selectedElement.styles.borderColor || '#2848F0'}
                                        onChange={(val) =>
                                          updateSelectedElement({ borderColor: val })
                                        }
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Sombra */}
                                <div className="pt-2 border-t border-zinc-100">
                                  <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                                    Sombra del reproductor:
                                  </label>
                                  <select
                                    value={selectedElement.styles.shadow || 'lg'}
                                    onChange={(e) =>
                                      updateSelectedElement({ shadow: e.target.value as any })
                                    }
                                    className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                                  >
                                    <option value="none">Sin sombra</option>
                                    <option value="sm">Sutil</option>
                                    <option value="md">Media</option>
                                    <option value="lg">Pronunciada</option>
                                    <option value="xl">Intensa</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 12. CONTENT FOR ICON */}
                  {selectedElement.type === 'icon' && (() => {
                    const iconName = selectedElement.content.iconName || 'Star';
                    const SelectedIconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;
                    return (
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion('iconSettings')}
                          className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <Smile className="w-3.5 h-3.5 text-indigo-600" />
                            Selector de Icono
                          </span>
                          {openSections.iconSettings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        {openSections.iconSettings && (
                          <div className="p-3 space-y-3.5 bg-white text-xs">
                            {/* Preview visual del icono actual con forma gráfica */}
                            <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-200 shadow-2xs"
                                  style={{
                                    backgroundColor: selectedElement.content.iconShape !== 'none'
                                      ? (selectedElement.content.iconBgColor || '#EFF6FF')
                                      : '#FFFFFF',
                                    borderRadius: selectedElement.content.iconShape === 'circle'
                                      ? '9999px'
                                      : selectedElement.content.iconShape === 'rounded'
                                      ? '10px'
                                      : '4px',
                                  }}
                                >
                                  <SelectedIconComponent
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      color: selectedElement.content.iconColor || '#2848F0',
                                    }}
                                  />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-zinc-800 block">{iconName}</span>
                                  <span className="text-[10px] text-zinc-400">Icono seleccionado activo</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-[#2848F0] font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                                Lucide Icon
                              </span>
                            </div>

                            {/* Catálogo de iconos en cuadrícula con formas gráficas reales */}
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1.5 text-[11px]">Elegir icono visual:</label>
                              <div className="grid grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-1.5 bg-white border border-zinc-200 rounded-xl">
                                {POPULAR_ICONS.map((name) => {
                                  const isCurr = iconName === name;
                                  const IconItemComponent = (LucideIcons as any)[name] || LucideIcons.Star;
                                  return (
                                    <button
                                      key={name}
                                      type="button"
                                      onClick={() => updateSelectedElement({}, { iconName: name })}
                                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                                        isCurr
                                          ? 'bg-[#2848F0] text-white shadow-xs scale-105 ring-2 ring-[#2848F0]/30'
                                          : 'hover:bg-zinc-100 text-zinc-700 border border-zinc-100'
                                      }`}
                                      title={name}
                                    >
                                      <IconItemComponent className="w-5 h-5 shrink-0" />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* TAMAÑO Y COLOR DEL ICONO */}
                            <div className="space-y-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                              <InlineSliderInput
                                label="Tamaño del icono:"
                                value={selectedElement.content.iconSize || 40}
                                min={16}
                                max={96}
                                inputMin={8}
                                step={2}
                                unit="px"
                                onChange={(val) => updateSelectedElement({}, { iconSize: val })}
                              />

                              <HexColorPicker
                                label="Color del Icono"
                                value={selectedElement.content.iconColor || '#2848F0'}
                                onChange={(val) => updateSelectedElement({}, { iconColor: val })}
                              />
                            </div>

                            {/* FORMA DEL ICONO: NINGUNA, CÍRCULO, CUADRADO, REDONDEADO */}
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Forma del icono:</label>
                              <select
                                value={selectedElement.content.iconShape || 'circle'}
                                onChange={(e) => updateSelectedElement({}, { iconShape: e.target.value as any })}
                                className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                              >
                                <option value="none">Ninguna (Sin fondo)</option>
                                <option value="circle">Círculo</option>
                                <option value="square">Cuadrado</option>
                                <option value="rounded">Redondeado</option>
                              </select>
                            </div>

                            {/* COLOR DE FONDO DEL CONTENEDOR (CUANDO FORMA !== 'NONE') */}
                            {selectedElement.content.iconShape && selectedElement.content.iconShape !== 'none' && (
                              <div>
                                <HexColorPicker
                                  label="Color de Fondo del contenedor"
                                  value={selectedElement.content.iconBgColor || '#EFF6FF'}
                                  onChange={(val) => updateSelectedElement({}, { iconBgColor: val })}
                                />
                              </div>
                            )}

                            {/* ALINEACIÓN */}
                            <div>
                              <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Alineación:</label>
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
                      </div>
                    );
                  })()}

                  {/* 13. CONTENT FOR COMPLETE FORM (FORMULARIO COMPLETO) */}
                  {selectedElement.type === 'simple_form' && (
                    <CompleteFormInspector
                      element={selectedElement}
                      pageSettings={pageSettings}
                      onUpdate={updateSelectedElement}
                    />
                  )}

                  {/* 13B. CONTENT FOR INLINE FORM (FORMULARIO INLINE) */}
                  {selectedElement.type === 'inline_form' && (
                    <InlineFormInspector
                      element={selectedElement}
                      pageSettings={pageSettings}
                      funnelPages={currentFunnel?.pages || []}
                      currentPageId={currentPage?.id}
                      onUpdate={updateSelectedElement}
                    />
                  )}

                  {/* 14. CONTENT FOR POPUP BUTTON */}
                  {selectedElement.type === 'popup_button' && (() => {
                    const currentBtnIcon = selectedElement.content.buttonIcon || '';
                    const CurrentBtnIconComp = currentBtnIcon ? (LucideIcons as any)[currentBtnIcon] : null;
                    return (
                      <div className="space-y-3">
                        <div className="space-y-3 border border-blue-200 rounded-xl p-3 bg-blue-50/20">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                              <Layers className="w-4 h-4 text-[#2848F0]" />
                              <span>Botón Pop-up</span>
                            </label>
                          </div>

                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Texto del botón:</label>
                            <input
                              type="text"
                              value={selectedElement.content.popupButtonText || ''}
                              onChange={(e) => updateSelectedElement({}, { popupButtonText: e.target.value })}
                              placeholder="Abrir Oferta en Pop-up"
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
                                        submitButtonText: 'Acceder Ahora',
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

                        {/* ICONO DEL BOTÓN */}
                        <div className="space-y-2.5 p-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl">
                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1">Icono del botón:</label>
                            <button
                              type="button"
                              onClick={() => setShowButtonIconPicker((prev) => !prev)}
                              className="w-full p-2 bg-white border border-zinc-200 hover:border-[#2848F0] rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors"
                            >
                              <span className="flex items-center gap-2 font-medium text-zinc-800">
                                {CurrentBtnIconComp ? (
                                  <>
                                    <CurrentBtnIconComp className="w-4 h-4 text-[#2848F0]" />
                                    <span>{currentBtnIcon}</span>
                                  </>
                                ) : (
                                  <span className="text-zinc-500">Sin icono (Haz clic para seleccionar)</span>
                                )}
                              </span>
                              {showButtonIconPicker ? (
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                              )}
                            </button>

                            {showButtonIconPicker && (
                              <div className="mt-2 p-2 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-2">
                                <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSelectedElement({}, { buttonIcon: '' });
                                      setShowButtonIconPicker(false);
                                    }}
                                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center text-[9px] font-semibold cursor-pointer transition-all ${
                                      !currentBtnIcon
                                        ? 'bg-[#2848F0] text-white shadow-2xs'
                                        : 'hover:bg-zinc-100 text-zinc-500 border border-zinc-100'
                                    }`}
                                    title="Sin icono"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  {CTA_BUTTON_ICONS.map((icName) => {
                                    const IcItem = (LucideIcons as any)[icName] || LucideIcons.ArrowRight;
                                    const isSel = currentBtnIcon === icName;
                                    return (
                                      <button
                                        key={icName}
                                        type="button"
                                        onClick={() => {
                                          updateSelectedElement({}, { buttonIcon: icName });
                                          setShowButtonIconPicker(false);
                                        }}
                                        className={`p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                          isSel
                                            ? 'bg-[#2848F0] text-white shadow-2xs ring-2 ring-[#2848F0]/30'
                                            : 'hover:bg-zinc-100 text-zinc-700 border border-zinc-100'
                                        }`}
                                        title={icName}
                                      >
                                        <IcItem className="w-4 h-4 shrink-0" />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* POSICIÓN DEL ICONO */}
                          <div>
                            <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Posición del icono:</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({}, { buttonIconPosition: 'before' })}
                                className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                  (selectedElement.content.buttonIconPosition || 'before') === 'before'
                                    ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                }`}
                              >
                                Adelante del texto
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSelectedElement({}, { buttonIconPosition: 'after' })}
                                className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                  selectedElement.content.buttonIconPosition === 'after'
                                    ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                                }`}
                              >
                                Después del texto
                              </button>
                            </div>
                          </div>

                          {/* TAMAÑO DEL ICONO */}
                          <InlineSliderInput
                            label="Tamaño del icono:"
                            value={
                              selectedElement.content.buttonIconSize ??
                              Math.max(14, Math.round((selectedElement.styles.fontSize || 16) * 1.05))
                            }
                            min={10}
                            max={64}
                            inputMin={8}
                            unit="px"
                            onChange={(val) => updateSelectedElement({}, { buttonIconSize: val })}
                          />

                          {/* ESPACIADO ENTRE ICONO Y TEXTO */}
                          <InlineSliderInput
                            label="Espaciado entre icono y texto:"
                            value={selectedElement.content.buttonIconSpacing ?? 8}
                            min={0}
                            max={40}
                            unit="px"
                            onChange={(val) => updateSelectedElement({}, { buttonIconSpacing: val })}
                          />
                        </div>

                        {/* RELLENO DEL BOTÓN (INTERNO DESDE EL TEXTO HACIA LOS BORDES) */}
                        <div className="p-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl space-y-2">
                          <div>
                            <span className="font-semibold text-zinc-800 block text-xs">Relleno del botón:</span>
                            <span className="text-[10px] text-zinc-500">Espacio interno desde el texto hacia los bordes del botón</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-semibold text-zinc-600 block mb-1">Vertical (arriba/abajo)</label>
                              <FreeNumberInput
                                value={selectedElement.styles.buttonPaddingY ?? 14}
                                min={0}
                                unit="px"
                                inputClassName="text-center"
                                onChange={(val) => updateSelectedElement({ buttonPaddingY: val })}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-zinc-600 block mb-1">Horizontal (laterales)</label>
                              <FreeNumberInput
                                value={selectedElement.styles.buttonPaddingX ?? 28}
                                min={0}
                                unit="px"
                                inputClassName="text-center"
                                onChange={(val) => updateSelectedElement({ buttonPaddingX: val })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 15. COUNTDOWN TIMER INSPECTOR */}
                  {selectedElement.type === 'countdown' && (
                    <div className="space-y-3.5 border border-orange-200 rounded-xl p-3 bg-orange-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Timer className="w-4 h-4 text-orange-600" />
                          <span>Cuenta Regresiva</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Fecha y hora límite:</label>
                        <input
                          type="datetime-local"
                          value={selectedElement.content.countdownEndDate || ''}
                          onChange={(e) => updateSelectedElement({}, { countdownEndDate: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Tema visual:</label>
                        <select
                          value={selectedElement.content.countdownTheme || 'dark'}
                          onChange={(e) => updateSelectedElement({}, { countdownTheme: e.target.value as any })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-white"
                        >
                          <option value="dark">Oscuro Elegante (Fondo negro)</option>
                          <option value="light">Claro Moderno (Fondo blanco)</option>
                          <option value="primary">Color Primario (Azul SSP)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200">
                        <div>
                          <label className="text-[10px] text-zinc-600 block mb-0.5">Etiqueta Días:</label>
                          <input
                            type="text"
                            value={selectedElement.content.countdownDaysLabel || 'Días'}
                            onChange={(e) => updateSelectedElement({}, { countdownDaysLabel: e.target.value })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-600 block mb-0.5">Etiqueta Horas:</label>
                          <input
                            type="text"
                            value={selectedElement.content.countdownHoursLabel || 'Horas'}
                            onChange={(e) => updateSelectedElement({}, { countdownHoursLabel: e.target.value })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-600 block mb-0.5">Etiqueta Minutos:</label>
                          <input
                            type="text"
                            value={selectedElement.content.countdownMinutesLabel || 'Minutos'}
                            onChange={(e) => updateSelectedElement({}, { countdownMinutesLabel: e.target.value })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-600 block mb-0.5">Etiqueta Segundos:</label>
                          <input
                            type="text"
                            value={selectedElement.content.countdownSecondsLabel || 'Segundos'}
                            onChange={(e) => updateSelectedElement({}, { countdownSecondsLabel: e.target.value })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 16. FAQ ACCORDION INSPECTOR */}
                  {selectedElement.type === 'faq' && (
                    <div className="space-y-3.5 border border-indigo-200 rounded-xl p-3 bg-indigo-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-indigo-600" />
                          <span>Preguntas Frecuentes (FAQ)</span>
                        </label>
                      </div>

                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {(selectedElement.content.faqItems || []).map((faq, fIdx) => (
                          <div key={faq.id || fIdx} className="p-2.5 bg-white border border-zinc-200 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-zinc-700">Pregunta #{fIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextItems = (selectedElement?.content.faqItems || []).filter((_, i) => i !== fIdx);
                                  updateSelectedElement({}, { faqItems: nextItems });
                                }}
                                className="text-red-500 hover:text-red-700 p-0.5"
                                title="Eliminar pregunta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={faq.question}
                              placeholder="¿Cuál es tu pregunta?"
                              onChange={(e) => {
                                const nextItems = [...(selectedElement?.content.faqItems || [])];
                                nextItems[fIdx] = { ...nextItems[fIdx], question: e.target.value };
                                updateSelectedElement({}, { faqItems: nextItems });
                              }}
                              className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg font-medium"
                            />
                            <textarea
                              value={faq.answer}
                              rows={2}
                              placeholder="Respuesta explicativa..."
                              onChange={(e) => {
                                const nextItems = [...(selectedElement?.content.faqItems || [])];
                                nextItems[fIdx] = { ...nextItems[fIdx], answer: e.target.value };
                                updateSelectedElement({}, { faqItems: nextItems });
                              }}
                              className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg resize-none"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const nextItems = [
                            ...(selectedElement?.content.faqItems || []),
                            {
                              id: `faq_${Date.now()}`,
                              question: 'Nueva Pregunta Frecuente',
                              answer: 'Escribe aquí la respuesta para tus usuarios.',
                            },
                          ];
                          updateSelectedElement({}, { faqItems: nextItems });
                        }}
                        className="w-full py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Pregunta Frecuente</span>
                      </button>
                    </div>
                  )}

                  {/* 17. SOCIAL LINKS INSPECTOR */}
                  {selectedElement.type === 'social_links' && (
                    <div className="space-y-3.5 border border-blue-200 rounded-xl p-3 bg-blue-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Share2 className="w-4 h-4 text-[#2848F0]" />
                          <span>Redes Sociales</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Tamaño:</label>
                          <select
                            value={selectedElement.content.socialSize || 'md'}
                            onChange={(e) => updateSelectedElement({}, { socialSize: e.target.value as any })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          >
                            <option value="sm">Pequeño</option>
                            <option value="md">Mediano</option>
                            <option value="lg">Grande</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Forma del fondo:</label>
                          <select
                            value={selectedElement.content.socialShape || 'circle'}
                            onChange={(e) => updateSelectedElement({}, { socialShape: e.target.value as any })}
                            className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                          >
                            <option value="circle">Círculo</option>
                            <option value="rounded">Bordes Suaves</option>
                            <option value="square">Cuadrado</option>
                            <option value="none">Sin fondo (Solo icono)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Modo de color:</label>
                        <select
                          value={selectedElement.content.socialColorMode || 'default'}
                          onChange={(e) => {
                            const mode = e.target.value as 'default' | 'custom';
                            updateSelectedElement(
                              {},
                              {
                                socialColorMode: mode,
                                socialStyle: mode === 'custom' ? 'custom' : 'colored',
                              }
                            );
                          }}
                          className="w-full p-1.5 text-xs border border-zinc-200 rounded-lg bg-white font-medium"
                        >
                          <option value="default">Colores Oficiales (Por defecto)</option>
                          <option value="custom">Color Personalizado</option>
                        </select>
                      </div>

                      {/* If custom color mode: Pickers for background and icon color */}
                      {(selectedElement.content.socialColorMode === 'custom' || selectedElement.content.socialStyle === 'custom') && (
                        <div className="space-y-2.5 p-2.5 bg-white border border-blue-100 rounded-lg shadow-2xs">
                          <HexColorPicker
                            label="Color del fondo / forma:"
                            value={selectedElement.content.socialBgColor || '#2848F0'}
                            onOpen={handleColorPickerOpen}
                            onClose={handleColorPickerClose}
                            onChange={(val) => updateSelectedElement({}, { socialBgColor: val })}
                          />
                          <HexColorPicker
                            label="Color del icono:"
                            value={selectedElement.content.socialIconColor || '#FFFFFF'}
                            onOpen={handleColorPickerOpen}
                            onClose={handleColorPickerClose}
                            onChange={(val) => updateSelectedElement({}, { socialIconColor: val })}
                          />
                        </div>
                      )}

                      <div className="space-y-2 pt-1 border-t border-zinc-200">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-zinc-700 block">Redes y orden:</label>
                          <span className="text-[10px] text-zinc-400">Usa las flechas para reordenar</span>
                        </div>
                        {(selectedElement.content.socialLinks || []).map((link, lIdx, arr) => (
                          <div key={link.id || link.platform} className="p-2 bg-white border border-zinc-200 rounded-lg space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    disabled={lIdx === 0}
                                    onClick={() => {
                                      if (lIdx === 0) return;
                                      const next = [...arr];
                                      const temp = next[lIdx];
                                      next[lIdx] = next[lIdx - 1];
                                      next[lIdx - 1] = temp;
                                      updateSelectedElement({}, { socialLinks: next });
                                    }}
                                    className="p-1 rounded hover:bg-zinc-100 disabled:opacity-20 cursor-pointer text-zinc-600 disabled:cursor-not-allowed transition-colors"
                                    title="Subir posición"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={lIdx === arr.length - 1}
                                    onClick={() => {
                                      if (lIdx === arr.length - 1) return;
                                      const next = [...arr];
                                      const temp = next[lIdx];
                                      next[lIdx] = next[lIdx + 1];
                                      next[lIdx + 1] = temp;
                                      updateSelectedElement({}, { socialLinks: next });
                                    }}
                                    className="p-1 rounded hover:bg-zinc-100 disabled:opacity-20 cursor-pointer text-zinc-600 disabled:cursor-not-allowed transition-colors"
                                    title="Bajar posición"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-xs font-semibold capitalize text-zinc-800">{link.platform}</span>
                              </div>
                              <label className="flex items-center gap-1 cursor-pointer text-[10px] text-zinc-600">
                                <input
                                  type="checkbox"
                                  checked={link.enabled}
                                  onChange={(e) => {
                                    const next = [...arr];
                                    next[lIdx] = { ...next[lIdx], enabled: e.target.checked };
                                    updateSelectedElement({}, { socialLinks: next });
                                  }}
                                  className="rounded text-[#2848F0]"
                                />
                                <span>{link.enabled ? 'Visible' : 'Oculto'}</span>
                              </label>
                            </div>
                            {link.enabled && (
                              <input
                                type="text"
                                value={link.url}
                                placeholder={`https://${link.platform}.com/...`}
                                onChange={(e) => {
                                  const next = [...arr];
                                  next[lIdx] = { ...next[lIdx], url: e.target.value };
                                  updateSelectedElement({}, { socialLinks: next });
                                }}
                                className="w-full p-1.5 text-xs border border-zinc-200 rounded-md bg-zinc-50 font-mono"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 18. CHECKBOX INSPECTOR */}
                  {selectedElement.type === 'checkbox' && (
                    <div className="space-y-3.5 border border-emerald-200 rounded-xl p-3 bg-emerald-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span>Casilla de Verificación</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Texto de la casilla:</label>
                        <textarea
                          rows={2}
                          value={selectedElement.content.checkboxLabel || ''}
                          onChange={(e) => updateSelectedElement({}, { checkboxLabel: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-1 border-t border-zinc-200">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedElement.content.checkboxRequired)}
                            onChange={(e) => updateSelectedElement({}, { checkboxRequired: e.target.checked })}
                            className="rounded text-[#2848F0]"
                          />
                          <span>Campo Obligatorio</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedElement.content.checkboxChecked)}
                            onChange={(e) => updateSelectedElement({}, { checkboxChecked: e.target.checked })}
                            className="rounded text-[#2848F0]"
                          />
                          <span>Marcado por defecto</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 19. INPUT FIELD INSPECTOR */}
                  {selectedElement.type === 'input_field' && (
                    <div className="space-y-3.5 border border-blue-200 rounded-xl p-3 bg-blue-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <TextCursorInput className="w-4 h-4 text-[#2848F0]" />
                          <span>Campo de Formulario</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Etiqueta del campo (Label):</label>
                        <input
                          type="text"
                          value={selectedElement.content.fieldLabel || ''}
                          onChange={(e) => updateSelectedElement({}, { fieldLabel: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Marcador de posición (Placeholder):</label>
                        <input
                          type="text"
                          value={selectedElement.content.fieldPlaceholder || ''}
                          onChange={(e) => updateSelectedElement({}, { fieldPlaceholder: e.target.value })}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">Tipo de entrada:</label>
                          <select
                            value={selectedElement.content.fieldType || 'email'}
                            onChange={(e) => updateSelectedElement({}, { fieldType: e.target.value as any })}
                            className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                          >
                            <option value="text">Texto corto</option>
                            <option value="email">Correo electrónico</option>
                            <option value="phone">Teléfono / WhatsApp</option>
                            <option value="number">Número</option>
                            <option value="textarea">Área de texto (multilínea)</option>
                          </select>
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(selectedElement.content.fieldRequired)}
                              onChange={(e) => updateSelectedElement({}, { fieldRequired: e.target.checked })}
                              className="rounded text-[#2848F0]"
                            />
                            <span>Campo Obligatorio</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 20. FORM BUTTON INSPECTOR */}
                  {selectedElement.type === 'form_button' && (
                    <div className="space-y-3.5 border border-indigo-200 rounded-xl p-3 bg-indigo-50/20">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <MousePointerClick className="w-4 h-4 text-indigo-600" />
                          <span>Botón de Formulario</span>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Texto principal del botón:</label>
                        <input
                          type="text"
                          value={selectedElement.content.buttonText || ''}
                          onChange={(e) => updateSelectedElement({}, { buttonText: e.target.value })}
                          placeholder="Enviar Información"
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Subtexto / Garantía (opcional):</label>
                        <input
                          type="text"
                          value={selectedElement.content.buttonSubtext || ''}
                          onChange={(e) => updateSelectedElement({}, { buttonSubtext: e.target.value })}
                          placeholder="🔒 Tus datos están 100% seguros"
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Acción del formulario al hacer clic:</label>
                        <select
                          value={selectedElement.styles.buttonDestination || 'next_page'}
                          onChange={(e) =>
                            updateSelectedElement({
                              buttonDestination: e.target.value as any,
                            })
                          }
                          className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                        >
                          <option value="next_page">Enviar formulario y avanzar a siguiente página (Recomendado)</option>
                          <option value="calendar">Enviar formulario y agendar en calendario</option>
                          <option value="url">Enviar formulario y abrir enlace externo (URL)</option>
                        </select>
                      </div>

                      {selectedElement.styles.buttonDestination === 'url' && (
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">URL de destino:</label>
                          <input
                            type="text"
                            placeholder="https://wa.me/... o https://..."
                            value={selectedElement.styles.buttonUrl || ''}
                            onChange={(e) => updateSelectedElement({ buttonUrl: e.target.value })}
                            className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-[#2848F0]"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                        <span className="text-xs font-semibold text-zinc-700">Ancho completo (100% columna):</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedElement.styles.fullWidth !== false}
                            onChange={(e) => updateSelectedElement({ fullWidth: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2848F0]"></div>
                        </label>
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
                    selectedElement.type === 'button' ||
                    selectedElement.type === 'popup_button' ||
                    selectedElement.type === 'form_button') && (
                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
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
                          {/* Tamaño de fuente: barra desplazadora e input en la misma fila horizontal */}
                          <InlineSliderInput
                            label="Tamaño de fuente:"
                            value={selectedElement.styles.fontSize || 16}
                            min={8}
                            max={120}
                            inputMin={1}
                            unit="px"
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
                              value={selectedElement.styles.textTransform || 'none'}
                              onChange={(e) => updateSelectedElement({ textTransform: (e.target.value || 'none') as any })}
                              className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-medium focus:outline-[#2848F0] focus:ring-1 focus:ring-[#2848F0] cursor-pointer"
                            >
                              <option value="none">Normal</option>
                              <option value="uppercase">Mayúsculas</option>
                              <option value="lowercase">Minúsculas</option>
                              <option value="capitalize">Iniciales en mayúscula</option>
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
                            {selectedElement.type === 'button' ||
                            selectedElement.type === 'popup_button' ||
                            selectedElement.type === 'form_button' ? (
                              <div className="grid grid-cols-4 gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'left', fullWidth: false })}
                                  className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                                    !selectedElement.styles.fullWidth && selectedElement.styles.textAlign === 'left'
                                      ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                  }`}
                                >
                                  <AlignLeft className="w-3.5 h-3.5" />
                                  <span>Izquierda</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'center', fullWidth: false })}
                                  className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                                    !selectedElement.styles.fullWidth &&
                                    (!selectedElement.styles.textAlign || selectedElement.styles.textAlign === 'center')
                                      ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                  }`}
                                >
                                  <AlignCenter className="w-3.5 h-3.5" />
                                  <span>Centro</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'right', fullWidth: false })}
                                  className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                                    !selectedElement.styles.fullWidth && selectedElement.styles.textAlign === 'right'
                                      ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                  }`}
                                >
                                  <AlignRight className="w-3.5 h-3.5" />
                                  <span>Derecha</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSelectedElement({ textAlign: 'center', fullWidth: true })}
                                  className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                                    Boolean(selectedElement.styles.fullWidth)
                                      ? 'bg-[#2848F0] text-white border-[#2848F0]'
                                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                                  }`}
                                  title="Ocupar todo el ancho del contenedor"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                  <span>Completo</span>
                                </button>
                              </div>
                            ) : (
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
                            )}
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
                    selectedElement.type === 'button' ||
                    selectedElement.type === 'popup_button' ||
                    selectedElement.type === 'form_button') && (
                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleAccordion('colors')}
                        className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-zinc-500" />
                          {selectedElement.type === 'button' ||
                          selectedElement.type === 'popup_button' ||
                          selectedElement.type === 'form_button'
                            ? 'Color y Fondo'
                            : 'Color del texto'}
                        </span>
                        {openSections.colors ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      {openSections.colors && (
                        <div className="p-3 space-y-3 bg-white">
                          {selectedElement.type === 'button' || selectedElement.type === 'popup_button' ? (
                            <>
                              {/* Selectores Normal / Al pasar el cursor arriba de todo */}
                              <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
                                <button
                                  type="button"
                                  onClick={() => setButtonColorStateTab('normal')}
                                  className={`py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                                    buttonColorStateTab === 'normal'
                                      ? 'bg-white text-[#2848F0] shadow-2xs'
                                      : 'text-zinc-600 hover:text-zinc-900'
                                  }`}
                                >
                                  Normal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setButtonColorStateTab('hover')}
                                  className={`py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                                    buttonColorStateTab === 'hover'
                                      ? 'bg-white text-[#2848F0] shadow-2xs'
                                      : 'text-zinc-600 hover:text-zinc-900'
                                  }`}
                                >
                                  Al pasar el cursor
                                </button>
                              </div>

                              {buttonColorStateTab === 'normal' ? (
                                <div className="space-y-2.5">
                                  <HexColorPicker
                                    label="Color de fondo:"
                                    value={selectedElement.styles.bgColor || '#2848F0'}
                                    onChange={(val) => updateSelectedElement({ bgColor: val })}
                                  />
                                  <HexColorPicker
                                    label="Color de fuente del botón:"
                                    value={selectedElement.styles.textColor || '#FFFFFF'}
                                    onChange={(val) => updateSelectedElement({ textColor: val })}
                                  />
                                  <HexColorPicker
                                    label="Color del borde:"
                                    value={selectedElement.styles.borderColor || '#18181B'}
                                    onChange={(val) => updateSelectedElement({ borderColor: val })}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-2.5">
                                  <HexColorPicker
                                    label="Color de fondo (al pasar el cursor):"
                                    value={selectedElement.styles.hoverBgColor || selectedElement.styles.bgColor || '#2848F0'}
                                    onChange={(val) => updateSelectedElement({ hoverBgColor: val })}
                                  />
                                  <HexColorPicker
                                    label="Color de fuente (al pasar el cursor):"
                                    value={selectedElement.styles.hoverTextColor || selectedElement.styles.textColor || '#FFFFFF'}
                                    onChange={(val) => updateSelectedElement({ hoverTextColor: val })}
                                  />
                                  <HexColorPicker
                                    label="Color del borde (al pasar el cursor):"
                                    value={selectedElement.styles.hoverBorderColor || selectedElement.styles.borderColor || '#18181B'}
                                    onChange={(val) => updateSelectedElement({ hoverBorderColor: val })}
                                  />
                                  {(selectedElement.styles.hoverBgColor ||
                                    selectedElement.styles.hoverTextColor ||
                                    selectedElement.styles.hoverBorderColor) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateSelectedElement({
                                          hoverBgColor: undefined,
                                          hoverTextColor: undefined,
                                          hoverBorderColor: undefined,
                                        })
                                      }
                                      className="w-full py-1.5 text-[11px] font-semibold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg cursor-pointer transition-colors"
                                    >
                                      Restablecer estado al pasar el cursor
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <HexColorPicker
                                label="Color de texto:"
                                value={selectedElement.styles.textColor || '#121111'}
                                onOpen={handleColorPickerOpen}
                                onClose={handleColorPickerClose}
                                onChange={(val) => handleTextColorChange(val)}
                              />

                              {selectedElement.type === 'form_button' && (
                                <>
                                  <HexColorPicker
                                    label="Color de fondo del botón:"
                                    value={selectedElement.styles.bgColor || '#2848F0'}
                                    onChange={(val) => updateSelectedElement({ bgColor: val })}
                                  />
                                  <NumberControl
                                    label="Borde redondeado (Radio)"
                                    value={selectedElement.styles.borderRadius ?? 8}
                                    min={0}
                                    max={48}
                                    onChange={(val) => updateSelectedElement({ borderRadius: val })}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* ACCORDION: BORDE Y REDONDEO (BOTÓN Y BOTÓN POP-UP)             */}
                  {/* ============================================================== */}
                  {(selectedElement.type === 'button' || selectedElement.type === 'popup_button') && (
                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleAccordion('buttonBorder')}
                        className="w-full px-3 py-2 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-800 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Square className="w-3.5 h-3.5 text-zinc-500" />
                          Borde y Redondeo
                        </span>
                        {openSections.buttonBorder !== false ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {openSections.buttonBorder !== false && (
                        <div className="p-3 space-y-3 bg-white">
                          {/* Opción de agregar borde */}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-700">Agregar borde:</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(selectedElement.styles.borderWidth ?? 0) > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateSelectedElement({
                                      borderWidth: 2,
                                      borderStyle: selectedElement.styles.borderStyle || 'solid',
                                      borderColor: selectedElement.styles.borderColor || '#18181B',
                                    });
                                  } else {
                                    updateSelectedElement({ borderWidth: 0 });
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2848F0]"></div>
                            </label>
                          </div>

                          {(selectedElement.styles.borderWidth ?? 0) > 0 && (
                            <div className="space-y-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                              <InlineSliderInput
                                label="Grosor de borde:"
                                value={selectedElement.styles.borderWidth || 1}
                                min={1}
                                max={12}
                                inputMin={1}
                                unit="px"
                                onChange={(val) => updateSelectedElement({ borderWidth: val })}
                              />

                              <div>
                                <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Tipo de borde:</label>
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

                          {/* Borde redondeado (Radio): barra desplazable e input alineados horizontalmente */}
                          <InlineSliderInput
                            label="Borde redondeado (Radio):"
                            value={selectedElement.styles.borderRadius ?? 0}
                            min={0}
                            max={60}
                            unit="px"
                            onChange={(val) => updateSelectedElement({ borderRadius: val })}
                          />
                        </div>
                      )}
                    </div>
                  )}



                  {/* ============================================================== */}
                  {/* ============================================================== */}
                  {/* ACCORDION: ESPACIADO (MARGEN Y RELLENO - AGRUPADOS EN 1 LÍNEA) */}
                  {/* ============================================================== */}
                  {selectedElement.type !== 'simple_form' &&
                    selectedElement.type !== 'inline_form' && (
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
                  )}
                </div>
              </div>
            ) : activeColForInspector && selectionCtx.selectedColParentRow ? (
              /* DEDICATED COLUMN INSPECTOR (COLUMNA INDIVIDUAL) */
              <ColumnInspector
                column={activeColForInspector}
                columnIndex={selectionCtx.selectedColIndex}
                parentRow={selectionCtx.selectedColParentRow}
                sectionName={selectedSec?.name}
                onUpdate={(props) => updateSelectedColumn(props)}
                onResizeColumnWidth={(pct) => {
                  const nextSections = resizeColumnWidthInSections(
                    sections,
                    activeColForInspector.id,
                    pct
                  );
                  pushHistory(nextSections);
                  setHasUnsavedChanges(true);
                }}
                onEqualizeColumns={() =>
                  changeRowColumnsCount(
                    selectionCtx.selectedColParentRow!.id,
                    selectionCtx.selectedColParentRow!.columns.length
                  )
                }
                onSelectSiblingColumn={(colId) => {
                  setSelectedColumnId(colId);
                  setSelectedElementId(null);
                }}
                onSelectParentRow={() => {
                  setSelectedRowId(selectionCtx.selectedColParentRow!.id);
                  setSelectedColumnId(null);
                  setSelectedElementId(null);
                }}
                onClose={handleReturnToLibrary}
              />
            ) : activeRowForInspector ? (
              /* DEDICATED ROW INSPECTOR (SECCIÓN INTERNA) */
              (() => {
                const secEffectiveMaxW = selectedSec
                  ? getSectionEffectiveMaxWidth(selectedSec, effectiveCanvasMaxWidth)
                  : effectiveCanvasMaxWidth;
                const rowGoverningMaxW =
                  selectionCtx.isNestedRow && selectionCtx.outerRow
                    ? (selectionCtx.outerRow.widthType || 'boxed') === 'boxed' &&
                      selectionCtx.outerRow.maxWidth !== undefined
                      ? Math.min(selectionCtx.outerRow.maxWidth, secEffectiveMaxW)
                      : secEffectiveMaxW
                    : secEffectiveMaxW;
                const rowGoverningLabel =
                  selectionCtx.isNestedRow &&
                  selectionCtx.outerRow &&
                  (selectionCtx.outerRow.widthType || 'boxed') === 'boxed' &&
                  selectionCtx.outerRow.maxWidth !== undefined
                    ? 'Contenedor Padre'
                    : selectedSec && isSectionBoxed(selectedSec)
                    ? 'Sección Externa'
                    : 'Canvas';
                return (
                  <RowInspector
                    row={activeRowForInspector}
                    sectionName={selectedSec?.name}
                    canvasMaxWidth={rowGoverningMaxW}
                    governingLabel={rowGoverningLabel}
                    onUpdate={(props) => updateSelectedRow(props)}
                    onChangeColumnsCount={(count) => changeRowColumnsCount(activeRowForInspector.id, count)}
                    onSelectColumn={(colId) => {
                      setSelectedColumnId(colId);
                      setSelectedRowId(null);
                      setSelectedElementId(null);
                    }}
                    onMoveUp={() => moveRow('up', selectedSec?.id, activeRowForInspector.id)}
                    onMoveDown={() => moveRow('down', selectedSec?.id, activeRowForInspector.id)}
                    canMoveUp={selectionCtx.canMoveRowUp}
                    canMoveDown={selectionCtx.canMoveRowDown}
                    canDelete={selectionCtx.canDeleteRow}
                    onDuplicate={() => duplicateRow(activeRowForInspector.id)}
                    onDelete={() => deleteRow(activeRowForInspector.id)}
                    onClose={handleReturnToLibrary}
                  />
                );
              })()
            ) : activeSectionForInspector ? (
              /* DEDICATED SECTION INSPECTOR (WHEN SECTION IS SELECTED) */
              <SectionInspector
                section={activeSectionForInspector}
                canvasMaxWidth={effectiveCanvasMaxWidth}
                onUpdate={(props) => updateSection(activeSectionForInspector.id, props)}
                onMoveUp={() => moveSection('up', activeSectionForInspector.id)}
                onMoveDown={() => moveSection('down', activeSectionForInspector.id)}
                onDuplicate={() => duplicateSection(activeSectionForInspector.id)}
                onDelete={() => deleteSection(activeSectionForInspector.id)}
                onClose={handleReturnToLibrary}
                canMoveUp={sections.findIndex((s) => s.id === activeSectionForInspector.id) > 0}
                canMoveDown={
                  sections.findIndex((s) => s.id === activeSectionForInspector.id) < sections.length - 1
                }
              />
            ) : (
              /* TABBED LIBRARY: ELEMENTS, BLOCKS & PAGE SETTINGS */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Tabs Header - Order: Página, Elementos, Bloques */}
                <div className="flex border-b border-zinc-200 bg-zinc-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('page');
                      setSelectedElementId(null);
                      setSelectedColumnId(null);
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
                      setSelectedColumnId(null);
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
                      setSelectedColumnId(null);
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
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                            100% Editables
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('elements')}
                            className="p-0.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                            title="Cerrar panel de plantillas"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                      {/* 1. SECCIÓN */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-['Inter']">
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

                      {/* 2. TEXTO */}
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
                            <span className="text-[11px] font-medium">Párrafo</span>
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

                      {/* 3. MULTIMEDIA */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Multimedia
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                              e.dataTransfer.setData('application/ssp-element-type', 'audio');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('audio')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Music className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Audio</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'icon');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('icon')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Smile className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Icono</span>
                          </button>
                        </div>
                      </div>

                      {/* 4. CTA */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          CTA
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'button');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('button')}
                            className="p-2.5 border border-blue-200 bg-blue-50/30 hover:border-[#2848F0] hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-blue-950 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <CreditCard className="w-5 h-5 text-[#2848F0] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">Botón</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'popup_button');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('popup_button')}
                            className="p-2.5 border border-purple-200 bg-purple-50/20 hover:border-purple-500 hover:bg-purple-50 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-purple-950 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Layers className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">Botón Pop-up</span>
                          </button>
                        </div>
                      </div>

                      {/* 5. FORMULARIO */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          FORMULARIO
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {/* 1. Formulario Completo */}
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'simple_form');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('simple_form')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs text-center min-h-[76px]"
                            title="Formulario Completo"
                          >
                            <FileText className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium leading-tight">Formulario Completo</span>
                          </button>

                          {/* 2. Formulario Inline */}
                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'inline_form');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('inline_form')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs text-center min-h-[76px]"
                            title="Formulario Inline (Correo + Botón en línea)"
                          >
                            <TextCursorInput className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium leading-tight">Formulario Inline</span>
                          </button>
                        </div>
                      </div>

                      {/* 6. OTROS */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Otros
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                              e.dataTransfer.setData('application/ssp-element-type', 'countdown');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('countdown')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <Timer className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Cuenta Regresiva</span>
                          </button>

                          <button
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/ssp-element-type', 'faq');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addElement('faq')}
                            className="p-2.5 border border-zinc-200 rounded-xl hover:border-[#2848F0] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 transition-all text-zinc-700 cursor-grab active:cursor-grabbing group shadow-2xs"
                          >
                            <HelpCircle className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Preguntas Frecuentes</span>
                          </button>
                        </div>
                      </div>

                      {/* 7. REDES SOCIALES */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 font-['Inter']">
                          Redes Sociales
                        </div>
                        <button
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/ssp-element-type', 'social_links');
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onClick={() => addElement('social_links')}
                          className="w-full p-2.5 border border-zinc-200 bg-white hover:border-[#2848F0] hover:bg-blue-50/50 rounded-xl flex items-center justify-center gap-2 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs"
                        >
                          <Share2 className="w-5 h-5 text-[#2848F0] group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-semibold text-zinc-800 group-hover:text-[#2848F0]">Redes Sociales</span>
                        </button>
                      </div>

                      {/* 8. COLUMNAS INTERNAS */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-['Inter']">
                            Columnas Internas
                          </span>
                          <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                            Arrastra a sección
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mb-2.5 font-['Inter']">
                          Columnas internas dentro de una sección existente (no crea nueva sección):
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingInnerCols(1);
                              e.dataTransfer.setData('application/ssp-inner-columns', '1');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => {
                              setDraggingInnerCols(null);
                              setDropIndicator(null);
                              setRowDropIndicator(null);
                              setSectionDropIndicator(null);
                            }}
                            onClick={() => addColumnsLayout(1)}
                            className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra dentro de un bloque o haz clic para añadir 1 columna interna"
                          >
                            <div className="w-full h-5 rounded bg-indigo-100 border border-indigo-300 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-indigo-700">100%</span>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-indigo-600">1 Col</span>
                          </div>

                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingInnerCols(2);
                              e.dataTransfer.setData('application/ssp-inner-columns', '2');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => {
                              setDraggingInnerCols(null);
                              setDropIndicator(null);
                              setRowDropIndicator(null);
                              setSectionDropIndicator(null);
                            }}
                            onClick={() => addColumnsLayout(2)}
                            className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra dentro de un bloque o haz clic para añadir 2 columnas internas"
                          >
                            <div className="w-full h-5 rounded flex gap-1">
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[9px] font-bold text-indigo-700">50%</span>
                              </div>
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[9px] font-bold text-indigo-700">50%</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-indigo-600">2 Col</span>
                          </div>

                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingInnerCols(3);
                              e.dataTransfer.setData('application/ssp-inner-columns', '3');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => {
                              setDraggingInnerCols(null);
                              setDropIndicator(null);
                              setRowDropIndicator(null);
                              setSectionDropIndicator(null);
                            }}
                            onClick={() => addColumnsLayout(3)}
                            className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra dentro de un bloque o haz clic para añadir 3 columnas internas"
                          >
                            <div className="w-full h-5 rounded flex gap-0.5">
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-indigo-700">33%</span>
                              </div>
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-indigo-700">33%</span>
                              </div>
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-indigo-700">33%</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-indigo-600">3 Col</span>
                          </div>

                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggingInnerCols(4);
                              e.dataTransfer.setData('application/ssp-inner-columns', '4');
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={() => {
                              setDraggingInnerCols(null);
                              setDropIndicator(null);
                              setRowDropIndicator(null);
                              setSectionDropIndicator(null);
                            }}
                            onClick={() => addColumnsLayout(4)}
                            className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-zinc-800 cursor-grab active:cursor-grabbing group shadow-2xs select-none"
                            title="Arrastra a una sección o haz clic para añadir 4 columnas internas"
                          >
                            <div className="w-full h-5 rounded flex gap-0.5">
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-indigo-700">25%</span>
                              </div>
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-indigo-700">25%</span>
                              </div>
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-indigo-700">25%</span>
                              </div>
                              <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center">
                                <span className="text-[7px] font-bold text-indigo-700">25%</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold group-hover:text-indigo-600">4 Col</span>
                          </div>
                        </div>
                      </div>

                      {/* 8. CONVERSIÓN SSP */}
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
              setSelectedColumnId(null);
              setSelectedRowId(null);
              setSelectedSectionId(null);
              setActiveTab('page');
            }
          }}
        >
          <div
            ref={canvasContainerRef}
            className={`transition-all duration-300 shadow-xl border flex flex-col relative w-full h-auto shrink-0 min-h-[480px] ${
              isPreviewMode
                ? 'mb-16 shadow-2xl overflow-hidden'
                : 'mb-24 overflow-visible'
            } ${viewportMode === 'mobile' ? 'max-w-[390px] my-4' : ''}`}
            style={{
              maxWidth:
                viewportMode === 'mobile'
                  ? '390px'
                  : pageSettings.pageWidthType === 'full'
                  ? '100%'
                  : `${pageSettings.pageContentMaxWidth || 1200}px`,
              borderRadius: `${pageSettings.pageBorderRadius ?? 0}px`,
              backgroundColor: pageSettings.pageBgColor || '#FFFFFF',
              fontFamily: pageSettings.bodyFontFamily || 'Inter',
              color: pageSettings.textColor || '#121111',
              borderColor: '#E4E4E7',
              paddingTop: `${pageSettings.pagePaddingTop ?? 0}px`,
              paddingRight: `${pageSettings.pagePaddingRight ?? 0}px`,
              paddingBottom: `${pageSettings.pagePaddingBottom ?? 0}px`,
              paddingLeft: `${pageSettings.pagePaddingLeft ?? 0}px`,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isPreviewMode) {
                setSelectedElementId(null);
                setSelectedColumnId(null);
                setSelectedRowId(null);
                setSelectedSectionId(null);
                setActiveTab('page');
              }
            }}
          >
            {/* Optional Canvas Background Image Layer (supports opacity, fit, position, repeat, attachment) */}
            {pageSettings.pageBgImageEnabled !== false &&
              pageSettings.pageBgImageUrl &&
              pageSettings.pageBgImageUrl.trim() !== '' && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: `${pageSettings.pageBorderRadius ?? 0}px`,
                  backgroundImage: `url("${pageSettings.pageBgImageUrl}")`,
                  backgroundSize:
                    pageSettings.pageBgImageSize === 'stretch'
                      ? '100% 100%'
                      : pageSettings.pageBgImageSize || 'cover',
                  backgroundPosition: pageSettings.pageBgImagePosition || 'center',
                  backgroundRepeat: pageSettings.pageBgImageRepeat || 'no-repeat',
                  backgroundAttachment:
                    pageSettings.pageBgImageAttachment === 'fixed' ? 'fixed' : 'scroll',
                  opacity: (pageSettings.pageBgImageOpacity ?? 100) / 100,
                }}
              />
            )}

            {sections.length === 0 ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const prebuiltType = e.dataTransfer.getData('application/ssp-prebuilt-block') || draggingBlockType;
                  const elType = e.dataTransfer.getData('application/ssp-element-type') as ElementType;
                  const layout = (e.dataTransfer.getData('application/ssp-section-layout') || draggingSectionLayout) as '1col' | '2col' | '3col' | '4col' | undefined;
                  const innerCols = e.dataTransfer.getData('application/ssp-inner-columns') || (draggingInnerCols !== null ? String(draggingInnerCols) : '');
                  clearAllDragStates();
                  if (prebuiltType) {
                    insertPrebuiltBlock(prebuiltType);
                  } else if (layout) {
                    insertNewSection(layout);
                  } else if (innerCols) {
                    addColumnsLayout(parseInt(innerCols, 10) || 1);
                  } else if (elType) {
                    addElement(elType);
                  }
                }}
                className="relative min-h-[460px] flex flex-col items-center justify-center p-8 text-center"
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

              const sectionIsBoxed = isSectionBoxed(section);
              const sectionEffectiveMaxW = getSectionEffectiveMaxWidth(section, effectiveCanvasMaxWidth);
              const secBorderStyle = section.borderStyle || 'solid';
              const secBorderColor = section.borderColor || '#E4E4E7';

              // Compute background & outer box styles (when boxed, shrink & center entire section box)
              const sectionStyle: React.CSSProperties = {
                width: '100%',
                maxWidth:
                  viewportMode !== 'mobile' && sectionIsBoxed
                    ? `${sectionEffectiveMaxW}px`
                    : undefined,
                paddingTop: `${section.paddingTop ?? section.paddingY ?? 48}px`,
                paddingBottom: `${section.paddingBottom ?? section.paddingY ?? 48}px`,
                paddingLeft: `${section.paddingLeft ?? 24}px`,
                paddingRight: `${section.paddingRight ?? 24}px`,
                marginTop: `${section.marginTop ?? 0}px`,
                marginBottom: `${section.marginBottom ?? 0}px`,
                marginLeft:
                  viewportMode !== 'mobile' && sectionIsBoxed
                    ? section.marginLeft
                      ? `${section.marginLeft}px`
                      : 'auto'
                    : `${section.marginLeft ?? 0}px`,
                marginRight:
                  viewportMode !== 'mobile' && sectionIsBoxed
                    ? section.marginRight
                      ? `${section.marginRight}px`
                      : 'auto'
                    : `${section.marginRight ?? 0}px`,
                borderRadius: `${section.borderRadius ?? 0}px`,
                borderTop: section.borderTopWidth
                  ? `${section.borderTopWidth}px ${secBorderStyle} ${secBorderColor}`
                  : undefined,
                borderRight: section.borderRightWidth
                  ? `${section.borderRightWidth}px ${secBorderStyle} ${secBorderColor}`
                  : undefined,
                borderBottom: section.borderBottomWidth
                  ? `${section.borderBottomWidth}px ${secBorderStyle} ${secBorderColor}`
                  : undefined,
                borderLeft: section.borderLeftWidth
                  ? `${section.borderLeftWidth}px ${secBorderStyle} ${secBorderColor}`
                  : undefined,
                position: 'relative',
              };

              if (effectiveBgType === 'solid') {
                const hasCustomCanvasSurface = Boolean(
                  (pageSettings.pageBgImageEnabled !== false &&
                    pageSettings.pageBgImageUrl &&
                    pageSettings.pageBgImageUrl.trim() !== '') ||
                    (pageSettings.pageBgColor &&
                      pageSettings.pageBgColor.toUpperCase() !== '#FFFFFF')
                );
                const isUntouchedLegacyWhite =
                  !section.bgCustom &&
                  (!section.bgColor || section.bgColor.toUpperCase() === '#FFFFFF') &&
                  !sectionIsBoxed &&
                  hasCustomCanvasSurface;
                sectionStyle.backgroundColor =
                  section.bgColor === 'transparent' || isUntouchedLegacyWhite
                    ? 'transparent'
                    : section.bgColor || '#FFFFFF';
              } else if (effectiveBgType === 'gradient') {
                sectionStyle.backgroundImage = section.bgGradient || 'linear-gradient(135deg, #18181B 0%, #09090B 100%)';
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

                  <DelayedAppearance
                    delayMinutes={section.delayMinutes}
                    delaySeconds={section.delaySeconds}
                    active={isPreviewMode}
                    resetTrigger={previewResetCount}
                  >
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
                      const isInnerCols =
                        draggingInnerCols !== null || e.dataTransfer.types.includes('application/ssp-inner-columns');
                      if (!isPrebuilt && !isSectionDrag && !isSectionLayout && !isInnerCols) return;
                      e.preventDefault();
                      e.stopPropagation();
                      if (isInnerCols) {
                        setDropIndicator(null);
                        let closestRowIdx = 0;
                        let closestDist = Infinity;
                        let pos: 'before' | 'after' = 'after';
                        section.rows.forEach((r, idx) => {
                          const el = document.getElementById(r.id);
                          if (el) {
                            const rRect = el.getBoundingClientRect();
                            const mid = rRect.top + rRect.height / 2;
                            const dist = Math.abs(e.clientY - mid);
                            if (dist < closestDist) {
                              closestDist = dist;
                              closestRowIdx = idx;
                              pos = e.clientY < mid ? 'before' : 'after';
                            }
                          }
                        });
                        setRowDropIndicator({
                          sectionId: section.id,
                          rowIndex: closestRowIdx,
                          position: pos,
                        });
                        return;
                      }
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
                      const innerColsData =
                        e.dataTransfer.getData('application/ssp-inner-columns') ||
                        (draggingInnerCols !== null ? String(draggingInnerCols) : null);
                      if (innerColsData) {
                        e.preventDefault();
                        e.stopPropagation();
                        const cols = parseInt(innerColsData, 10) || 1;
                        let targetRowIdx: number;
                        if (rowDropIndicator && rowDropIndicator.sectionId === section.id) {
                          targetRowIdx =
                            rowDropIndicator.position === 'before'
                              ? rowDropIndicator.rowIndex
                              : rowDropIndicator.rowIndex + 1;
                        } else {
                          let closestRowIdx = Math.max(0, section.rows.length - 1);
                          let closestDist = Infinity;
                          let isBefore = false;
                          section.rows.forEach((r, idx) => {
                            const el = document.getElementById(r.id);
                            if (el) {
                              const rRect = el.getBoundingClientRect();
                              const mid = rRect.top + rRect.height / 2;
                              const dist = Math.abs(e.clientY - mid);
                              if (dist < closestDist) {
                                closestDist = dist;
                                closestRowIdx = idx;
                                isBefore = e.clientY < mid;
                              }
                            }
                          });
                          targetRowIdx = isBefore ? closestRowIdx : closestRowIdx + 1;
                        }
                        setDraggingInnerCols(null);
                        setRowDropIndicator(null);
                        setSectionDropIndicator(null);
                        addColumnsLayout(cols, section.id, targetRowIdx);
                        return;
                      }

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
                      setSelectedRowId(null);
                      setSelectedColumnId(null);
                      setSelectedElementId(null);
                    }}
                    className={`relative shrink-0 transition-all ${
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
                          borderRadius: 'inherit',
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

                        {((section.delayMinutes || 0) * 60 + (section.delaySeconds || 0)) > 0 && (
                          <div
                            className="flex items-center gap-1 bg-amber-900/90 text-amber-200 px-1.5 py-0.5 rounded text-[10px] font-mono select-none"
                            title={`Retardo de aparición programado: ${(section.delayMinutes || 0) > 0 ? `${section.delayMinutes}m ` : ''}${section.delaySeconds || 0}s`}
                          >
                            <Clock className="w-3 h-3 text-amber-300" />
                            <span>
                              {(section.delayMinutes || 0) > 0 ? `${section.delayMinutes}m ` : ''}
                              {section.delaySeconds || 0}s
                            </span>
                          </div>
                        )}

                      <div className="w-[1px] h-3.5 bg-amber-400 mx-0.5" />

                      {/* Section Settings (Tuerca de Configuración) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSectionId(section.id);
                          setSelectedElementId(null);
                          setSelectedColumnId(null);
                          setSelectedRowId(null);
                          const inspectorEl = document.getElementById('inspector-panel-sidebar');
                          if (inspectorEl) {
                            inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="p-1 rounded hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center"
                        title="Configuración de la sección"
                      >
                        <Settings className="w-3.5 h-3.5 text-white" />
                      </button>

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
                {(() => {
                  const computeDropPositionInColumn = (col: PageBlockColumn, clientY: number) => {
                    if (col.elements.length === 0) {
                      return { index: 0, position: 'before' as const, targetIdx: 0 };
                    }
                    let closestIdx = col.elements.length - 1;
                    let closestDist = Infinity;
                    let pos: 'before' | 'after' = 'after';
                    for (let idx = 0; idx < col.elements.length; idx++) {
                      const childEl = col.elements[idx];
                      const domEl = document.getElementById(childEl.id);
                      if (domEl) {
                        const rect = domEl.getBoundingClientRect();
                        const mid = rect.top + rect.height / 2;
                        const dist = Math.abs(clientY - mid);
                        if (dist < closestDist) {
                          closestDist = dist;
                          closestIdx = idx;
                          pos = clientY < mid ? 'before' : 'after';
                        }
                      }
                    }
                    const targetIdx = pos === 'before' ? closestIdx : closestIdx + 1;
                    return { index: closestIdx, position: pos, targetIdx };
                  };

                  const renderCanvasRow = (
                    row: PageBlockRow,
                    rIdx: number,
                    depth: 0 | 1,
                    wrapperEl?: PageBlockElement,
                    parentElementsCount?: number,
                    governingMaxW: number = sectionEffectiveMaxW
                  ): React.ReactNode => {
                    const isRowSelected =
                      !isPreviewMode &&
                      !selectedColumnId &&
                      ((selectedRowId === row.id && !selectedElementId) ||
                        (Boolean(wrapperEl) && selectedElementId === wrapperEl!.id));
                    const isRowHovered = !isPreviewMode && hoveredRowId === row.id && !selectedElementId;
                    const isDraggingWrapper = Boolean(wrapperEl && draggingElementId === wrapperEl.id);
                    const canRowMoveUp = depth === 0 ? rIdx > 0 : rIdx > 0;
                    const canRowMoveDown =
                      depth === 0
                        ? rIdx < section.rows.length - 1
                        : rIdx < (parentElementsCount ?? 1) - 1;
                    const canRowDelete = depth === 1 ? true : section.rows.length > 1;

                    const effectiveRowMaxW =
                      (row.widthType || 'boxed') === 'boxed' && row.maxWidth
                        ? Math.min(row.maxWidth, governingMaxW)
                        : governingMaxW;

                    const rowStyle: React.CSSProperties = {
                      maxWidth:
                        (row.widthType || 'boxed') === 'boxed' && row.maxWidth
                          ? `${effectiveRowMaxW}px`
                          : row.widthType === 'full'
                          ? '100%'
                          : undefined,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginTop: row.marginTop !== undefined ? `${row.marginTop}px` : '0px',
                      marginBottom: row.marginBottom !== undefined ? `${row.marginBottom}px` : '0px',
                      paddingTop: row.paddingTop !== undefined ? `${row.paddingTop}px` : undefined,
                      paddingBottom: row.paddingBottom !== undefined ? `${row.paddingBottom}px` : undefined,
                      paddingLeft: row.paddingLeft !== undefined ? `${row.paddingLeft}px` : undefined,
                      paddingRight: row.paddingRight !== undefined ? `${row.paddingRight}px` : undefined,
                      backgroundColor: row.bgColor || undefined,
                      borderRadius: `${row.borderRadius ?? 0}px`,
                      borderWidth: row.borderWidth !== undefined ? `${row.borderWidth}px` : undefined,
                      borderColor: row.borderColor || undefined,
                      borderStyle: row.borderStyle || (row.borderWidth ? 'solid' : undefined),
                    };

                    return (
                      <React.Fragment key={row.id || rIdx}>
                        {/* Visual Drop Line Indicator Before Row (outer rows only) */}
                        {!isPreviewMode &&
                          depth === 0 &&
                          rowDropIndicator &&
                          rowDropIndicator.sectionId === section.id &&
                          rowDropIndicator.rowIndex === rIdx &&
                          rowDropIndicator.position === 'before' && (
                            <div className="w-full h-2 bg-indigo-600 rounded-full my-2.5 shadow-md relative flex items-center justify-center animate-pulse z-40 pointer-events-none">
                              <div className="absolute -top-3 bg-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <span>Insertar columnas aquí</span>
                              </div>
                            </div>
                          )}

                        <DelayedAppearance
                          delayMinutes={row.delayMinutes}
                          delaySeconds={row.delaySeconds}
                          active={isPreviewMode}
                          resetTrigger={previewResetCount}
                        >
                        <div
                          id={row.id}
                          style={rowStyle}
                          onMouseOver={(e) => {
                            if (isPreviewMode) return;
                            e.stopPropagation();
                            if (hoveredRowId !== row.id) {
                              setHoveredRowId(row.id);
                            }
                          }}
                          onMouseLeave={() => {
                            if (!isPreviewMode && hoveredRowId === row.id) {
                              setHoveredRowId(null);
                            }
                          }}
                          onDragOver={(e) => {
                            const isInnerCols =
                              draggingInnerCols !== null ||
                              e.dataTransfer.types.includes('application/ssp-inner-columns');
                            const draggedEl = draggingElementId ? findElementById(sections, draggingElementId) : null;
                            if (depth === 1) {
                              if (isInnerCols || draggedEl?.type === 'inner_columns') {
                                e.preventDefault();
                                e.stopPropagation();
                                setDropIndicator(null);
                                setRowDropIndicator(null);
                              }
                              return;
                            }
                            if (isInnerCols) {
                              e.preventDefault();
                              e.stopPropagation();
                              setDropIndicator(null);
                              const rect = e.currentTarget.getBoundingClientRect();
                              const relativeY = e.clientY - rect.top;
                              const position = relativeY < rect.height / 2 ? 'before' : 'after';
                              setRowDropIndicator({
                                sectionId: section.id,
                                rowIndex: rIdx,
                                position,
                              });
                            }
                          }}
                          onDrop={(e) => {
                            const innerColsData =
                              e.dataTransfer.getData('application/ssp-inner-columns') ||
                              (draggingInnerCols !== null ? String(draggingInnerCols) : null);
                            if (depth === 1) {
                              const sourceId = e.dataTransfer.getData('application/ssp-element-id') || draggingElementId;
                              const sourceEl = sourceId ? findElementById(sections, sourceId) : null;
                              if (innerColsData || sourceEl?.type === 'inner_columns') {
                                e.preventDefault();
                                e.stopPropagation();
                                setDraggingInnerCols(null);
                                setDraggingElementId(null);
                                setDropIndicator(null);
                                setRowDropIndicator(null);
                                showToast('Solo se permite una sección interna dentro de un bloque (máximo 1 nivel)');
                              }
                              return;
                            }
                            if (innerColsData) {
                              e.preventDefault();
                              e.stopPropagation();
                              const cols = parseInt(innerColsData, 10) || 1;
                              const rect = e.currentTarget.getBoundingClientRect();
                              const relativeY = e.clientY - rect.top;
                              const position =
                                rowDropIndicator &&
                                rowDropIndicator.sectionId === section.id &&
                                rowDropIndicator.rowIndex === rIdx
                                  ? rowDropIndicator.position
                                  : relativeY < rect.height / 2
                                  ? 'before'
                                  : 'after';
                              const targetRowIdx = position === 'before' ? rIdx : rIdx + 1;
                              setDraggingInnerCols(null);
                              setDropIndicator(null);
                              setRowDropIndicator(null);
                              setSectionDropIndicator(null);
                              addColumnsLayout(cols, section.id, targetRowIdx);
                              return;
                            }
                          }}
                          onClick={(e) => {
                            if (isPreviewMode) return;
                            e.stopPropagation();
                            setSelectedSectionId(section.id);
                            setSelectedRowId(row.id);
                            setSelectedColumnId(null);
                            setSelectedElementId(null);
                          }}
                          className={`relative transition-all group/row ${
                            isDraggingWrapper ? 'opacity-35 scale-[0.99] border-2 border-dashed border-indigo-500' : ''
                          } ${
                            !isPreviewMode
                              ? isRowSelected
                                ? 'ring-2 ring-indigo-600 bg-indigo-50/10'
                                : isRowHovered
                                ? 'ring-1 ring-indigo-400/80 ring-dashed'
                                : ''
                              : ''
                          }`}
                        >
                        {/* FLOATING ACTION TOOLBAR FOR SELECTED OR HOVERED INTERNAL SECTION (ROW) */}
                        {!isPreviewMode && (isRowSelected || isRowHovered) && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute -top-7 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-t-md uppercase tracking-wider z-30 flex items-center gap-1.5 shadow-md select-none"
                          >
                            <div
                              draggable={Boolean(wrapperEl && !isPreviewMode)}
                              onDragStart={(e) => {
                                if (!wrapperEl || isPreviewMode) return;
                                e.stopPropagation();
                                setDraggingElementId(wrapperEl.id);
                                e.dataTransfer.setData('application/ssp-element-id', wrapperEl.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragEnd={() => {
                                setDraggingElementId(null);
                                setDropIndicator(null);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSectionId(section.id);
                                setSelectedRowId(row.id);
                                setSelectedColumnId(null);
                                setSelectedElementId(null);
                              }}
                              className={`flex items-center gap-1 px-1 py-0.5 rounded hover:bg-indigo-700 transition-colors ${
                                wrapperEl ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                              }`}
                              title={
                                wrapperEl
                                  ? 'Clic para editar sección interna o arrastra para reordenar dentro del bloque'
                                  : 'Clic para editar sección interna'
                              }
                            >
                              {wrapperEl ? (
                                <Move className="w-3 h-3 text-white" />
                              ) : (
                                <Box className="w-3.5 h-3.5 text-white" />
                              )}
                              <span>{formatRowDisplayName(row.name, 'Sección Interna')}</span>
                            </div>
                            {((row.delayMinutes || 0) * 60 + (row.delaySeconds || 0)) > 0 && (
                              <div
                                className="flex items-center gap-1 bg-indigo-900/90 text-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-mono select-none"
                                title={`Retardo de aparición programado: ${(row.delayMinutes || 0) > 0 ? `${row.delayMinutes}m ` : ''}${row.delaySeconds || 0}s`}
                              >
                                <Clock className="w-3 h-3 text-indigo-300" />
                                <span>
                                  {(row.delayMinutes || 0) > 0 ? `${row.delayMinutes}m ` : ''}
                                  {row.delaySeconds || 0}s
                                </span>
                              </div>
                            )}
                            <div className="w-[1px] h-3 bg-indigo-400 mx-0.5" />
                            {/* Row Settings (Tuerca de Configuración) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRowId(row.id);
                                setSelectedSectionId(section.id);
                                setSelectedColumnId(null);
                                setSelectedElementId(null);
                                const inspectorEl = document.getElementById('inspector-panel-sidebar');
                                if (inspectorEl) {
                                  inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="p-1 hover:bg-indigo-700 rounded transition-colors cursor-pointer flex items-center"
                              title="Configuración de la sección interna"
                            >
                              <Settings className="w-3 h-3 text-white" />
                            </button>
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveRow('up', section.id, row.id);
                              }}
                              disabled={!canRowMoveUp}
                              className="p-0.5 hover:bg-indigo-700 disabled:opacity-40 rounded transition-colors cursor-pointer flex items-center"
                              title="Subir sección interna"
                            >
                              <ArrowUp className="w-3 h-3 text-white" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveRow('down', section.id, row.id);
                              }}
                              disabled={!canRowMoveDown}
                              className="p-0.5 hover:bg-indigo-700 disabled:opacity-40 rounded transition-colors cursor-pointer flex items-center"
                              title="Bajar sección interna"
                            >
                              <ArrowDown className="w-3 h-3 text-white" />
                            </button>
                            <div className="w-[1px] h-3 bg-indigo-400 mx-0.5" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRow(row.id);
                              }}
                              disabled={!canRowDelete}
                              className="p-1 hover:bg-red-600 disabled:opacity-40 rounded transition-colors cursor-pointer flex items-center text-white"
                              title="Eliminar sección interna"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        )}

                        <div
                          className={`flex flex-wrap -mx-3 items-stretch ${
                            viewportMode === 'mobile' ? 'flex-col gap-4' : ''
                          }`}
                        >
                      {row.columns.map((column, cIdx) => {
                        const isColumnSelected =
                          !isPreviewMode && selectedColumnId === column.id && !selectedElementId;
                        const colSurfaceStyle = getColumnSurfaceStyle(column, { isPreview: isPreviewMode });
                        const colShadowClass = getColumnShadowClass(column.shadow);
                        const hasCustomColBorder = Boolean(column.borderWidth && column.borderWidth > 0);

                        return (
                          <div
                            key={column.id}
                            style={{
                              width: viewportMode === 'mobile' ? '100%' : `${column.widthPercentage}%`,
                            }}
                            className="px-3 flex flex-col relative"
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

                              const isInnerCols =
                                draggingInnerCols !== null ||
                                e.dataTransfer.types.includes('application/ssp-inner-columns');
                              const draggedEl = draggingElementId ? findElementById(sections, draggingElementId) : null;

                              if (depth === 1 && (isInnerCols || draggedEl?.type === 'inner_columns')) {
                                e.preventDefault();
                                e.stopPropagation();
                                setDropIndicator(null);
                                setRowDropIndicator(null);
                                return;
                              }

                              e.preventDefault();
                              e.stopPropagation();
                              setRowDropIndicator(null);
                              setSectionDropIndicator(null);

                              const { index, position } = computeDropPositionInColumn(column, e.clientY);
                              setDropIndicator((prev) =>
                                prev && prev.colId === column.id && prev.index === index && prev.position === position
                                  ? prev
                                  : { colId: column.id, index, position }
                              );
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

                              const innerColsData =
                                e.dataTransfer.getData('application/ssp-inner-columns') ||
                                (draggingInnerCols !== null ? String(draggingInnerCols) : null);

                              if (innerColsData) {
                                e.preventDefault();
                                e.stopPropagation();
                                const cols = parseInt(innerColsData, 10) || 1;
                                if (depth === 1) {
                                  setDraggingInnerCols(null);
                                  setDropIndicator(null);
                                  setRowDropIndicator(null);
                                  setSectionDropIndicator(null);
                                  showToast('Solo se permite una sección interna dentro de un bloque (máximo 1 nivel)');
                                  return;
                                }
                                const computed = computeDropPositionInColumn(column, e.clientY);
                                const targetIdx =
                                  dropIndicator && dropIndicator.colId === column.id
                                    ? dropIndicator.position === 'before'
                                      ? dropIndicator.index
                                      : dropIndicator.index + 1
                                    : computed.targetIdx;
                                setDraggingInnerCols(null);
                                setDropIndicator(null);
                                setRowDropIndicator(null);
                                setSectionDropIndicator(null);
                                insertNestedColumnsAt(cols, column.id, targetIdx);
                                return;
                              }

                              e.preventDefault();
                              e.stopPropagation();

                              const sourceId = e.dataTransfer.getData('application/ssp-element-id') || draggingElementId;
                              if (sourceId && depth === 1) {
                                const srcEl = findElementById(sections, sourceId);
                                if (srcEl?.type === 'inner_columns') {
                                  clearAllDragStates();
                                  showToast('Solo se permite una sección interna dentro de un bloque (máximo 1 nivel)');
                                  return;
                                }
                              }

                              const computed = computeDropPositionInColumn(column, e.clientY);
                              const targetIdx =
                                dropIndicator && dropIndicator.colId === column.id
                                  ? dropIndicator.position === 'before'
                                    ? dropIndicator.index
                                    : dropIndicator.index + 1
                                  : computed.targetIdx;

                              // Handle sidebar drop
                              const droppedType = e.dataTransfer.getData('application/ssp-element-type') as ElementType;
                              const droppedLevel = e.dataTransfer.getData('application/ssp-element-level') as
                                | 'h1'
                                | 'h2'
                                | 'h3'
                                | 'h4'
                                | undefined;
                              clearAllDragStates();
                              if (droppedType) {
                                insertElementAt(droppedType, column.id, targetIdx, droppedLevel ? { level: droppedLevel } : undefined);
                                return;
                              }

                              // Handle canvas internal reorder
                              if (sourceId) {
                                reorderCanvasElement(sourceId, column.id, targetIdx);
                              }
                            }}
                          >
                            <div
                              style={colSurfaceStyle}
                              onClick={(e) => {
                                if (isPreviewMode) return;
                                e.stopPropagation();
                                setSelectedSectionId(section.id);
                                setSelectedRowId(row.id);
                                setSelectedColumnId(null);
                                setSelectedElementId(null);
                              }}
                              className={`w-full flex-1 relative transition-all ${colShadowClass} ${
                                isPreviewMode
                                  ? 'min-h-0'
                                  : `min-h-[76px] cursor-pointer ${
                                      !hasCustomColBorder
                                        ? dropIndicator?.colId === column.id
                                          ? 'border-2 border-dashed border-[#2848F0] bg-blue-50/20'
                                          : isColumnSelected
                                          ? 'border-2 border-solid border-indigo-500'
                                          : 'border border-dashed border-zinc-300/80'
                                        : ''
                                    }`
                              }`}
                            >
                              {!isPreviewMode && column.elements.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-4 px-2 pointer-events-none select-none">
                                  {dropIndicator?.colId === column.id ? (
                                    <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse">
                                      <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                        <span>Soltar aquí</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-[11px] font-semibold text-zinc-500">
                                        {column.name || `Columna ${cIdx + 1}`}
                                      </span>
                                      <span className="text-[10px] text-zinc-400 italic mt-0.5">
                                        Arrastra elementos aquí
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}

                              {column.elements.map((element, elIdx) => {
                                if (element.type === 'inner_columns' && element.nestedRow) {
                                  return (
                                    <React.Fragment key={element.id}>
                                      {!isPreviewMode &&
                                        dropIndicator &&
                                        dropIndicator.colId === column.id &&
                                        dropIndicator.index === elIdx &&
                                        dropIndicator.position === 'before' && (
                                          <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-30 pointer-events-none">
                                            <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                              <span>Soltar aquí</span>
                                            </div>
                                          </div>
                                        )}

                                      {depth === 0 && (
                                        <div
                                          id={element.id}
                                          style={{
                                            marginTop: `${element.styles.marginTop || 0}px`,
                                            marginBottom: `${element.styles.marginBottom ?? 16}px`,
                                          }}
                                          className="relative w-full"
                                        >
                                          {renderCanvasRow(
                                            element.nestedRow,
                                            elIdx,
                                            1,
                                            element,
                                            column.elements.length,
                                            effectiveRowMaxW
                                          )}
                                        </div>
                                      )}

                                      {!isPreviewMode &&
                                        dropIndicator &&
                                        dropIndicator.colId === column.id &&
                                        dropIndicator.index === elIdx &&
                                        dropIndicator.position === 'after' && (
                                          <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-30 pointer-events-none">
                                            <div className="absolute -top-2.5 bg-[#2848F0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                              <span>Soltar aquí</span>
                                            </div>
                                          </div>
                                        )}
                                    </React.Fragment>
                                  );
                                }

                                const isSelected = selectedElementId === element.id;
                                const isDraggingThis = draggingElementId === element.id;

                                return (
                                  <React.Fragment key={element.id}>
                                    {/* HORIZONTAL PLACEMENT DROP LINE INDICATOR (BEFORE) - REQ 2 */}
                                    {!isPreviewMode &&
                                      dropIndicator &&
                                      dropIndicator.colId === column.id &&
                                      dropIndicator.index === elIdx &&
                                      dropIndicator.position === 'before' && (
                                        <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-30 pointer-events-none">
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
                                        const isInnerCols =
                                          draggingInnerCols !== null ||
                                          e.dataTransfer.types.includes('application/ssp-inner-columns');
                                        const draggedEl = draggingElementId
                                          ? findElementById(sections, draggingElementId)
                                          : null;
                                        if (depth === 1 && (isInnerCols || draggedEl?.type === 'inner_columns')) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setDropIndicator(null);
                                          setRowDropIndicator(null);
                                          return;
                                        }
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setRowDropIndicator(null);
                                        setSectionDropIndicator(null);
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const relativeY = e.clientY - rect.top;
                                        const position = relativeY < rect.height / 2 ? 'before' : 'after';
                                        setDropIndicator((prev) =>
                                          prev &&
                                          prev.colId === column.id &&
                                          prev.index === elIdx &&
                                          prev.position === position
                                            ? prev
                                            : {
                                                colId: column.id,
                                                index: elIdx,
                                                position,
                                              }
                                        );
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isPreviewMode) {
                                          setSelectedElementId(element.id);
                                          setSelectedColumnId(null);
                                          setSelectedRowId(row.id);
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

                                          {/* Element Settings (Tuerca de Configuración) */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedElementId(element.id);
                                              setSelectedColumnId(null);
                                              setSelectedSectionId(section.id);
                                              setSelectedRowId(row.id);
                                              const inspectorEl = document.getElementById('inspector-panel-sidebar');
                                              if (inspectorEl) {
                                                inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                              }
                                            }}
                                            className="p-1 rounded hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center"
                                            title="Configuración del elemento"
                                          >
                                            <Settings className="w-3.5 h-3.5 text-white" />
                                          </button>

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
                                          element.type === 'button' ||
                                          element.type === 'popup_button' ||
                                          element.type === 'form_button') && (
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
                                                  marginRight: `${element.styles.bulletSpacing ?? 10}px`,
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
                                                  flex: element.styles.textAlign === 'center' || element.styles.textAlign === 'right' ? '0 1 auto' : '1 1 auto',
                                                  minWidth: 0,
                                                  textAlign: element.styles.textAlign || 'left',
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

                                    {element.type === 'button' && (() => {
                                      const isFullWidth = Boolean(element.styles.fullWidth);
                                      const align = element.styles.textAlign || 'center';
                                      const normalBg = element.styles.bgColor || pageSettings.primaryColor || '#2848F0';
                                      const normalText = element.styles.textColor || '#FFFFFF';
                                      const bWidth = element.styles.borderWidth ?? 0;
                                      const hasBorder = bWidth > 0;
                                      const normalBorder = element.styles.borderColor || '#18181B';
                                      const hoverBg = element.styles.hoverBgColor || normalBg;
                                      const hoverText = element.styles.hoverTextColor || normalText;
                                      const hoverBorder = hasBorder ? (element.styles.hoverBorderColor || normalBorder) : 'transparent';

                                      const padY = element.styles.buttonPaddingY ?? 14;
                                      const padX = element.styles.buttonPaddingX ?? 28;
                                      const fontSize = element.styles.fontSize || 16;

                                      const iconName = element.content.buttonIcon || '';
                                      const IconComp = iconName ? (LucideIcons as any)[iconName] : null;
                                      const iconPos = element.content.buttonIconPosition || 'before';
                                      const iconSpacing = element.content.buttonIconSpacing ?? 8;
                                      const iconSize = element.content.buttonIconSize ?? Math.max(14, Math.round(fontSize * 1.05));

                                        const rawBtnText = element.content.buttonText || 'Botón de Acción';
                                        const displayBtnText =
                                          editingCanvasButtonId === element.id
                                            ? rawBtnText
                                            : formatCtaDisplayText(rawBtnText, element.styles.textTransform);

                                        const showSubtext =
                                          Boolean(element.content.buttonSubtextEnabled) &&
                                          Boolean((element.content.buttonSubtext || '').trim());
                                        const subtextFontSize = element.content.buttonSubtextFontSize ?? 12;
                                        const subtextFontFamily =
                                          element.content.buttonSubtextFontFamily ||
                                          element.styles.fontFamily ||
                                          pageSettings.bodyFontFamily ||
                                          'Poppins';
                                        const subtextColor =
                                          element.content.buttonSubtextColor || 'rgba(255, 255, 255, 0.85)';
                                        const subtextGap = element.content.buttonSubtextGap ?? 4;
                                        const subtextTransform = element.content.buttonSubtextTransform || 'none';
                                        const displaySubtext = formatCtaDisplayText(
                                          element.content.buttonSubtext || '',
                                          subtextTransform
                                        );
                                        const subtextIconName = element.content.buttonSubtextIcon || '';
                                        const SubtextIconComp = subtextIconName
                                          ? (LucideIcons as any)[subtextIconName]
                                          : null;
                                        const subtextIconSize = Math.max(10, Math.round(subtextFontSize * 1.05));

                                        return (
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: isFullWidth
                                                ? 'center'
                                                : align === 'left'
                                                ? 'flex-start'
                                                : align === 'right'
                                                ? 'flex-end'
                                                : 'center',
                                              width: '100%',
                                            }}
                                          >
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (isPreviewMode && element.styles.buttonDestination === 'url' && element.styles.buttonUrl) {
                                                  const link = document.createElement('a');
                                                  link.href = element.styles.buttonUrl;
                                                  if (element.styles.buttonOpenNewTab) {
                                                    link.target = '_blank';
                                                    link.rel = 'noopener noreferrer';
                                                  } else {
                                                    link.target = '_self';
                                                  }
                                                  link.click();
                                                }
                                              }}
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
                                                  fontFamily: element.styles.fontFamily || pageSettings.bodyFontFamily || 'Poppins',
                                                  fontWeight: element.styles.isBold ? 700 : 500,
                                                  fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                                  paddingTop: `${padY}px`,
                                                  paddingBottom: `${padY}px`,
                                                  paddingLeft: `${padX}px`,
                                                  paddingRight: `${padX}px`,
                                                  borderRadius: `${element.styles.borderRadius ?? 0}px`,
                                                  borderWidth: `${bWidth}px`,
                                                  borderStyle: hasBorder ? (element.styles.borderStyle || 'solid') : 'none',
                                                  outline: isSelected ? 'none' : undefined,
                                                } as React.CSSProperties
                                              }
                                              className="[background-color:var(--cta-bg)] hover:[background-color:var(--cta-hover-bg)] [color:var(--cta-text)] hover:[color:var(--cta-hover-text)] [border-color:var(--cta-border)] hover:[border-color:var(--cta-hover-border)] shadow-sm transition-colors duration-200 inline-flex flex-col items-center justify-center font-semibold cursor-pointer text-center"
                                            >
                                              <span
                                                className="inline-flex items-center justify-center"
                                                style={{
                                                  gap: IconComp ? `${iconSpacing}px` : '0px',
                                                  textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                                  textTransform: element.styles.textTransform || 'none',
                                                }}
                                              >
                                                {IconComp && iconPos === 'before' && (
                                                  <IconComp
                                                    style={{
                                                      width: `${iconSize}px`,
                                                      height: `${iconSize}px`,
                                                    }}
                                                    className="shrink-0"
                                                  />
                                                )}
                                                <span
                                                  contentEditable={!isPreviewMode && isSelected}
                                                  suppressContentEditableWarning={true}
                                                  onFocus={() => {
                                                    setEditingCanvasButtonId(element.id);
                                                    dirtyCanvasButtonTextRef.current = null;
                                                  }}
                                                  onInput={(e) => {
                                                    dirtyCanvasButtonTextRef.current = e.currentTarget.textContent || '';
                                                  }}
                                                  onBlur={() => {
                                                    setEditingCanvasButtonId(null);
                                                    if (dirtyCanvasButtonTextRef.current !== null) {
                                                      updateSelectedElement({}, { buttonText: dirtyCanvasButtonTextRef.current });
                                                      dirtyCanvasButtonTextRef.current = null;
                                                    }
                                                  }}
                                                  className="outline-none"
                                                >
                                                  {displayBtnText}
                                                </span>
                                                {IconComp && iconPos === 'after' && (
                                                  <IconComp
                                                    style={{
                                                      width: `${iconSize}px`,
                                                      height: `${iconSize}px`,
                                                    }}
                                                    className="shrink-0"
                                                  />
                                                )}
                                              </span>

                                              {showSubtext && (
                                                <span
                                                  className="inline-flex items-center justify-center leading-tight"
                                                  style={{
                                                    marginTop: `${subtextGap}px`,
                                                    fontSize: `${subtextFontSize}px`,
                                                    fontFamily: subtextFontFamily,
                                                    color: subtextColor,
                                                    fontWeight: element.content.buttonSubtextBold ? 700 : 400,
                                                    fontStyle: element.content.buttonSubtextItalic ? 'italic' : 'normal',
                                                    textDecoration: element.content.buttonSubtextUnderline
                                                      ? 'underline'
                                                      : 'none',
                                                    textTransform: subtextTransform,
                                                    gap: '4px',
                                                  }}
                                                >
                                                  {SubtextIconComp && (
                                                    <SubtextIconComp
                                                      style={{
                                                        width: `${subtextIconSize}px`,
                                                        height: `${subtextIconSize}px`,
                                                      }}
                                                      className="shrink-0"
                                                    />
                                                  )}
                                                  <span>{displaySubtext}</span>
                                                </span>
                                              )}
                                            </button>
                                          </div>
                                        );
                                      })()}

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
                                          videoFileName={element.content.videoFileName}
                                          aspectRatio={element.styles.aspectRatio || '16/9'}
                                          borderRadius={element.styles.borderRadius ?? 0}
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
                                            updateElementContent(element.id, {
                                              videoUrl: sampleUrl,
                                              videoFileName: '',
                                              videoSource: 'youtube',
                                            });
                                          }}
                                          videoSource={element.content.videoSource}
                                          videoAutoplay={element.content.videoAutoplay}
                                          videoMuted={element.content.videoMuted}
                                          videoLoop={element.content.videoLoop}
                                          videoCoverType={element.content.videoCoverType}
                                          videoCoverImage={element.content.videoCoverImage}
                                          videoCoverText={element.content.videoCoverText}
                                          videoCoverTextFont={element.content.videoCoverTextFont}
                                          videoCoverTextSize={element.content.videoCoverTextSize}
                                          videoCoverTextColor={element.content.videoCoverTextColor}
                                          videoCoverTextBg={element.content.videoCoverTextBg}
                                          videoCoverTextBold={element.content.videoCoverTextBold}
                                          videoCoverPlayIcon={element.content.videoCoverPlayIcon}
                                          videoCoverButtonShape={element.content.videoCoverButtonShape}
                                          videoCoverPlayColor={element.content.videoCoverPlayColor}
                                          videoCoverPlayBg={element.content.videoCoverPlayBg}
                                          videoCoverPlaySize={element.content.videoCoverPlaySize}
                                          videoCoverArrowType={element.content.videoCoverArrowType}
                                          videoCoverArrowColor={element.content.videoCoverArrowColor}
                                          videoCoverArrowSize={element.content.videoCoverArrowSize}
                                          videoCoverArrowRotation={element.content.videoCoverArrowRotation}
                                          videoCoverBgType={element.content.videoCoverBgType}
                                          videoCoverBgColor={element.content.videoCoverBgColor}
                                          videoCoverBgColor2={element.content.videoCoverBgColor2}
                                          videoCoverBgOpacity={element.content.videoCoverBgOpacity}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'image' && (() => {
                                      const linkUrl = element.styles.linkUrl || element.content.linkUrl;
                                      const linkOpenNewTab = element.styles.linkOpenNewTab ?? element.content.linkOpenNewTab ?? true;
                                      const imgNode = (
                                        <ConfiguredImage
                                          src={element.content.src}
                                          alt={element.content.alt}
                                          styles={element.styles}
                                          defaultWidth={450}
                                        />
                                      );

                                      return (
                                        <div
                                          style={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent:
                                              element.styles.textAlign === 'left'
                                                ? 'flex-start'
                                                : element.styles.textAlign === 'right'
                                                ? 'flex-end'
                                                : 'center',
                                          }}
                                        >
                                          {linkUrl ? (
                                            <a
                                              href={isPreviewMode ? linkUrl : undefined}
                                              target={linkOpenNewTab ? '_blank' : '_self'}
                                              rel="noopener noreferrer"
                                              onClick={(e) => {
                                                if (!isPreviewMode) e.preventDefault();
                                              }}
                                              style={{ display: 'inline-flex', maxWidth: '100%' }}
                                              className="cursor-pointer"
                                            >
                                              {imgNode}
                                            </a>
                                          ) : (
                                            imgNode
                                          )}
                                        </div>
                                      );
                                    })()}

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
                                          defaultPrimaryColor={pageSettings.primaryColor}
                                          defaultFontFamily={pageSettings.bodyFontFamily}
                                          onSubmitSuccess={() => {
                                            showToast('¡Información enviada con éxito!');
                                          }}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'inline_form' && (
                                      <div className="w-full">
                                        <InlineFormElement
                                          element={element}
                                          isEditable={!isPreviewMode}
                                          defaultPrimaryColor="#F5B056"
                                          defaultFontFamily={pageSettings.bodyFontFamily}
                                          onSubmitSuccess={() => {
                                            showToast('¡Correo registrado con éxito!');
                                          }}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'popup_button' && (
                                      <div className="w-full">
                                        <PopupButtonElement
                                          element={element}
                                          isEditable={!isPreviewMode}
                                          isSelected={!isPreviewMode && isSelected}
                                          defaultPrimaryColor={pageSettings.primaryColor}
                                          defaultFontFamily={pageSettings.bodyFontFamily}
                                          onUpdateText={(newText) => {
                                            updateSelectedElement({}, { popupButtonText: newText });
                                          }}
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

                                    {element.type === 'countdown' && (
                                      <div
                                        style={{
                                          textAlign: element.styles.textAlign || 'center',
                                        }}
                                        className="w-full py-2"
                                      >
                                        <CountdownTimerWidget
                                          endDate={element.content.countdownEndDate}
                                          daysLabel={element.content.countdownDaysLabel}
                                          hoursLabel={element.content.countdownHoursLabel}
                                          minutesLabel={element.content.countdownMinutesLabel}
                                          secondsLabel={element.content.countdownSecondsLabel}
                                          theme={element.content.countdownTheme || 'dark'}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'faq' && (
                                      <div className="w-full py-2">
                                        <FaqAccordionWidget items={element.content.faqItems} />
                                      </div>
                                    )}

                                    {element.type === 'social_links' && (
                                      <div
                                        style={{
                                          textAlign: element.styles.textAlign || 'center',
                                        }}
                                        className="w-full py-2"
                                      >
                                        <SocialLinksWidget
                                          links={element.content.socialLinks}
                                          size={element.content.socialSize || 'md'}
                                          styleType={element.content.socialStyle || 'colored'}
                                          colorMode={element.content.socialColorMode || 'default'}
                                          iconColor={element.content.socialIconColor || '#FFFFFF'}
                                          bgColor={element.content.socialBgColor || '#2848F0'}
                                          shape={element.content.socialShape || 'circle'}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'checkbox' && (
                                      <div
                                        style={{
                                          textAlign: element.styles.textAlign || 'left',
                                        }}
                                        className="w-full py-1.5"
                                      >
                                        <CheckboxWidget
                                          label={element.content.checkboxLabel}
                                          checked={element.content.checkboxChecked}
                                          required={element.content.checkboxRequired}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'input_field' && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent:
                                            element.styles.textAlign === 'center'
                                              ? 'center'
                                              : element.styles.textAlign === 'right'
                                              ? 'flex-end'
                                              : 'flex-start',
                                        }}
                                        className="w-full py-1.5"
                                      >
                                        <InputFieldWidget
                                          label={element.content.fieldLabel}
                                          placeholder={element.content.fieldPlaceholder}
                                          type={element.content.fieldType || 'email'}
                                          required={element.content.fieldRequired}
                                        />
                                      </div>
                                    )}

                                    {element.type === 'form_button' && (
                                      <div
                                        style={{
                                          textAlign: element.styles.textAlign || 'center',
                                          display: 'flex',
                                          justifyContent:
                                            element.styles.textAlign === 'left'
                                              ? 'flex-start'
                                              : element.styles.textAlign === 'right'
                                              ? 'flex-end'
                                              : 'center',
                                          width: '100%',
                                        }}
                                        className="w-full py-1.5"
                                      >
                                        <button
                                          type="button"
                                          style={{
                                            width: element.styles.fullWidth !== false ? '100%' : 'auto',
                                            backgroundColor: element.styles.bgColor || pageSettings.primaryColor || '#2848F0',
                                            color: element.styles.textColor || '#FFFFFF',
                                            fontSize: `${element.styles.fontSize || 16}px`,
                                            fontFamily: element.styles.fontFamily || pageSettings.bodyFontFamily || 'Poppins',
                                            fontWeight: element.styles.isBold ? 700 : 600,
                                            fontStyle: element.styles.isItalic ? 'italic' : 'normal',
                                            textDecoration: element.styles.isUnderline ? 'underline' : 'none',
                                            textTransform: element.styles.textTransform || 'none',
                                            paddingTop: `${element.styles.paddingTop || 14}px`,
                                            paddingBottom: `${element.styles.paddingBottom || 14}px`,
                                            paddingLeft: `${element.styles.paddingLeft || 28}px`,
                                            paddingRight: `${element.styles.paddingRight || 28}px`,
                                            borderRadius: `${element.styles.borderRadius ?? 8}px`,
                                            boxShadow: element.styles.boxShadow || '0 4px 14px 0 rgba(40, 72, 240, 0.35)',
                                          }}
                                          className="hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group shadow-md"
                                        >
                                          <div className="flex items-center justify-center gap-2">
                                            <span
                                              contentEditable={!isPreviewMode && isSelected}
                                              suppressContentEditableWarning={true}
                                              onBlur={(e) => {
                                                const newText = e.currentTarget.innerText;
                                                updateSelectedElement({}, { buttonText: newText });
                                              }}
                                              className="outline-none"
                                            >
                                              {element.content.buttonText || 'Enviar Información'}
                                            </span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                          </div>
                                          {element.content.buttonSubtext && (
                                            <span
                                              contentEditable={!isPreviewMode && isSelected}
                                              suppressContentEditableWarning={true}
                                              onBlur={(e) => {
                                                const newSub = e.currentTarget.innerText;
                                                updateSelectedElement({}, { buttonSubtext: newSub });
                                              }}
                                              className="text-[11px] opacity-85 font-normal tracking-wide outline-none"
                                            >
                                              {element.content.buttonSubtext}
                                            </span>
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* HORIZONTAL PLACEMENT DROP LINE INDICATOR (AFTER) - REQ 2 */}
                                  {!isPreviewMode &&
                                    dropIndicator &&
                                    dropIndicator.colId === column.id &&
                                    dropIndicator.index === elIdx &&
                                    dropIndicator.position === 'after' && (
                                      <div className="w-full h-1.5 bg-[#2848F0] rounded-full my-2 shadow-md relative flex items-center justify-center animate-pulse z-30 pointer-events-none">
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
                </DelayedAppearance>

                {/* Visual Drop Line Indicator After Row */}
                {!isPreviewMode &&
                  depth === 0 &&
                  rowDropIndicator &&
                  rowDropIndicator.sectionId === section.id &&
                  rowDropIndicator.rowIndex === rIdx &&
                  rowDropIndicator.position === 'after' && (
                    <div className="w-full h-2 bg-indigo-600 rounded-full my-2.5 shadow-md relative flex items-center justify-center animate-pulse z-40 pointer-events-none">
                      <div className="absolute -top-3 bg-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span>Insertar columnas aquí</span>
                      </div>
                    </div>
                  )}
              </React.Fragment>
            );
          };

          return section.rows.map((row, rIdx) => renderCanvasRow(row, rIdx, 0));
        })()}
                </div>
              </div>
              </DelayedAppearance>

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
              selectedColumnId={selectedColumnId}
              selectedElementId={selectedElementId}
              onSelectSection={(secId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(null);
                setSelectedColumnId(null);
                setSelectedElementId(null);
              }}
              onSelectRow={(secId, rId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(rId);
                setSelectedColumnId(null);
                setSelectedElementId(null);
              }}
              onSelectColumn={(secId, rId, colId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(rId);
                setSelectedColumnId(colId);
                setSelectedElementId(null);
              }}
              onSelectElement={(secId, rId, _cId, elId) => {
                setSelectedSectionId(secId);
                setSelectedRowId(rId);
                setSelectedColumnId(null);
                setSelectedElementId(elId);
              }}
              onSelectPage={() => {
                setSelectedSectionId(null);
                setSelectedRowId(null);
                setSelectedColumnId(null);
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
              onMoveElementToColumn={(elId, targetColId, targetIdx) =>
                reorderCanvasElement(elId, targetColId, targetIdx)
              }
              onMoveRowToSection={(rId, targetSecId, targetRowIdx) =>
                moveCanvasRowToSection(rId, targetSecId, targetRowIdx)
              }
              onPromoteInnerColumnsToRow={(wrapperElId, targetSecId, targetRowIdx) =>
                promoteInnerColumnsToRow(wrapperElId, targetSecId, targetRowIdx)
              }
              onMoveSectionToIndex={(secId, targetIdx) => reorderCanvasSection(secId, targetIdx)}
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
                  const secBoxed = isSectionBoxed(sec);
                  const secBgType = sec.bgType || (sec.bgGradient ? 'gradient' : sec.bgImageUrl ? 'image' : 'solid');
                  const tplBorderStyle = sec.borderStyle || 'solid';
                  const tplBorderColor = sec.borderColor || '#E4E4E7';
                  return (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 shrink-0"
                      style={{
                        width: '100%',
                        maxWidth: secBoxed ? `${getSectionEffectiveMaxWidth(sec, 900)}px` : undefined,
                        marginLeft: secBoxed ? 'auto' : undefined,
                        marginRight: secBoxed ? 'auto' : undefined,
                        borderRadius: `${sec.borderRadius ?? 0}px`,
                        borderTop: sec.borderTopWidth
                          ? `${sec.borderTopWidth}px ${tplBorderStyle} ${tplBorderColor}`
                          : undefined,
                        borderRight: sec.borderRightWidth
                          ? `${sec.borderRightWidth}px ${tplBorderStyle} ${tplBorderColor}`
                          : undefined,
                        borderBottom: sec.borderBottomWidth
                          ? `${sec.borderBottomWidth}px ${tplBorderStyle} ${tplBorderColor}`
                          : undefined,
                        borderLeft: sec.borderLeftWidth
                          ? `${sec.borderLeftWidth}px ${tplBorderStyle} ${tplBorderColor}`
                          : undefined,
                        backgroundColor: secBgType === 'solid' ? sec.bgColor || '#FFFFFF' : undefined,
                        backgroundImage: secBgType === 'gradient' ? sec.bgGradient : undefined,
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
                            style={{
                              ...getColumnSurfaceStyle(c, { isPreview: true }),
                              flex: c.widthPercentage >= 50 ? '1 1 320px' : '1 1 240px',
                              minWidth: '260px',
                            }}
                            className={`space-y-4 ${getColumnShadowClass(c.shadow)}`}
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
                                {el.type === 'image' && el.content.src && (
                                  <div className="w-full flex justify-center py-2">
                                    <ConfiguredImage
                                      src={el.content.src}
                                      alt={el.content.alt}
                                      styles={el.styles}
                                      defaultWidth={450}
                                    />
                                  </div>
                                )}
                                {el.type === 'video' && (
                                  <div className="w-full flex justify-center py-2">
                                    <EmbeddedVideoPlayer
                                      videoUrl={el.content.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                                      videoFileName={el.content.videoFileName}
                                      aspectRatio={el.styles?.aspectRatio || '16/9'}
                                      borderRadius={el.styles?.borderRadius ?? 12}
                                      maxWidth={el.styles?.maxWidth || '750px'}
                                      borderWidth={el.styles?.borderWidth}
                                      borderColor={el.styles?.borderColor}
                                      borderStyle={el.styles?.borderStyle}
                                      videoSource={el.content.videoSource}
                                      videoAutoplay={el.content.videoAutoplay}
                                      videoMuted={el.content.videoMuted}
                                      videoLoop={el.content.videoLoop}
                                      videoCoverType={el.content.videoCoverType}
                                      videoCoverImage={el.content.videoCoverImage}
                                      videoCoverText={el.content.videoCoverText}
                                      videoCoverTextFont={el.content.videoCoverTextFont}
                                      videoCoverTextSize={el.content.videoCoverTextSize}
                                      videoCoverTextColor={el.content.videoCoverTextColor}
                                      videoCoverTextBg={el.content.videoCoverTextBg}
                                      videoCoverTextBold={el.content.videoCoverTextBold}
                                      videoCoverPlayIcon={el.content.videoCoverPlayIcon}
                                      videoCoverButtonShape={el.content.videoCoverButtonShape}
                                      videoCoverPlayColor={el.content.videoCoverPlayColor}
                                      videoCoverPlayBg={el.content.videoCoverPlayBg}
                                      videoCoverPlaySize={el.content.videoCoverPlaySize}
                                      videoCoverArrowType={el.content.videoCoverArrowType}
                                      videoCoverArrowColor={el.content.videoCoverArrowColor}
                                      videoCoverArrowSize={el.content.videoCoverArrowSize}
                                      videoCoverArrowRotation={el.content.videoCoverArrowRotation}
                                      videoCoverBgType={el.content.videoCoverBgType}
                                      videoCoverBgColor={el.content.videoCoverBgColor}
                                      videoCoverBgColor2={el.content.videoCoverBgColor2}
                                      videoCoverBgOpacity={el.content.videoCoverBgOpacity}
                                    />
                                  </div>
                                )}
                                {el.type === 'audio' && (
                                  <AudioPlayerElement element={el} isEditable={false} />
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
                                    className="shadow-md text-sm font-bold uppercase tracking-wider cursor-default w-full sm:w-auto text-center inline-flex flex-col items-center justify-center"
                                  >
                                    <span>{el.content.buttonText || 'Botón de Acción'}</span>
                                    {el.content.buttonSubtextEnabled && el.content.buttonSubtext && (
                                      <span
                                        style={{
                                          marginTop: `${el.content.buttonSubtextGap ?? 4}px`,
                                          fontSize: `${el.content.buttonSubtextFontSize ?? 12}px`,
                                          fontFamily: el.content.buttonSubtextFontFamily || undefined,
                                          color: el.content.buttonSubtextColor || 'rgba(255, 255, 255, 0.85)',
                                          fontWeight: el.content.buttonSubtextBold ? 700 : 400,
                                          fontStyle: el.content.buttonSubtextItalic ? 'italic' : 'normal',
                                          textDecoration: el.content.buttonSubtextUnderline ? 'underline' : 'none',
                                          textTransform: el.content.buttonSubtextTransform || 'none',
                                        }}
                                        className="leading-tight tracking-normal"
                                      >
                                        {el.content.buttonSubtext}
                                      </span>
                                    )}
                                  </button>
                                )}
                                {el.type === 'simple_form' && (
                                  <div className="p-4 border border-zinc-200 rounded-lg bg-zinc-50 text-xs text-zinc-600">
                                    [Formulario de Captura de Prospectos]
                                  </div>
                                )}
                                {el.type === 'inline_form' && (
                                  <div className="p-4 border border-zinc-200 rounded-lg bg-zinc-50 text-xs text-zinc-600">
                                    [Formulario Inline: Correo + Botón]
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
