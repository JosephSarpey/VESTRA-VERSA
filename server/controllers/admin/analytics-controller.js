const User = require('../../models/User');
const Order = require('../../models/Order');

// Helper to get MongoDB $dateToString format for grouping
const getGroupId = (groupBy) => {
  if (groupBy === 'month') return { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
  // Default to week: ISO week-year
  return { $dateToString: { format: "%G-%V", date: "$createdAt" } };
};

const getUsersOverTime = async (req, res) => {
  try {
    const groupBy = req.query.groupBy === 'month' ? 'month' : 'week';
    const groupId = getGroupId(groupBy);

    const result = await User.aggregate([
      { $group: { _id: groupId, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(result.map(r => ({
      period: r._id,
      count: r.count
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user analytics', details: err.message });
  }
};

const getSalesOverTime = async (req, res) => {
  try {
    const groupBy = req.query.groupBy === 'month' ? 'month' : 'week';
    const groupId = groupBy === 'month'
      ? { $dateToString: { format: "%Y-%m", date: "$orderDate" } }
      : { $dateToString: { format: "%G-%V", date: "$orderDate" } };

    const SUCCESS_STATUS = "paid";

    const result = await Order.aggregate([
      { $match: { orderDate: { $exists: true }, paymentStatus: SUCCESS_STATUS } },
      { $group: {
        _id: groupId,
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(result.map(r => ({
      period: r._id,
      totalSales: r.totalSales,
      orderCount: r.orderCount
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales analytics', details: err.message });
  }
};

module.exports = {
  getUsersOverTime,
  getSalesOverTime
};
