const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
      cartId,
    } = req.body;

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
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newlyCreatedOrder.save();

    // Create line items for Stripe Checkout
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.title },
        unit_amount: Math.round(Number(item.price) * 100), // amount in cents
      },
      quantity: item.quantity,
    }));

    if (taxAmount > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax' },
          unit_amount: Math.round(Number(taxAmount) * 100),
        },
        quantity: 1,
      });
    }

    if (shippingFee > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(Number(shippingFee) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/shop/stripe-return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/checkout`,
      client_reference_id: newlyCreatedOrder._id.toString(),
      metadata: {
        orderId: newlyCreatedOrder._id.toString()
      },
      line_items,
    });

    // Provide the approval URL to the frontend which will redirect to Stripe
    res.status(201).json({
      success: true,
      approvalURL: session.url,
      orderId: newlyCreatedOrder._id,
      sessionId: session.id, // Can be useful tracking
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const retryPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Find the existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid" || order.orderStatus === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid and confirmed",
      });
    }

    // Create line items for Stripe Checkout
    const line_items = order.cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.title },
        unit_amount: Math.round(Number(item.price) * 100), // amount in cents
      },
      quantity: item.quantity,
    }));

    if (order.taxAmount > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax' },
          unit_amount: Math.round(Number(order.taxAmount) * 100),
        },
        quantity: 1,
      });
    }

    if (order.shippingFee > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(Number(order.shippingFee) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/shop/stripe-return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/checkout`,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString()
      },
      line_items,
    });

    res.status(200).json({
      success: true,
      approvalURL: session.url,
      orderId: order._id,
      sessionId: session.id, // Can be useful tracking
    });

  } catch (e) {
    console.error("Retry payment error:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrying payment!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { sessionId, orderId } = req.body;

    // First, verify the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Retrieve the Stripe session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = session.payment_intent; // Save the Stripe Payment Intent ID
      order.payerId = session.customer || session.customer_details?.email || "";

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

      // Send confirmation email asynchronously (do not await)
      const user = await User.findById(order.userId);
      if (user?.email) {
        const html = orderConfirmationEmail(order);
        sendMail(user.email, "Order Confirmed", html).catch(err => {
          console.error("Failed to send order confirmation email:", err);
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order confirmed",
        data: order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not approved by Stripe",
        data: session
      });
    }
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
  retryPayment,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
