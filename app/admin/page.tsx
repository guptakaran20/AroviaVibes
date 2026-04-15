"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Package
} from "lucide-react";
import { orderService } from "@/services/orders";
import { productService } from "@/services/products";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const revenue = await orderService.getRevenueStats();
      const { data: orders } = await orderService.getAllOrders();
      const products = await productService.getProducts();
      
      const pending = orders?.filter(o => o.order_status === 'pending').length || 0;

      setStats({
        totalRevenue: revenue,
        totalOrders: orders?.length || 0,
        totalProducts: products.length,
        pendingOrders: pending
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
        <p className="text-neutral-500 text-sm uppercase tracking-widest">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-neutral-900 border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                <card.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500 text-xs uppercase tracking-widest">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Insight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif">Recent Performance</h3>
            <button className="text-xs text-primary uppercase tracking-widest hover:underline">View Analytics</button>
          </div>
          <div className="h-64 flex items-center justify-center border border-white/5 border-dashed rounded-xl text-neutral-600 text-sm italic">
            Analytics visualization will appear as transaction data increases.
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-serif">Order Distribution</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-400">
                <span>Completed</span>
                <span className="text-white">{Math.round(((stats.totalOrders - stats.pendingOrders) / (stats.totalOrders || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000" 
                  style={{ width: `${((stats.totalOrders - stats.pendingOrders) / (stats.totalOrders || 1)) * 100}%` }} 
                />
              </div>
            </div>
            {/* Add more distribution items if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
