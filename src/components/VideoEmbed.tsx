import React from 'react';
import { parseVideoUrl } from '@/lib/videoUtils';

interface VideoEmbedProps {
  url: string;
  title?: string;
  thumbnail?: string;
  className?: string;
  style?: React.CSSProperties;
  onPlay?: () => void;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title,
  thumbnail,
  className = '',
  style,
  onPlay
}) => {
  const parsedVideo = parseVideoUrl(url);

  // If it's a supported platform, use iframe embed
  if (parsedVideo) {
    const { platform, embedUrl } = parsedVideo;

    switch (platform.name) {
      case 'YouTube':
        return (
          <iframe
            src={`${embedUrl}?autoplay=0&rel=0&modestbranding=1`}
            title={title || 'YouTube Video'}
            className={`w-full h-full ${className}`}
            style={style}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={onPlay}
          />
        );

      case 'Vimeo':
        return (
          <iframe
            src={`${embedUrl}?autoplay=0&color=ffffff&title=0&byline=0&portrait=0`}
            title={title || 'Vimeo Video'}
            className={`w-full h-full ${className}`}
            style={style}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={onPlay}
          />
        );

      case 'Gumlet':
        // Gumlet supports iframe embedding through play.gumlet.io
        return (
          <div className={`w-full h-full flex items-center justify-center ${className}`} style={style}>
            <iframe
              src={parsedVideo.embedUrl}
              title={title || 'Gumlet Video'}
              className="w-full max-w-2xl aspect-video"
              frameBorder="0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={onPlay}
            />
          </div>
        );

      default:
        // Fallback to direct video
        return (
          <video
            src={url}
            poster={thumbnail}
            controls
            className={`w-full h-full object-cover object-center ${className}`}
            style={style}
            onPlay={onPlay}
          >
            Your browser does not support the video tag.
          </video>
        );
    }
  }

  // If not a recognized platform, try to render as direct video
  return (
    <video
      src={url}
      poster={thumbnail}
      controls
      className={`w-full h-full object-cover object-center ${className}`}
      style={style}
      onPlay={onPlay}
    >
      Your browser does not support the video tag.
    </video>
  );
};