"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin,  } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-neutral-950 border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex flex-col items-start">
              <span className="text-2xl font-serif tracking-[0.3em] font-bold">
                AROVIA
              </span>
              <span className="text-[10px] uppercase tracking-[0.5em] text-primary">
                Vibes
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Defining luxury through scent. We bring you the world's most 
              exquisite fragrances, curated for the modern connoisseur.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="https://www.instagram.com/arovia.vibes/" className="hover:text-primary"><FaInstagram className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-primary">Collections</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">All Products</Link></li>
              <li><Link href="/shop?category=Men" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">Men</Link></li>
              <li><Link href="/shop?category=Women" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">Women</Link></li>
              <li><Link href="/shop?category=Unisex" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">Unisex</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-primary">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/shipping-returns" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">Shipping & Returns</Link></li>
              <li><Link href="/privacy-policy" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">Privacy Policy</Link></li>
              <li><Link href="/faq" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-premium">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-primary">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <span className="text-neutral-400 text-sm">aroviavibes@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-neutral-500 uppercase tracking-widest">
          <p>© 2026 Arovia Vibes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
