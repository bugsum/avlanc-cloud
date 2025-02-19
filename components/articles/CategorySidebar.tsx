import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export const CategorySidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  allTags,
  selectedTags,
  setSelectedTags,
  sortBy,
  setSortBy,
}: CategorySidebarProps) => (
  <aside className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-2 py-1 rounded transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {allTags.map((tag) => (
              <motion.div
                key={tag}
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => {
                    setSelectedTags(
                      checked
                        ? [...selectedTags, tag]
                        : selectedTags.filter((t) => t !== tag)
                    );
                  }}
                />
                <label
                  htmlFor={`tag-${tag}`}
                  className="flex-grow cursor-pointer"
                >
                  {tag}
                </label>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Sort By</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select sorting option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="readTime">Read Time</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  </aside>
);
