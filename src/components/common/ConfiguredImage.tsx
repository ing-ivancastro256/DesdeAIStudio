import React from 'react';
import { ElementStyles } from '../../types';

export interface ConfiguredImageProps {
  src?: string;
  alt?: string;
  styles?: ElementStyles;
  defaultWidth?: number | string;
}

const DEFAULT_FALLBACK_SRC =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80';

function getCssPosition(pos?: ElementStyles['imagePosition']): string {
  switch (pos) {
    case 'top':
      return 'center top';
    case 'bottom':
      return 'center bottom';
    case 'left':
      return 'left center';
    case 'right':
      return 'right center';
    case 'center':
    default:
      return 'center center';
  }
}

function getBoxShadowCss(shadow?: ElementStyles['shadow']): string | undefined {
  switch (shadow) {
    case 'sm':
      return '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    case 'md':
      return '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    case 'lg':
      return '0 10px 15px -3px rgb(0 0 0 / 0.1)';
    case 'xl':
      return '0 20px 25px -5px rgb(0 0 0 / 0.1)';
    default:
      return undefined;
  }
}

export const ConfiguredImage: React.FC<ConfiguredImageProps> = ({
  src,
  alt = '',
  styles = {},
  defaultWidth = 450,
}) => {
  const resolvedSrc = src || DEFAULT_FALLBACK_SRC;
  const widthCss = styles.imageWidth
    ? `${styles.imageWidth}px`
    : typeof defaultWidth === 'number'
    ? `${defaultWidth}px`
    : defaultWidth;

  const fit = styles.imageFit || 'contain';
  const repeat = styles.imageRepeat || 'no-repeat';
  const posCss = getCssPosition(styles.imagePosition);
  const borderRadius = styles.borderRadius ?? 0;
  const isCircle = borderRadius >= 150;

  const sharedFrameStyle: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    opacity: styles.opacity ?? 1,
    border: styles.borderWidth
      ? `${styles.borderWidth}px ${styles.borderStyle || 'solid'} ${
          styles.borderColor || '#E4E4E7'
        }`
      : undefined,
    boxShadow: getBoxShadowCss(styles.shadow),
  };

  // Pattern / Repeat mode OR unscaled Original ('auto') mode uses CSS background-image
  if (repeat !== 'no-repeat' || fit === 'auto') {
    const bgSize =
      fit === 'cover'
        ? 'cover'
        : fit === 'stretch'
        ? '100% 100%'
        : fit === 'contain'
        ? repeat === 'repeat-x'
          ? 'auto 100%'
          : repeat === 'repeat-y'
          ? '100% auto'
          : 'contain'
        : 'auto';

    const needsMosaicHeight =
      repeat === 'repeat' ||
      repeat === 'repeat-y' ||
      (repeat === 'no-repeat' &&
        fit === 'auto' &&
        (styles.imagePosition === 'top' || styles.imagePosition === 'bottom'));

    return (
      <div
        role="img"
        aria-label={alt}
        style={{
          ...sharedFrameStyle,
          width: widthCss,
          maxWidth: '100%',
          backgroundImage: `url("${resolvedSrc}")`,
          backgroundRepeat: repeat,
          backgroundPosition: posCss,
          backgroundSize: bgSize,
          overflow: 'hidden',
          ...(needsMosaicHeight
            ? {
                aspectRatio: isCircle ? '1 / 1' : '16 / 9',
                minHeight: '180px',
              }
            : {}),
        }}
        className="select-none"
      >
        {!needsMosaicHeight && (
          <img
            src={resolvedSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="opacity-0 pointer-events-none block w-auto h-auto max-h-[360px] min-h-[40px]"
          />
        )}
      </div>
    );
  }

  // Standard <img> rendering for 'contain' (default, zero cropping), 'cover', and 'stretch'
  if (fit === 'cover') {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        draggable={false}
        style={{
          ...sharedFrameStyle,
          display: 'block',
          width: widthCss,
          maxWidth: '100%',
          aspectRatio: isCircle ? '1 / 1' : '4 / 3',
          objectFit: 'cover',
          objectPosition: posCss,
        }}
        className="select-none"
      />
    );
  }

  if (fit === 'stretch') {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        draggable={false}
        style={{
          ...sharedFrameStyle,
          display: 'block',
          width: widthCss,
          maxWidth: '100%',
          aspectRatio: isCircle ? '1 / 1' : '16 / 9',
          objectFit: 'fill',
          objectPosition: posCss,
        }}
        className="select-none"
      />
    );
  }

  // Default: 'contain' — 100% gradual proportional scaling with ZERO cropping
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      draggable={false}
      style={{
        ...sharedFrameStyle,
        display: 'block',
        width: widthCss,
        maxWidth: '100%',
        height: 'auto',
      }}
      className="select-none"
    />
  );
};
