function orderConfirmationEmail(orderDetails) {
  const cartItems = Array.isArray(orderDetails.cartItems)
  ? orderDetails.cartItems
  : orderDetails.cartItems?.items || [];

const itemsTableRows = cartItems.map(item => `
  <tr>
    <td style="padding: 10px; border: 1px solid #ccc;">
      <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 10px; vertical-align: middle;" />
      ${item.title}
    </td>
    <td style="padding: 10px; text-align: center; border: 1px solid #ccc;">${item.quantity}</td>
    <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">$${Number(item.price).toFixed(2)}</td>
    <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">$${(item.price * item.quantity).toFixed(2)}</td>
  </tr>
`).join('');


  const address = orderDetails.addressInfo
    ? `${orderDetails.addressInfo.address}<br>${orderDetails.addressInfo.city}, ${orderDetails.addressInfo.country} - ${orderDetails.addressInfo.pincode}<br>Phone: ${orderDetails.addressInfo.phone}`
    : "Not provided";

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06);">
      <!-- Logo Header -->
      <div style="background-color: #f9fafb; padding: 16px; text-align: center;">
        <img src="https://yourdomain.com/logo.png" alt="Vestra Versa" style="height: 50px;" />
      </div>

      <!-- Order Confirmed Banner -->
      <div style="background-color: #3B82F6; padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0;">🛒 Order Confirmed!</h1>
        <p style="margin-top: 5px;">Order ID: ${orderDetails._id}</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 24px;">
        <p>Dear <strong>${orderDetails.userName || "Customer"}</strong>,</p>
        <p>Thank you for your order. Below are the details of your purchase:</p>

        <h2 style="font-size: 18px; margin-top: 24px;">📦 Items Ordered</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
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

        <h2 style="font-size: 18px; margin-top: 24px;">💰 Order Summary</h2>
        <table style="width: 100%; font-size: 14px; margin-top: 10px;">
          <tr><td>Subtotal</td><td style="text-align: right;">$${(orderDetails.total - orderDetails.taxAmount - orderDetails.shippingFee).toFixed(2)}</td></tr>
          <tr><td>Shipping</td><td style="text-align: right;">$${Number(orderDetails.shippingFee).toFixed(2)}</td></tr>
          <tr><td>Tax (5%)</td><td style="text-align: right;">$${Number(orderDetails.taxAmount).toFixed(2)}</td></tr>
          <tr style="font-weight: bold;"><td>Total</td><td style="text-align: right;">$${Number(orderDetails.total).toFixed(2)}</td></tr>
        </table>

        <h2 style="font-size: 18px; margin-top: 24px;">📍 Shipping Address</h2>
        <p>${address}</p>

        <p style="margin-top: 20px;">🧾 Payment Method: <strong>${orderDetails.paymentMethod}</strong></p>
        <p>Status: <strong>${orderDetails.paymentStatus}</strong></p>

        <p style="margin-top: 30px;">We'll update you when your order ships. For any queries, reply to this email.</p>

        <p style="margin-top: 20px;">Warm regards,<br><strong>Vestra Versa Team</strong></p>
      </div>

      <div style="background-color: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        &copy; ${new Date().getFullYear()} Vestra Versa. All rights reserved.
      </div>
    </div>
  `;

  const text = `
Order Confirmation - Vestra Versa
----------------------------------

Hi ${orderDetails.userName || "Customer"},

Thank you for your order!

Order ID: ${orderDetails._id}
Total: $${Number(orderDetails.total).toFixed(2)}
Shipping Address: ${orderDetails.addressInfo?.address}, ${orderDetails.addressInfo?.city}, ${orderDetails.addressInfo?.country} - ${orderDetails.addressInfo?.pincode}
Phone: ${orderDetails.addressInfo?.phone}

Items:
${orderDetails.cartItems.map(i => `- ${i.title} x${i.quantity} ($${i.price.toFixed(2)} each)`).join('\n')}

Subtotal: $${(orderDetails.total - orderDetails.taxAmount - orderDetails.shippingFee).toFixed(2)}
Shipping: $${Number(orderDetails.shippingFee).toFixed(2)}
Tax: $${Number(orderDetails.taxAmount).toFixed(2)}
Total: $${Number(orderDetails.total).toFixed(2)}

Payment Method: ${orderDetails.paymentMethod}
Status: ${orderDetails.paymentStatus}

We'll notify you when your order ships!

- Vestra Versa Team
`;

  return { html, text };
}

module.exports = orderConfirmationEmail;