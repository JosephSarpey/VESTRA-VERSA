function orderStatusUpdateEmail(order) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #4F8A8B; color: #fff; padding: 24px; text-align: center;">
          <h2 style="margin: 0;">Order Status Updated</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${order.userName || ''}</strong>,</p>
          <p>Your order status has been updated to: <b>${order.orderStatus}</b></p>
          <p>Order ID: <b>${order._id}</b></p>
          <p>If you have any questions, reply to this email.</p>
          <p style="margin-top: 16px;">Best regards,<br><b>Vestra Versa Team</b></p>
        </div>
        <div style="background: #f6f6f6; padding: 12px; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
        </div>
      </div>
    `;
  
    const text = `
      Hello ${order.userName || ''},
      Your order status has been updated to: ${order.orderStatus}
      Order ID: ${order._id}
  
      Thank you for shopping with us!
      Vestra Versa Team
    `;
  
    return { html, text };
  }
  
  module.exports = orderStatusUpdateEmail;