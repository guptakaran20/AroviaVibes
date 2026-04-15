import { Product } from "@/types";

export const transformProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
  brand: p.brand,
  description: p.description,
  price: p.price,
  discount_price: p.oldPrice ?? undefined,
  category: p.category,
  image_url: p.image || p.image_url,
  secondary_image_url: p.secondaryImage || p.secondary_image_url || undefined,
  images: p.images || [p.image || p.image_url, p.secondaryImage || p.secondary_image_url].filter(Boolean) as string[],
  rating: p.rating,
  stock: p.stock,
  is_new: p.isNew ?? false,
  is_featured: false,
});