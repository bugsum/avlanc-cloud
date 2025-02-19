import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface MobileFilterMenuProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export const MobileFilterMenu = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  allTags,
  selectedTags,
  setSelectedTags,
  sortBy,
  setSortBy,
}: MobileFilterMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Adjust your article preferences</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-2 py-1 rounded ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Tags</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => {
                        setSelectedTags(
                          checked
                            ? [...selectedTags, tag]
                            : selectedTags.filter((t) => t !== tag)
                        );
                      }}
                    />
                    <label htmlFor={`mobile-tag-${tag}`}>{tag}</label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Sort By</h3>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setIsOpen(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="readTime">Read Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
