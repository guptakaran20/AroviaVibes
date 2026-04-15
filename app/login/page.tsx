"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { authService } from "@/services/auth";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) setMessage(msg);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authService.signIn(formData.email, formData.password);
    setLoading(false);

    if (!error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif">Welcome Back</h1>
            <p className="text-neutral-400 text-sm">Sign in to your account</p>
          </div>

          {message && (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-primary text-sm text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary outline-none transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary outline-none transition-colors"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Connect <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-neutral-500">
            New to Arovia Vibes?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
