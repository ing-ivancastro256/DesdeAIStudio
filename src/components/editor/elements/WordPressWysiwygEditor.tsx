import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
  Palette,
  RemoveFormatting,
  Code,
  Eye,
  HelpCircle,
  Image as ImageIcon,
  Minus,
  Check,
  X,
  Sparkles,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { ElementStyles } from '../../../types';
import { HexColorPicker } from '../../common/HexColorPicker';

interface WordPressWysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  variant?: 'sidebar' | 'fullscreen';
  onToggleFullscreen?: () => void;
  onCloseFullscreen?: () => void;
  title?: string;
  elementStyles?: ElementStyles;
  showMediaButton?: boolean;
}

export const WordPressWysiwygEditor: React.FC<WordPressWysiwygEditorProps> = ({
  value,
  onChange,
  variant = 'sidebar',
  onToggleFullscreen,
  onCloseFullscreen,
  title = 'Editor de Texto',
  elementStyles,
  showMediaButton = true,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'texto'>('visual');
  const [showToolbarRow2, setShowToolbarRow2] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Link state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);

  // Media state
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaAlign, setMediaAlign] = useState<'none' | 'center' | 'left' | 'right'>('center');

  // Format dropdown
  const [currentFormat, setCurrentFormat] = useState('p');

  // Ref to the contentEditable visual div
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>(value || '');
  const isFocusedRef = useRef<boolean>(false);
  const savedSelectionRef = useRef<Range | null>(null);

  // Initialize and synchronize content when external value changes and not typing
  useEffect(() => {
    if (activeTab !== 'visual' || !visualEditorRef.current) return;

    if (value !== lastHtmlRef.current && !isFocusedRef.current) {
      visualEditorRef.current.innerHTML = value || '';
      lastHtmlRef.current = value || '';
    }
  }, [value, activeTab]);

  // Initial load
  useEffect(() => {
    if (visualEditorRef.current && visualEditorRef.current.innerHTML !== (value || '')) {
      visualEditorRef.current.innerHTML = value || '';
      lastHtmlRef.current = value || '';
    }
  }, []);

  // Save current text selection before opening popups
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Safe command executor that keeps focus and selection
  const executeCmd = (command: string, cmdValue: string | undefined = undefined) => {
    if (activeTab !== 'visual') return;
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, cmdValue);
    if (visualEditorRef.current) {
      const newHtml = visualEditorRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      onChange(newHtml);
    }
  };

  // Handle typing inside contentEditable without resetting the DOM tree
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const newHtml = visualEditorRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      onChange(newHtml);
    }
  };

  const handleVisualFocus = () => {
    isFocusedRef.current = true;
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      // fallback
    }
  };

  const handleVisualBlur = () => {
    isFocusedRef.current = false;
    if (visualEditorRef.current) {
      const newHtml = visualEditorRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      onChange(newHtml);
    }
  };

  // Switch between Visual and Texto (HTML) tabs seamlessly
  const handleTabChange = (tab: 'visual' | 'texto') => {
    if (tab === activeTab) return;

    if (tab === 'texto') {
      // Transitioning from Visual to Texto: ensure value is up to date
      if (visualEditorRef.current) {
        const currentHtml = visualEditorRef.current.innerHTML;
        lastHtmlRef.current = currentHtml;
        onChange(currentHtml);
      }
    } else {
      // Transitioning from Texto to Visual: will update via ref next tick
      setTimeout(() => {
        if (visualEditorRef.current) {
          visualEditorRef.current.innerHTML = value || '';
          lastHtmlRef.current = value || '';
        }
      }, 0);
    }
    setActiveTab(tab);
  };

  // Format block change
  const handleFormatChange = (tag: string) => {
    setCurrentFormat(tag);
    if (tag === 'p') {
      executeCmd('formatBlock', '<p>');
    } else if (tag === 'pre') {
      executeCmd('formatBlock', '<pre>');
    } else {
      executeCmd('formatBlock', `<${tag}>`);
    }
  };

  // Insert Link
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();

    let targetUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('#') && !targetUrl.startsWith('/')) {
      targetUrl = `https://${targetUrl}`;
    }

    if (linkText.trim() && savedSelectionRef.current && savedSelectionRef.current.collapsed) {
      const anchor = document.createElement('a');
      anchor.href = targetUrl;
      anchor.innerText = linkText.trim();
      anchor.target = linkTargetBlank ? '_blank' : '_self';
      anchor.rel = 'noopener noreferrer';
      savedSelectionRef.current.insertNode(anchor);
    } else {
      executeCmd('createLink', targetUrl);
      // If target blank requested, set attribute on created anchor
      if (visualEditorRef.current && linkTargetBlank) {
        const anchors = visualEditorRef.current.querySelectorAll(`a[href="${targetUrl}"]`);
        anchors.forEach((a) => {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        });
      }
    }

    if (visualEditorRef.current) {
      const newHtml = visualEditorRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      onChange(newHtml);
    }

    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  // Insert Media (Image)
  const handleInsertMedia = () => {
    if (!mediaUrl.trim()) return;
    restoreSelection();

    const imgTag = `<p style="text-align: ${mediaAlign === 'none' ? 'left' : mediaAlign}; margin: 16px 0;"><img src="${mediaUrl.trim()}" alt="${mediaAlt.trim()}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" /></p>`;

    executeCmd('insertHTML', imgTag);

    setMediaUrl('');
    setMediaAlt('');
    setShowMediaModal(false);
  };

  // Word count calculator
  const calculateWordCount = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean);
    return {
      words: words.length,
      chars: text.length,
      readingMinutes: Math.max(1, Math.ceil(words.length / 200)),
    };
  };

  const wordStats = calculateWordCount(value || '');

  // Editor preset colors
  const wpColors = [
    { name: 'Negro Carbón', color: '#18181b' },
    { name: 'Gris Oscuro', color: '#52525b' },
    { name: 'Azul Clásico', color: '#2271b1' },
    { name: 'Azul Marca', color: '#2848F0' },
    { name: 'Rojo Carmesí', color: '#d63638' },
    { name: 'Verde Éxito', color: '#00a32a' },
    { name: 'Ámbar Alerta', color: '#dba617' },
    { name: 'Púrpura', color: '#8a2be2' },
    { name: 'Blanco', color: '#ffffff' },
  ];

  // Keyboard shortcut listener for Fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (variant === 'fullscreen' && e.key === 'Escape') {
        if (onCloseFullscreen) onCloseFullscreen();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        executeCmd('bold');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        executeCmd('italic');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        executeCmd('underline');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [variant, onCloseFullscreen]);

  const isFullscreen = variant === 'fullscreen';

  return (
    <div
      className={`font-sans select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#f0f0f1] flex flex-col overflow-hidden animate-in fade-in duration-200'
          : 'w-full border border-[#c3c4c7] rounded-md bg-white shadow-xs overflow-hidden'
      }`}
    >
      {/* 1. TOP HEADER BAR */}
      <div
        className={`flex items-center justify-between border-b ${
          isFullscreen
            ? 'bg-[#1d2327] text-white px-5 py-2.5 shadow-md border-zinc-800'
            : 'bg-[#f6f7f7] px-3 py-1.5 border-[#dcdcde]'
        }`}
      >
        <div className="flex items-center gap-2">
          {isFullscreen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shadow-xs">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>{title || 'Editor de Texto'}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Pantalla Completa
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Escribe libremente con el editor de texto. Los cambios se sincronizan en tiempo real con tu lienzo.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2848F0]" />
                {title || 'Editor de Texto'}
              </span>
            </div>
          )}
        </div>

        {/* Action controls & Tabs */}
        <div className="flex items-center gap-2">
          {/* Add Media Button ("Añadir objeto") */}
          {showMediaButton && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowMediaModal(true);
              }}
              title="Añadir objeto multimedia / Imagen"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                isFullscreen
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-600'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border-[#c3c4c7] shadow-xs'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#2271b1]" />
              <span className="text-[11px]">Añadir objeto</span>
            </button>
          )}

          {/* Visual / Texto Tabs */}
          <div className="flex items-center bg-zinc-200/80 p-0.5 rounded border border-zinc-300">
            <button
              type="button"
              onClick={() => handleTabChange('visual')}
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'visual'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Visual</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('texto')}
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'texto'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Texto (HTML)</span>
            </button>
          </div>

          {/* Fullscreen Toggle Buttons */}
          {isFullscreen ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onCloseFullscreen}
                title="Salir de pantalla completa (Esc)"
                className="flex items-center gap-1.5 px-3 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded shadow-xs cursor-pointer transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Salir de Pantalla Completa</span>
              </button>
            </div>
          ) : (
            onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                title="Maximizar a Pantalla Completa"
                className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#2848F0]" />
                <span className="hidden sm:inline">Pantalla completa</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* 2. CLASSIC WORDPRESS TOOLBAR (TinyMCE) */}
      {activeTab === 'visual' && (
        <div
          className={`border-b select-none transition-colors ${
            isFullscreen
              ? 'bg-[#ffffff] px-6 py-2 border-zinc-200 shadow-xs'
              : 'bg-[#f6f7f7] px-2 py-1.5 border-[#dcdcde]'
          }`}
        >
          {/* TOOLBAR ROW 1 */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Format Dropdown (Párrafo, H1, H2, H3, H4) */}
            <div className="relative inline-block mr-1">
              <select
                value={currentFormat}
                onChange={(e) => handleFormatChange(e.target.value)}
                title="Formato de bloque"
                className="text-xs bg-white text-zinc-800 border border-[#c3c4c7] hover:border-zinc-400 rounded px-2 py-1 font-medium focus:outline-[#2271b1] cursor-pointer shadow-2xs h-7"
              >
                <option value="p">Párrafo</option>
                <option value="h1">Título 1 (H1)</option>
                <option value="h2">Título 2 (H2)</option>
                <option value="h3">Título 3 (H3)</option>
                <option value="h4">Título 4 (H4)</option>
                <option value="h5">Título 5 (H5)</option>
                <option value="pre">Preformateado</option>
              </select>
            </div>

            <div className="w-[1px] h-4 bg-zinc-300 mx-0.5" />

            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('bold');
              }}
              title="Negrita (Ctrl+B)"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('italic');
              }}
              title="Cursiva (Ctrl+I)"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Bullet List */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('insertUnorderedList');
              }}
              title="Lista con viñetas"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('insertOrderedList');
              }}
              title="Lista numerada"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* Blockquote */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('formatBlock', '<blockquote>');
              }}
              title="Cita"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-zinc-300 mx-0.5" />

            {/* Alignment Left */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('justifyLeft');
              }}
              title="Alinear a la izquierda"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>

            {/* Alignment Center */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('justifyCenter');
              }}
              title="Centrar"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>

            {/* Alignment Right */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('justifyRight');
              }}
              title="Alinear a la derecha"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-zinc-300 mx-0.5" />

            {/* Insert Link */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowLinkModal(true);
              }}
              title="Insertar/editar enlace (Ctrl+K)"
              className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            {/* Remove Link */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCmd('unlink');
              }}
              title="Quitar enlace"
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Button in Toolbar (as user specified: next to link or with X icon) */}
            {onToggleFullscreen && !isFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                title="Pantalla completa"
                className="p-1.5 text-[#2271b1] hover:text-[#135e96] hover:bg-blue-50 active:bg-blue-100 rounded border border-blue-200 bg-white transition-colors cursor-pointer flex items-center gap-1 shadow-2xs font-semibold"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">Pantalla completa</span>
              </button>
            )}

            {/* Toolbar Toggle (Kitchen Sink) */}
            <button
              type="button"
              onClick={() => setShowToolbarRow2(!showToolbarRow2)}
              title="Alternar barra de herramientas (Más opciones)"
              className={`p-1.5 rounded border transition-colors cursor-pointer ml-auto ${
                showToolbarRow2
                  ? 'bg-zinc-200 text-zinc-900 border-zinc-300'
                  : 'text-zinc-600 hover:bg-zinc-200/80 border-transparent hover:border-zinc-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TOOLBAR ROW 2 (Kitchen Sink Expandable) */}
          {showToolbarRow2 && (
            <div className="flex flex-wrap items-center gap-1 pt-1 mt-1 border-t border-zinc-200/80 animate-in fade-in duration-150">
              {/* Strikethrough */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('strikeThrough');
                }}
                title="Tachado"
                className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>

              {/* Underline */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('underline');
                }}
                title="Subrayado (Ctrl+U)"
                className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              {/* Justify */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('justifyFull');
                }}
                title="Justificar"
                className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>

              {/* Horizontal Line */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('insertHorizontalRule');
                }}
                title="Línea horizontal"
                className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-zinc-300 mx-0.5" />

              {/* Text Color Dropdown */}
              <div className="relative">
                <div onMouseDown={() => saveSelection()}>
                  <HexColorPicker
                    compact
                    value="#18181b"
                    onChange={(color) => {
                      restoreSelection();
                      executeCmd('foreColor', color);
                    }}
                  />
                </div>
              </div>

              {/* Remove Formatting */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('removeFormat');
                }}
                title="Limpiar formato"
                className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-zinc-300 mx-0.5" />

              {/* Undo */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('undo');
                }}
                title="Deshacer (Ctrl+Z)"
                className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>

              {/* Redo */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCmd('redo');
                }}
                title="Rehacer (Ctrl+Y)"
                className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>

              {/* Shortcuts Help */}
              <button
                type="button"
                onClick={() => setShowShortcutsModal(true)}
                title="Atajos de teclado"
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/80 active:bg-zinc-300 rounded border border-transparent hover:border-zinc-300 transition-colors cursor-pointer ml-auto"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. EDITABLE BODY AREA (DRAFTING CANVAS) */}
      <div
        className={`flex-1 overflow-y-auto relative ${
          isFullscreen
            ? 'p-4 sm:p-8 md:p-10 bg-[#f0f0f1] min-h-0 scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-200'
            : 'p-3 bg-white'
        }`}
      >
        {activeTab === 'visual' ? (
          <div
            className={
              isFullscreen
                ? 'w-full max-w-4xl mx-auto bg-white shadow-lg border border-zinc-300 rounded-sm p-8 sm:p-14 min-h-[calc(100vh-200px)] h-auto mb-24 transition-all'
                : 'w-full min-h-[180px]'
            }
          >
            {/* The actual contentEditable div (no dangerouslySetInnerHTML to prevent caret resets!) */}
            <div
              ref={visualEditorRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onFocus={handleVisualFocus}
              onBlur={handleVisualBlur}
              onInput={handleVisualInput}
              style={{
                fontFamily: elementStyles?.fontFamily || 'Inter, sans-serif',
                color: elementStyles?.textColor || '#18181b',
                fontSize: `${elementStyles?.fontSize || 16}px`,
                lineHeight: elementStyles?.lineHeight || 1.6,
                outline: 'none',
              }}
              className="w-full prose prose-zinc max-w-none focus:outline-none min-h-[300px] h-auto [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:text-zinc-900 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-zinc-900 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-zinc-800 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-zinc-600 [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-xs"
            />
          </div>
        ) : (
          /* TEXTO (HTML CODE) TAB */
          <div className={isFullscreen ? 'w-full max-w-4xl mx-auto min-h-[calc(100vh-200px)] h-auto flex flex-col mb-24' : 'w-full'}>
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">Editor de Código HTML (Texto):</span>
              <span>Edita directamente las etiquetas HTML</span>
            </div>
            <textarea
              value={value || ''}
              onChange={(e) => {
                lastHtmlRef.current = e.target.value;
                onChange(e.target.value);
              }}
              placeholder="<p>Escribe tu código HTML aquí...</p>"
              className={`w-full font-mono text-xs p-3 border border-zinc-300 rounded focus:outline-blue-500 bg-white text-zinc-800 leading-relaxed resize-y ${
                isFullscreen ? 'min-h-[500px] flex-1 shadow-md' : 'min-h-[200px]'
              }`}
            />
          </div>
        )}
      </div>

      {/* 4. BOTTOM STATUS BAR (Words count & Sync info) */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 border-t text-[11px] ${
          isFullscreen
            ? 'bg-[#1d2327] text-zinc-300 border-zinc-800 px-6 py-2'
            : 'bg-[#f6f7f7] text-zinc-600 border-[#dcdcde]'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">
            Palabras: <strong className={isFullscreen ? 'text-white' : 'text-zinc-900'}>{wordStats.words}</strong>
          </span>
          <span className="hidden sm:inline">
            Caracteres: <strong className={isFullscreen ? 'text-white' : 'text-zinc-900'}>{wordStats.chars}</strong>
          </span>
          {isFullscreen && (
            <span className="hidden md:inline text-zinc-400">
              Tiempo estimado de lectura: ~{wordStats.readingMinutes} min
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Sincronizado</span>
          </span>
          {isFullscreen && (
            <span className="text-zinc-400 text-[10px]">
              Presiona <kbd className="px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono">Esc</kbd> para volver al lienzo
            </span>
          )}
        </div>
      </div>

      {/* MODAL: INSERTAR ENLACE */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowLinkModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl border border-zinc-300 p-5 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-[#2271b1]" />
                <span>Insertar / Editar Enlace</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">URL de destino:</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com o #seccion"
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded focus:outline-[#2271b1] text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInsertLink();
                  }}
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Texto del enlace (opcional):</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Ej: Haz clic aquí"
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded focus:outline-[#2271b1] text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkTargetBlank}
                  onChange={(e) => setLinkTargetBlank(e.target.checked)}
                  className="rounded text-[#2271b1] focus:ring-[#2271b1]"
                />
                <span className="text-zinc-700 text-xs font-medium">Abrir enlace en una pestaña nueva</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold shadow-xs cursor-pointer"
              >
                Insertar Enlace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR OBJETO (IMAGEN) */}
      {showMediaModal && (
        <div
          className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowMediaModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl border border-zinc-300 p-5 max-w-lg w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#2271b1]" />
                <span>Añadir Objeto Multimedia (Imagen)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">URL de la Imagen:</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setMediaAlt('');
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded focus:outline-[#2271b1] text-xs"
                  autoFocus
                />
              </div>

              {/* Sample images quick pick */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                  O elige una imagen de prueba rápida:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: 'Oficina / Negocios',
                      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
                    },
                    {
                      label: 'Tecnología / Laptop',
                      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
                    },
                    {
                      label: 'Crecimiento / Gráficos',
                      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setMediaUrl(preset.url);
                        setMediaAlt(preset.label);
                      }}
                      className="text-left p-1.5 border border-zinc-200 hover:border-[#2271b1] rounded text-[11px] bg-zinc-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-12 object-cover rounded mb-1"
                      />
                      <span className="font-medium text-zinc-700 truncate block">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Texto alternativo (Alt):</label>
                <input
                  type="text"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  placeholder="Descripción de la imagen"
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded focus:outline-[#2271b1] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Alineación:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => setMediaAlign(align)}
                      className={`py-1 text-xs font-semibold rounded border uppercase cursor-pointer ${
                        mediaAlign === align
                          ? 'bg-[#2271b1] text-white border-[#2271b1]'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      {align === 'none' ? 'Ninguna' : align === 'left' ? 'Izquierda' : align === 'center' ? 'Centro' : 'Derecha'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInsertMedia}
                disabled={!mediaUrl.trim()}
                className="px-4 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white rounded font-bold shadow-xs cursor-pointer"
              >
                Insertar en el texto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ATAJOS DE TECLADO */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl border border-zinc-300 p-5 max-w-sm w-full space-y-3"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#2271b1]" />
                <span>Atajos de Teclado</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-zinc-700">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span>Negrita:</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded border font-mono">Ctrl + B</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span>Cursiva:</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded border font-mono">Ctrl + I</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span>Subrayado:</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded border font-mono">Ctrl + U</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span>Deshacer:</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded border font-mono">Ctrl + Z</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span>Rehacer:</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded border font-mono">Ctrl + Y</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Salir de pantalla completa:</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded border font-mono">Esc</kbd>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 text-xs bg-zinc-800 text-white rounded font-semibold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
