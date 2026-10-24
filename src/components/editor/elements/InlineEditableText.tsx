import React, { useRef, useEffect, useLayoutEffect } from 'react';

interface InlineEditableTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'li' | 'span' | 'div';
  elementId?: string;
  dataBulletIndex?: number;
  html?: string;
  text?: string;
  fallbackText?: string;
  isEditable: boolean;
  isSelected?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onSave?: (html: string, text: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  as = 'div',
  elementId,
  dataBulletIndex,
  html,
  text,
  fallbackText = '',
  isEditable,
  isSelected = false,
  style,
  className = '',
  onSave,
  onBlur,
}) => {
  const domRef = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);

  // Content priority: formatted HTML > plain text > fallbackText
  const currentContent =
    html !== undefined && html !== ''
      ? html
      : text !== undefined && text !== ''
      ? text
      : fallbackText;

  // Immediate layout effect to sync DOM whenever content, elementId, editable state or tag (as) changes
  useLayoutEffect(() => {
    if (domRef.current && !isFocusedRef.current) {
      // If an inline color picker session is active on this element, do not clobber it
      if (domRef.current.querySelector('[data-inline-color-target]')) {
        return;
      }
      if (domRef.current.innerHTML !== currentContent) {
        domRef.current.innerHTML = currentContent;
      }
    }
  }, [currentContent, elementId, isEditable, as]);

  // Fallback useEffect to guarantee sync across all microtasks
  useEffect(() => {
    if (domRef.current && !isFocusedRef.current) {
      if (domRef.current.querySelector('[data-inline-color-target]')) {
        return;
      }
      if (domRef.current.innerHTML !== currentContent) {
        domRef.current.innerHTML = currentContent;
      }
    }
  }, [currentContent, elementId, isEditable, as]);

  const Tag = as as any;

  if (!isEditable) {
    return (
      <Tag
        key={`${elementId}_${as}`}
        data-element-id={elementId}
        data-bullet-index={dataBulletIndex}
        style={style}
        className={className}
        dangerouslySetInnerHTML={{ __html: currentContent }}
      />
    );
  }

  return (
    <Tag
      key={`${elementId}_${as}`}
      ref={(node: HTMLElement | null) => {
        (domRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (node && !isFocusedRef.current) {
          if (!node.querySelector('[data-inline-color-target]')) {
            if (node.innerHTML !== currentContent) {
              node.innerHTML = currentContent;
            }
          }
        }
      }}
      data-element-id={elementId}
      contentEditable={true}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{ __html: currentContent }}
      data-bullet-index={dataBulletIndex}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        isFocusedRef.current = false;
        const newHtml = e.currentTarget.innerHTML;
        const newText = e.currentTarget.textContent || '';
        onSave?.(newHtml, newText);
        onBlur?.(e);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.metaKey || e.ctrlKey) {
          const key = e.key.toLowerCase();
          if (key === 'b' || key === 'i' || key === 'u') {
            e.preventDefault();
            const cmd = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline';
            document.execCommand(cmd, false);
            if (domRef.current) {
              onSave?.(domRef.current.innerHTML, domRef.current.innerText);
            }
          }
        }
      }}
      style={{
        ...style,
        outline: isSelected ? 'none' : undefined,
      }}
      className={className}
    />
  );
};
