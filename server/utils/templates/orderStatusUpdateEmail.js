function orderStatusUpdateEmail(order) {
  const supportEmail = "vestraversa@gmail.com"; // replace with your actual support email

  const itemsTableRows = order.cartItems.map(item => {
    const price = Number(item.price || 0);
    return `
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">
          <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; vertical-align: middle; margin-right: 8px;" />
          ${item.title}
        </td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ccc;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">$${price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">$${(price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const subtotal = (order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2);
  const tax = Number(order.taxAmount).toFixed(2);
  const shipping = Number(order.shippingFee).toFixed(2);
  const total = Number(order.totalAmount).toFixed(2);

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 6px 18px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(to right, #3B82F6, #2563EB); color: white; padding: 28px 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">📦 Order Status Update</h2>
        <p style="margin-top: 6px;">Order ID: <strong>${order._id}</strong></p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 16px;">Hi <strong>${order.userName || 'Customer'}</strong>,</p>
        <p>We're writing to inform you that the status of your order has changed.</p>

        <p style="font-size: 16px; margin: 16px 0; background: #F0F9FF; padding: 16px; border-left: 4px solid #3B82F6; border-radius: 8px;">
          <strong>New Status:</strong> <span style="color: #2563EB;">${order.orderStatus}</span>
        </p>

        <h3 style="font-size: 18px; margin-top: 30px;">🧾 Items in Your Order</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ccc;">Item</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ccc;">Qty</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ccc;">Price</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ccc;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>

        <h3 style="font-size: 18px; margin-top: 24px;">💰 Order Summary</h3>
        <table style="width: 100%; font-size: 14px; margin-top: 10px;">
          <tr><td>Subtotal</td><td style="text-align: right;">$${subtotal}</td></tr>
          <tr><td>Shipping</td><td style="text-align: right;">$${shipping}</td></tr>
          <tr><td>Tax</td><td style="text-align: right;">$${tax}</td></tr>
          <tr style="font-weight: bold;"><td>Total</td><td style="text-align: right;">$${total}</td></tr>
        </table>

        <p style="margin-top: 20px;">
          You can <a href="https://vestraversa.com/shop/account/orders/${order._id}" style="color: #2563EB; font-weight: 500; text-decoration: underline;">view your order here</a> for full details.
        </p>

        <p style="margin-top: 24px;">Need help? Email our support team at 
          <a href="mailto:${supportEmail}" style="color: #2563EB; font-weight: 500;">${supportEmail}</a>
        </p>

        <p style="margin-top: 30px;">Warm regards,<br /><strong>The Vestra Versa Team</strong></p>
      </div>

      <div style="background: #f3f4f6; padding: 14px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
      </div>
    </div>
  `;

  const text = `
Hello ${order.userName || 'Customer'},

Your order status has been updated.

Order ID: ${order._id}
New Status: ${order.orderStatus}

Items:
${order.cartItems.map(item => `- ${item.title} x${item.quantity} ($${Number(item.price).toFixed(2)} each)`).join('\n')}

Subtotal: $${subtotal}
Shipping: $${shipping}
Tax: $${tax}
Total: $${total}

View your order: https://vestraversa.com/shop/account/orders/${order._id}

Need help? Contact support at ${supportEmail}

Thanks for shopping with us!
- Vestra Versa Team
  `;

  return { html, text };
}

module.exports = orderStatusUpdateEmail;
