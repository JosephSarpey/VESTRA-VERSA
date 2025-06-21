import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Search } from "lucide-react";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Input } from "@/components/ui/input";

function OrderStatusBadge({ status }) {
  const statusColors = {
    confirmed: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    rejected: "bg-red-600",
    cancelled: "bg-red-600"
  };

  const statusLabels = {
    confirmed: "Order Placed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    rejected: "Rejected",
    cancelled: "Cancelled"
  };

  return (
    <Badge className={`py-1 px-3 ${statusColors[status] || "bg-gray-500"}`}>
      {statusLabels[status] || status}
    </Badge>
  );
}

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { orderList, orderDetails } = useSelector(state => state.adminOrder);
  const dispatch = useDispatch();

  const filteredOrders = orderList?.filter(order =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Orders</h1>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((orderItem) => (
                  <TableRow key={orderItem._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">#{orderItem._id.slice(-6)}</TableCell>
                    <TableCell>{orderItem.userName || 'Guest'}</TableCell>
                    <TableCell>{new Date(orderItem.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {orderItem.cartItems?.slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product?.name || 'Product'}
                            className="w-8 h-8 rounded-full object-cover border-2 border-background"
                          />
                        ))}
                        {orderItem.cartItems?.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                            +{orderItem.cartItems.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${orderItem.totalAmount}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={orderItem.orderStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFetchOrderDetails(orderItem._id)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={openDetailsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
          }
        }}
      >
        {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </div>
  );
}

export default AdminOrdersView;