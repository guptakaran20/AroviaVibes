"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { orderService } from "@/services/orders";
import { StatusBadge } from "@/components/account/StatusBadge";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import { formatDate, formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  AlertCircle,
  RotateCcw,
  XCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    const { data, error: fetchError } = await orderService.getOrderById(id as string);
    if (fetchError) {
      setError(fetchError === "NOT_FOUND" ? "Order not found" : "Failed to load order details");
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    // Optimistic UI update
    const previousStatus = order.order_status;
    setOrder({ ...order, order_status: "cancelled" });
    setIsCancelling(true);

    const { error: cancelError } = await orderService.cancelOrder(order.id);
    
    setIsCancelling(false);
    if (cancelError) {
      // Revert on failure
      setOrder({ ...order, order_status: previousStatus });
      toast.error(cancelError === "LOCKED" ? "Order can no longer be cancelled" : "Failed to cancel order");
    } else {
      toast.success("Order cancelled successfully");
    }
  };

  const handleReorder = async () => {
    setIsReordering(true);
    let skippedItems = false;
    
    for (const item of order.order_items) {
      if (item.products && item.products.stock > 0 && item.products.is_active !== false) {
        for (let i = 0; i < item.quantity; i++) {
          addToCart(item.products);
        }
      } else {
        skippedItems = true;
      }
    }

    if (skippedItems) {
      toast.error("Some items were skipped as they are out of stock or unavailable");
    } else {
      toast.success("All items added back to cart");
    }
    
    router.push("/cart");
    setIsReordering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center space-y-6">
        <AlertCircle className="w-16 h-16 text-neutral-500" />
        <h2 className="text-3xl font-serif">{error || "Something went wrong"}</h2>
        <Link href="/account/orders" className="text-primary hover:underline uppercase tracking-widest text-xs font-bold">
          Back to My Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/account/orders" className="flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <StatusBadge status={order.order_status} />
                <span className="text-white font-bold tracking-[0.2em] uppercase text-xs">#{order.tracking_id}</span>
              </div>
              <h1 className="text-4xl font-serif">Order Details</h1>
              <p className="text-neutral-500 text-xs uppercase tracking-widest">Placed on {formatDate(order.created_at)}</p>
            </div>
            
            <div className="flex gap-4">
              {order.order_status === "pending" && (
                <button 
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex items-center gap-2 px-6 py-3 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
              <button 
                onClick={handleReorder}
                disabled={isReordering}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {isReordering ? "Processing..." : "Reorder"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            {/* Timeline */}
            <div className="bg-neutral-900 border border-white/5 p-8 rounded-2xl">
              <h3 className="text-lg font-serif mb-8">Order Status Tracking</h3>
              <OrderTimeline status={order.order_status} />
            </div>

            {/* Items */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <Package className="w-5 h-5 text-neutral-500" />
                <h3 className="text-lg font-serif">Items</h3>
              </div>
              <div className="divide-y divide-white/5">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="p-6 flex items-center gap-6">
                    <div className="relative w-20 h-24 bg-black rounded-lg overflow-hidden flex-shrink-0">
                      {item.products ? (
                        <Image 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-700">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      {item.products ? (
                        <>
                          <Link href={`/product/${item.products.id}`} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest">
                            {item.products.name}
                          </Link>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{item.products.brand}</p>
                        </>
                      ) : (
                        <p className="text-sm text-red-500 italic">Product no longer available</p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-white/[0.02] space-y-4">
                 <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-500">
                   <span>Order Total</span>
                   <span className="text-white font-bold">{formatCurrency(order.total_amount)}</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Delivery Info */}
            <div className="bg-neutral-900 border border-white/5 p-8 rounded-2xl space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <MapPin className="w-5 h-5" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Delivery Address</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase">{order.customer_name}</p>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">{order.address}</p>
                  <p className="text-xs text-neutral-400 font-medium">Contact: {order.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Payment Method</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase">{order.payment_method}</p>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">Payment Status: {order.payment_status}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center gap-3 text-neutral-500 italic text-[10px] uppercase tracking-widest">
                <Truck className="w-4 h-4" />
                Express Shipping Included
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
