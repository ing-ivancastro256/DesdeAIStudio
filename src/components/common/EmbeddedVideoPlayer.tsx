import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  PlayCircle,
  Film,
  Sparkles,
  RefreshCw,
  AlertCircle,
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
} from 'lucide-react';
import { getEmbedVideoInfo } from '../../utils/videoUtils';

export interface EmbeddedVideoPlayerProps {
  videoUrl?: string;
  videoFileName?: string;
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
  videoCoverBgColor2?: string;
  videoCoverBgOpacity?: number; // 0 to 100
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  videoUrl,
  videoFileName,
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

  videoSource = 'youtube',
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
  videoCoverBgColor2,
  videoCoverBgOpacity = 100,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [fallbackBlobUrl, setFallbackBlobUrl] = useState<string | null>(null);
  const [didAttemptBlobFallback, setDidAttemptBlobFallback] = useState(false);
  const [isCoverDismissed, setIsCoverDismissed] = useState(false);
  const [playerResetKey, setPlayerResetKey] = useState(0);
  const [suppressAutoplay, setSuppressAutoplay] = useState(false);
  const [prevCoverType, setPrevCoverType] = useState(videoCoverType);
  const [prevCoverImage, setPrevCoverImage] = useState(videoCoverImage);
  const [prevAutoplay, setPrevAutoplay] = useState(videoAutoplay);

  // Whenever cover type changes, immediately restore cover and reset video to 0:00 paused
  if (prevCoverType !== videoCoverType) {
    setPrevCoverType(videoCoverType);
    setIsCoverDismissed(false);
    setSuppressAutoplay(true);
    setPlayerResetKey((k) => k + 1);
  }

  // If cover image is replaced while in 'image' cover mode, restore cover and reset to 0:00 paused
  if (prevCoverImage !== videoCoverImage) {
    setPrevCoverImage(videoCoverImage);
    if (videoCoverType === 'image') {
      setIsCoverDismissed(false);
      setSuppressAutoplay(true);
      setPlayerResetKey((k) => k + 1);
    }
  }

  // Re-honor videoAutoplay prop if the user explicitly toggles the Autoplay setting
  if (prevAutoplay !== videoAutoplay) {
    setPrevAutoplay(videoAutoplay);
    setSuppressAutoplay(false);
  }

