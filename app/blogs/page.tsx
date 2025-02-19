"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Calendar } from "lucide-react";
import { articles, Article } from "@/data";
import { ArticleDialog } from "@/components/articles/ArticleDialog";
import { SocialShareButtons } from "@/components/articles/SocialShareButtons";
import { CategorySidebar } from "@/components/articles/CategorySidebar";
import { MobileFilterMenu } from "@/components/articles/MobileFilterMenu";

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");

  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags))
  );
  const categories = [
    "All",
    ...Array.from(new Set(articles.map((article) => article.category))),
  ];

  const filteredArticles = articles
    .filter(
      (article) =>
        (selectedCategory === "All" || article.category === selectedCategory) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) => article.tags.includes(tag))) &&
        (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "readTime") {
        return a.readTime - b.readTime;
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Hosting Knowledge Base</h1>
        <p className="text-xl mb-4">
          Explore expert advice, tutorials, and insights to enhance your hosting
          experience.
        </p>
        <div className="relative w-full max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Articles</h2>
        <MobileFilterMenu
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          allTags={allTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-1/4">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            allTags={allTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <main className="lg:w-3/4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <p className="text-center mt-8">
              No articles match your current search or filter.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

const ArticleCard = ({ article }: { article: Article }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="h-full flex flex-col">
      <Image
        src={article.image || "/placeholder.svg"}
        alt={article.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge>{article.category}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1" size={14} />
            {article.readTime} min read
          </div>
        </div>
        <CardTitle className="mt-2">{article.title}</CardTitle>
        <CardDescription>{article.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="mr-1" size={14} />
          {new Date(article.date).toLocaleDateString()}
        </div>
        <div className="flex items-center mt-2">
          <Image
            src={article.author.avatar || "/placeholder.svg"}
            alt={article.author.name}
            width={24}
            height={24}
            className="rounded-full mr-2"
          />
          <p className="text-sm">By {article.author.name}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <ArticleDialog article={article} />
        <SocialShareButtons article={article} />
      </CardFooter>
    </Card>
  </motion.div>
);
