const Order = require("../../models/Order");
const sendMail = require('../../utils/mailer');
const User = require("../../models/User");
const orderStatusUpdateEmail = require('../../utils/templates/orderStatusUpdateEmail');

const getAllOrdersOfAllUser = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(400).json({
        success: false,
        message: "No orders found!",
      });
    }

    return res.status(200).json({
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

const getOrderDetailsForAdmin = async (req, res) => {
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found!",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Send email to user
    const user = await User.findById(order.userId);
    const userEmail = user?.email;
    const { html, text } = orderStatusUpdateEmail(order);

    if (userEmail) {
      await sendMail(
        userEmail,
        "Order Status Updated",
        html,
        text
      );
    }

    res.status(200).json({
      success: true,
      message: "Order status is successfully updated!",
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
  getAllOrdersOfAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
