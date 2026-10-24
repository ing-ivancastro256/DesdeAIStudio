/**
 * Video Utilities for parsing and embedding YouTube, Vimeo, Loom, and direct video URLs.
 */

export interface ParsedVideoInfo {
  isValid: boolean;
  type: 'youtube' | 'vimeo' | 'loom' | 'direct' | 'empty' | 'unknown';
  embedUrl: string;
  originalUrl: string;
  videoId?: string;
}

/**
 * Extracts YouTube Video ID from any standard or shortened YouTube URL.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If directly an 11-character ID (standard YouTube ID format)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle embed URLs: /embed/ID
  const embedMatch = trimmed.match(/(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Handle standard watch URLs, shorts, youtu.be, live, etc.
  const standardMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1];
  }

  return null;
}

/**
 * Parses timestamp from YouTube URL (e.g., ?t=85 or ?t=1m25s) into seconds.
 */
export function extractYouTubeStartTime(url: string): number | null {
  if (!url) return null;
  const match = url.match(/[?&](?:t|start)=([0-9hms]+)/i);
  if (!match || !match[1]) return null;

  const val = match[1];
  if (/^\d+$/.test(val)) {
    return parseInt(val, 10);
  }

  // Parse 1h20m30s
  let seconds = 0;
  const h = val.match(/(\d+)h/i);
  const m = val.match(/(\d+)m/i);
  const s = val.match(/(\d+)s/i);
  if (h) seconds += parseInt(h[1], 10) * 3600;
  if (m) seconds += parseInt(m[1], 10) * 60;
  if (s) seconds += parseInt(s[1], 10);

  return seconds > 0 ? seconds : null;
}

export interface VideoEmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  source?: string;
}

/**
 * Parses any video URL and generates an embeddable URL with optional autoplay/muted/loop parameters.
 */
export function getEmbedVideoInfo(rawUrl: string | undefined, options?: VideoEmbedOptions): ParsedVideoInfo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isValid: false,
      type: 'empty',
      embedUrl: '',
      originalUrl: '',
    };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      type: 'empty',
      embedUrl: '',
      originalUrl: '',
    };
  }

  const { autoplay = false, muted = false, loop = false, source } = options || {};

  // 0. Uploaded local Blob URLs or Data URLs
  if (/^blob:/i.test(trimmed) || /^data:(video\/|application\/octet-stream)/i.test(trimmed)) {
    return {
      isValid: true,
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  // 1. YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    const startTime = extractYouTubeStartTime(trimmed);
    let embed = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&enablejsapi=1`;
    if (startTime) {
      embed += `&start=${startTime}`;
    }
    if (autoplay) {
      embed += `&autoplay=1`;
    }
    if (muted) {
      embed += `&mute=1`;
    }
    if (loop) {
      embed += `&loop=1&playlist=${ytId}`;
    }
    return {
      isValid: true,
      type: 'youtube',
      embedUrl: embed,
      originalUrl: trimmed,
      videoId: ytId,
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|))(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    let embed = `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
    if (autoplay) embed += `&autoplay=1`;
    if (muted) embed += `&muted=1`;
    if (loop) embed += `&loop=1`;
    return {
      isValid: true,
      type: 'vimeo',
      embedUrl: embed,
      originalUrl: trimmed,
      videoId: vimeoMatch[1],
    };
  }
  if (trimmed.includes('player.vimeo.com/video/')) {
    let embed = trimmed;
    if (autoplay && !embed.includes('autoplay=')) embed += `${embed.includes('?') ? '&' : '?'}autoplay=1`;
    if (muted && !embed.includes('muted=')) embed += `&muted=1`;
    if (loop && !embed.includes('loop=')) embed += `&loop=1`;
    return {
      isValid: true,
      type: 'vimeo',
      embedUrl: embed,
      originalUrl: trimmed,
    };
  }

  // 3. Wistia
  const wistiaMatch = trimmed.match(/(?:wistia\.com\/(?:medias|embed)\/|fast\.wistia\.net\/embed\/iframe\/)([a-zA-Z0-9]+)/i);
  if (wistiaMatch && wistiaMatch[1]) {
    let embed = `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}?videoFoam=true`;
    if (autoplay) embed += `&autoPlay=true`;
    if (muted) embed += `&muted=true`;
    if (loop) embed += `&endVideoBehavior=loop`;
    return {
      isValid: true,
      type: 'wistia' as any,
      embedUrl: embed,
      originalUrl: trimmed,
      videoId: wistiaMatch[1],
    };
  }

  // 4. Loom
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      isValid: true,
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      originalUrl: trimmed,
      videoId: loomMatch[1],
    };
  }

  // 5. Direct video file (.mp4, .avi, .mov, .webm, .mkv, .ogg, .m4v)
  if (/\.(mp4|avi|mov|webm|mkv|ogg|m4v)($|\?|#)/i.test(trimmed)) {
    return {
      isValid: true,
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  // 6. Explicit upload or external video URL -> play with HTML5 <video> when source is upload/external
  if (/^https?:\/\//i.test(trimmed)) {
    if (source === 'upload' || source === 'external') {
      return {
        isValid: true,
        type: 'direct',
        embedUrl: trimmed,
        originalUrl: trimmed,
      };
    }
    return {
      isValid: true,
      type: 'unknown',
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  return {
    isValid: false,
    type: 'unknown',
    embedUrl: '',
    originalUrl: trimmed,
  };
}

/**
 * Returns just the embed URL string or empty string if not embeddable.
 */
export function getEmbedVideoUrl(rawUrl: string | undefined): string {
  return getEmbedVideoInfo(rawUrl).embedUrl;
}

