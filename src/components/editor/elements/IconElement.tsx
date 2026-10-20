import React from 'react';
import * as Icons from 'lucide-react';
import { PageBlockElement } from '../../../types';

interface IconElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
}

export const POPULAR_ICONS = [
  'Star',
  'Heart',
  'CheckCircle',
  'ShieldCheck',
  'Award',
  'Zap',
  'Phone',
  'Mail',
  'Clock',
  'MapPin',
  'Sparkles',
  'Flame',
  'User',
  'Users',
  'ShoppingBag',
  'Globe',
  'Rocket',
  'HelpCircle',
  'AlertCircle',
  'ArrowRight',
  'Play',
  'Gift',
  'BadgeCheck',
  'Compass',
  'Lock',
  'Smile',
  'ThumbsUp',
  'TrendingUp',
  'DollarSign',
  'Briefcase',
  'Headphones',
  'Crown',
  'Megaphone',
  'Bell',
  'Calendar',
];

export const IconElement: React.FC<IconElementProps> = ({ element }) => {
  const iconName = element.content.iconName || 'Star';
  const size = element.content.iconSize || 36;
  const color = element.content.iconColor || element.styles?.textColor || '#2848F0';
  const bgColor = element.content.iconBgColor;
  const shape = element.content.iconShape || 'none';
  const textAlign = element.styles?.textAlign || 'center';

  // Dynamic Icon resolution
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName] || Icons.Star;

  const containerStyle: React.CSSProperties = {
    textAlign,
    marginTop: `${element.styles?.marginTop || 0}px`,
    marginBottom: `${element.styles?.marginBottom ?? 16}px`,
    paddingTop: `${element.styles?.paddingTop || 0}px`,
    paddingBottom: `${element.styles?.paddingBottom || 0}px`,
  };

  const getShapeClasses = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full p-3 inline-flex items-center justify-center';
      case 'square':
        return 'rounded-none p-3 inline-flex items-center justify-center';
      case 'rounded':
        return 'rounded-2xl p-3 inline-flex items-center justify-center';
      default:
        return 'inline-flex items-center justify-center';
    }
  };

  return (
    <div style={containerStyle} className="w-full">
      <div
        className={getShapeClasses()}
        style={{
          backgroundColor: shape !== 'none' ? bgColor || '#EFF6FF' : undefined,
          display: 'inline-flex',
        }}
      >
        <IconComponent
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color,
          }}
        />
      </div>
    </div>
  );
};
