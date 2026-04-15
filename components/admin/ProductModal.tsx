"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { productService } from "@/services/products";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export const ProductModal = ({ isOpen, onClose, product, onSuccess }: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    brand: "",
    description: "",
    price: 0,
    discount_price: 0,
    category: "Men",
    stock: 0,
    is_featured: false,
    rating: 5,
    is_active: true,
    cod_charges: 0,
  });

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setExistingImages(product.images || [product.image_url, product.secondary_image_url].filter(Boolean) as string[]);
      setPreviews([]);
      setNewImageFiles([]);
    } else {
      setFormData({
        name: "",
        brand: "",
        description: "",
        price: 0,
        discount_price: 0,
        category: "Men",
        stock: 0,
        is_featured: false,
        rating: 5,
        is_active: true,
        cod_charges: 0,
      });
      setExistingImages([]);
      setPreviews([]);
      setNewImageFiles([]);
    }
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === "" 
            ? 0
            : parseFloat(value)
          : value,
    }));
  };

  const handleToggle = (field: "is_featured" | "is_active") => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingImages.length + newImageFiles.length + files.length;

    if (totalCount > 5) {
      alert("Maximum 5 images allowed per product");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setNewImageFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product?.id) {
        await productService.updateProduct(
          product.id, 
          formData,
          newImageFiles,
          existingImages
        );
      } else {
        await productService.createProduct(
          formData,
          newImageFiles
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-serif">{product ? "Edit Product" : "Add New Product"}</h2>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                {product ? "Update product details and stock" : "Create a new entry in your collection"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-neutral-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Product Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors"
                    placeholder="e.g. Jaguar Men Classic EDT"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Brand</label>
                  <input
                    required
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors"
                    placeholder="e.g. Jaguar"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors appearance-none"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Price (₹)</label>
                    <input
                      required
                      type="number"
                      name="price"
                      value={formData.price ?? ""}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Old Price (₹)</label>
                    <input
                      type="number"
                      name="discount_price"
                      value={formData.discount_price ?? ""}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Stock Quantity</label>
                    <input
                      required
                      type="number"
                      name="stock"
                      value={formData.stock ?? ""}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">COD Extra Charge (₹)</label>
                    <input
                      required
                      type="number"
                      name="cod_charges"
                      value={formData.cod_charges ?? ""}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggle("is_featured")}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      formData.is_featured 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-black/40 border-white/10 text-neutral-400"
                    )}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Featured</span>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      formData.is_featured ? "bg-primary border-primary" : "border-white/20"
                    )} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle("is_active")}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      formData.is_active !== false
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                        : "bg-black/40 border-white/10 text-neutral-400"
                    )}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Listed</span>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      formData.is_active !== false ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary outline-none transition-colors resize-none"
                placeholder="Describe the fragrance notes, longevity, and feel..."
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Product Gallery (Max 5)</label>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
                  {existingImages.length + newImageFiles.length} / 5 Images
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((url, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`existing-${index}`} 
                    className="relative aspect-square rounded-xl overflow-hidden group border border-white/5 bg-black"
                  >
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 py-1 text-[8px] text-black font-bold text-center uppercase tracking-tighter">
                        Main
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* New Previews */}
                {previews.map((preview, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`new-${index}`} 
                    className="relative aspect-square rounded-xl overflow-hidden group border border-white/5 bg-black"
                  >
                    <img src={preview} alt="Upload Preview" className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-2 h-2 bg-primary animate-ping rounded-full" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </motion.div>
                ))}

                {/* Upload Placeholder */}
                {(existingImages.length + newImageFiles.length) < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-black border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="p-2 bg-white/5 rounded-full text-neutral-500 group-hover:text-primary transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Add Image</span>
                  </button>
                )}
              </div>

              <input 
                 type="file" 
                 ref={fileInputRef}
                 multiple
                 className="hidden"
                 accept="image/*"
                 onChange={handleImageChange}
              />
              
              <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-wider">
                Tip: The first image will be used as the primary display. Recommended aspect ratio 4:5.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button 
              disabled={loading}
              type = "submit"
              className="min-w-[140px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                product ? "Update Product" : "Create Product"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  </AnimatePresence>
);
};
