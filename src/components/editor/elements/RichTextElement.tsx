import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Quote,
  RemoveFormatting,
  Palette,
  Maximize2,
  FileText,
} from 'lucide-react';
import { PageBlockElement } from '../../../types';
import { HexColorPicker } from '../../common/HexColorPicker';

interface RichTextElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  isSelected?: boolean;
  onChange?: (html: string) => void;
  onOpenFullscreen?: () => void;
}

export const RichTextElement: React.FC<RichTextElementProps> = ({
  element,
  isEditable = false,
  isSelected = false,
  onChange,
  onOpenFullscreen,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const defaultHtml =
    element.content.html ||
    `<p>Este es tu <strong>editor de texto</strong>. Puedes redactar, dar formato y personalizar tu contenido con total libertad.</p>`;

  const targetHtml = element.content.html !== undefined && element.content.html !== '' ? element.content.html : defaultHtml;

  const lastHtmlRef = useRef<string>(targetHtml);
  const isFocusedRef = useRef<boolean>(false);
  const savedRangeRef = useRef<Range | null>(null);

  // Initialize and synchronize DOM whenever contentRef attaches, element changes, or isEditable toggles (e.g. returning from preview mode)
  useEffect(() => {
    if (contentRef.current) {
      if (!isFocusedRef.current) {
        if (contentRef.current.innerHTML !== targetHtml) {
          contentRef.current.innerHTML = targetHtml;
        }
        lastHtmlRef.current = targetHtml;
      }
    }
  }, [element.id, isEditable, targetHtml]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!contentRef.current) return;
    contentRef.current.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    const newHtml = contentRef.current.innerHTML;
    lastHtmlRef.current = newHtml;
    if (onChange) {
      onChange(newHtml);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      const newHtml = contentRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      if (onChange) {
        onChange(newHtml);
      }
    }
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      // fallback
    }
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    if (contentRef.current) {
      const newHtml = contentRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      if (onChange) {
        onChange(newHtml);
      }
    }
  };

  const handleAddLink = () => {
    if (linkUrl) {
      executeCommand('createLink', linkUrl);
      setLinkUrl('');
      setLinkModalOpen(false);
    }
  };

  const colors = [
    '#18181b', // Dark
    '#2848F0', // Brand blue
    '#16A34A', // Emerald green
    '#DC2626', // Red
    '#D97706', // Amber
    '#9333EA', // Purple
    '#52525b', // Zinc
    '#FFFFFF', // White
  ];

  return (
    <div className="relative group/richtext w-full">
      {/* FLOATING TEXT EDITOR TOOLBAR WHEN SELECTED */}
      {isEditable && isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-12 left-0 z-30 bg-[#1d2327] text-white rounded-lg px-2.5 py-1.5 flex items-center gap-1 shadow-2xl border border-zinc-700 select-none animate-in fade-in slide-in-from-bottom-2 text-xs"
        >
          {/* Text Editor Badge */}
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 pr-2 border-r border-zinc-700">
            <FileText className="w-3.5 h-3.5 text-zinc-300" />
            <span>Editor de Texto</span>
          </span>

          {/* Format Block Selector */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h1>');
            }}
            title="Título 1 (H1)"
            className="p-1 hover:bg-zinc-800 rounded font-bold text-[11px] flex items-center gap-0.5"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h2>');
            }}
            title="Título 2 (H2)"
            className="p-1 hover:bg-zinc-800 rounded font-bold text-[11px] flex items-center gap-0.5"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h3>');
            }}
            title="Título 3 (H3)"
            className="p-1 hover:bg-zinc-800 rounded font-bold text-[11px] flex items-center gap-0.5"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<p>');
            }}
            title="Párrafo normal"
            className="px-1.5 py-0.5 hover:bg-zinc-800 rounded text-[11px] font-semibold"
          >
            P
          </button>

          <div className="w-[1px] h-4 bg-zinc-700 mx-0.5" />

          {/* Inline Styles */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            title="Negrita (Ctrl+B)"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            title="Cursiva (Ctrl+I)"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            title="Subrayado (Ctrl+U)"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            title="Tachado"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-700 mx-0.5" />

          {/* Lists */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            title="Lista con viñetas"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            title="Lista numerada"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<blockquote>');
            }}
            title="Cita destacada"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-700 mx-0.5" />

          {/* Alignment */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyLeft');
            }}
            title="Alinear a la izquierda"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyCenter');
            }}
            title="Centrar"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyRight');
            }}
            title="Alinear a la derecha"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-700 mx-0.5" />

          {/* Link */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setLinkModalOpen(true);
            }}
            title="Insertar enlace"
            className="p-1 hover:bg-zinc-800 rounded"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {/* Color dropdown with portal HexColorPicker */}
          <div onMouseDown={() => saveSelection()}>
            <HexColorPicker
              compact
              value="#18181b"
              onChange={(newColor) => {
                restoreSelection();
                executeCommand('foreColor', newColor);
              }}
            />
          </div>

          {/* Remove formatting */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('removeFormat');
            }}
            title="Quitar formato"
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          {onOpenFullscreen && (
            <>
              <div className="w-[1px] h-4 bg-zinc-700 mx-0.5" />
              <button
                type="button"
                onClick={onOpenFullscreen}
                title="Maximizar a Pantalla Completa"
                className="px-2 py-0.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded flex items-center gap-1 font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Pantalla completa</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* LINK INPUT MODAL */}
      {linkModalOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-12 left-20 z-40 bg-white p-2 rounded-lg shadow-2xl border border-zinc-300 flex items-center gap-1.5"
        >
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://ejemplo.com"
            className="text-xs px-2 py-1 border border-zinc-300 rounded focus:outline-blue-500 w-48 text-zinc-800"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddLink();
              if (e.key === 'Escape') setLinkModalOpen(false);
            }}
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="px-2 py-1 bg-[#2271b1] text-white text-xs font-semibold rounded hover:bg-[#135e96] cursor-pointer"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setLinkModalOpen(false)}
            className="px-1.5 py-1 text-zinc-500 text-xs hover:bg-zinc-100 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* CONTENT AREA: When editable, do NOT use dangerouslySetInnerHTML to prevent cursor destruction */}
      {isEditable ? (
        <div
          ref={contentRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            fontFamily: element.styles.fontFamily || 'Inter, sans-serif',
            color: element.styles.textColor || '#18181b',
            textAlign: element.styles.textAlign || 'left',
            marginTop: `${element.styles.marginTop || 0}px`,
            marginBottom: `${element.styles.marginBottom ?? 16}px`,
            paddingTop: `${element.styles.paddingTop || 0}px`,
            paddingBottom: `${element.styles.paddingBottom || 0}px`,
            paddingLeft: `${element.styles.paddingLeft || 0}px`,
            paddingRight: `${element.styles.paddingRight || 0}px`,
            outline: 'none',
          }}
          className="w-full prose prose-zinc max-w-none focus:outline-none min-h-[40px] [&_p]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2271b1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[#2271b1] [&_a]:underline"
        />
      ) : (
        <div
          style={{
            fontFamily: element.styles.fontFamily || 'Inter, sans-serif',
            color: element.styles.textColor || '#18181b',
            textAlign: element.styles.textAlign || 'left',
            marginTop: `${element.styles.marginTop || 0}px`,
            marginBottom: `${element.styles.marginBottom ?? 16}px`,
            paddingTop: `${element.styles.paddingTop || 0}px`,
            paddingBottom: `${element.styles.paddingBottom || 0}px`,
            paddingLeft: `${element.styles.paddingLeft || 0}px`,
            paddingRight: `${element.styles.paddingRight || 0}px`,
          }}
          className="w-full prose prose-zinc max-w-none min-h-[40px] [&_p]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2271b1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[#2271b1] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: targetHtml }}
        />
      )}
    </div>
  );
};
