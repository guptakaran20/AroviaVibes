import { CartItem } from "@/types";

interface OrderData {
  id: string;
  tracking_id: string;
  customer_name: string;
  total_amount: number;
  address: string;
  payment_method: string;
  order_items?: any[];
}

export function renderOrderEmailHtml(order: OrderData) {
  const itemsHtml = order.order_items?.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <div style="font-weight: 500; color: #111;">${item.products?.name || 'Product'}</div>
        <div style="font-size: 12px; color: #666;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .brand { font-family: serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 8px; }
        .status { color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .order-card { background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
        .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 12px; }
        .content-text { font-size: 14px; color: #333; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .total-row { font-size: 18px; font-weight: 700; color: #000; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">Arovia Vibes</div>
          <div class="status">Order Confirmed ✨</div>
        </div>

        <div class="content-text">
          Hi ${order.customer_name},<br><br>
          Great news! Your order has been confirmed and is now being processed. We'll send you another update as soon as it's shipped.
        </div>

        <div class="order-card">
          <div class="section-title">Order Details</div>
          <table class="table">
            <tr>
              <td style="font-size: 14px; color: #666; padding-bottom: 4px;">Tracking ID</td>
              <td style="font-size: 14px; font-weight: 600; text-align: right; padding-bottom: 4px;">${order.tracking_id}</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #666;">Payment Method</td>
              <td style="font-size: 14px; font-weight: 600; text-align: right;">${order.payment_method}</td>
            </tr>
          </table>
        </div>

        <div class="section-title">Shipping Address</div>
        <div class="content-text" style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 16px;">
          ${order.address}
        </div>

        <div class="section-title">Your Items</div>
        <table class="table" style="margin-bottom: 24px;">
          ${itemsHtml}
          <tr>
            <td style="padding: 24px 0 0; font-size: 16px; font-weight: 700;">Total Amount</td>
            <td style="padding: 24px 0 0; text-align: right; font-size: 18px; font-weight: 700;">₹${order.total_amount}</td>
          </tr>
        </table>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Arovia Vibes. All rights reserved.<br>
          If you have any questions, reply to this email or contact our support team.
        </div>
      </div>
    </body>
    </html>
  `;
}
