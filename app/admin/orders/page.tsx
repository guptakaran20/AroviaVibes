"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Loader2
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/services/orders";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const statusMap = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
  processing: { label: "Processing", icon: Loader2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  shipped: { label: "Shipped", icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await getAllOrders();
    setOrders(data || []);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await updateOrderStatus(id, status);
    if (error) {
      toast.error('Failed to update order status');
    } else {
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => {
    const searchStr = searchQuery.toLowerCase();
    const customerMatch = 
      o.tracking_id?.toLowerCase().includes(searchStr) ||
      o.customer_name?.toLowerCase().includes(searchStr) ||
      o.phone?.toLowerCase().includes(searchStr) ||
      o.pincode?.toLowerCase().includes(searchStr) ||
      o.address?.toLowerCase().includes(searchStr);
    
    const items = o.items || o.order_items;
    const productMatch = items?.some((item: any) => {
      const product = item.product || item.products;
      return product?.name?.toLowerCase().includes(searchStr);
    });

    return customerMatch || productMatch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif mb-2">Orders</h1>
        <p className="text-neutral-500 text-sm uppercase tracking-widest">Monitor and process customer orders</p>
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search by Tracking ID or Customer name..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-primary outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <th className="px-6 py-4 font-normal">Order / Tracking</th>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Date</th>
                <th className="px-6 py-4 font-normal">Amount</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-sm italic">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusMap[order.order_status as keyof typeof statusMap] || statusMap.pending;
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white uppercase">{order.tracking_id}</p>
                          {(order.items?.[0]?.product?.name || order.order_items?.[0]?.products?.name) && (
                            <p className="text-[11px] text-primary font-medium line-clamp-1">
                              {order.items?.[0]?.product?.name || order.order_items?.[0]?.products?.name}
                              {(order.items?.length || order.order_items?.length || 0) > 1 && ` + ${(order.items?.length || order.order_items?.length) - 1} more`}
                            </p>
                          )}
                          <p className="text-[10px] text-neutral-500">{order.items?.length || order.order_items?.length || 0} items</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-white font-medium">{order.customer_name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{order.phone}</p>
                          <p className="text-[10px] text-neutral-500 leading-tight max-w-[200px] break-words">
                            {order.address}
                          </p>
                          {order.pincode && (
                            <p className="text-[10px] text-primary font-bold">PIN: {order.pincode}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">₹{order.total_amount}</td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ring-1 ring-inset",
                          status.color,
                          status.bg,
                          "ring-current/20"
                        )}>
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] uppercase tracking-widest text-neutral-400 outline-none focus:border-primary transition-colors cursor-pointer"
                          value={order.order_status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                          {Object.keys(statusMap).map(s => (
                            <option key={s} value={s}>{s.toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
