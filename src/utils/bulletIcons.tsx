import React from 'react';
import {
  Check,
  CheckCircle2,
  Square,
  ArrowRight,
  Star,
  Zap,
  Minus,
} from 'lucide-react';

export const BULLET_ICON_OPTIONS = [
  { value: 'disc', label: 'Punto clásico (•)' },
  { value: 'check', label: 'Check (✓)' },
  { value: 'check_circle', label: 'Check circular (✅)' },
  { value: 'square', label: 'Cuadrado (■)' },
  { value: 'arrow', label: 'Flecha (➔)' },
  { value: 'star', label: 'Estrella (★)' },
  { value: 'zap', label: 'Rayo (⚡)' },
  { value: 'dash', label: 'Guion (–)' },
];

export const renderBulletIcon = (
  iconType = 'disc',
  fontSize = 15,
  customColor?: string
) => {
  const iconSize = Math.max(12, Math.round(fontSize * 0.95));
  const style: React.CSSProperties = { color: customColor || 'currentColor' };

  switch (iconType) {
    case 'check':
      return (
        <Check
          className="shrink-0"
          style={{ width: iconSize, height: iconSize, ...style }}
          strokeWidth={2.8}
        />
      );
    case 'check_circle':
      return (
        <CheckCircle2
          className="shrink-0"
          style={{ width: iconSize, height: iconSize, ...style }}
          strokeWidth={2.2}
        />
      );
    case 'square':
      return (
        <Square
          className="shrink-0 fill-current"
          style={{
            width: Math.round(iconSize * 0.7),
            height: Math.round(iconSize * 0.7),
            ...style,
          }}
        />
      );
    case 'arrow':
      return (
        <ArrowRight
          className="shrink-0"
          style={{ width: iconSize, height: iconSize, ...style }}
          strokeWidth={2.8}
        />
      );
    case 'star':
      return (
        <Star
          className="shrink-0 fill-current"
          style={{ width: iconSize, height: iconSize, ...style }}
        />
      );
    case 'zap':
      return (
        <Zap
          className="shrink-0 fill-current"
          style={{ width: iconSize, height: iconSize, ...style }}
        />
      );
    case 'dash':
      return (
        <Minus
          className="shrink-0"
          style={{ width: iconSize, height: iconSize, ...style }}
          strokeWidth={3}
        />
      );
    case 'disc':
    default:
      return (
        <span
          className="shrink-0 font-bold leading-none select-none"
          style={{
            fontSize: `${Math.round(fontSize * 1.1)}px`,
            ...style,
          }}
        >
          •
        </span>
      );
  }
};
