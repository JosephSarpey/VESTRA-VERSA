function orderConfirmationEmail(order) {
    const itemsTableRows = order.cartItems.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #eee;">${item.title}</td>
        <td style="padding: 8px; border: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #eee; text-align: right;">$${Number(item.price).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #eee; text-align: right;">$${(Number(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  
    const address = order.addressInfo
      ? `${order.addressInfo.address || ''}<br>
         ${order.addressInfo.city || ''}, ${order.addressInfo.country || ''} - ${order.addressInfo.pincode || ''}<br>
         Phone: ${order.addressInfo.phone || ''}`
      : 'N/A';
  
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #4F8A8B; color: #fff; padding: 24px; text-align: center;">
          <h2 style="margin: 0;">Order Confirmed!</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${order.userName || ''}</strong>,</p>
          <p>Thank you for your purchase! Your order has been <strong>confirmed</strong>.</p>
          <h3 style="margin-top: 32px; margin-bottom: 8px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <thead>
              <tr style="background: #f6f6f6;">
                <th style="padding: 8px; border: 1px solid #eee; text-align: left;">Product</th>
                <th style="padding: 8px; border: 1px solid #eee; text-align: center;">Qty</th>
                <th style="padding: 8px; border: 1px solid #eee; text-align: right;">Price</th>
                <th style="padding: 8px; border: 1px solid #eee; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>
          <table style="width: 100%; margin-bottom: 24px;">
            <tr>
              <td style="padding: 4px 0;"><b>Subtotal:</b></td>
              <td style="padding: 4px 0; text-align: right;">$${Number(order.totalAmount || order.total).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><b>Tax:</b></td>
              <td style="padding: 4px 0; text-align: right;">$${Number(order.taxAmount || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><b>Shipping:</b></td>
              <td style="padding: 4px 0; text-align: right;">$${Number(order.shippingFee || 0).toFixed(2)}</td>
            </tr>
            <tr style="font-weight: bold;">
              <td style="padding: 4px 0;">Total:</td>
              <td style="padding: 4px 0; text-align: right;">$${Number(order.totalAmount || order.total).toFixed(2)}</td>
            </tr>
          </table>
          <h3 style="margin-top: 32px; margin-bottom: 8px;">Shipping Address</h3>
          <p style="margin-bottom: 32px;">${address}</p>
          <p>We'll notify you when your order status changes.</p>
          <p style="margin-top: 32px; color: #888;">If you have any questions, reply to this email.</p>
          <p style="margin-top: 16px;">Best regards,<br><b>Vestra Versa Team</b></p>
        </div>
        <div style="background: #f6f6f6; padding: 12px; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
        </div>
      </div>
    `;
  
    const text = `
      Hello ${order.userName || ''},
      Your order has been confirmed!
  
      Order ID: ${order._id}
      Total: $${order.totalAmount || order.total}
  
      We'll notify you when your order status changes.
      Shipping Address: ${order.addressInfo ? order.addressInfo.address : 'N/A'}
  
      Thank you for shopping with us!
      Vestra Versa Team
    `;
  
    return { html, text };
  }
  
  module.exports = orderConfirmationEmail;