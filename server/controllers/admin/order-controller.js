const Order = require("../../models/Order");
const sendMail = require('../../utils/mailer');
const User = require("../../models/User");
const orderStatusUpdateEmail = require('../../utils/templates/orderStatusUpdateEmail');

const buildFilters = (query) => {
  const { status, search, startDate, endDate } = query;
  const filters = {};

  // Filter by status
  if (status) {
    filters.orderStatus = status;
  }

  // Search by order ID or customer name
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filters.$or = [
      { _id: { $regex: searchRegex } },
      { userName: { $regex: searchRegex } },
      { 'addressInfo.phone': { $regex: searchRegex } }
    ];
  }

  // Filter by date range
  if (startDate || endDate) {
    filters.orderDate = {};
    if (startDate) {
      filters.orderDate.$gte = new Date(startDate);
    }
    if (endDate) {
      // Set to end of day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filters.orderDate.$lte = endOfDay;
    }
  }

  return filters;
};

const buildSort = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  return sort;
};

const getAllOrders = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters
    const filters = buildFilters(req.query);

    // Build sort
    const sortBy = req.query.sortBy || 'orderDate';
    const sortOrder = req.query.sortOrder || 'desc';
    const sort = buildSort(sortBy, sortOrder);

    // Get total count for pagination
    const total = await Order.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    // Get paginated orders
    const orders = await Order.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (e) {
    console.error('Error fetching orders:', e);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: e.message,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error('Error fetching order details:', e);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: e.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    order.orderStatus = orderStatus;
    order.orderUpdateDate = new Date();
    await order.save();

    // Send email to user
    try {
      const user = await User.findById(order.userId);
      if (user?.email) {
        const html = orderStatusUpdateEmail(order);
        await sendMail(
          user.email,
          `Order #${order._id} Status Updated`,
          html
        );
      }
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (e) {
    console.error('Error updating order status:', e);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: e.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
};
