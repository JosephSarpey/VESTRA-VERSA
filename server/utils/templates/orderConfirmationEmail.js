function orderConfirmationEmail(order) {
  const supportEmail = "support@vestraversa.com";
  const logoUrl = "https://vestraversa.com/logo.png"; // ← Replace with your real logo URL

  const itemsRows = order.cartItems.map(item => {
    const price = Number(item.price || 0).toFixed(2);
    const total = (price * item.quantity).toFixed(2);
    const imageUrl = item.image || 'https://via.placeholder.com/60';
  
    return `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <table style="width: 100%; border-collapse: collapse;">
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
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${price}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${total}</td>
      </tr>
    `;
  }).join('');
  

  const subtotal = (order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2);
  const shipping = Number(order.shippingFee).toFixed(2);
  const tax = Number(order.taxAmount).toFixed(2);
  const total = Number(order.totalAmount).toFixed(2);

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            padding: 16px !important;
          }
          .order-table th, .order-table td {
            font-size: 14px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background: #f3f4f6;">
      <div class="container" style="max-width: 640px; margin: auto; font-family: 'Segoe UI', sans-serif; border: 1px solid #eee; border-radius: 10px; overflow: hidden; background: #fff; padding: 24px 32px;">
        <div style="text-align: center; padding-bottom: 16px;">
          <img src="${logoUrl}" alt="Vestra Versa Logo" style="height: 60px;" />
        </div>

        <div style="text-align: center; background: #1e40af; color: white; padding: 20px 16px;">
          <h2 style="margin: 0;">🧾 Order Confirmation</h2>
        </div>

        <p style="margin-top: 24px;">Hi <strong>${order.userName || 'Customer'}</strong>,</p>
        <p>Thank you for your order!</p>

        <table style="width: 100%; font-size: 14px; margin-bottom: 16px;">
          <tr><td><strong>Order ID:</strong></td><td>${order._id}</td></tr>
          <tr><td><strong>Total:</strong></td><td>$${total}</td></tr>
          <tr><td><strong>Shipping Address:</strong></td><td>${order.shippingAddress}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${order.phone}</td></tr>
          <tr><td><strong>Payment Method:</strong></td><td>${order.paymentMethod}</td></tr>
          <tr><td><strong>Status:</strong></td><td>${order.paymentStatus}</td></tr>
        </table>

        <h3 style="margin-top: 32px; margin-bottom: 12px;">🛍️ Items Ordered</h3>
        <table class="order-table" style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <thead style="background: #f3f4f6;">
            <tr>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table style="width: 100%; font-size: 15px; margin-top: 20px;">
          <tr><td><strong>Subtotal:</strong></td><td style="text-align: right;">$${subtotal}</td></tr>
          <tr><td><strong>Shipping:</strong></td><td style="text-align: right;">$${shipping}</td></tr>
          <tr><td><strong>Tax:</strong></td><td style="text-align: right;">$${tax}</td></tr>
          <tr><td><strong>Total:</strong></td><td style="text-align: right;"><strong>$${total}</strong></td></tr>
        </table>

        <p style="margin-top: 20px;">
          📄 <a href="https://vestraversa.com/shop/account/orders/${order._id}" style="color: #2563eb;">View Order Details</a>
        </p>

        <p style="margin-top: 24px;">
          If you have any questions, contact us at 
          <a href="mailto:${supportEmail}" style="color: #2563eb;">${supportEmail}</a>.
        </p>

        <p style="margin-top: 20px;">We’ll notify you when your order ships!</p>
        <p><strong>– Vestra Versa Team</strong></p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
      </div>
    </body>
  </html>
  `;

  return { html };
}

module.exports = orderConfirmationEmail;
