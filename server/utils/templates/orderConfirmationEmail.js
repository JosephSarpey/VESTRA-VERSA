function orderConfirmationEmail(order) {
  const itemsTableRows = order.cartItems.map(item => {
    const price = Number(item.price || 0);
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin-right: 10px;" />
          <span style="vertical-align: middle;">${item.title}</span>
        </td>
        <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">$${price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">$${(price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const address = order.addressInfo
    ? `${order.addressInfo.address}<br>${order.addressInfo.city}, ${order.addressInfo.country} - ${order.addressInfo.pincode}<br>📞 ${order.addressInfo.phone}`
    : "Not provided";

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 6px 20px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(to right, #4f46e5, #3b82f6); padding: 30px 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px;">🛍️ Order Confirmed</h1>
        <p style="margin-top: 8px;">Order ID: <strong>${order._id}</strong></p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 16px;">Hello <strong>${order.userName || "Customer"}</strong>,</p>
        <p style="margin-top: 4px;">Thanks for shopping with us! Here's a summary of your order:</p>

        <h2 style="margin-top: 24px; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">📦 Items</h2>
        <table style="width: 100%; font-size: 14px; margin-top: 12px; border-collapse: collapse;">
          <thead style="background-color: #f9fafb;">
            <tr>
              <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ccc;">Item</th>
              <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ccc;">Qty</th>
              <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ccc;">Price</th>
              <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ccc;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>

        <h2 style="margin-top: 24px; font-size: 18px;">💵 Summary</h2>
        <table style="width: 100%; font-size: 15px; margin-top: 12px;">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">$${(order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td style="text-align: right;">$${Number(order.shippingFee).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Tax (5%):</td>
            <td style="text-align: right;">$${Number(order.taxAmount).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 1px solid #ccc;">
            <td style="padding-top: 8px;">Total:</td>
            <td style="padding-top: 8px; text-align: right;">$${Number(order.totalAmount).toFixed(2)}</td>
          </tr>
        </table>

        <h2 style="margin-top: 24px; font-size: 18px;">🚚 Shipping Address</h2>
        <p style="margin-top: 6px; line-height: 1.5;">${address}</p>

        <p style="margin-top: 16px;">💳 Payment Method: <strong>${order.paymentMethod}</strong></p>
        <p>Status: <strong>${order.paymentStatus}</strong></p>

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://vestraversa.com/account/orders/${order._id}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
            🔎 View Your Order
          </a>
        </div>

        <p style="margin-top: 32px; font-size: 14px;">You'll receive another email when your order ships.</p>
        <p style="margin-top: 16px; font-size: 14px;">Warm regards,<br><strong>The Vestra Versa Team</strong></p>
      </div>

      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
      </div>
    </div>
  `;

  const text = `
Order Confirmation - Vestra Versa
----------------------------------

Hi ${order.userName || "Customer"},

Thank you for your order!

Order ID: ${order._id}
Total: $${order.totalAmount}
Shipping Address: ${order.addressInfo?.address}, ${order.addressInfo?.city}, ${order.addressInfo?.country} - ${order.addressInfo?.pincode}
Phone: ${order.addressInfo?.phone}

Items:
${order.cartItems.map(item => `- ${item.title} x${item.quantity} ($${Number(item.price).toFixed(2)} each)`).join('\n')}

Subtotal: $${(order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2)}
Shipping: $${Number(order.shippingFee).toFixed(2)}
Tax: $${Number(order.taxAmount).toFixed(2)}
Total: $${order.totalAmount}

Payment Method: ${order.paymentMethod}
Status: ${order.paymentStatus}

🔗 View your order: https://vestraversa.com/shop/account/orders/${order._id}

We'll notify you when your order ships!

- Vestra Versa Team
`;

  return { html, text };
}

module.exports = orderConfirmationEmail;
