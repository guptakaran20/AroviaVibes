"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth";

export const Navbar = () => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    authService.getSession().then(({ data }) => {
      setSession(data.session);
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/shop" className="text-sm uppercase tracking-widest hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/shop?category=Men" className="text-sm uppercase tracking-widest hover:text-primary transition-colors">
            Men
          </Link>
          <Link href="/shop?category=Women" className="text-sm uppercase tracking-widest hover:text-primary transition-colors">
            Women
          </Link>
          <Link href="/shop?category=Unisex" className="text-sm uppercase tracking-widest hover:text-primary transition-colors">
            Unisex
          </Link>
        </div>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center group">
           <div className="flex flex-col items-center">
            <span className="text-2xl font-serif tracking-[0.3em] font-bold group-hover:text-primary transition-colors">
              AROVIA
            </span>
            <span className="text-[10px] uppercase tracking-[0.5em] text-primary">
              Vibes
            </span>
           </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Link href={session ? "/account" : "/login"} className="hidden md:block hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="relative hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-background text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] bg-neutral-900 z-50 p-8 flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-serif tracking-widest">AROVIA</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-8">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg uppercase tracking-widest">Home</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg uppercase tracking-widest">All Collections</Link>
                <Link href="/shop?category=Men" onClick={() => setIsMobileMenuOpen(false)} className="text-lg uppercase tracking-widest">Men</Link>
                <Link href="/shop?category=Women" onClick={() => setIsMobileMenuOpen(false)} className="text-lg uppercase tracking-widest">Women</Link>
                <Link href="/shop?category=Unisex" onClick={() => setIsMobileMenuOpen(false)} className="text-lg uppercase tracking-widest">Unisex</Link>
              </div>
              <div className="mt-auto border-t border-white/10 pt-8 space-y-4">
                <Link 
                  href={session ? "/account" : "/login"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 uppercase tracking-widest text-sm text-neutral-400 hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{session ? "My Account" : "Login"}</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
