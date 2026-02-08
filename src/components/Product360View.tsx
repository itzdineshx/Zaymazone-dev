import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Play, Pause, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Image360 {
  angle: number;
  url: string;
  alt: string;
}

interface Product360ViewProps {
  images: Image360[];
  zoomEnabled?: boolean;
  spinSpeed?: number;
  className?: string;
}

export const Product360View = ({
  images,
  zoomEnabled = true,
  spinSpeed = 300,
  className = ''
}: Product360ViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const autoSpinRef = useRef<NodeJS.Timeout | null>(null);

  const sortedImages = images.sort((a, b) => a.angle - b.angle);

  // Auto-spin functionality
  useEffect(() => {
    if (isAutoSpinning) {
      autoSpinRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
      }, spinSpeed);
    } else {
      if (autoSpinRef.current) {
        clearInterval(autoSpinRef.current);
        autoSpinRef.current = null;
      }
    }

    return () => {
      if (autoSpinRef.current) {
        clearInterval(autoSpinRef.current);
      }
    };
  }, [isAutoSpinning, spinSpeed, sortedImages.length]);

  const toggleAutoSpin = () => {
    setIsAutoSpinning(!isAutoSpinning);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isZoomed) {
      const deltaX = e.clientX - dragStart.x;
      if (Math.abs(deltaX) > 50) { // Threshold for rotation
        if (deltaX > 0) {
          prevImage();
        } else {
          nextImage();
        }
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }

    if (isZoomed && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    if (!zoomEnabled) return;

    if (!isZoomed) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
      }
    }
    setIsZoomed(!isZoomed);
  };

  // Auto-spin functionality
  useEffect(() => {
    if (!isDragging && !isZoomed) {
      const interval = setInterval(() => {
        nextImage();
      }, spinSpeed);

      return () => clearInterval(interval);
    }
  }, [isDragging, isZoomed, spinSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === ' ' && zoomEnabled) {
        e.preventDefault();
        setIsZoomed(!isZoomed);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [zoomEnabled]);

  if (!sortedImages.length) {
    return (
      <div className={`w-full h-96 bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">360° view not available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">360° Interactive View</h3>
          <Badge variant="secondary" className="text-xs">
            {sortedImages.length} angles
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoSpinning ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoSpin}
            className="flex items-center gap-2"
          >
            {isAutoSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoSpinning ? 'Stop' : 'Auto Spin'}
          </Button>
          {zoomEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsZoomed(!isZoomed)}
              className="flex items-center gap-2"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              {isZoomed ? 'Zoom Out' : 'Zoom In'}
            </Button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 cursor-grab shadow-lg border ${
          isDragging ? 'cursor-grabbing' : ''
        } ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        style={{ aspectRatio: '1', minHeight: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={toggleZoom}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading 360° view...</p>
            </div>
          </div>
        )}
        <img
          ref={imageRef}
          src={sortedImages[currentIndex].url}
          alt={sortedImages[currentIndex].alt || `Product view at ${sortedImages[currentIndex].angle}°`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isZoomed ? 'scale-150' : 'scale-100'
          } ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          draggable={false}
        />

        {/* Enhanced indicators */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {sortedImages[currentIndex].angle}°
          </div>
          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {sortedImages.length}
          </div>
        </div>

        {/* Navigation arrows - enhanced */}
        {!isZoomed && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg border-0 h-12 w-12 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg border-0 h-12 w-12 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Zoom hint */}
        {zoomEnabled && !isZoomed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            Click to zoom • Drag to rotate
          </div>
        )}
      </div>

      {/* Enhanced thumbnail strip */}
      <div className="flex gap-3 mt-6 overflow-x-auto pb-2 px-2">
        {sortedImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg border-3 overflow-hidden transition-all duration-200 ${
              index === currentIndex
                ? 'border-primary shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:scale-102'
            }`}
          >
            <img
              src={image.url}
              alt={`View ${image.angle}°`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Enhanced instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          🖱️ <strong>Drag</strong> to rotate • 🔍 <strong>Click</strong> to zoom • ⌨️ <strong>Arrow keys</strong> to navigate
        </p>
        {isAutoSpinning && (
          <Badge variant="outline" className="animate-pulse">
            🔄 Auto-rotating...
          </Badge>
        )}
      </div>
    </div>
  );
};
