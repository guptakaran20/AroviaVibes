"use client";

import React from "react";
import { ProductCard } from "../products/ProductCard";
import productsData from "@/lib/data.json";
import { Product } from "@/types";
import { motion } from "framer-motion";

export const FeaturedProducts = () => {
  const featuredProducts = productsData.slice(0, 4) as Product[];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
