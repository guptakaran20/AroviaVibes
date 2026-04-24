"use server"

import { createClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'
import { resend } from '@/lib/resend'
import { renderOrderEmailHtml } from '@/components/emails/OrderConfirmationEmail'

export async function createOrder(orderData: {
  user_id: string;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  email?: string;
  payment_method: 'COD' | 'UPI';
  total_amount: number;
  items: CartItem[];
}) {
  const supabase = await createClient()
  const trackingId = `ARV-${Date.now()}`

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'UNAUTHORIZED' }

    // Check stock
    for (const item of orderData.items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single()

      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`)
      }
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        tracking_id: trackingId,
        customer_name: orderData.customer_name,
        customer_email: user.email, // Store email for notifications
        phone: orderData.phone,
        address: orderData.address,
        pincode: orderData.pincode,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        order_status: 'pending',
        total_amount: orderData.total_amount
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
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

    // Update stock
    for (const item of orderData.items) {
      await supabase.rpc('decrement_stock', { 
        product_id: item.id, 
        qty: item.quantity 
      })
    }

    return { data: order, error: null }

  } catch (error: any) {
    console.error('Order creation failed:', error)
    return { data: null, error: error.message || 'INTERNAL_ERROR' }
  }
}

export async function getUserOrders(page = 1, limit = 20) {
  const supabase = await createClient()
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
    return { data: null, error: 'INTERNAL_ERROR' }
  }
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'UNAUTHORIZED' }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: 'INTERNAL_ERROR' }
  }
}

export async function getAllOrders() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  
  // 1. Fetch current order with items
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single()

  if (fetchError || !order) return { data: null, error: fetchError }

  // 2. Update status
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error }

  // 3. Atomic Email Trigger Logic
  if (status === 'confirmed' && (order.email_attempts || 0) < 3) {
    const { data: lockData } = await supabase
      .from('orders')
      .update({
        email_sent: true,
        email_attempts: (order.email_attempts || 0) + 1
      })
      .eq('id', id)
      .eq('email_sent', false) // Only if not sent yet
      .select()
      .single()

    if (lockData) {
      try {
        await resend.emails.send({
          from: 'Arovia Vibes <no-reply@aroviavibes.com>',
          to: order.customer_email,
          subject: 'Your Order is Confirmed ✨',
          html: renderOrderEmailHtml(order),
        })
      } catch (err) {
        console.error('Email failed', err)
        // Rollback to allow retry
        await supabase
          .from('orders')
          .update({ email_sent: false })
          .eq('id', id)
      }
    }
  }

  return { data, error: null }
}

export async function cancelOrder(orderId: string) {
  const supabase = await createClient()
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

    return { data, error: null }
  } catch (error: any) {
    console.error('Cancel order failed:', error)
    return { data: null, error: 'INTERNAL_ERROR' }
  }
}

export async function updatePaymentStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: status })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function getRevenueStats() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('payment_status', 'paid')

  if (error) return 0
  return data.reduce((sum, order) => sum + Number(order.total_amount), 0)
}
