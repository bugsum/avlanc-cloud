"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "VPS",
  "Minecraft",
  "Discord Bots",
  "Web Hosting"
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.replace(`/store?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Categories</h2>
      <div className="flex flex-col space-y-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
