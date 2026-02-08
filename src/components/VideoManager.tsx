import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Play, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { validateVideoUrl, generateThumbnailUrl, parseVideoUrl } from '@/lib/videoUtils';

interface Video {
  type: 'demonstration' | 'making-of' | 'usage';
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
}

interface VideoManagerProps {
  videos: Video[];
  onChange: (videos: Video[]) => void;
}

interface VideoFormData {
  type: 'demonstration' | 'making-of' | 'usage';
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
}

const INITIAL_VIDEO_DATA: VideoFormData = {
  type: 'demonstration',
  title: '',
  url: '',
  thumbnail: '',
  duration: 0
};

export function VideoManager({ videos, onChange }: VideoManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [videoForm, setVideoForm] = useState<VideoFormData>(INITIAL_VIDEO_DATA);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'link'>('link');
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; platform?: string; error?: string } | null>(null);

  const resetForm = () => {
    setVideoForm(INITIAL_VIDEO_DATA);
    setEditingIndex(null);
    setUploadMethod('link');
    setUrlValidation(null);
  };

  const handleAddVideo = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditVideo = (index: number) => {
    const video = videos[index];
    setVideoForm({
      type: video.type,
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      duration: video.duration
    });
    setEditingIndex(index);
    setUploadMethod(video.url.startsWith('http') ? 'link' : 'upload');
    setIsDialogOpen(true);
  };

  const handleDeleteVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onChange(newVideos);
    toast.success('Video removed successfully');
  };

  const handleSubmitVideo = () => {
    if (!videoForm.title || !videoForm.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate URL based on upload method
    if (uploadMethod === 'link') {
      const validation = validateVideoUrl(videoForm.url);
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid video URL');
        return;
      }
    } else {
      // Basic URL validation for uploaded files
      if (!videoForm.url.match(/^https?:\/\/.+/)) {
        toast.error('Please enter a valid URL starting with http:// or https://');
        return;
      }
    }

    // Generate thumbnail if not provided
    const thumbnail = videoForm.thumbnail || generateThumbnailUrl(videoForm.url);

    const newVideo: Video = {
      type: videoForm.type,
      title: videoForm.title,
      url: videoForm.url,
      thumbnail: thumbnail,
      duration: videoForm.duration
    };

    let newVideos: Video[];
    if (editingIndex !== null) {
      newVideos = [...videos];
      newVideos[editingIndex] = newVideo;
    } else {
      newVideos = [...videos, newVideo];
    }

    onChange(newVideos);
    setIsDialogOpen(false);
    resetForm();
    toast.success(editingIndex !== null ? 'Video updated successfully' : 'Video added successfully');
  };

  const getVideoTypeLabel = (type: string) => {
    switch (type) {
      case 'demonstration': return 'Product Demo';
      case 'making-of': return 'Making Of';
      case 'usage': return 'How to Use';
      default: return type;
    }
  };

  const getVideoTypeColor = (type: string) => {
    switch (type) {
      case 'demonstration': return 'bg-blue-100 text-blue-800';
      case 'making-of': return 'bg-green-100 text-green-800';
      case 'usage': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformFromUrl = (url: string): string => {
    const parsed = parseVideoUrl(url);
    return parsed ? parsed.platform.name : 'Direct Video';
  };

  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'YouTube': return 'bg-red-100 text-red-800';
      case 'Vimeo': return 'bg-blue-100 text-blue-800';
      case 'Gumlet': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Video List */}
      {videos.length > 0 && (
        <div className="grid gap-3">
          {videos.map((video, index) => (
            <Card key={index} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-6 h-6 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{video.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getVideoTypeColor(video.type)}`}>
                        {getVideoTypeLabel(video.type)}
                      </Badge>
                      <Badge className={`text-xs ${getPlatformColor(getPlatformFromUrl(video.url))}`}>
                        {getPlatformFromUrl(video.url)}
                      </Badge>
                      {video.duration > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVideo(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVideo(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Video Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddVideo}
        className="w-full border-dashed"
        disabled={videos.length >= 5}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Video {videos.length > 0 && `(${videos.length}/5)`}
      </Button>

      {/* Video Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Edit Video' : 'Add Video'}
            </DialogTitle>
            <DialogDescription>
              Add a video to showcase your product. You can upload a file or provide a video link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Method Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadMethod === 'link' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('link')}
                className="flex-1"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Video Link
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('upload')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            {/* Video Type */}
            <div>
              <Label htmlFor="videoType">Video Type *</Label>
              <Select
                value={videoForm.type}
                onValueChange={(value: 'demonstration' | 'making-of' | 'usage') =>
                  setVideoForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select video type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demonstration">Product Demonstration</SelectItem>
                  <SelectItem value="making-of">Making Of / Behind the Scenes</SelectItem>
                  <SelectItem value="usage">How to Use / Care Instructions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="videoTitle">Title *</Label>
              <Input
                id="videoTitle"
                value={videoForm.title}
                onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title"
              />
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="videoUrl">
                {uploadMethod === 'link' ? 'Video URL *' : 'Video File *'}
              </Label>
              {uploadMethod === 'link' ? (
                <div>
                  <Input
                    id="videoUrl"
                    value={videoForm.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      setVideoForm(prev => ({ ...prev, url }));

                      // Validate URL in real-time
                      if (url.trim()) {
                        const validation = validateVideoUrl(url);
                        setUrlValidation(validation);
                      } else {
                        setUrlValidation(null);
                      }
                    }}
                    placeholder="https://youtu.be/... or https://vimeo.com/... or https://gumlet.com/..."
                    className={urlValidation && !urlValidation.isValid ? 'border-red-500' : ''}
                  />
                  {urlValidation && (
                    <div className="mt-1 text-xs">
                      {urlValidation.isValid ? (
                        <span className="text-green-600 flex items-center gap-1">
                          ✓ Supported platform: {urlValidation.platform}
                        </span>
                      ) : (
                        <span className="text-red-600">{urlValidation.error}</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  id="videoUrl"
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real app, you'd upload the file and get back a URL
                      // For now, we'll create a placeholder URL
                      const url = URL.createObjectURL(file);
                      setVideoForm(prev => ({ ...prev, url }));
                    }
                  }}
                />
              )}
            </div>

            {/* Thumbnail URL (optional) */}
            <div>
              <Label htmlFor="videoThumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="videoThumbnail"
                value={videoForm.thumbnail}
                onChange={(e) => setVideoForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to use video URL as thumbnail
              </p>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="videoDuration">Duration (seconds)</Label>
              <Input
                id="videoDuration"
                type="number"
                value={videoForm.duration || ''}
                onChange={(e) => setVideoForm(prev => ({
                  ...prev,
                  duration: parseInt(e.target.value) || 0
                }))}
                placeholder="120"
                min="0"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitVideo}>
                {editingIndex !== null ? 'Update Video' : 'Add Video'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}