import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Analytics />
      <SpeedInsights />
      
      {/* Promotion Section */}
      <section className="py-24 bg-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <span className="text-primary uppercase tracking-luxury text-xs font-bold">Exclusive Offer</span>
              <h2 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight">
                Sensory <br /> <span className="text-primary italic">Gift Sets</span>
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                Experience the complete range with our curated gift sets. 
                The perfect present for yourself or someone special.
              </p>
              <div className="pt-4">
                <a href="/shop" className="inline-block bg-primary text-background px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-primary-dark transition-colors">
                  Shop Gift Sets
                </a>
              </div>
            </div>
            <div className="relative h-[500px] md:h-[700px]">
              <iframe src='https://my.spline.design/theperfume-YZaNL4Lw473ywUAmmjU0dRBJ/' width='100%' height='100%'></iframe>
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
