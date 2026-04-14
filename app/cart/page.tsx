"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatCurrency, cn } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center space-y-8 animate-slide-up">
           <div className="relative inline-block">
             <ShoppingBag className="w-16 h-16 text-neutral-800" />
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="w-2 h-2 bg-primary animate-ping rounded-full" />
             </div>
           </div>
           <div className="space-y-2">
            <h1 className="text-4xl font-serif">Your cart is <span className="text-primary italic">empty</span></h1>
            <p className="text-neutral-500 uppercase tracking-widest text-[10px]">Discover your signature scent</p>
           </div>
           <Button size="lg">
             <Link href="/shop">Start Exploring</Link>
           </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
            The <span className="text-primary italic">Atelier</span> Cart
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-luxury">
            {cartCount} Exquisite items curated for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 py-8 border-b border-white/5 animate-fade-in"
              >
                <div className="relative w-32 aspect-[4/5] bg-neutral-900 border border-white/5 flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between h-auto py-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-primary text-[10px] uppercase tracking-luxury font-bold">{item.brand}</span>
                      <h3 className="text-xl font-medium tracking-wide uppercase">{item.name}</h3>
                      <p className="text-neutral-500 text-xs uppercase tracking-widest">Category: {item.category}</p>
                    </div>
                    <span className="text-lg font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center border border-white/10 h-10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-4 h-full hover:bg-white/5 transition-colors border-r border-white/10"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-6 text-sm font-bold w-12 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-4 h-full hover:bg-white/5 transition-colors border-l border-white/10"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-500 hover:text-red-800 transition-colors flex items-center space-x-2 text-xs uppercase tracking-widest group"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8 animate-slide-up">
            <div className="bg-neutral-900 border border-white/5 p-8 space-y-8">
              <h4 className="text-xl font-serif tracking-widest">Order Summary</h4>
              
              <div className="space-y-4">
                 <div className="flex justify-between text-sm uppercase tracking-widest">
                   <span className="text-neutral-400">Subtotal</span>
                   <span className="font-bold">{formatCurrency(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between text-sm uppercase tracking-widest">
                   <span className="text-neutral-400">Shipping</span>
                   <span className="text-primary">Complimentary</span>
                 </div>
                 <div className="flex justify-between text-sm uppercase tracking-widest">
                   <span className="text-neutral-400">Tax (Estimated)</span>
                   <span className="font-bold">{formatCurrency(0)}</span>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex justify-between">
                   <span className="text-lg uppercase tracking-luxury font-bold">Total</span>
                   <span className="text-xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <Button className="w-full flex items-center justify-center space-x-3 h-14" size="lg">
                    <Link href="/checkout" className="flex items-center space-x-3">
                        <span>Secure Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                 </Button>
                 <Link href="/shop" className="block text-center text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                   Continue Curation
                 </Link>
              </div>
            </div>

            <div className="p-8 border border-white/5 rounded-sm space-y-4">
               <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Luxury Assurance</h5>
               <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-widest">
                 All orders are handled with white-glove precision. Track your delivery 
                 live through our premium partner network.
               </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
