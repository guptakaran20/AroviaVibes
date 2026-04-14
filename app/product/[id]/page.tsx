"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import productsData from "@/lib/data.json";
import { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = productsData.find((p) => p.id === id) as Product;

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif">Product Not Found</h1>
          <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4) as Product[];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs / Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-neutral-500 hover:text-primary transition-colors text-xs uppercase tracking-widest mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Images */}
          <div className="space-y-4">
             <div className="relative aspect-[4/5] bg-neutral-900 border border-white/5 overflow-hidden">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.target as any).src = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
             </div>
             {product.secondaryImage && (
               <div className="grid grid-cols-4 gap-4">
                  <div className="relative aspect-square bg-neutral-900 border border-white/5 grayscale hover:grayscale-0 transition-all cursor-pointer">
                    <Image src={product.image} alt="Thumb" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-square bg-neutral-900 border border-white/5 grayscale hover:grayscale-0 transition-all cursor-pointer">
                    <Image src={product.secondaryImage} alt="Thumb" fill className="object-cover" />
                  </div>
               </div>
             )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <span className="text-primary text-sm uppercase tracking-luxury font-bold">
                  {product.brand}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                   <div className="flex items-center text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-current" : "opacity-30")} />
                      ))}
                   </div>
                   <span className="text-neutral-500 text-xs uppercase tracking-widest">
                     {product.rating} / 5 Rating
                   </span>
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <span className="text-3xl font-bold text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-neutral-500 line-through pb-1">
                    {formatCurrency(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-neutral-400 text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="pt-8 space-y-8">
                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center border border-white/10 h-14">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-6 h-full hover:bg-white/5 transition-colors border-r border-white/10"
                    >
                      -
                    </button>
                    <span className="px-8 text-lg font-bold w-20 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-6 h-full hover:bg-white/5 transition-colors border-l border-white/10"
                    >
                      +
                    </button>
                  </div>
                  <Button 
                    size="lg" 
                    className="flex-1 w-full h-14 flex items-center justify-center space-x-3"
                    onClick={() => {
                        for(let i=0; i<quantity; i++) addToCart(product);
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Experience Luxury</span>
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-white/5">
                   <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Express Shipping</span>
                   </div>
                   <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">100% Authentic</span>
                   </div>
                   <div className="flex items-center space-x-3">
                      <RotateCcw className="w-5 h-5 text-primary" />
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Easy Returns</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-12">
            <h2 className="text-3xl font-serif tracking-tight text-center">
              You May Also <span className="text-primary italic">Like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
