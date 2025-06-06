const express = require("express");

const {
    getAllOrdersOfAllUser,
    getOrderDetailsForAdmin,
    updateOrderStatus
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUser);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
