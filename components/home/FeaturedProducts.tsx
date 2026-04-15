"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "../products/ProductCard";
import { Product } from "@/types";
import { productService } from "@/services/products";
import { Loader2 } from "lucide-react";

export const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <span className="text-primary uppercase tracking-luxury text-xs font-semibold">
              Curated for you
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
              Featured <span className="text-primary italic">Selection</span>
            </h2>
          </div>
          <p className="text-neutral-400 max-w-sm text-sm leading-relaxed">
            Our most sought-after fragrances, handpicked to elevate your aura 
            for any occasion.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/50 rounded-3xl border border-white/5">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-neutral-500 font-serif italic">Curating excellence...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
             <p className="text-neutral-500 italic">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};
