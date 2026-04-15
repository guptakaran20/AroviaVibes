"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { productService } from "@/services/products";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

const categories = ["All", "Men", "Women", "Unisex"];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && categories.includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams.toString());

    if (cat === "All") params.delete("category");
    else params.set("category", cat);

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "All") return true;
    return product.category === activeCategory;
  });

  if (loading) {
    return <div className="text-center py-24">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0 text-center md:text-left">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
                  The <span className="text-primary italic">Collection</span>
                </h1>
                <p className="text-neutral-400 text-sm uppercase tracking-luxury">
                  Refined fragrances for every mood and moment
                </p>
              </div>
      
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 border-b border-white/5 pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={cn(
                      "px-6 py-2 text-xs uppercase tracking-widest transition-all duration-300 relative",
                      activeCategory === cat 
                        ? "text-primary font-bold" 
                        : "text-neutral-500 hover:text-white"
                    )}
                  >
                    {cat}
                    {activeCategory === cat && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
      
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-4">
                <p className="text-neutral-500 uppercase tracking-widest text-sm">No products found in this category</p>
                <button 
                  onClick={() => handleCategoryChange("All")}
                  className="text-primary border-b border-primary pb-1 uppercase tracking-widest text-xs"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
    </div>
  );
}