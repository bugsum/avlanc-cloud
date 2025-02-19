import { Suspense } from "react";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductSearch } from "@/components/store/product-search";
import { CategoryFilter } from "@/components/store/category-filter";
import { PageHeader } from "@/components/page-header";
import { Announcement } from "@/components/ui/announcement";

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Avlanc Store"
        description="Find the perfect hosting solution for your needs"
      />
      <div className="py-4">
        <Announcement
          message="This Store is currently under development, You will soon be able to purchase anything!"
          variant="default"
          classname="rounded-md"
          link={{ text: "Learn More", href: "" }}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <CategoryFilter />
        </aside>
        <main className="flex-1">
          <ProductSearch />
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
