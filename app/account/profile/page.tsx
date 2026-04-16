"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSession, ensureProfile, updateProfile } from "@/services/auth";
import { User, Mail, Shield, ArrowLeft, Loader2, Save, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    pincode: "",
    phone: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);
      
      // Use ensureProfile to help self-heal if profile record is missing
      const { data } = await ensureProfile(session.user.id, session.user.user_metadata);
      setProfile(data);
      setEditData({
        name: data?.name || session.user.user_metadata?.full_name || "",
        pincode: data?.pincode || "",
        phone: data?.phone || ""
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editData.pincode && (editData.pincode.length !== 6 || !/^\d+$/.test(editData.pincode))) {
      toast.error("Please provide a valid 6-digit PIN code");
      return;
    }

    setIsUpdating(true);
    const { data, error } = await updateProfile(user.id, editData);
    setIsUpdating(false);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      setProfile(data);
      toast.success("Profile updated successfully");
    }
  };

  // Fallback name logic
  const displayName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Member";

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
                   <h3 className="text-2xl font-serif">{displayName}</h3>
                   <p className="text-neutral-500 text-xs uppercase tracking-widest">Arovia Vibes Member</p>
                 </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Full Name</span>
                  </div>
                  <input 
                    type="text"
                    value={editData.name}
                    onChange={e => setEditData({...editData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:border-primary outline-none transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Email Address</span>
                  </div>
                  <p className="text-white font-medium py-2.5 px-4 bg-black/20 rounded-xl border border-white/5 opacity-50">{user?.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Phone Number</span>
                  </div>
                  <input 
                    type="tel"
                    value={editData.phone}
                    onChange={e => setEditData({...editData, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:border-primary outline-none transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Default PIN Code</span>
                  </div>
                  <input 
                    type="text"
                    maxLength={6}
                    value={editData.pincode}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 6) setEditData({...editData, pincode: val});
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:border-primary outline-none transition-colors"
                    placeholder="6-digit PIN"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Account Role</span>
                  </div>
                  <p className="text-primary font-bold uppercase tracking-widest text-xs py-2.5 px-4">{profile?.role || "User"}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 bg-primary text-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white transition-all disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
