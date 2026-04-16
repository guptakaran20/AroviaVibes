"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import { createOrder } from "@/services/orders";
import { getSession, ensureProfile, updateProfile } from "@/services/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    paymentMethod: "COD" as "COD" | "UPI",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await getSession();
      if (!session) {
        toast.error("Please login to complete your order");
        router.push(`/login?redirect=/checkout`);
        return;
      }
      setUserId(session.user.id);
      
      // Auto-fill name if profile exists or metadata exists
      const { data: profile } = await ensureProfile(session.user.id, session.user.user_metadata);
      const nameFallback = profile?.name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
      
      if (nameFallback || profile?.pincode) {
        setFormData(prev => ({ 
          ...prev, 
          name: nameFallback,
          pincode: profile?.pincode || "" 
        }));
      }
    };
    checkAuth();
  }, [router]);

  if (cart.length === 0) {
    if (typeof window !== "undefined") router.push("/shop");
    return null;
  }

  const codChargesTotal = cart.reduce((sum, item) => sum + (Number(item.cod_charges) || 0) * item.quantity, 0);
  const finalTotal = formData.paymentMethod === "COD" ? cartTotal + codChargesTotal : cartTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Authentication required");
      router.push("/login");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      toast.error("Please provide all delivery details");
      return;
    }

    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      toast.error("Please provide a valid 6-digit PIN code");
      return;
    }

    setIsSubmitting(true);

    const { data: order, error } = await createOrder({
      user_id: userId,
      customer_name: formData.name,
      phone: formData.phone,
      address: formData.address,
      pincode: formData.pincode,
      payment_method: formData.paymentMethod,
      total_amount: finalTotal,
      items: cart,
    });

    if (!error && order) {
      // Save pincode to profile for future use
      await updateProfile(userId, { pincode: formData.pincode });
      
      clearCart();
      router.push(`/order-confirmation?tracking=${order.tracking_id}`);
    }
  };


  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
            Final <span className="text-primary italic">Curation</span>
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-luxury">
            Secure checkout for your luxury selection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-8">
              <h2 className="text-2xl font-serif tracking-widest pb-4 border-b border-white/5 italic text-primary">Delivery Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g. Alexander Pierce"
                    className="w-full bg-neutral-900 border border-white/10 p-4 text-white focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-900 border border-white/10 p-4 text-white focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Delivery Address</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Street address, Apartment, City, State"
                  className="w-full bg-neutral-900 border border-white/10 p-4 text-white focus:border-primary outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2 max-w-xs">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">PIN Code (6 Digits)</label>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 6) setFormData({...formData, pincode: val});
                  }}
                  placeholder="400001"
                  className="w-full bg-neutral-900 border border-white/10 p-4 text-white focus:border-primary outline-none transition-colors"
                />
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-serif tracking-widest pb-4 border-b border-white/5 italic text-primary">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* COD */}
                 <div 
                   onClick={() => setFormData({...formData, paymentMethod: "COD"})}
                   className={`p-6 border cursor-pointer transition-all flex items-start space-x-4 ${formData.paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-white/10 bg-neutral-900"}`}
                 >
                   <Banknote className={`w-6 h-6 ${formData.paymentMethod === "COD" ? "text-primary" : "text-neutral-500"}`} />
                   <div className="space-y-1">
                     <p className="text-sm uppercase tracking-widest font-bold">Cash on Delivery</p>
                     <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Pay when you receive your order</p>
                   </div>
                 </div>

                 {/* UPI */}
                 <div 
                   onClick={() => setFormData({...formData, paymentMethod: "UPI"})}
                   className={`p-6 border cursor-pointer transition-all flex items-start space-x-4 ${formData.paymentMethod === "UPI" ? "border-primary bg-primary/5" : "border-white/10 bg-neutral-900"}`}
                 >
                   <CreditCard className={`w-6 h-6 ${formData.paymentMethod === "UPI" ? "text-primary" : "text-neutral-500"}`} />
                   <div className="space-y-1">
                     <p className="text-sm uppercase tracking-widest font-bold">UPI / Cards</p>
                     <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Instant secure digital payment</p>
                   </div>
                 </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 h-fit lg:sticky lg:top-32 space-y-8 animate-slide-up">
            <div className="bg-neutral-900 border border-white/5 p-8 space-y-8">
              <h4 className="text-xl font-serif tracking-widest">Your Order</h4>
              
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-xs items-center">
                    <div className="flex flex-col">
                       <span className="uppercase tracking-widest font-bold">{item.name}</span>
                       <span className="text-neutral-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                 <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-500">
                   <span>Subtotal</span>
                   <span>{formatCurrency(cartTotal)}</span>
                 </div>
                 
                 {formData.paymentMethod === "COD" && codChargesTotal > 0 && (
                   <div className="flex justify-between text-xs uppercase tracking-widest text-primary animate-in fade-in slide-in-from-top-1 duration-300">
                     <span>COD Convenience Fee</span>
                     <span>+ {formatCurrency(codChargesTotal)}</span>
                   </div>
                 )}

                 <div className="flex justify-between text-lg uppercase tracking-luxury font-bold pt-2 border-t border-white/5">
                   <span>Total</span>
                   <span className="text-primary">{formatCurrency(finalTotal)}</span>
                 </div>
                 <p className="text-[10px] text-neutral-500 uppercase tracking-widest italic text-center">Tax and shipping included</p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 flex items-center justify-center space-x-3" size="lg">
                 {isSubmitting ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                 ) : (
                   <>
                     <span>Place Order</span>
                     <ShieldCheck className="w-5 h-5" />
                   </>
                 )}
              </Button>
            </div>

            <div className="flex flex-col space-y-4">
               <div className="flex items-center space-x-3 text-neutral-400">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest">Free Express Shipping Reserved</span>
               </div>
               <div className="flex items-center space-x-3 text-neutral-400">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest">SSL Encrypted Transaction</span>
               </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
