"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get("tracking");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!trackingId) {
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("tracking_id", trackingId)
        .single();

      if (!error) setOrder(data);

      setLoading(false);
    };

    fetchOrder();
  }, [trackingId]);

  if (loading) {
    return (
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-serif">
          Curating your order confirmation...
        </h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-serif">Order not found</h1>
        <Link href="/shop">Return to Collection</Link>
      </div>
    );
  }

  return (
    <>
      {/* KEEP YOUR EXISTING UI HERE (no change needed) */}
      <p>Tracking ID: {order.tracking_id}</p>
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center space-y-8 mb-24 animate-fade-in">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-4"
                 >
                   <CheckCircle2 className="w-12 h-12" />
                 </motion.div>
                 <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
                    Order <span className="text-primary italic">Confirmed</span>
                  </h1>
                  <p className="text-neutral-400 text-sm uppercase tracking-[0.4em]">Thank you for choosing Arovia Vibes</p>
                 </div>
                 <p className="text-neutral-500 max-w-lg mx-auto leading-relaxed text-sm">
                   Your signature selection is being prepared with clinical precision. 
                   Tracking ID: <span className="text-white font-bold">{order.tracking_id}</span>
                 </p>
              </div>
      
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 anim-slide-up">
                 <div className="bg-neutral-900 border border-white/5 p-8 space-y-6">
                    <h3 className="text-lg font-serif tracking-widest text-primary italic border-b border-white/5 pb-4">Order Summary</h3>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                          <span className="text-neutral-500 flex items-center gap-2"><Package className="w-4 h-4" /> Tracking ID</span>
                          <span className="font-bold text-white uppercase">{order.tracking_id}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                          <span className="text-neutral-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                          <span className="font-bold text-white">{new Date(order.created_at).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs uppercase tracking-widest pt-4 border-t border-white/5">
                          <span className="text-neutral-500">Status</span>
                          <span className="px-3 py-1 bg-primary text-background font-bold text-[10px] uppercase">{order.order_status}</span>
                       </div>
                    </div>
      
                    <div className="space-y-4 pt-8">
                       {order.order_items?.map((item: any) => (
                         <div key={item.id} className="flex justify-between text-xs items-center opacity-80">
                            <span>{item.products?.name} x{item.quantity}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                         </div>
                       ))}
                       <div className="pt-4 border-t border-white/10 flex justify-between font-bold">
                          <span className="uppercase tracking-widest text-primary">Total Amount</span>
                          <span className="text-lg">{formatCurrency(order.total_amount)}</span>
                       </div>
                    </div>
                 </div>
      
                 <div className="bg-neutral-900 border border-white/5 p-8 space-y-6">
                    <h3 className="text-lg font-serif tracking-widest text-primary italic border-b border-white/5 pb-4">Delivery Information</h3>
                    
                    <div className="space-y-6">
                       <div className="flex items-start gap-4">
                          <User className="w-5 h-5 text-neutral-500 mt-1" />
                          <div className="space-y-1">
                             <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Recipient</p>
                             <p className="text-sm uppercase tracking-widest">{order.customer_name}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4">
                          <Phone className="w-5 h-5 text-neutral-500 mt-1" />
                          <div className="space-y-1">
                             <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Contact</p>
                             <p className="text-sm uppercase tracking-widest">{order.phone}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4">
                          <MapPin className="w-5 h-5 text-neutral-500 mt-1" />
                          <div className="space-y-1">
                             <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Address</p>
                             <p className="text-sm uppercase tracking-widest leading-relaxed">{order.address}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
      
              <div className="text-center">
                 <Button size="lg">
                    <Link href="/shop">Continue Curation</Link>
                 </Button>
              </div>
            </div>
    </>
  );
}