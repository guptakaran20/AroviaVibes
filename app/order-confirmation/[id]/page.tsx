"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useOrders } from "@/context/OrderContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Package, Calendar, MapPin, Phone, User } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(id as string);

  if (!order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
           <h1 className="text-2xl font-serif">Finding your order...</h1>
           <p className="text-neutral-500 uppercase tracking-widest text-xs">This may take a moment</p>
           <Link href="/shop" className="text-primary border-b border-primary pb-1 uppercase tracking-widest text-xs">Return to Gallery</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

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
             A confirmation email has been sent to your registered address.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 anim-slide-up">
           {/* Order Details */}
           <div className="bg-neutral-900 border border-white/5 p-8 space-y-6">
              <h3 className="text-lg font-serif tracking-widest text-primary italic border-b border-white/5 pb-4">Order Summary</h3>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                    <span className="text-neutral-500 flex items-center gap-2"><Package className="w-4 h-4" /> Order ID</span>
                    <span className="font-bold text-white">{order.id}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                    <span className="text-neutral-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                    <span className="font-bold text-white">{new Date(order.date).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs uppercase tracking-widest pt-4 border-t border-white/5">
                    <span className="text-neutral-500">Status</span>
                    <span className="px-3 py-1 bg-primary text-background font-bold text-[10px]">{order.status}</span>
                 </div>
              </div>

              <div className="space-y-4 pt-8">
                 {order.items.map(item => (
                   <div key={item.id} className="flex justify-between text-xs items-center opacity-80">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                   </div>
                 ))}
                 <div className="pt-4 border-t border-white/10 flex justify-between font-bold">
                    <span className="uppercase tracking-widest text-primary">Total Paid</span>
                    <span className="text-lg">{formatCurrency(order.total)}</span>
                 </div>
              </div>
           </div>

           {/* Delivery Details */}
           <div className="bg-neutral-900 border border-white/5 p-8 space-y-6">
              <h3 className="text-lg font-serif tracking-widest text-primary italic border-b border-white/5 pb-4">Delivery Information</h3>
              
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-neutral-500 mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Recipient</p>
                       <p className="text-sm uppercase tracking-widest">{order.customer.name}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-neutral-500 mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Contact</p>
                       <p className="text-sm uppercase tracking-widest">{order.customer.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-neutral-500 mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Address</p>
                       <p className="text-sm uppercase tracking-widest leading-relaxed">{order.customer.address}</p>
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

      <Footer />
    </main>
  );
}
