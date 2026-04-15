import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-md mx-auto px-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif">Welcome Back</h1>
            <p className="text-neutral-400 text-sm">
              Sign in to your account
            </p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>

          <div className="text-center text-sm text-neutral-500">
            New to Arovia Vibes?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Create an account
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}