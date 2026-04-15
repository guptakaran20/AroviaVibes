"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="text-xl font-serif tracking-tight flex items-center gap-2">
              <span className="text-primary italic">Arovia</span> Admin
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-neutral-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300",
                    isActive 
                      ? "bg-primary text-black font-bold" 
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="h-[1px] bg-white/5 w-full" />
            <button 
              onClick={() => authService.signOut()}
              className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 hover:text-red-500 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-neutral-900/50 backdrop-blur-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={cn("lg:hidden text-neutral-400", isSidebarOpen && "hidden")}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">Administrator</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Admin Access</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-black">
          {children}
        </div>
      </main>
    </div>
  );
}
