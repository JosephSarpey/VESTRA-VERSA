function orderStatusUpdateEmail(order) {
  return `
  <html>
  <body style="margin:0; padding:0; font-family:Segoe UI, sans-serif; background-color:#f6f6f6;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #eaeaea; border-radius:10px; overflow:hidden;">
      <tr style="background:#2c2c2c; color:#f8d24e; border-bottom: 4px solid #f8d24e;">
        <td style="padding:20px; text-align:center;">
          <img src="https://collection.cloudinary.com/di7pya1rt/e182718ffa3853898a07e0e339176040" alt="Vestra Versa" style="height:40px; margin-bottom:10px;" />
          <h2>Order Status Updated</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <p>Hello <strong>${order.userName || 'Customer'}</strong>,</p>
          <p>Your order status has been updated:</p>
          <table width="100%" cellpadding="8" style="font-size:14px;">
            <tr><td><strong>Order ID:</strong></td><td>${order._id}</td></tr>
            <tr><td><strong>Status:</strong></td><td style="color:#2563EB;">${order.orderStatus}</td></tr>
            <tr><td><strong>Total Amount:</strong></td><td>$${Number(order.totalAmount).toFixed(2)}</td></tr>
          </table>

          <p style="margin-top:20px; text-align:center;">
            <a href="https://vestraversa.com/shop/account" style="display:inline-block; background:#f8d24e; color:#2c2c2c; font-weight:bold; border-radius:6px; padding:10px 20px; text-decoration:none">🔍Login To View Your Order</a>
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


module.exports = orderStatusUpdateEmail;
