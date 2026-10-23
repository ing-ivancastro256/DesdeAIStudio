import React, { useState } from 'react';
import {
  Video,
  Play,
  PlayCircle,
  Film,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CornerDownRight,
  ArrowDownRight,
  CornerRightDown,
  MousePointerClick,
  Eye,
  Tv,
  Flame,
  Zap,
  Volume2,
  Heart,
  Disc,
  Square,
} from 'lucide-react';
import { getEmbedVideoInfo } from '../../utils/videoUtils';

export interface EmbeddedVideoPlayerProps {
  videoUrl?: string;
  aspectRatio?: '16/9' | '4/3' | '9/16' | '1/1' | string;
  borderRadius?: number;
  maxWidth?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onSetSampleVideo?: (sampleUrl: string) => void;

  // Video Options
  videoSource?: 'youtube' | 'vimeo' | 'wistia' | 'upload' | 'external' | 'server';
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;

  // Cover Portada
  videoCoverType?: 'none' | 'image' | 'custom';
  videoCoverImage?: string;
  videoCoverText?: string;
  videoCoverTextFont?: string;
  videoCoverTextSize?: number;
  videoCoverTextColor?: string;
  videoCoverTextBg?: string;
  videoCoverTextBold?: boolean;
  videoCoverPlayIcon?: string;
  videoCoverButtonShape?: 'circle' | 'square' | 'rounded';
  videoCoverPlayColor?: string;
  videoCoverPlayBg?: string;
  videoCoverPlaySize?: number;
  videoCoverArrowType?: 'curved' | 'straight' | 'corner' | 'hand';
  videoCoverArrowColor?: string;
  videoCoverArrowSize?: number;
  videoCoverArrowRotation?: number; // 0 to 360
  videoCoverBgType?: 'solid' | 'gradient' | 'pattern';
  videoCoverBgColor?: string;
  videoCoverBgOpacity?: number; // 0 to 100
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  videoUrl,
  aspectRatio = '16/9',
  borderRadius = 0,
  maxWidth = '750px',
  borderWidth,
  borderColor,
  borderStyle,
  isEditable = false,
  isSelected = false,
  onSelect,
  onSetSampleVideo,

  videoAutoplay = false,
  videoMuted = false,
  videoLoop = false,

