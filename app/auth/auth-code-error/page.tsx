"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AlertCircle, ArrowLeft, RefreshCw, Mail } from "lucide-react";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <div className="bg-white/5 border border-white/10 p-12 rounded-3xl backdrop-blur-xl space-y-8 text-center animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-serif">Authentication Error</h1>
            <p className="text-neutral-400 text-lg max-w-md mx-auto leading-relaxed">
              We couldn't verify your session. This usually happens if the link has expired or has already been used.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Link 
              href="/forgot-password"
              className="flex items-center justify-center gap-2 bg-primary text-black font-bold py-4 px-6 rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-5 h-5" />
              Request New Link
            </Link>
            
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-medium py-4 px-6 rounded-2xl hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-neutral-500 mb-4">Still having trouble?</p>
            <a 
              href="mailto:support@aroviavibes.com" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
