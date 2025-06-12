function orderStatusUpdateEmail(order) {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background: #2563EB; color: #fff; padding: 24px; text-align: center;">
        <h2 style="margin: 0;">📦 Order Status Update</h2>
      </div>

      <div style="padding: 24px;">
        <p>Hi <strong>${order.userName || 'Customer'}</strong>,</p>
        <p>We're writing to let you know that the status of your order has been updated.</p>

        <p style="font-size: 16px; margin: 16px 0;">
          🆔 <strong>Order ID:</strong> ${order._id}<br />
          📌 <strong>New Status:</strong> <span style="color: #2563EB;">${order.orderStatus}</span>
        </p>

        <p>
          You can view your order at any time:
          <a href="https://yourdomain.com/orders/${order._id}" style="color: #2563EB;">View Order Details</a>
        </p>

        <p style="margin-top: 24px;">
          If you have any questions, feel free to reply to this email.
        </p>

        <p style="margin-top: 24px;">Warm regards,<br /><strong>Vestra Versa Team</strong></p>
      </div>

      <div style="background: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
      </div>
    </div>
  `;

  const text = `
Hello ${order.userName || 'Customer'},

Your order status has been updated.

Order ID: ${order._id}
New Status: ${order.orderStatus}

You can view your order at: https://yourdomain.com/orders/${order._id}

Thank you for shopping with us!
- Vestra Versa Team
  `;

  return { html, text };
}

module.exports = orderStatusUpdateEmail;