  // Ensure native HTML5 video element is paused and rewound to 0:00 on reset
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch {
        // Ignore if metadata hasn't loaded yet
      }
    }
  }, [playerResetKey]);

  // Reset error, cover dismissal & fallback states whenever videoUrl or source changes
  useEffect(() => {
    setLoadError(false);
    setDidAttemptBlobFallback(false);
    setIsCoverDismissed(false);
    setFallbackBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [videoUrl, videoSource]);

  // Cleanup any created fallback blob URL on unmount
  useEffect(() => {
    return () => {
      if (fallbackBlobUrl) {
        URL.revokeObjectURL(fallbackBlobUrl);
      }
    };
  }, [fallbackBlobUrl]);

  const hasActiveCover = Boolean(videoCoverType && videoCoverType !== 'none' && !isCoverDismissed);
  const isDismissedCoverPlayback = Boolean(videoCoverType && videoCoverType !== 'none' && isCoverDismissed);

  // Never autoplay behind an active cover; play immediately when cover is clicked; stay paused at 0:00 after cover-type switch
  const effectiveAutoplay = hasActiveCover
    ? false
    : isDismissedCoverPlayback
    ? true
    : !suppressAutoplay && Boolean(videoAutoplay);
  const effectiveMuted = isDismissedCoverPlayback ? false : Boolean(videoMuted);

  const videoInfo = getEmbedVideoInfo(videoUrl, {
    autoplay: effectiveAutoplay,
    muted: effectiveMuted,
    loop: videoLoop,
    source: videoSource,
  });

  const activeDirectSrc = fallbackBlobUrl || videoInfo.embedUrl;
  const sampleYouTube = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  const ratioStyle =
    aspectRatio === '4/3'
      ? '4/3'
      : aspectRatio === '9/16'
      ? '9/16'
      : aspectRatio === '1/1'
      ? '1/1'
      : '16/9';

  const handleCoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCoverDismissed(true);
  };

  const handleDirectVideoError = () => {
    // Some browsers reject 'video/quicktime' (.mov) or 'video/x-matroska' (.mkv) MIME strings
    // even when their internal demuxer can decode the underlying H.264/VP8/VP9/AAC/Opus stream
    // if served as a sniffable typeless Blob. Retry once automatically for blob: URLs.
    if (
      videoInfo.embedUrl.startsWith('blob:') &&
      !didAttemptBlobFallback
    ) {
      setDidAttemptBlobFallback(true);
      fetch(videoInfo.embedUrl)
        .then((res) => res.blob())
        .then((rawBlob) => {
          const sniffableBlob = new Blob([rawBlob]);
          const nextUrl = URL.createObjectURL(sniffableBlob);
          setFallbackBlobUrl(nextUrl);
          setLoadError(false);
        })
        .catch(() => {
          setLoadError(true);
        });
      return;
    }
    setLoadError(true);
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
            <div className="w-full h-full border-2 rounded-none flex items-center justify-center" style={{ borderColor: color }}>
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

  const effectiveGradientColor2 = videoCoverBgColor2 || '#18181B';
  const effectivePatternColor2 = videoCoverBgColor2 || '#94A3B8';

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
            ref={videoRef}
            key={`${activeDirectSrc}-${playerResetKey}`}
            src={activeDirectSrc}
            controls
            playsInline
            autoPlay={effectiveAutoplay}
            muted={effectiveMuted}
            loop={videoLoop}
            preload="metadata"
            className="w-full h-full object-contain bg-black rounded-[inherit]"
            onError={handleDirectVideoError}
          />
        ) : (
          <iframe
            key={`${videoInfo.embedUrl}-${playerResetKey}`}
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
        /* Empty or invalid/unsupported state placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-zinc-900 to-zinc-950 select-none">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center mb-3 shadow-lg ring-4 ring-red-500/20">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>

          <h4 className="text-sm font-bold text-zinc-100 font-['Poppins']">
            {videoFileName ? videoFileName : 'Reproductor de Video'}
          </h4>

          {videoInfo.type === 'empty' ? (
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              {videoSource === 'upload'
                ? 'Arrastra o sube un video (MP4, AVI, MOV, WebM o MKV) desde el panel lateral.'
                : 'Introduce la URL de tu video en el panel lateral para reproducir en tiempo real.'}
            </p>
          ) : loadError && videoInfo.type === 'direct' ? (
            <div className="flex flex-col items-center gap-1.5 text-xs text-amber-400 mt-1.5 max-w-sm">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  El navegador no pudo decodificar el códec interno de este archivo. Prueba con códec H.264 / VP9 (MP4, WebM, MOV o MKV).
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1 max-w-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>URL no reconocida. Ingresa un enlace válido de YouTube, Vimeo, Wistia o archivo de video.</span>
            </div>
          )}

          {onSetSampleVideo && videoSource !== 'upload' && (
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
          style={
            videoCoverType === 'image'
              ? { opacity: (videoCoverBgOpacity ?? 100) / 100 }
              : undefined
          }
        >
          {/* BACKGROUND LAYER FOR CUSTOM CTA COVER (SÓLIDO, GRADIENTE DE 2 COLORES, PATRÓN DE 2 COLORES) */}
          {videoCoverType === 'custom' && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor:
                  videoCoverBgType === 'solid' || videoCoverBgType === 'pattern'
                    ? videoCoverBgColor
                    : undefined,
                backgroundImage:
                  videoCoverBgType === 'gradient'
                    ? `linear-gradient(135deg, ${videoCoverBgColor} 0%, ${effectiveGradientColor2} 100%)`
                    : videoCoverBgType === 'pattern'
                    ? `radial-gradient(${effectivePatternColor2} 1.75px, transparent 1.75px), radial-gradient(${effectivePatternColor2} 1.75px, transparent 1.75px)`
                    : undefined,
                backgroundSize: videoCoverBgType === 'pattern' ? '22px 22px' : undefined,
                backgroundPosition: videoCoverBgType === 'pattern' ? '0 0, 11px 11px' : undefined,
                opacity: (videoCoverBgOpacity ?? 100) / 100,
              }}
            />
          )}

          {/* OPTION 1: IMAGE COVER */}
          {videoCoverType === 'image' && videoCoverImage && (
            <img
              src={videoCoverImage}
              alt="Portada de video"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* OPTION 2: COMPOSED CUSTOM COVER (TEXTO ARRIBA, FLECHA A LA IZQUIERDA, PLAY EN EL CENTRO EXACTO) */}
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
                      ? '0px'
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
          <div className="absolute bottom-3 z-20 text-[11px] text-zinc-300 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs font-medium">
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
                if (isCoverDismissed) {
                  setIsCoverDismissed(false);
                  setSuppressAutoplay(true);
                  setPlayerResetKey((k) => k + 1);
                } else {
                  setIsCoverDismissed(true);
                }
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
