import { createClient } from '@/lib/supabase/client'
import { CartItem } from '@/types'
import { toast } from 'react-hot-toast'

export const orderService = {
  async createOrder(orderData: {
    user_id: string; // Enforced
    customer_name: string;
    phone: string;
    address: string;
    payment_method: 'COD' | 'UPI';
    total_amount: number;
    items: CartItem[];
  }) {
    const supabase = createClient()
    const trackingId = `ARV-${Date.now()}`

    try {
      // 1. Double check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { data: null, error: 'UNAUTHORIZED' }

      // 2. Check stock
      for (const item of orderData.items) {
        const { data: product, error: stockCheckError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single()

        if (stockCheckError || !product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`)
        }
      }

      // 3. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          tracking_id: trackingId,
          customer_name: orderData.customer_name,
          phone: orderData.phone,
          address: orderData.address,
          payment_method: orderData.payment_method,
          payment_status: 'pending',
          order_status: 'pending',
          total_amount: orderData.total_amount
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // 4. Create order items and decrement stock
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 5. Update stock
      for (const item of orderData.items) {
        await supabase.rpc('decrement_stock', { 
          product_id: item.id, 
          qty: item.quantity 
        })
      }

      toast.success('Order placed successfully!')
      return { data: order, error: null }

    } catch (error: any) {
      console.error('Order creation failed:', error)
      toast.error(error.message || 'Failed to place order')
      return { data: null, error: error.message || 'INTERNAL_ERROR' }
    }
  },

  async getUserOrders(page = 1, limit = 20) {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { data: null, error: 'UNAUTHORIZED' }

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Fetch user orders failed:', error)
      return { data: null, error: 'INTERNAL_ERROR' }
    }
  },

  async getOrderById(orderId: string) {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { data: null, error: 'UNAUTHORIZED' }

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return { data: null, error: 'NOT_FOUND' }
        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('Get order by ID failed:', error)
      return { data: null, error: 'INTERNAL_ERROR' }
    }
  },

  async cancelOrder(orderId: string) {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { data: null, error: 'UNAUTHORIZED' }

      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id)
        .eq('order_status', 'pending') // Only cancel if pending
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') return { data: null, error: 'LOCKED' }
        throw error
      }

      toast.success('Order cancelled successfully')
      return { data, error: null }
    } catch (error: any) {
      console.error('Cancel order failed:', error)
      toast.error('Failed to cancel order')
      return { data: null, error: 'INTERNAL_ERROR' }
    }
  },

  async getAllOrders() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async updateOrderStatus(id: string, status: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', id)
      .select()
      .single()

    if (!error) toast.success(`Order status updated to ${status}`)
    return { data, error }
  },

  async updatePaymentStatus(id: string, status: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', id)
      .select()
      .single()

    if (!error) toast.success(`Payment status updated to ${status}`)
    return { data, error }
  },

  async getRevenueStats() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')

    if (error) return 0
    return data.reduce((sum, order) => sum + Number(order.total_amount), 0)
  }
}

