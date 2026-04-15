import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <Suspense fallback={<div className="text-center py-24">Loading...</div>}>
        <ShopContent />
      </Suspense>

      <Footer />
    </main>
  );
}