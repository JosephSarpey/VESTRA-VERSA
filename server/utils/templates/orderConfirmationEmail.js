function orderConfirmationEmail(order) {
  return `
  <html>
  <body style="margin:0; padding:0; font-family:Segoe UI, sans-serif; background-color:#f6f6f6;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #eaeaea; border-radius:10px; overflow:hidden;">
      <tr style="background:#3B82F6; color:#ffffff;">
        <td style="padding:20px; text-align:center;">
          <img src="https://vestraversa.com/logo.png" alt="Vestra Versa" style="height:40px; margin-bottom:10px;" />
          <h2>Order Confirmation</h2>
          <p style="margin:0;">Order ID: ${order._id}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <p>Hello <strong>${order.userName || 'Customer'}</strong>,</p>
          <p>Thank you for your order! Below is your order summary:</p>
          <h3 style="margin-top:20px;">🛍 Items Ordered</h3>
          <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
            <thead>
              <tr style="background:#f3f4f6; text-align:left;">
                <th>Image</th>
                <th>Product</th>
                <th>Qty</th>
                <th style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.cartItems.map(item => `
              <tr style="border-top:1px solid #e5e7eb;">
                <td><img src="${item.image}" alt="${item.title}" style="width:50px; height:50px; border-radius:6px;" /></td>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td style="text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          <h3 style="margin-top:30px;">💰 Summary</h3>
          <table width="100%" cellpadding="8" style="font-size:14px;">
            <tr><td>Subtotal:</td><td align="right">$${(order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2)}</td></tr>
            <tr><td>Shipping Fee:</td><td align="right">$${Number(order.shippingFee).toFixed(2)}</td></tr>
            <tr><td>Tax:</td><td align="right">$${Number(order.taxAmount).toFixed(2)}</td></tr>
            <tr style="font-weight:bold;"><td>Total Amount:</td><td align="right">$${Number(order.totalAmount).toFixed(2)}</td></tr>
          </table>

          <h3 style="margin-top:30px;">📍 Shipping Address</h3>
          <p style="margin:0;">
            ${order.addressInfo.address},<br/>
            ${order.addressInfo.city}, ${order.addressInfo.country} - ${order.addressInfo.pincode}<br/>
            Phone: ${order.addressInfo.phone}
          </p>

          <p style="margin-top:20px;">Payment Method: <strong>${order.paymentMethod}</strong></p>
          <p>Status: <strong>${order.paymentStatus}</strong></p>

          <p style="margin-top:20px; text-align:center;">
            <a href="https://vestraversa.com/shop/account/orders/${order._id}" style="display:inline-block; background:#3B82F6; color:#ffffff; padding:10px 20px; border-radius:6px; text-decoration:none;">🔎 View Your Order</a>
          </p>

          <p style="margin-top:30px;">Need help? Contact us at <a href="mailto:support@vestraversa.com">support@vestraversa.com</a></p>
          <p>Thank you!<br/><strong>Vestra Versa Team</strong></p>
        </td>
      </tr>
      <tr style="background:#f9fafb;">
        <td style="padding:12px; text-align:center; font-size:12px; color:#666;">
          &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
module.exports = orderConfirmationEmail;
