"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect minimal information necessary to deliver our luxury fragrances to you. This includes your name, shipping address, email, and contact number provided during checkout."
    },
    {
      title: "How We Use Information",
      content: "Your data is used solely for order processing, providing customer support, and sending optional brand updates if you have opted in. We never sell your personal information to third parties."
    },
    {
      title: "Security Measures",
      content: "We employ industry-standard encryption and security protocols to protect your sensitive data. Payment processing is handled via secure, PCI-compliant third-party gateways."
    },
    {
      title: "Cookies",
      content: "Our website uses essential cookies to manage your shopping cart and session. Analytical cookies help us refine our collection based on user preferences."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, rectify, or request the deletion of your personal data at any time by contacting our support team."
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-4">
            Privacy <span className="text-primary italic">Policy</span>
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.3em]">
            Effective Date: April 14, 2026
          </p>
        </header>

        <div className="space-y-16">
          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-sm uppercase tracking-widest font-bold text-primary">
                {String(index + 1).padStart(2, '0')}. {section.title}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}

          <section className="pt-12 border-t border-white/5">
            <h2 className="text-sm uppercase tracking-widest font-bold text-primary mb-4">
              Contact Us
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              If you have any questions about our privacy practices, please contact us at 
              <span className="text-white ml-1 italic underline underline-offset-4">privacy@aroviavibes.com</span>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
