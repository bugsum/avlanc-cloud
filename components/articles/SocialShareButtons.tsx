import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Article } from "@/data";

export const SocialShareButtons = ({ article }: { article: Article }) => {
  const shareUrl = `https://avlanc.com/articles/${article.id}`;
  const shareText = `Check out this article: ${article.title}`;

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(article.title)}`,
      "_blank"
    );
  };

  return (
    <div className="flex space-x-2">
      <Button size="sm" variant="outline" onClick={shareOnFacebook}>
        <Facebook className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button size="sm" variant="outline" onClick={shareOnTwitter}>
        <Twitter className="w-4 h-4 mr-2" />
        Tweet
      </Button>
      {/* <Button size="sm" variant="outline" onClick={shareOnLinkedIn}>
        <Linkedin className="w-4 h-4 mr-2" />
        Post
      </Button> */}
    </div>
  );
};
