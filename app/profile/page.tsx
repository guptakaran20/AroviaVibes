"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { authService } from "@/services/auth";
import { orderService } from "@/services/orders";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Loader2,
  ChevronRight,
  Package,
  Calendar,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const statusColorMap = {
  pending: "text-amber-500 bg-amber-500/10",
  confirmed: "text-blue-500 bg-blue-500/10",
  shipped: "text-purple-500 bg-purple-500/10",
  delivered: "text-emerald-500 bg-emerald-500/10",
  cancelled: "text-red-500 bg-red-500/10",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await authService.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

      const { data: profileData } = await authService.getProfile(session.user.id);
      const { data: ordersData } = await orderService.getUserOrders();

      setProfile(profileData);
      setOrders(ordersData || []);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Profile Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-neutral-900 border border-white/5 p-8 rounded-2xl space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif">{profile?.name || "Guest User"}</h1>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                    {profile?.role === 'admin' ? "Platinum Administrator" : "Luxury Collector"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span>{orders.length} Orders Placed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Member since {new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => authService.signOut()}
                className="w-full bg-red-500/10 text-red-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all text-xs uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>

              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-xs uppercase tracking-widest"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right: Order History */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-3xl font-serif mb-2">Order History</h2>
              <p className="text-neutral-500 text-sm uppercase tracking-widest">Track your previous signature selections</p>
            </div>

            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-neutral-900 border border-white/5 p-12 rounded-2xl text-center space-y-4">
                  <p className="text-neutral-500 italic">No orders found in your curation...</p>
                  <Button variant="outline">
                    <Link href="/shop">Explore Collection</Link>
                  </Button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/20 transition-all">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/5">
                          <ShoppingBag className="w-6 h-6 text-neutral-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-widest text-neutral-500">Order ID</p>
                          <p className="text-sm font-bold uppercase tracking-tight">{order.tracking_id}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-8 items-center">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500">Placed on</p>
                          <p className="text-xs font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500">Total</p>
                          <p className="text-sm font-bold text-primary">₹{order.total_amount}</p>
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold ring-1 ring-inset ring-current/20",
                          statusColorMap[order.order_status as keyof typeof statusColorMap] || "text-neutral-400 bg-neutral-400/10"
                        )}>
                          {order.order_status}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 bg-white/[0.02]">
                      <div className="flex flex-wrap gap-4">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="px-2 py-1 bg-black border border-white/5 rounded text-[10px] text-neutral-400">
                              {item.quantity}x
                            </div>
                            <span className="text-xs text-neutral-300">{item.products?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
