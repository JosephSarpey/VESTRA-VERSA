function orderStatusUpdateEmail(order) {
  const itemsTableRows = order.cartItems.map(item => {
    const price = Number(item.price || 0).toFixed(2);
    const total = (price * item.quantity).toFixed(2);
    const imageUrl = item.image || 'https://via.placeholder.com/60';

    return `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 60px;">
                <img src="${imageUrl}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" />
              </td>
              <td style="padding-left: 10px; font-size: 14px;">
                ${item.title}
              </td>
            </tr>
          </table>
        </td>
        <td style="text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="text-align: right; border: 1px solid #ddd;">$${price}</td>
        <td style="text-align: right; border: 1px solid #ddd;">$${total}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background: #2563EB; color: #fff; padding: 20px; text-align: center;">
        <img src="https://yourdomain.com/logo.png" alt="Vestra Versa" style="max-height: 40px; margin-bottom: 10px;" />
        <h2 style="margin: 0;">📦 Order Status Update</h2>
      </div>

      <!-- Body -->
      <div style="padding: 24px;">
        <p style="margin: 0;">Hi <strong>${order.userName || 'Customer'}</strong>,</p>
        <p>We’re writing to inform you that your order status has been updated:</p>

        <p style="font-size: 16px; margin: 20px 0;">
          🆔 <strong>Order ID:</strong> ${order._id}<br>
          📌 <strong>New Status:</strong> <span style="color: #2563EB;">${order.orderStatus}</span>
        </p>

        <h3 style="margin-top: 30px; font-size: 16px;">🛍️ Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Item</th>
              <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Qty</th>
              <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Price</th>
              <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>

        <h3 style="margin-top: 30px; font-size: 16px;">💳 Order Summary</h3>
        <table style="width: 100%; font-size: 14px; margin-top: 10px;">
          <tr><td>Subtotal:</td><td style="text-align: right;">$${(order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2)}</td></tr>
          <tr><td>Shipping:</td><td style="text-align: right;">$${Number(order.shippingFee).toFixed(2)}</td></tr>
          <tr><td>Tax:</td><td style="text-align: right;">$${Number(order.taxAmount).toFixed(2)}</td></tr>
          <tr style="font-weight: bold;"><td>Total:</td><td style="text-align: right;">$${order.totalAmount.toFixed(2)}</td></tr>
        </table>

        <p style="margin-top: 20px;">💰 Payment Method: <strong>${order.paymentMethod}</strong></p>
        <p>Status: <strong>${order.paymentStatus}</strong></p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vestraversa.com/shop/account/orders/${order._id}" style="background-color: #2563EB; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">🔎 View Order</a>
        </div>

        <p style="margin: 20px 0;">Need help? Contact us at <a href="mailto:support@vestraversa.com" style="color: #2563EB;">support@vestraversa.com</a></p>

        <p style="margin-top: 20px;">Warm regards,<br><strong>Vestra Versa Team</strong></p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
      </div>
    </div>
  `;

  const text = `
Hello ${order.userName || 'Customer'},

Your order status has been updated.

Order ID: ${order._id}
Status: ${order.orderStatus}

Total Amount: $${order.totalAmount.toFixed(2)}

View your order: https://vestraversa.com/shop/account/orders/${order._id}

Need help? Contact us at support@vestraversa.com

Thank you,
- Vestra Versa Team
  `;

  return { html, text };
}