  videoCoverType = 'none',
  videoCoverImage,
  videoCoverText = 'DALE CLICK AQUÍ',
  videoCoverTextFont = 'Poppins',
  videoCoverTextSize = 22,
  videoCoverTextColor = '#121111',
  videoCoverTextBg = '#FFFFFF',
  videoCoverTextBold = true,
  videoCoverPlayIcon = 'play',
  videoCoverButtonShape = 'circle',
  videoCoverPlayColor = '#FFFFFF',
  videoCoverPlayBg = '#FF5A5F',
  videoCoverPlaySize = 56,
  videoCoverArrowType = 'curved',
  videoCoverArrowColor = '#121111',
  videoCoverArrowSize = 26,
  videoCoverArrowRotation = 0,
  videoCoverBgType = 'solid',
  videoCoverBgColor = '#F4F4F5',
  videoCoverBgOpacity = 100,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isCoverDismissed, setIsCoverDismissed] = useState(false);

  // If cover was dismissed, force autoplay so video plays immediately on user click
  const effectiveAutoplay = isCoverDismissed || videoAutoplay;
  const effectiveMuted = isCoverDismissed ? false : videoMuted;

  const videoInfo = getEmbedVideoInfo(videoUrl, {
    autoplay: effectiveAutoplay,
    muted: effectiveMuted,
    loop: videoLoop,
  });

  const sampleYouTube = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  const ratioStyle =
    aspectRatio === '4/3'
      ? '4/3'
      : aspectRatio === '9/16'
      ? '9/16'
      : aspectRatio === '1/1'
      ? '1/1'
      : '16/9';

  const hasActiveCover = videoCoverType && videoCoverType !== 'none' && !isCoverDismissed;

  const handleCoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCoverDismissed(true);
  };

  const renderPlayIcon = () => {
    const iconSize = Math.max(16, Math.round((videoCoverPlaySize || 56) * 0.44));
    const color = videoCoverPlayColor || '#FFFFFF';
    const commonProps = {
      style: { width: `${iconSize}px`, height: `${iconSize}px`, color },
    };

    switch (videoCoverPlayIcon) {
      case 'play_circle':
        return <PlayCircle {...commonProps} />;
      case 'play_square':
        return (
          <div className="relative flex items-center justify-center" style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
            <div className="w-full h-full border-2 rounded-xs flex items-center justify-center" style={{ borderColor: color }}>
              <Play style={{ width: `${Math.round(iconSize * 0.52)}px`, height: `${Math.round(iconSize * 0.52)}px`, color, fill: color, marginLeft: '1px' }} />
            </div>
          </div>
        );
      case 'film':
        return <Film {...commonProps} />;
      case 'sparkle':
        return <Sparkles {...commonProps} />;
      case 'tv':
        return <Tv {...commonProps} />;
      case 'video':
        return <Video {...commonProps} />;
      case 'flame':
        return <Flame {...commonProps} style={{ ...commonProps.style, fill: color }} />;
      case 'zap':
        return <Zap {...commonProps} style={{ ...commonProps.style, fill: color }} />;
      case 'volume_2':
        return <Volume2 {...commonProps} />;
      case 'heart':
        return <Heart {...commonProps} style={{ ...commonProps.style, fill: color }} />;
      case 'eye':
        return <Eye {...commonProps} />;
      case 'disc':
        return <Disc {...commonProps} />;
      case 'play':
      default:
        return (
          <Play
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              color,
              fill: color,
              marginLeft: '2px',
            }}
          />
        );
    }
  };

  const renderArrowIcon = () => {
    const size = videoCoverArrowSize;
    const style: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      color: videoCoverArrowColor,
      transform: `rotate(${videoCoverArrowRotation}deg)`,
      transformOrigin: 'center center',
      transition: 'transform 0.15s ease',
    };

    switch (videoCoverArrowType) {
      case 'straight':
        return <ArrowDownRight style={style} />;
      case 'corner':
        return <CornerRightDown style={style} />;
      case 'hand':
        return <MousePointerClick style={style} />;
      case 'curved':
      default:
        // Hand-drawn curved arrow SVG matching Image 2
        return (
          <svg
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
          >
            <path d="M7 6 C7 16, 14 21, 21 21" />
            <path d="M14 23 L21 21 L19 14" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: maxWidth || '100%',
        borderRadius: `${borderRadius}px`,
        aspectRatio: ratioStyle,
        borderWidth: borderWidth !== undefined ? `${borderWidth}px` : undefined,
        borderColor: borderColor || undefined,
        borderStyle: (borderStyle as any) || (borderWidth ? 'solid' : undefined),
      }}
      className={`relative overflow-hidden bg-black shadow-xl ${
        borderWidth ? '' : 'border border-zinc-800'
      } transition-all ${isSelected ? 'ring-2 ring-[#2848F0]' : ''}`}
    >
      {/* UNDERLYING VIDEO PLAYER */}
      {videoInfo.isValid && !loadError ? (
        videoInfo.type === 'direct' ? (
          <video
            src={videoInfo.embedUrl}
            controls
            playsInline
            autoPlay={effectiveAutoplay}
            muted={effectiveMuted}
            loop={videoLoop}
            preload="metadata"
            className="w-full h-full object-cover rounded-[inherit]"
            onError={() => setLoadError(true)}
          />
        ) : (
          <iframe
            src={videoInfo.embedUrl}
            title="Reproductor de Video"
            className="w-full h-full border-0 rounded-[inherit]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onError={() => setLoadError(true)}
          />
        )
      ) : (
        /* Empty or invalid state placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-zinc-900 to-zinc-950 select-none">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center mb-3 shadow-lg ring-4 ring-red-500/20">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>

          <h4 className="text-sm font-bold text-zinc-100 font-['Poppins']">
            Reproductor de Video
          </h4>

          {videoInfo.type === 'empty' ? (
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              Introduce la URL de tu video en el panel lateral para reproducir en tiempo real.
            </p>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1 max-w-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>URL no reconocida. Ingresa un enlace válido de YouTube, Vimeo, Wistia o MP4.</span>
            </div>
          )}

          {onSetSampleVideo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetSampleVideo(sampleYouTube);
                setLoadError(false);
              }}
              className="mt-3.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2848F0] hover:bg-[#1E36B9] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cargar video de prueba</span>
            </button>
          )}
        </div>
      )}

      {/* COVER PORTADA OVERLAY */}
      {hasActiveCover && (
        <div
          onClick={handleCoverClick}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer select-none transition-all group/cover"
          style={{
            backgroundColor:
              videoCoverType === 'custom' && videoCoverBgType === 'solid'
                ? videoCoverBgColor
                : undefined,
            backgroundImage:
              videoCoverType === 'custom' && videoCoverBgType === 'gradient'
                ? `linear-gradient(135deg, ${videoCoverBgColor} 0%, #18181B 100%)`
                : videoCoverType === 'custom' && videoCoverBgType === 'pattern'
                ? `radial-gradient(circle at 50% 50%, ${videoCoverBgColor} 0%, #09090B 100%)`
                : undefined,
            opacity: (videoCoverBgOpacity ?? 100) / 100,
          }}
        >
          {/* OPTION 1: IMAGE COVER */}
          {videoCoverType === 'image' && videoCoverImage && (
            <img
              src={videoCoverImage}
              alt="Portada de video"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* OPTION 2: COMPOSED CUSTOM COVER (TEXT ARRIBA, FLECHA A LA IZQUIERDA, PLAY EN EL CENTRO EXACTO) */}
          {videoCoverType === 'custom' && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* BOTÓN DE PLAY: CENTRADO EN LA MITAD EXACTA HORIZONTAL Y VERTICAL */}
              <button
                type="button"
                className="absolute z-20 flex items-center justify-center shadow-xl transition-transform group-hover/cover:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/5 pointer-events-auto"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${videoCoverPlaySize || 56}px`,
                  height: `${videoCoverPlaySize || 56}px`,
                  borderRadius:
                    videoCoverButtonShape === 'square'
                      ? '8px'
                      : videoCoverButtonShape === 'rounded'
                      ? '16px'
                      : '9999px',
                  backgroundColor: videoCoverPlayBg || '#FF5A5F',
                }}
                title="Reproducir video"
              >
                {renderPlayIcon()}
              </button>

              {/* TEXTO ARRIBA DEL BOTÓN DE PLAY */}
              {videoCoverText && (
                <div
                  className="absolute z-20 px-5 py-2 rounded-lg shadow-sm flex items-center justify-center text-center transition-transform group-hover/cover:scale-105 pointer-events-none"
                  style={{
                    left: '50%',
                    top: `calc(50% - ${(videoCoverPlaySize || 56) / 2 + 38}px)`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: videoCoverTextBg || '#FFFFFF',
                    color: videoCoverTextColor || '#121111',
                    fontFamily: videoCoverTextFont || 'Poppins',
                    fontSize: `${videoCoverTextSize || 22}px`,
                    fontWeight: videoCoverTextBold ? 700 : 500,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{videoCoverText}</span>
                </div>
              )}

              {/* FLECHA A LA IZQUIERDA DEL BOTÓN DE PLAY APUNTANDO HACIA EL PLAY */}
              <div
                className="absolute z-20 pointer-events-none transition-transform group-hover/cover:scale-105"
                style={{
                  left: `calc(50% - ${(videoCoverPlaySize || 56) / 2 + 16}px)`,
                  top: `calc(50% - ${(videoCoverPlaySize || 56) / 2 + 8}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {renderArrowIcon()}
              </div>
            </div>
          )}

          {/* PLAY BUTTON ON TOP OF IMAGE COVER */}
          {videoCoverType === 'image' && (
            <button
              type="button"
              className="relative z-10 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl ring-4 ring-white/30 group-hover/cover:scale-110 transition-transform"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

          {/* Click to play tooltip */}
          <div className="absolute bottom-3 text-[11px] text-zinc-400 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs font-medium">
            Haz clic para reproducir
          </div>
        </div>
      )}

      {/* Editor mode toolbar button */}
      {isEditable && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 opacity-90 hover:opacity-100">
          {videoCoverType !== 'none' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCoverDismissed(!isCoverDismissed);
              }}
              className="px-2 py-1 text-[10px] font-semibold bg-zinc-900/90 hover:bg-black text-white rounded-md backdrop-blur-sm border border-white/20 shadow-sm cursor-pointer flex items-center gap-1"
              title={isCoverDismissed ? 'Mostrar portada' : 'Probar sin portada'}
            >
              <Eye className="w-3 h-3 text-amber-400" />
              <span>{isCoverDismissed ? 'Ver Portada' : 'Ver Video'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="px-2 py-1 text-[10px] font-semibold bg-black/80 hover:bg-black text-white rounded-md backdrop-blur-sm border border-white/20 shadow-sm cursor-pointer flex items-center gap-1"
            title="Editar ajustes del video"
          >
            <Video className="w-3 h-3 text-red-500" />
            <span>Ajustes Video</span>
          </button>
        </div>
      )}
    </div>
  );
};
