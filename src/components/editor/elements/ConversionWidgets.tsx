import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { FaqItem, SocialLinkItem } from '../../../types';

/* =========================================================================
   1. COUNTDOWN TIMER WIDGET (DÍAS, HORAS, MINUTOS, SEGUNDOS)
   ========================================================================= */
interface CountdownTimerWidgetProps {
  endDate?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  theme?: 'dark' | 'light' | 'primary';
  className?: string;
}

export const CountdownTimerWidget: React.FC<CountdownTimerWidgetProps> = ({
  endDate,
  daysLabel = 'Días',
  hoursLabel = 'Horas',
  minutesLabel = 'Minutos',
  secondsLabel = 'Segundos',
  theme = 'dark',
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      if (!endDate) {
        setTimeLeft({ days: 2, hours: 14, minutes: 35, seconds: 40, isExpired: false });
        return;
      }

      const target = new Date(endDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  // Theme styles
  const themeCardStyles = {
    dark: 'bg-zinc-900 text-white border-zinc-800 shadow-lg',
    light: 'bg-white text-zinc-900 border-zinc-200 shadow-md',
    primary: 'bg-[#2848F0] text-white border-blue-600 shadow-lg',
  }[theme] || 'bg-zinc-900 text-white border-zinc-800 shadow-lg';

  const labelStyles = {
    dark: 'text-zinc-400',
    light: 'text-zinc-500',
    primary: 'text-blue-100',
  }[theme] || 'text-zinc-400';

  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* DÍAS */}
      <div className={`flex flex-col items-center justify-center min-w-[65px] sm:min-w-[80px] py-2 sm:py-3 px-2 sm:px-3 rounded-xl border ${themeCardStyles}`}>
        <span className="font-mono text-xl sm:text-3xl font-extrabold tracking-tight leading-none">
          {pad(timeLeft.days)}
        </span>
        <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 ${labelStyles}`}>
          {daysLabel}
        </span>
      </div>

      <span className="text-xl sm:text-2xl font-bold text-zinc-400 -mt-3 hidden sm:inline">:</span>

      {/* HORAS */}
      <div className={`flex flex-col items-center justify-center min-w-[65px] sm:min-w-[80px] py-2 sm:py-3 px-2 sm:px-3 rounded-xl border ${themeCardStyles}`}>
        <span className="font-mono text-xl sm:text-3xl font-extrabold tracking-tight leading-none">
          {pad(timeLeft.hours)}
        </span>
        <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 ${labelStyles}`}>
          {hoursLabel}
        </span>
      </div>

      <span className="text-xl sm:text-2xl font-bold text-zinc-400 -mt-3 hidden sm:inline">:</span>

      {/* MINUTOS */}
      <div className={`flex flex-col items-center justify-center min-w-[65px] sm:min-w-[80px] py-2 sm:py-3 px-2 sm:px-3 rounded-xl border ${themeCardStyles}`}>
        <span className="font-mono text-xl sm:text-3xl font-extrabold tracking-tight leading-none">
          {pad(timeLeft.minutes)}
        </span>
        <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 ${labelStyles}`}>
          {minutesLabel}
        </span>
      </div>

      <span className="text-xl sm:text-2xl font-bold text-zinc-400 -mt-3 hidden sm:inline">:</span>

      {/* SEGUNDOS */}
      <div className={`flex flex-col items-center justify-center min-w-[65px] sm:min-w-[80px] py-2 sm:py-3 px-2 sm:px-3 rounded-xl border ${themeCardStyles}`}>
        <span className="font-mono text-xl sm:text-3xl font-extrabold tracking-tight leading-none text-red-400">
          {pad(timeLeft.seconds)}
        </span>
        <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 ${labelStyles}`}>
          {secondsLabel}
        </span>
      </div>
    </div>
  );
};

/* =========================================================================
   2. FAQ ACCORDION WIDGET (PREGUNTAS FRECUENTES DESPLEGABLES)
   ========================================================================= */
interface FaqAccordionWidgetProps {
  items?: FaqItem[];
  className?: string;
}

