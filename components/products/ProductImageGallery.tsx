"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
}

export const ProductImageGallery = ({ images: initialImages }: ProductImageGalleryProps) => {
  // Fallback for empty images or legacy single-image data
  const images = initialImages && initialImages.length > 0 
    ? initialImages 
    : ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000"];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    const nextIndex = (currentIndex + newDirection + images.length) % images.length;
    setDirection(newDirection);
    setCurrentIndex(nextIndex);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="space-y-6">
      {/* Main Image View */}
      <div className="relative aspect-[4/5] bg-neutral-900 border border-white/5 overflow-hidden group rounded-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 }
            }}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              fill
              className="object-contain scale-[1.1] md:scale-[1.05] p-4 select-none"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        {images.length > 1 && (
          <div className="absolute inset-0 hidden md:flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <button
              onClick={() => paginate(-1)}
              className="p-4 bg-black/60 backdrop-blur-xl rounded-full text-white pointer-events-auto hover:bg-primary hover:text-black transition-all border border-white/10 active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="p-4 bg-black/60 backdrop-blur-xl rounded-full text-white pointer-events-auto hover:bg-primary hover:text-black transition-all border border-white/10 active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Indicators (Bottom Overlay) */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10 pointer-events-none">
            {images.map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  width: i === currentIndex ? 32 : 8,
                  backgroundColor: i === currentIndex ? "#d4af37" : "rgba(255, 255, 255, 0.2)"
                }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails (Desktop) */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-wrap gap-4">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={cn(
                "relative w-24 aspect-square rounded-xl transition-all duration-500 overflow-hidden ring-2 ring-inset",
                i === currentIndex 
                  ? "ring-primary scale-105" 
                  : "ring-white/5 opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
              )}
            >
              <Image src={url} alt={`Thumb ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
