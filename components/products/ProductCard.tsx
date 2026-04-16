"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/Button";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-white/5">
        <Link href={`/product/${product.id}`}>
          {/* Main Image */}
          {(product.images?.[0] || product.image_url) ? (
            <Image
              src={product.images?.[0] || product.image_url}
              alt={product.name}
              fill
              className={cn(
                "object-contain scale-[1.15] p-4 transition-transform duration-700 group-hover:scale-105",
                isHovered && (product.images?.[1] || product.secondary_image_url) ? "opacity-0" : "opacity-100"
              )}
              onError={(e) => {
                (e.target as any).src = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000";
              }}
            />) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-700">
              No Image
            </div>
          )}

          {/* Hover Image */}
          {(() => {
            const hoverImage = product.images?.[1] || product.secondary_image_url;
            if (!hoverImage) return null;
            return (
              <Image
                src={hoverImage}
                alt={product.name}
                fill
                className={cn(
                  "object-contain scale-[1.15]p-4 transition-transform duration-700 group-hover:scale-105",
                  isHovered ? "opacity-100 scale-110" : "opacity-0"
                )}
              />
            );
          })()}
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.is_new && (
            <span className="bg-primary text-background text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
              New Arrival
            </span>
          )}
        </div>

        {/* Quick Add button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            {product.brand}
          </span>
          <div className="flex items-center text-primary">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-1 text-[10px] text-foreground">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-sm uppercase tracking-wider font-medium group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(product.price)}
          </span>
          {product.discount_price && (
            <span className="text-xs text-neutral-500 line-through">
              {formatCurrency(product.discount_price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Import cn explicitly if it wasn't available
import { cn } from "@/lib/utils";
