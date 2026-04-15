import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { toast } from 'react-hot-toast'

const sanitizePath = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

const uploadProductImage = async (productName: string, file: File, type: 'main' | 'secondary') => {
  const supabase = createClient()
  const folder = sanitizePath(productName)
  const fileName = `${Date.now()}-${type}.jpg`
  const path = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from('products')
    .upload(path, file)

  if (error) {
    console.error(`Error uploading ${type} image:`, error)
    throw new Error(`Failed to upload ${type} image: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
  return publicUrl
}

export const productService = {
  async getProducts() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .gt('stock', 0)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    return data as Product[]
  },

  async adminGetProducts() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin products:', error)
      return []
    }
    return data as Product[]
  },

  async getFeaturedProducts() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .gt('stock', 0)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
    return data as Product[]
  },

  async getProductBySlug(slug: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }
    return data as Product
  },

  async createProduct(product: Partial<Product>, imageFile?: File, secondaryImageFile?: File) {
    let imageUrl = product.image_url
    let secondaryImageUrl = product.secondary_image_url

    try {
      if (imageFile) {
        imageUrl = await uploadProductImage(product.name || 'unnamed', imageFile, 'main')
      }
      if (secondaryImageFile) {
        secondaryImageUrl = await uploadProductImage(product.name || 'unnamed', secondaryImageFile, 'secondary')
      }
    } catch (err: any) {
      toast.error(err.message)
      return null
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        image_url: imageUrl,
        secondary_image_url: secondaryImageUrl,
        slug: product.name ? sanitizePath(product.name) : `prod-${Date.now()}`,
        is_active: product.is_active ?? true
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product record')
      return null
    }

    toast.success('Product created successfully')
    return data as Product
  },

  async updateProduct(id: string, updates: Partial<Product>, imageFile?: File, secondaryImageFile?: File) {
    let imageUrl = updates.image_url
    let secondaryImageUrl = updates.secondary_image_url

    try {
      if (imageFile) {
        imageUrl = await uploadProductImage(updates.name || 'updated', imageFile, 'main')
      }
      if (secondaryImageFile) {
        secondaryImageUrl = await uploadProductImage(updates.name || 'updated', secondaryImageFile, 'secondary')
      }
    } catch (err: any) {
      toast.error(err.message)
      return null
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        ...(imageUrl && { image_url: imageUrl }),
        ...(secondaryImageUrl && { secondary_image_url: secondaryImageUrl }),
        is_active: updates.is_active ?? true,
        cod_charges: updates.cod_charges ?? 0
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
      return null
    }

    toast.success('Product updated successfully')
    return data
  },

  async deleteProduct(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      
      // Check for common foreign key constraint error (linked to orders)
      if (error.code === '23503') {
        const { error: hideError } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', id)
        
        if (hideError) {
          toast.error('Failed to delete or hide product')
          return false
        }
        
        toast.success('Product has sales history. It has been hidden from the shop instead.')
        return true // Return true because the "removal" from view was successful
      } else {
        toast.error(`Failed to delete product: ${error.message}`)
      }
      return false
    }

    toast.success('Product deleted')
    return true
  }
}
