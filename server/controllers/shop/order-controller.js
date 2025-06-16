const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const sendMail = require('../../utils/mailer');
const orderConfirmationEmail = require('../../utils/templates/orderConfirmationEmail');
const User = require("../../models/User");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      taxAmount = 0,
      shippingFee = 0,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Calculate subtotal from cart items (sum of item prices * quantity)
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const subtotalStr = subtotal.toFixed(2);
    const taxStr = Number(taxAmount).toFixed(2);
    const shippingStr = Number(shippingFee).toFixed(2);
    const totalStr = Number(totalAmount).toFixed(2);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/shop/paypal-return`,
        cancel_url: `${process.env.FRONTEND_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: Number(item.price).toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalStr,
            details: {
              subtotal: subtotalStr,
              tax: taxStr,
              shipping: shippingStr,
            },
          },
          description: "Order payment",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("PayPal error details:", JSON.stringify(error.response || error, null, 2));
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
          error: error.response || error,
        });
      }
      else {
        const newlyCreatedOrder = new Order({
          userId,
          userName,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          taxAmount,
          shippingFee,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // First, verify the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Execute the PayPal payment
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD',
          total: order.totalAmount.toFixed(2)
        }
      }]
    };

    // Execute the payment with PayPal
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        console.error("PayPal capture error:", error.response || error);
        return res.status(400).json({ 
          success: false, 
          message: "Payment capture failed",
          error: error.response || error 
        });
      }

      // Only update order if payment was successful
      if (payment.state === 'approved') {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        // Update product quantities
        for (let item of order.cartItems) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.totalStock -= item.quantity;
            await product.save();
          }
        }

        // Clear the cart
        await Cart.findByIdAndDelete(order.cartId);

        // Save the updated order
        await order.save();

        // Send confirmation email
        const user = await User.findById(order.userId);
        if (user?.email) {
          const html = orderConfirmationEmail(order);
          await sendMail(user.email, "Order Confirmed", html);
        }

        return res.status(200).json({
          success: true,
          message: "Order confirmed",
          data: order,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment not approved",
          data: payment
        });
      }
    });

  } catch (e) {
    console.error("Payment capture error:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your payment",
      error: e.message
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