export const FaqAccordionWidget: React.FC<FaqAccordionWidgetProps> = ({
  items = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [items[0]?.id || 'faq_0']: true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-4 border border-dashed border-zinc-300 rounded-xl text-center text-xs text-zinc-500">
        No hay preguntas frecuentes agregadas. Haz clic en el elemento para editarlas.
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-2.5 text-left ${className}`}>
      {items.map((item, idx) => {
        const isOpen = Boolean(openItems[item.id || `faq_${idx}`]);
        return (
          <div
            key={item.id || `faq_${idx}`}
            className="border border-zinc-200 rounded-xl bg-white overflow-hidden transition-all shadow-2xs hover:border-zinc-300"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id || `faq_${idx}`)}
              className="w-full py-3.5 px-4 sm:px-5 flex items-center justify-between gap-3 text-left font-semibold text-zinc-900 hover:text-[#2848F0] transition-colors cursor-pointer select-none"
            >
              <span className="text-sm sm:text-base font-['Poppins']">
                {item.question || `Pregunta frecuente #${idx + 1}`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-[#2848F0]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed font-['Inter'] border-t border-zinc-100 bg-zinc-50/50 animate-in fade-in-50 duration-150">
                {item.answer || 'Escribe aquí la respuesta para esta pregunta frecuente.'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================================
   3. SOCIAL LINKS WIDGET (HORIZONTAL ICONS BAR)
   ========================================================================= */
interface SocialLinksWidgetProps {
  links?: SocialLinkItem[];
  size?: 'sm' | 'md' | 'lg';
  styleType?: 'colored' | 'black' | 'outline' | 'rounded' | 'default' | 'custom';
  colorMode?: 'default' | 'custom';
  iconColor?: string;
  bgColor?: string;
  shape?: 'circle' | 'square' | 'rounded' | 'none';
  className?: string;
}

export const SocialLinksWidget: React.FC<SocialLinksWidgetProps> = ({
  links = [],
  size = 'md',
  styleType = 'colored',
  colorMode = 'default',
  iconColor = '#FFFFFF',
  bgColor = '#2848F0',
  shape = 'circle',
  className = '',
}) => {
  const activeLinks = (links && links.length > 0 ? links : [
    { id: 'fb', platform: 'facebook', url: 'https://facebook.com', enabled: true },
    { id: 'ig', platform: 'instagram', url: 'https://instagram.com', enabled: true },
    { id: 'tt', platform: 'tiktok', url: 'https://tiktok.com', enabled: true },
    { id: 'wa', platform: 'whatsapp', url: 'https://wa.me/', enabled: true },
    { id: 'yt', platform: 'youtube', url: 'https://youtube.com', enabled: true },
  ]).filter((l) => l.enabled);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size] || 'w-10 h-10 text-sm';

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size] || 'w-5 h-5';

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'x':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className={iconSizes} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPlatformColors = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-[#1877F2] text-white hover:bg-[#0c63d4]';
      case 'instagram':
        return 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90';
      case 'tiktok':
        return 'bg-black text-white hover:bg-zinc-800';
      case 'whatsapp':
        return 'bg-[#25D366] text-white hover:bg-[#1ebd5a]';
      case 'youtube':
        return 'bg-[#FF0000] text-white hover:bg-[#d60000]';
      case 'x':
        return 'bg-black text-white hover:bg-zinc-800';
      case 'linkedin':
        return 'bg-[#0A66C2] text-white hover:bg-[#084e96]';
      default:
        return 'bg-zinc-800 text-white hover:bg-zinc-900';
    }
  };

  const shapeClass = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-xl',
    none: 'bg-transparent shadow-none',
  }[shape] || 'rounded-full';

  const isCustomMode = colorMode === 'custom' || styleType === 'custom';

  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 ${className}`}>
      {activeLinks.map((link) => {
        let buttonStyle = '';
        let customInlineStyles: React.CSSProperties = {};

        if (isCustomMode) {
          buttonStyle = `${shapeClass} shadow-2xs`;
          customInlineStyles = {
            backgroundColor: shape === 'none' ? 'transparent' : bgColor,
            color: iconColor,
          };
        } else if (styleType === 'colored' || styleType === 'default') {
          buttonStyle = `${getPlatformColors(link.platform)} ${shapeClass} shadow-2xs`;
        } else if (styleType === 'black') {
          buttonStyle = `bg-zinc-900 text-white hover:bg-black ${shapeClass} shadow-2xs`;
        } else if (styleType === 'outline') {
          buttonStyle = `border border-zinc-300 text-zinc-700 hover:border-zinc-500 hover:bg-zinc-50 ${shapeClass} shadow-2xs`;
        } else {
          buttonStyle = `${getPlatformColors(link.platform)} ${shapeClass} shadow-2xs`;
        }

        return (
          <a
            key={link.id || link.platform}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!link.url || link.url === '#') e.preventDefault();
            }}
            style={customInlineStyles}
            className={`inline-flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${sizeClasses} ${buttonStyle}`}
            title={link.platform.toUpperCase()}
          >
            {getPlatformIcon(link.platform)}
          </a>
        );
      })}
    </div>
  );
};

/* =========================================================================
   4. CHECKBOX WIDGET (CASILLA DE VERIFICACIÓN)
   ========================================================================= */
interface CheckboxWidgetProps {
  label?: string;
  checked?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({
  label = 'Acepto los términos y condiciones',
  checked = false,
  required = false,
  className = '',
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const next = !isChecked;
    setIsChecked(next);
    onChange?.(next);
  };

  return (
    <label
      onClick={handleToggle}
      className={`inline-flex items-start gap-2.5 cursor-pointer text-left select-none text-zinc-700 hover:text-zinc-900 transition-colors ${className}`}
    >
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
          isChecked
            ? 'bg-[#2848F0] border-[#2848F0] text-white shadow-2xs'
            : 'bg-white border-zinc-300 hover:border-zinc-400'
        }`}
      >
        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      <span className="text-xs sm:text-sm font-['Inter'] leading-tight">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </span>
    </label>
  );
};

/* =========================================================================
   5. INPUT FIELD WIDGET (CAMPO DE FORMULARIO)
   ========================================================================= */
interface InputFieldWidgetProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'phone' | 'number' | 'textarea';
  required?: boolean;
  className?: string;
}

export const InputFieldWidget: React.FC<InputFieldWidgetProps> = ({
  label = 'Tu Correo Electrónico',
  placeholder = 'ejemplo@tudominio.com',
  type = 'email',
  required = false,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-lg text-left ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Inter']">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          rows={3}
          disabled
          className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl bg-white text-zinc-800 placeholder:text-zinc-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2848F0]/30 focus:border-[#2848F0] transition-all resize-none shadow-2xs cursor-default"
        />
      ) : (
        <input
          type={type === 'phone' ? 'tel' : type}
          placeholder={placeholder}
          disabled
          className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl bg-white text-zinc-800 placeholder:text-zinc-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2848F0]/30 focus:border-[#2848F0] transition-all shadow-2xs cursor-default"
        />
      )}
    </div>
  );
};
