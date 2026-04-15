"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Package,
  ExternalLink,
  Loader2
} from "lucide-react";
import { productService } from "@/services/products";
import { Product } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductModal } from "@/components/admin/ProductModal";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productService.adminGetProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const success = await productService.deleteProduct(id);
      if (success) fetchProducts();
    }
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2">Products</h1>
          <p className="text-neutral-500 text-sm uppercase tracking-widest">Manage your perfume collection</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search products by name or brand..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-primary outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-widest px-4">
            Total: {filteredProducts.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <th className="px-6 py-4 font-normal">Product</th>
                <th className="px-6 py-4 font-normal">Category</th>
                <th className="px-6 py-4 font-normal">Price</th>
                <th className="px-6 py-4 font-normal">Stock</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-sm italic">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/5">
                          {product.image_url ? (
                            <Image 
                              src={product.image_url} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-700">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-neutral-400 capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                        )} />
                        <span className="text-xs text-neutral-400">{product.stock} in stock</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {product.is_active !== false ? (
                          <span className="bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-widest px-2 py-1 rounded ring-1 ring-emerald-500/20">Visible</span>
                        ) : (
                          <span className="bg-red-500/10 text-red-500 text-[10px] uppercase tracking-widest px-2 py-1 rounded ring-1 ring-red-500/20">Hidden</span>
                        )}
                        {product.is_featured && (
                          <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-widest px-2 py-1 rounded ring-1 ring-primary/20">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
