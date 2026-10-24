import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Radio,
} from 'lucide-react';
import { PageBlockElement } from '../../../types';

interface AudioPlayerElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
}

export const AudioPlayerElement: React.FC<AudioPlayerElementProps> = ({
  element,
  isEditable = false,
}) => {
  const audioType = element.content.audioType || 'direct';
  const audioUrl = (element.content.audioUrl || '').trim();
  const title = element.content.audioTitle ?? 'Título del audio';
  const artist = element.content.audioArtist ?? 'Artista / Autor';
  const loop = element.content.audioLoop ?? false;

  // Player customization (Solid color by default)
  const bgType = element.content.audioBgType || 'solid';
  const bgColor = element.content.audioBgColor || '#18181B';
  const bgColorEnd = element.content.audioBgColorEnd || '#1E293B';
  const titleColor = element.content.audioTitleColor || '#FFFFFF';
  const artistColor = element.content.audioArtistColor || '#A1A1AA';
  const titleSize = element.content.audioTitleSize ?? 13;
  const fontFamily = element.content.audioFontFamily || 'Poppins';

  const playButtonBg = element.content.audioPlayButtonBg || '#2848F0';
  const playIconColor = element.content.audioPlayIconColor || '#FFFFFF';
  const playButtonShape = element.content.audioPlayButtonShape || 'rounded';
  const progressColor = element.content.audioProgressColor || '#2848F0';
  const progressBgColor = element.content.audioProgressBgColor || '#3F3F46';
  const playerSize = element.content.audioPlayerSize || 'normal';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Reset playback state whenever audioUrl or audioType changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl, audioType]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = loop;
    }
  }, [volume, isMuted, loop]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper to parse Spotify Embed
  const getSpotifyEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('/embed/')) return url;
      const match = url.match(/open\.spotify\.com\/(?:intl-[a-zA-Z-]+\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
      if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  // Helper to parse SoundCloud Embed
  const getSoundCloudEmbedUrl = (url: string) => {
    if (!url) return '';
    const encoded = encodeURIComponent(url);
    return `https://w.soundcloud.com/player/?url=${encoded}&color=%232848f0&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  };

  const align = element.styles?.textAlign || 'center';
  const justifyClass =
    align === 'left'
      ? 'justify-start'
      : align === 'right'
      ? 'justify-end'
      : 'justify-center';

  const outerWrapperStyle: React.CSSProperties = {
    marginTop: `${element.styles?.marginTop || 0}px`,
    marginBottom: `${element.styles?.marginBottom ?? 20}px`,
    paddingTop: `${element.styles?.paddingTop || 0}px`,
    paddingBottom: `${element.styles?.paddingBottom || 0}px`,
    paddingLeft: `${element.styles?.paddingLeft || 0}px`,
    paddingRight: `${element.styles?.paddingRight || 0}px`,
  };

  const innerPlayerWidthStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: element.styles?.maxWidth || '100%',
  };

  const isPlaylist =
    audioUrl.includes('playlist') ||
    audioUrl.includes('album') ||
    audioUrl.includes('sets');

  const embedHeight = isPlaylist ? 380 : 152;

  // Size presets for Direct Audio Player
  const sizePadding =
    playerSize === 'compact'
      ? '10px 14px'
      : playerSize === 'large'
      ? '22px 24px'
      : '16px 18px';

  const playBtnSizePx =
    playerSize === 'compact' ? 38 : playerSize === 'large' ? 56 : 48;

  const playIconSizeClass =
    playerSize === 'compact'
      ? 'w-4 h-4'
      : playerSize === 'large'
      ? 'w-6 h-6'
      : 'w-5 h-5';

  const playBtnRadius =
    playButtonShape === 'circle'
      ? '9999px'
      : playButtonShape === 'square'
      ? '0px'
      : '12px';

  const borderRadiusPx = element.styles?.borderRadius ?? 16;
  const borderWidthPx = element.styles?.borderWidth ?? 0;
  const borderStyleVal = element.styles?.borderStyle || 'solid';
  const borderColorVal = element.styles?.borderColor || '#3F3F46';

  const shadowMap: Record<string, string> = {
    none: 'none',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.12)',
    md: '0 4px 12px -2px rgba(0, 0, 0, 0.18)',
    lg: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
    xl: '0 20px 35px -8px rgba(0, 0, 0, 0.35)',
  };
  const resolvedShadow = shadowMap[element.styles?.shadow || 'lg'] ?? shadowMap.lg;

  const directCardStyle: React.CSSProperties = {
    background:
      bgType === 'gradient'
        ? `linear-gradient(135deg, ${bgColor} 0%, ${bgColorEnd} 100%)`
        : bgColor,
    borderRadius: `${borderRadiusPx}px`,
    padding: sizePadding,
    border:
      borderWidthPx > 0
        ? `${borderWidthPx}px ${borderStyleVal} ${borderColorVal}`
        : '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: resolvedShadow,
    fontFamily,
  };

  const progressRatio = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const volumeRatio = Math.min(100, Math.max(0, (isMuted ? 0 : volume) * 100));
  const barHeightClass = playerSize === 'large' ? 'h-2' : playerSize === 'compact' ? 'h-1' : 'h-1.5';

  return (
    <div style={outerWrapperStyle} className={`w-full flex ${justifyClass}`}>
      <div style={innerPlayerWidthStyle}>
        {/* SPOTIFY EMBED MODE */}
        {audioType === 'spotify' && (
          audioUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-900">
              <iframe
                src={getSpotifyEmbedUrl(audioUrl)}
                width="100%"
                height={embedHeight}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={title || 'Spotify Audio'}
                className="rounded-2xl w-full"
              />
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-zinc-900 text-white border border-zinc-800 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold">Reproductor de Spotify</div>
              <p className="text-xs text-zinc-400 max-w-md">
                {isEditable
                  ? 'Pega la URL de tu canción, episodio o playlist de Spotify en el panel lateral.'
                  : 'Audio de Spotify no configurado.'}
              </p>
            </div>
          )
        )}

        {/* SOUNDCLOUD EMBED MODE */}
        {audioType === 'soundcloud' && (
          audioUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-white">
              <iframe
                width="100%"
                height={isPlaylist ? 380 : 166}
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={getSoundCloudEmbedUrl(audioUrl)}
                title={title || 'SoundCloud Audio'}
                className="rounded-2xl w-full"
              />
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-zinc-900 text-white border border-zinc-800 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold">Reproductor de SoundCloud</div>
              <p className="text-xs text-zinc-400 max-w-md">
                {isEditable
                  ? 'Pega la URL de tu pista o playlist de SoundCloud en el panel lateral.'
                  : 'Audio de SoundCloud no configurado.'}
              </p>
            </div>
          )
        )}

        {/* DIRECT MP3 / UPLOADED AUDIO CUSTOM PLAYER */}
        {audioType === 'direct' && (
          <div>
            <div style={directCardStyle} className="transition-all">
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  preload="metadata"
                />
              )}

              <div className="flex items-center gap-3.5">
                {/* Play/Pause Main Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  style={{
                    width: `${playBtnSizePx}px`,
                    height: `${playBtnSizePx}px`,
                    borderRadius: playBtnRadius,
                    backgroundColor: playButtonBg,
                    color: playIconColor,
                  }}
                  className={`active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-md ${
                    audioUrl ? 'cursor-pointer hover:opacity-95' : 'cursor-default opacity-80'
                  }`}
                  title={!audioUrl ? 'Sin audio cargado' : isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? (
                    <Pause className={`${playIconSizeClass} fill-current`} />
                  ) : (
                    <Play className={`${playIconSizeClass} fill-current ml-0.5`} />
                  )}
                </button>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <div
                        style={{
                          color: titleColor,
                          fontSize: `${titleSize}px`,
                          fontFamily,
                        }}
                        className="font-bold truncate flex items-center gap-1.5 leading-snug"
                      >
                        <Music
                          style={{ color: progressColor }}
                          className="w-3.5 h-3.5 shrink-0"
                        />
                        <span className="truncate">{title || 'Sin título'}</span>
                      </div>
                      {artist && (
                        <div
                          style={{
                            color: artistColor,
                            fontSize: `${Math.max(10, titleSize - 2)}px`,
                            fontFamily,
                          }}
                          className="truncate leading-tight mt-0.5"
                        >
                          {artist}
                        </div>
                      )}
                    </div>
                    <div
                      style={{ color: artistColor }}
                      className="text-[11px] font-mono shrink-0 font-medium"
                    >
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  {/* Seeker Scrubber */}
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      disabled={!audioUrl}
                      style={{
                        background: `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${progressRatio}%, ${progressBgColor} ${progressRatio}%, ${progressBgColor} 100%)`,
                        accentColor: progressColor,
                      }}
                      className={`w-full ${barHeightClass} rounded-full appearance-none focus:outline-none ${
                        audioUrl ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    />
                  </div>
                </div>

                {/* Volume Controls */}
                <div
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                  className="hidden sm:flex items-center gap-2 shrink-0 pl-2 border-l"
                >
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    style={{ color: artistColor }}
                    className="p-1.5 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    style={{
                      background: `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${volumeRatio}%, ${progressBgColor} ${volumeRatio}%, ${progressBgColor} 100%)`,
                      accentColor: progressColor,
                    }}
                    className="w-14 h-1 rounded-full appearance-none cursor-pointer focus:outline-none"
                    title="Volumen"
                  />
                </div>
              </div>
            </div>

            {isEditable && !audioUrl && (
              <div className="mt-1.5 text-[11px] text-amber-600 font-medium text-center">
                {element.content.audioSource === 'upload'
                  ? 'Sube un archivo MP3/WAV desde el panel lateral para reproducir el audio.'
                  : 'Ingresa una URL de audio externo en el panel lateral para reproducir.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
