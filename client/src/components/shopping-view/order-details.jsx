import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Package, RefreshCw, Truck, CheckCircle2, XCircle } from "lucide-react";

function OrderTimeline({ status }) {
  const statuses = [
    { 
      id: 'confirmed', 
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
    icon: <XCircle className="h-4 w-4" />,
    isTerminal: true
  };

  const rejectedStatus = { 
    id: 'rejected', 
    label: 'Rejected', 
    icon: <XCircle className="h-4 w-4" />,
    isTerminal: true
  };

  // Clone the statuses array to avoid mutating the original
  let timelineStatuses = [...statuses];
  
  // Add the terminal status if needed
  if (status === 'cancelled' || status === 'rejected') {
    timelineStatuses = timelineStatuses.filter(s => 
      s.id === 'confirmed' || s.id === status
    );
    timelineStatuses.push(status === 'cancelled' ? cancelledStatus : rejectedStatus);
  }

  const currentStatusIndex = timelineStatuses.findIndex(s => s.id === status);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Order Status</h3>
      <div className="relative">
        <div className={`absolute left-4 top-4 -bottom-4 w-0.5 ${
          status === 'cancelled' || status === 'rejected' 
            ? 'bg-destructive/20' 
            : 'bg-muted'
        }`} />
        <div className="space-y-6">
          {timelineStatuses.map((item, index) => {
            const isActive = index <= currentStatusIndex;
            const isTerminal = item.isTerminal;
            const isError = item.id === 'cancelled' || item.id === 'rejected';
            
            return (
              <div key={item.id} className="relative flex gap-4">
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive 
                      ? isError 
                        ? 'bg-destructive text-destructive-foreground' 
                        : 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isError ? 'text-destructive' : ''
                  }`}>
                    {item.label}
                  </p>
                  {isActive && (
                    <p className={`text-sm ${
                      isError ? 'text-destructive/80' : 'text-muted-foreground'
                    }`}>
                      {isTerminal 
                        ? `Your order has been ${item.label.toLowerCase()}.`
                        : `Your order is ${item.label.toLowerCase()}.`}
                      {isError && (
                        <span className="block mt-1 text-sm text-muted-foreground">
                          Please contact support if you need assistance.
                        </span>
                      )}
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
    <Badge 
      className={`py-1 px-3 ${
        statusColors[status] || "bg-gray-500"
      } ${
        (status === 'rejected' || status === 'cancelled') ? 'hover:bg-red-700' : ''
      }`}
    >
      {statusLabels[status] || status}
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
                  <img
                    src={item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={item.title}
                    className="h-16 w-16 rounded-md object-cover"
                  />
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