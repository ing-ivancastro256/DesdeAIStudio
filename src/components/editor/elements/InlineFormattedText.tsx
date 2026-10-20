import React, { useEffect, useRef } from 'react';

export interface InlineFormattedTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'div' | 'span';
  html: string;
  isEditable: boolean;
  style?: React.CSSProperties;
  className?: string;
  dataBulletIndex?: number;
  placeholder?: string;
  onUpdate: (newHtml: string, newText: string) => void;
}

export const InlineFormattedText: React.FC<InlineFormattedTextProps> = ({
  as = 'p',
  html,
  isEditable,
  style,
  className = '',
  dataBulletIndex,
  placeholder,
  onUpdate,
}) => {
  const elRef = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);
  const lastHtmlRef = useRef(html || '');

  // Synchronize DOM with html when not focused or when switching between editable/preview
  useEffect(() => {
    if (elRef.current && !isFocusedRef.current) {
      const targetHtml = html || placeholder || '';
      if (elRef.current.innerHTML !== targetHtml) {
        elRef.current.innerHTML = targetHtml;
      }
      lastHtmlRef.current = targetHtml;
    }
  }, [html, placeholder, isEditable]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    isFocusedRef.current = false;
    const currentHtml = e.currentTarget.innerHTML;
    const currentText = e.currentTarget.innerText;
    lastHtmlRef.current = currentHtml;
    onUpdate(currentHtml, currentText);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Keyboard shortcuts for inline formatting: Cmd/Ctrl + B, I, U
    if (e.metaKey || e.ctrlKey) {
      const key = e.key.toLowerCase();
      if (key === 'b' || key === 'i' || key === 'u') {
        e.preventDefault();
        const cmd = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline';
        document.execCommand(cmd, false);
        if (elRef.current) {
          const newHtml = elRef.current.innerHTML;
          const newText = elRef.current.innerText;
          lastHtmlRef.current = newHtml;
          onUpdate(newHtml, newText);
        }
      }
    }
  };

  const Tag = as as any;

  if (!isEditable) {
    return (
      <Tag
        style={style}
        className={className}
        dangerouslySetInnerHTML={{ __html: html || placeholder || '' }}
      />
    );
  }

  return (
    <Tag
      ref={elRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      data-bullet-index={dataBulletIndex}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
      className={className}
    />
  );
};
