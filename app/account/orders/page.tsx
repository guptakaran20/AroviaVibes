"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { orderService } from "@/services/orders";
import { authService } from "@/services/auth";
import { StatusBadge } from "@/components/account/StatusBadge";
import { OrderSkeleton } from "@/components/account/OrderSkeleton";
import { formatDate, formatCurrency } from "@/lib/format";
import Link from "next/link";
import { ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await orderService.getUserOrders(1, 20);
    
    if (fetchError) {
      setError(fetchError === "UNAUTHORIZED" ? "Please login to view orders" : "Failed to load orders");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/account" className="flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="w-3 h-3 mr-2" /> Overview
            </Link>
            <h1 className="text-5xl font-serif tracking-tight">
              Order <span className="text-primary italic">History</span>
            </h1>
          </div>
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            {orders.length} Total Boutique Purchases
          </p>
        </div>

        {loading ? (
          <OrderSkeleton />
        ) : error ? (
          <div className="bg-neutral-900 border border-white/5 p-12 rounded-2xl text-center space-y-6">
            <p className="text-neutral-500 italic">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-neutral-900 border border-white/5 p-20 rounded-2xl text-center space-y-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 text-neutral-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif">No orders yet</h3>
              <p className="text-neutral-500 text-sm">Your luxury journey with Arovia Vibes begins with your first selection.</p>
            </div>
            <Link 
              href="/shop"
              className="inline-block px-12 py-4 bg-primary text-black rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                href={`/account/orders/${order.id}`}
                className="block bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-2xl hover:border-primary/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Order ID</p>
                      <p className="text-sm font-bold tracking-widest group-hover:text-primary transition-colors uppercase">
                        {order.tracking_id}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Date</p>
                      <p className="text-sm text-neutral-300">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Total</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                    <StatusBadge status={order.order_status} />
                    <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-primary transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
