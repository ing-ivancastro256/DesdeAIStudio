import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Music,
  Radio,
  ExternalLink,
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
  const audioUrl =
    element.content.audioUrl ||
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const title = element.content.audioTitle || 'Audio de Demostración';
  const artist = element.content.audioArtist || 'Scale Sales Pro Audio';
  const loop = element.content.audioLoop ?? false;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = loop;
    }
  }, [volume, isMuted, loop]);

  const togglePlay = () => {
    if (!audioRef.current) return;
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
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper to parse Spotify Embed
  const getSpotifyEmbedUrl = (url: string) => {
    if (!url) return 'https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT';
    try {
      // If already embed URL
      if (url.includes('/embed/')) return url;
      // Convert standard URL: https://open.spotify.com/track/XYZ -> https://open.spotify.com/embed/track/XYZ
      const match = url.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
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

  const containerStyle: React.CSSProperties = {
    marginTop: `${element.styles?.marginTop || 0}px`,
    marginBottom: `${element.styles?.marginBottom ?? 20}px`,
    paddingTop: `${element.styles?.paddingTop || 0}px`,
    paddingBottom: `${element.styles?.paddingBottom || 0}px`,
    paddingLeft: `${element.styles?.paddingLeft || 0}px`,
    paddingRight: `${element.styles?.paddingRight || 0}px`,
    maxWidth: element.styles?.maxWidth || '100%',
  };

  return (
    <div style={containerStyle} className="w-full">
      {/* SPOTIFY EMBED MODE */}
      {audioType === 'spotify' && (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-900">
          <iframe
            src={getSpotifyEmbedUrl(audioUrl)}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={title}
            className="rounded-2xl w-full"
          />
        </div>
      )}

      {/* SOUNDCLOUD EMBED MODE */}
      {audioType === 'soundcloud' && (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-200">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={getSoundCloudEmbedUrl(audioUrl)}
            title={title}
            className="rounded-2xl w-full"
          />
        </div>
      )}

      {/* DIRECT MP3 CUSTOM AUDIO PLAYER */}
      {audioType === 'direct' && (
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl p-4 shadow-lg border border-zinc-700/60 transition-all hover:border-zinc-600">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />

          <div className="flex items-center gap-3.5">
            {/* Play/Pause Main Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-xl bg-[#2848F0] hover:bg-blue-600 active:scale-95 transition-all text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer group"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Info & Progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <div className="text-xs font-bold font-['Poppins'] text-white truncate flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-[#2848F0] shrink-0" />
                    <span>{title}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate font-['Inter']">
                    {artist}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 shrink-0 font-medium">
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
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#2848F0] focus:outline-none"
                />
              </div>
            </div>

            {/* Volume & Loop Controls */}
            <div className="flex items-center gap-2 shrink-0 pl-1 border-l border-zinc-700/60">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                title={isMuted ? 'Desmutear' : 'Mutear'}
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
                className="w-14 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-[#2848F0]"
                title="Volumen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
