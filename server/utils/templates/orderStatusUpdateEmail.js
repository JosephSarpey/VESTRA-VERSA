function orderStatusUpdateEmail(orderDetails) {
    const itemsTableRows = orderDetails.cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">
          <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; vertical-align: middle; border-radius: 6px;" />
          ${item.title}
        </td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ccc;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  
    const address = orderDetails.addressInfo
      ? `${orderDetails.addressInfo.address}<br>${orderDetails.addressInfo.city}, ${orderDetails.addressInfo.country} - ${orderDetails.addressInfo.pincode}<br>Phone: ${orderDetails.addressInfo.phone}`
      : "Not provided";
  
    const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #10B981; padding: 24px; color: white; text-align: center;">
          <h2 style="margin: 0;">Order Status Update</h2>
          <p style="margin: 8px 0;">Status: <strong>${orderDetails.orderStatus}</strong></p>
          <p style="margin: 8px 0;">Order ID: ${orderDetails._id}</p>
        </div>
  
        <div style="padding: 24px;">
          <p>Hi <strong>${orderDetails.userName || 'Customer'}</strong>,</p>
          <p>We wanted to let you know that your order status has been updated.</p>
  
          <a href="${orderDetails.orderUrl}" style="display: inline-block; margin: 16px 0; padding: 10px 16px; background-color: #3B82F6; color: white; border-radius: 6px; text-decoration: none; font-weight: 500;">
            🔎 View Order
          </a>
  
          <h3 style="margin-top: 24px;">🛍 Items</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
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
  
          <h3 style="margin-top: 24px;">💳 Order Summary</h3>
          <table style="width: 100%; font-size: 14px;">
            <tr><td>Subtotal</td><td style="text-align: right;">$${(orderDetails.total - orderDetails.taxAmount - orderDetails.shippingFee).toFixed(2)}</td></tr>
            <tr><td>Shipping</td><td style="text-align: right;">$${orderDetails.shippingFee.toFixed(2)}</td></tr>
            <tr><td>Tax (5%)</td><td style="text-align: right;">$${orderDetails.taxAmount.toFixed(2)}</td></tr>
            <tr style="font-weight: bold;"><td>Total</td><td style="text-align: right;">$${orderDetails.total.toFixed(2)}</td></tr>
          </table>
  
          <h3 style="margin-top: 24px;">📍 Shipping Address</h3>
          <p>${address}</p>
  
          <p style="margin-top: 12px;">🧾 Payment Method: <strong>${orderDetails.paymentMethod}</strong><br/>
          💵 Payment Status: <strong>${orderDetails.paymentStatus}</strong></p>
  
          <p style="margin-top: 24px;">Thanks for shopping with Vestra Versa. We’ll keep you informed on any further updates.</p>
          <p style="margin-top: 20px;">Warm regards,<br><strong>Vestra Versa Team</strong></p>
        </div>
  
        <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #777;">
          &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
        </div>
      </div>
    `;
  
    const text = `
  Order Status Update - Vestra Versa
  
  Hi ${orderDetails.userName || 'Customer'},
  
  Your order status has been updated to: ${orderDetails.orderStatus}
  Order ID: ${orderDetails._id}
  
  View your order: ${orderDetails.orderUrl}
  
  Items:
  ${orderDetails.cartItems.map(i => `- ${i.title} x${i.quantity} ($${i.price.toFixed(2)} each)`).join('\n')}
  
  Subtotal: $${(orderDetails.total - orderDetails.taxAmount - orderDetails.shippingFee).toFixed(2)}
  Shipping: $${orderDetails.shippingFee.toFixed(2)}
  Tax: $${orderDetails.taxAmount.toFixed(2)}
  Total: $${orderDetails.total.toFixed(2)}
  
  Shipping Address:
  ${orderDetails.addressInfo?.address}, ${orderDetails.addressInfo?.city}, ${orderDetails.addressInfo?.country} - ${orderDetails.addressInfo?.pincode}
  Phone: ${orderDetails.addressInfo?.phone}
  
  Payment Method: ${orderDetails.paymentMethod}
  Payment Status: ${orderDetails.paymentStatus}
  
  Thank you for shopping with Vestra Versa!
    `;
  
    return { html, text };
  }
  
  module.exports = orderStatusUpdateEmail;
  