import React, { useState } from 'react';
import { Video, Play, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { getEmbedVideoInfo } from '../../utils/videoUtils';

interface EmbeddedVideoPlayerProps {
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
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  videoUrl,
  aspectRatio = '16/9',
  borderRadius = 12,
  maxWidth = '750px',
  borderWidth,
  borderColor,
  borderStyle,
  isEditable = false,
  isSelected = false,
  onSelect,
  onSetSampleVideo,
}) => {
  const [loadError, setLoadError] = useState(false);
  const videoInfo = getEmbedVideoInfo(videoUrl);

  const sampleYouTube = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  const ratioStyle =
    aspectRatio === '4/3'
      ? '4/3'
      : aspectRatio === '9/16'
      ? '9/16'
      : aspectRatio === '1/1'
      ? '1/1'
      : '16/9';

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
      } transition-all ${
        isSelected ? 'ring-2 ring-[#2848F0]' : ''
      }`}
    >
      {/* If valid embeddable video URL exists */}
      {videoInfo.isValid && !loadError ? (
        videoInfo.type === 'direct' ? (
          <video
            src={videoInfo.embedUrl}
            controls
            playsInline
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
              Introduce una URL de YouTube en el panel lateral para ver y reproducir tu video en tiempo real.
            </p>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1 max-w-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>URL no reconocida. Asegúrate de ingresar un enlace válido de YouTube.</span>
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

          {videoUrl && (
            <div className="mt-2 text-[10px] text-zinc-500 font-mono truncate max-w-xs px-2 py-0.5 bg-zinc-800/60 rounded">
              {videoUrl}
            </div>
          )}
        </div>
      )}

      {/* Editor mode badge helper */}
      {isEditable && (
        <div className="absolute top-2 right-2 z-10 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
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
