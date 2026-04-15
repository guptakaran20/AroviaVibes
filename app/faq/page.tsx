"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Products",
    questions: [
      {
        q: "Are your fragrances authentic?",
        a: "Every Arovia Vibes selection is guaranteed 100% authentic. We source directly from authorized distributors and the world's most prestigious perfume houses."
      },
      {
        q: "How should I store my perfume?",
        a: "To preserve the integrity of the scent, store your bottle in a cool, dark place away from direct sunlight and humidity. Avoid storing in bathrooms."
      }
    ]
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Express shipping typically takes mapping 3-5 business days across India. Every order is tracked and insured."
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 2 hours of placement. Once processed and shipped, cancellations are no longer possible."
      }
    ]
  },
  {
    category: "Returns",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 14-day return window for products that are unopened, unused, and in their original sealed packaging."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="text-sm uppercase tracking-wide group-hover:text-primary transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-neutral-500"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pt-4 pb-2 text-sm text-neutral-400 leading-relaxed font-light">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6">
        <header className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6">
            Frequently Asked <br />
            <span className="text-primary italic">Questions</span>
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-luxury">
            Your inquiries, answered with clarity
          </p>
        </header>

        <div className="space-y-16">
          {faqs.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-primary border-l-2 border-primary pl-4 mb-8">
                {group.category}
              </h2>
              <div className="space-y-2">
                {group.questions.map((faq, faqIndex) => (
                  <FAQItem key={faqIndex} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-neutral-950 border border-white/5 text-center space-y-6">
          <h3 className="font-serif text-2xl tracking-wide">Still have questions?</h3>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            Our luxury concierge team is available to assist you with any inquiries 
            regarding our collection.
          </p>
          <a 
            href="mailto:aroviavibes@gmail.com"
            className="inline-block px-8 py-3 bg-primary text-background font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
