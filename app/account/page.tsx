"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { authService } from "@/services/auth";
import { orderService } from "@/services/orders";
import { 
  ShoppingBag, 
  User, 
  ChevronRight, 
  Package, 
  LogOut,
  Clock
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Loader2 } from "lucide-react";

export default function AccountDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ totalOrders: 0, lastOrder: null as any });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await authService.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);
      
      const [profileRes, ordersRes] = await Promise.all([
        authService.getProfile(session.user.id),
        orderService.getUserOrders(1, 1) // Get just the latest one
      ]);

      setProfile(profileRes.data);
      
      // Get total count separately or from ordersRes if it returned metadata
      // For now, let's just fetch all to get count (not ideal but works for now)
      const { data: allOrders } = await orderService.getUserOrders(1, 100);
      
      setStats({
        totalOrders: allOrders?.length || 0,
        lastOrder: allOrders?.[0] || null
      });
      
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-5xl font-serif mb-4 tracking-tight">
            My <span className="text-primary italic">Account</span>
          </h1>
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            Welcome back, {profile?.name || user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-2">
            <Link href="/account" className="flex items-center space-x-3 p-4 bg-primary text-black rounded-xl font-bold transition-all">
              <User className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Overview</span>
            </Link>
            <Link href="/account/orders" className="flex items-center space-x-3 p-4 hover:bg-white/5 rounded-xl transition-all group">
              <ShoppingBag className="w-5 h-5 text-neutral-500 group-hover:text-primary" />
              <span className="text-sm uppercase tracking-widest text-neutral-400 group-hover:text-white">My Orders</span>
            </Link>
            <Link href="/account/profile" className="flex items-center space-x-3 p-4 hover:bg-white/5 rounded-xl transition-all group">
              <Package className="w-5 h-5 text-neutral-500 group-hover:text-primary" />
              <span className="text-sm uppercase tracking-widest text-neutral-400 group-hover:text-white">Profile</span>
            </Link>
            <button 
              onClick={() => authService.signOut()}
              className="w-full flex items-center space-x-3 p-4 hover:bg-red-500/10 rounded-xl transition-all group mt-8"
            >
              <LogOut className="w-5 h-5 text-neutral-500 group-hover:text-red-500" />
              <span className="text-sm uppercase tracking-widest text-neutral-400 group-hover:text-red-500">Sign Out</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Card */}
              <div className="bg-neutral-900 border border-white/5 p-8 rounded-2xl space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-neutral-900 border border-white/5 p-8 rounded-2xl space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Latest Order</p>
                  {stats.lastOrder ? (
                    <div className="mt-2">
                       <StatusBadge status={stats.lastOrder.order_status} />
                    </div>
                  ) : (
                    <p className="text-neutral-400 text-sm mt-1">No orders yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Order Preview */}
            {stats.lastOrder && (
              <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-lg font-serif">Recent Order</h3>
                  <Link href="/account/orders" className="text-[10px] uppercase tracking-widest text-primary hover:underline flex items-center">
                    View All <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Order ID</p>
                    <p className="text-sm font-bold tracking-widest">{stats.lastOrder.tracking_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Date</p>
                    <p className="text-sm">{new Date(stats.lastOrder.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Total</p>
                    <p className="text-sm font-bold">₹{stats.lastOrder.total_amount}</p>
                  </div>
                  <Link 
                    href={`/account/orders/${stats.lastOrder.id}`}
                    className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
