"use client";

import { useState } from "react";
import { resetPasswordForEmail } from "@/services/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPasswordForEmail(email);

    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      setSubmitted(true);
      toast.success("Reset link sent!");
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-md mx-auto px-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif">Forgot Password</h1>
            <p className="text-neutral-400 text-sm">
              Enter your email to receive a reset link
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium">Check your inbox</h2>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  We've sent a password reset link to <br />
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-primary hover:underline text-sm"
              >
                Didn't get the email? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary outline-none transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Send Reset Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <a href="/login" className="text-neutral-500 hover:text-white text-sm transition-colors">
                  Back to Login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
