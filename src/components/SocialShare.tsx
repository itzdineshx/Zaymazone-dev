import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

const SocialShare = ({
  url = window.location.href,
  title = "Zaymazone - Crafting Culture. Empowering Artisans.",
  description = "Discover authentic handcrafted products from talented artisans.",
  hashtags = ["handcrafted", "artisans", "traditionalcrafts"],
  className = "",
  showLabels = false,
  size = "md"
}: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.map(tag => `%23${tag}`).join('');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'width=600,height=400');
      analytics.shareProduct(url.split('/').pop() || '', platform);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url
        });
        analytics.shareProduct(url.split('/').pop() || '', 'native');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(url);
      // You could show a toast notification here
    }
  };

  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabels && <span className="text-sm font-medium mr-2">Share:</span>}

      {/* Native share button (if supported) */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2"
        >
          <Share2 size={iconSize} />
          {showLabels && "Share"}
        </Button>
      )}

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
      >
        <Facebook size={iconSize} className="text-blue-600" />
        {showLabels && "Facebook"}
      </Button>

      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-2 hover:bg-sky-50 hover:border-sky-200"
      >
        <Twitter size={iconSize} className="text-sky-500" />
        {showLabels && "Twitter"}
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
      >
        <Linkedin size={iconSize} className="text-blue-700" />
        {showLabels && "LinkedIn"}
      </Button>

      {/* WhatsApp */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200"
      >
        <MessageCircle size={iconSize} className="text-green-600" />
        {showLabels && "WhatsApp"}
      </Button>
    </div>
  );
};

export default SocialShare;