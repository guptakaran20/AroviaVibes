import { Suspense } from "react";
import OrderConfirmationClient from "@/components/order/OrderConfirmationClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6">
        <Suspense fallback={<div>Loading...</div>}>
          <OrderConfirmationClient />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}