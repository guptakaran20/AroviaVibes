import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Analytics />
      <SpeedInsights />

      {/* Promotion Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Section Header Logo */}


        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold block">Exclusive Offer</span>
                <h2 className="text-6xl md:text-8xl font-serif leading-[1.1] tracking-normal">
                  Sensory <br /> 
                  <span className="text-primary italic font-light">Gift Sets</span>
                </h2>
              </div>
              
              <p className="text-neutral-400 text-lg leading-relaxed max-w-md font-light">
                Experience the complete range with our curated gift sets.
                The perfect present for yourself or someone special.
              </p>
              
              <div className="pt-4">
          <a href="/shop" className="inline-block bg-primary text-background px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-primary-dark transition-colors">
                  Shop Gift Sets
                </a>
              </div>
            </div>

            {/* Right image panel with spotlight effect */}
            <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center">
              {/* Spotlight Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(189,168,127,0.08)_0%,transparent_70%)] pointer-events-none" />
              
              <div className="relative w-full h-full group">
                <img
                  src="/hh.png"
                  alt="Gift Set"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[95%] md:w-[90%] object-contain z-10 drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle edge masks for seamless integration */}
                <div className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    background: "linear-gradient(to right, #0a0a0a 5%, transparent 25%, transparent 75%, #0a0a0a 95%)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000"
                alt="Women Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-4">
                <h3 className="text-4xl font-serif tracking-widest text-white">FOR HER</h3>
                <a href="/shop?category=Women" className="text-primary border-b border-primary text-sm uppercase tracking-widest hover:text-white hover:border-white transition-colors pb-1">
                  Discover Collection
                </a>
              </div>
            </div>
            <div className="relative group h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1000"
                alt="Men Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-4">
                <h3 className="text-4xl font-serif tracking-widest text-white">FOR HIM</h3>
                <a href="/shop?category=Men" className="text-primary border-b border-primary text-sm uppercase tracking-widest hover:text-white hover:border-white transition-colors pb-1">
                  Discover Collection
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
