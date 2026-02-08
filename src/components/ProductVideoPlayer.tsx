import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipBack, SkipForward, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProductVideo {
  type: 'demonstration' | 'making-of' | 'usage';
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
  fileSize: number;
  uploadedAt: string;
}

interface ProductVideoPlayerProps {
  videos: ProductVideo[];
  autoplay?: boolean;
  className?: string;
}

export const ProductVideoPlayer = ({
  videos,
  autoplay = false,
  className = ''
}: ProductVideoPlayerProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVideo = videos[currentVideoIndex];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreenToggle = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const getVideoTypeLabel = (type: string) => {
    switch (type) {
      case 'demonstration':
        return 'Product Demo';
      case 'making-of':
        return 'Making Process';
      case 'usage':
        return 'How to Use';
      default:
        return 'Video';
    }
  };

  const getVideoTypeColor = (type: string) => {
    switch (type) {
      case 'demonstration':
        return 'bg-blue-500';
      case 'making-of':
        return 'bg-green-500';
      case 'usage':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className={`w-full h-64 bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No videos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Film className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold">Product Videos</h3>
        <Badge variant="secondary">{videos.length} videos</Badge>
      </div>

      {/* Main Video Player */}
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl group"
      >
        <video
          ref={videoRef}
          src={currentVideo.url}
          poster={currentVideo.thumbnail}
          className="w-full h-auto max-h-[500px] object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
        />

        {/* Enhanced Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Center Play/Pause */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePlayPause}
              className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-20 h-20 backdrop-blur-sm shadow-lg"
            >
              {isPlaying ? (
                <Pause className="h-10 w-10" />
              ) : (
                <Play className="h-10 w-10 ml-1" />
              )}
            </Button>
          </div>

          {/* Top Info Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg drop-shadow-lg mb-1">
                  {currentVideo.title}
                </h3>
                <Badge
                  variant="secondary"
                  className={`${getVideoTypeColor(currentVideo.type)} text-white border-0 text-xs`}
                >
                  {getVideoTypeLabel(currentVideo.type)}
                </Badge>
              </div>
              <div className="text-white/80 text-sm">
                {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Progress
                value={(currentTime / duration) * 100}
                className="h-2 bg-white/20"
              />
              <div className="flex justify-between text-white/80 text-xs mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, currentTime - 10);
                    }
                  }}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                    }
                  }}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMuteToggle}
                  className="text-white hover:bg-white/20 rounded-full ml-2"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreenToggle}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Thumbnails */}
      {videos.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => handleVideoSelect(index)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                index === currentVideoIndex
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-24 object-cover"
              />

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="h-8 w-8 text-white" />
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatTime(video.duration)}
              </div>

              {/* Active indicator */}
              {index === currentVideoIndex && (
                <div className="absolute top-2 left-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                </div>
              )}

              {/* Video type badge */}
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className={`${getVideoTypeColor(video.type)} text-white border-0 text-xs`}
                >
                  {getVideoTypeLabel(video.type)}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Video Details */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">{currentVideo.title}</h4>
          <span className="text-sm text-muted-foreground">
            {formatTime(currentVideo.duration)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Uploaded {new Date(currentVideo.uploadedAt).toLocaleDateString()}</span>
          <span>{(currentVideo.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
        </div>
      </div>
    </div>
  );
};
