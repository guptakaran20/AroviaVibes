"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, RefreshCcw, ShieldCheck } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-24 space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
            Shipping & <span className="text-primary italic">Returns</span>
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-luxury">
            Excellence in service, everywhere you are
          </p>
        </header>

        <div className="space-y-20">
          {/* Shipping Policy */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif tracking-wide">Shipping Policy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-neutral-400">
              <div className="space-y-4">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Domestic Shipping</h3>
                <p>
                  We offer complimentary express shipping on all orders across India. 
                  Delivery typically takes 3-5 business days. Each package is insured 
                  and requires a signature upon delivery to ensure your fragrance 
                  reaches you safely.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Processing Time</h3>
                <p>
                  Orders placed before 2:00 PM IST will be processed the same business day. 
                  Orders placed after this time, or on weekends, will be processed 
                  the following business day.
                </p>
              </div>
            </div>
          </section>

          {/* Returns & Exchanges */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <RefreshCcw className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif tracking-wide">Returns & Exchanges</h2>
            </div>
            
            <div className="space-y-6 text-sm leading-relaxed text-neutral-400">
              <p>
                Due to the delicate nature of fragrances and hygiene standards, we exclusively 
                offer returns on products that are <span className="text-white">completely sealed and in their original packaging</span>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ul className="space-y-3 list-disc list-inside">
                  <li>Returns accepted within 14 days of delivery.</li>
                  <li>Original receipt or order number required.</li>
                  <li>Product must be strictly unopened and unused.</li>
                </ul>
                <div className="p-6 bg-neutral-900/50 border border-white/5 rounded-lg">
                  <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-2">Damaged Items</h4>
                  <p className="text-xs">
                    In the rare event that your product arrives damaged or defective, 
                    please contact us within 48 hours with photographic evidence for 
                    an immediate replacement.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif tracking-wide">Secure Refund Process</h2>
            </div>
            
            <p className="text-sm leading-relaxed text-neutral-400">
              Once your return is received and inspected, we will notify you of the 
              approval or rejection of your refund. If approved, your refund will be 
              processed and automatically applied to your original method of payment 
              within 7-10 business days.
            </p>
          </section>

          <footer className="pt-12 border-t border-white/5 text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-[0.3em]">
              Further assistance? Email <span className="text-primary italic">aroviavibes@gmail.com</span>
            </p>
          </footer>
        </div>
      </div>

      <Footer />
    </main>
  );
}
