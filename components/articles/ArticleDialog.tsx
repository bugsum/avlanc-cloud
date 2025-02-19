import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Article } from "@/data";
import { SocialShareButtons } from "@/components/articles/SocialShareButtons";

export const ArticleDialog = ({ article }: { article: Article }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Read More</Button>
    </DialogTrigger>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          {article.title}
        </DialogTitle>
        <DialogDescription>
          By {article.author.name} |{" "}
          {new Date(article.date).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg"
        />
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <SocialShareButtons article={article} />
      </div>
    </DialogContent>
  </Dialog>
);
