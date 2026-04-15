"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { authService } from "@/services/auth";
import { User, Mail, Shield, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await authService.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);
      
      const { data } = await authService.getProfile(session.user.id);
      setProfile(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/account" className="flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-3 h-3 mr-2" /> Overview
          </Link>
          <h1 className="text-5xl font-serif tracking-tight">
            User <span className="text-primary italic">Profile</span>
          </h1>
        </div>

        <div className="max-w-2xl">
          <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                   <User className="w-10 h-10 text-primary" />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-2xl font-serif">{profile?.name || "Member"}</h3>
                   <p className="text-neutral-500 text-xs uppercase tracking-widest">Arovia Vibes Member</p>
                 </div>
               </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Full Name</span>
                  </div>
                  <p className="text-white font-medium">{profile?.name || "Not set"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Email Address</span>
                  </div>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Account Role</span>
                  </div>
                  <p className="text-primary font-bold uppercase tracking-widest text-xs">{profile?.role || "User"}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-xs text-neutral-500 italic">
                  Profile editing is currently disabled. Please contact support to change your account details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
