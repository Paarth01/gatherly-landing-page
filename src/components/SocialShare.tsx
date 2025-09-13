import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, MessageCircle, Instagram, Twitter, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

const SocialShare = ({ title, url, description }: SocialShareProps) => {
  const shareText = `Check out this event: ${title}`;
  const shareUrl = url;

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareText);
    const tweetUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${tweetUrl}`, '_blank');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't have a direct web sharing API
    // This opens Instagram and users can manually share
    toast.info("Copy the link and share on Instagram manually");
    navigator.clipboard.writeText(shareUrl);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNativeShare}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Share...
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleInstagramShare}>
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;