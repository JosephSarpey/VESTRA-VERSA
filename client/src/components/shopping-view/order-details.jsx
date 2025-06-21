import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Package, RefreshCw, Truck, CheckCircle2, XCircle } from "lucide-react";

function OrderTimeline({ status }) {
  const statuses = [
    { 
      id: 'pending', 
      label: 'Order Placed', 
      icon: <Package className="h-4 w-4" /> 
    },
    { 
      id: 'processing', 
      label: 'Processing', 
      icon: <RefreshCw className="h-4 w-4" /> 
    },
    { 
      id: 'shipped', 
      label: 'Shipped', 
      icon: <Truck className="h-4 w-4" /> 
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      icon: <CheckCircle2 className="h-4 w-4" /> 
    }
  ];

  const cancelledStatus = { 
    id: 'cancelled', 
    label: 'Cancelled', 
    icon: <XCircle className="h-4 w-4" /> 
  };

  if (status === 'cancelled' || status === 'rejected') {
    statuses.push(cancelledStatus);
  }

  const currentStatusIndex = statuses.findIndex(s => s.id === status);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Order Status</h3>
      <div className="relative">
        <div className="absolute left-4 top-4 -bottom-4 w-0.5 bg-muted" />
        <div className="space-y-6">
          {statuses.map((item, index) => {
            const isActive = index <= currentStatusIndex;
            return (
              <div key={item.id} className="relative flex gap-4">
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  {isActive && index === currentStatusIndex && (
                    <p className="text-sm text-muted-foreground">
                      Your order is {item.label.toLowerCase()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const statusColors = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    rejected: "bg-red-600",
    cancelled: "bg-red-600"
  };

  return (
    <Badge className={`py-1 px-3 ${statusColors[status] || "bg-gray-500"}`}>
      {status}
    </Badge>
  );
}

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogTitle>Order #{orderDetails._id.slice(-6)}</DialogTitle>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <OrderTimeline status={orderDetails.orderStatus} />
          
          <div className="space-y-4">
            <h3 className="font-medium">Items</h3>
            <div className="space-y-4">
              {orderDetails.cartItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-muted" />
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${orderDetails.subtotal || orderDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${orderDetails.shippingCost || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${orderDetails.tax || '0.00'}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${orderDetails.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Shipping Information</h3>
            <div className="space-y-1 text-sm">
              <p>{user?.userName}</p>
              <p>{orderDetails.addressInfo?.address}</p>
              <p>
                {orderDetails.addressInfo?.city}, {orderDetails.addressInfo?.pincode}
              </p>
              <p>{orderDetails.addressInfo?.country}</p>
              <p>Phone: {orderDetails.addressInfo?.phone}</p>
              {orderDetails.addressInfo?.notes && (
                <p className="pt-2">
                  <span className="font-medium">Notes: </span>
                  {orderDetails.addressInfo.notes}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Payment Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium">{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <OrderStatusBadge status={orderDetails.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;