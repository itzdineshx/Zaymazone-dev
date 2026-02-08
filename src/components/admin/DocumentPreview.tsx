import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn } from 'lucide-react';

interface DocumentPreviewProps {
  type: 'image' | 'video' | null;
  url: string | null;
  onClose: () => void;
  onDownload?: (url: string, filename: string) => void;
}

export function DocumentPreview({ type, url, onClose, onDownload }: DocumentPreviewProps) {
  if (!url) return null;

  return (
    <Dialog open={!!url} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0">
        <div className="relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                {type === 'image' ? 'Image Preview' : 'Video Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={() => onDownload(url, `document-${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-black flex items-center justify-center min-h-[500px] max-h-[90vh] pt-16">
            {type === 'image' ? (
              <img
                src={url}
                alt="Preview"
                className="max-w-full max-h-[calc(90vh-4rem)] object-contain"
              />
            ) : type === 'video' ? (
              <video
                src={url}
                controls
                autoPlay
                className="max-w-full max-h-[calc(90vh-4rem)]"
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
