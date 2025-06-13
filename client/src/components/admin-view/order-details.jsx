import { useState, useEffect } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@/store/admin/order-slice";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const initialFormData = {
  status: '',
}

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  // Set initial form data when order details change
  useEffect(() => {
    if (orderDetails?.orderStatus) {
      setFormData({ status: orderDetails.orderStatus });
    }
  }, [orderDetails]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    
    if (status === orderDetails?.orderStatus) {
      toast.info("Status is already set to " + status);
      return;
    }

    dispatch(updateOrderStatus({ 
      id: orderDetails?._id, 
      orderStatus: status 
    }));
  }

  return (
    <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-background z-10">
          <h2 className="text-xl font-semibold">Order Details</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium text-right break-all">{orderDetails?._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>${orderDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="capitalize">{orderDetails?.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="capitalize">{orderDetails?.paymentStatus || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Status:</span>
                    <Badge
                      className={`py-1 px-3 ${
                        orderDetails?.orderStatus === "delivered"
                          ? "bg-green-500"
                          : orderDetails?.orderStatus === "cancelled"
                          ? "bg-red-600"
                          : orderDetails?.orderStatus === "shipped"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    >
                      {orderDetails?.orderStatus || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-2">
                <h3 className="font-medium">Shipping Information</h3>
                <div className="bg-muted/50 p-4 rounded-md text-sm space-y-1">
                  <div className="font-medium">{orderDetails?.userName || 'N/A'}</div>
                  <div>{orderDetails?.addressInfo?.address || 'N/A'}</div>
                  <div>
                    {orderDetails?.addressInfo?.city || ''} {orderDetails?.addressInfo?.pincode ? `, ${orderDetails.addressInfo.pincode}` : ''}
                  </div>
                  <div>{orderDetails?.addressInfo?.country || 'N/A'}</div>
                  <div>Phone: {orderDetails?.addressInfo?.phone || 'N/A'}</div>
                  {orderDetails?.addressInfo?.notes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="font-medium">Notes:</p>
                      <p className="text-muted-foreground">{orderDetails.addressInfo.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-medium">Order Items ({orderDetails?.cartItems?.length || 0})</h3>
              <div className="border rounded-md divide-y">
                {orderDetails?.cartItems?.map((item, index) => (
                  <div key={index} className="p-3 grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-2 truncate">{item.title}</div>
                    <div className="text-center">Qty: {item.quantity}</div>
                    <div className="text-right font-medium">${parseFloat(item.price).toFixed(2)}</div>
                  </div>
                ))}
                <div className="p-3 border-t font-medium text-right">
                  Total: ${orderDetails?.totalAmount?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Form */}
        <div className="border-t p-4 bg-muted/10">
          <CommonForm
            formControls={[
              {
                label: "Update Status",
                name: "status",
                componentType: "select",
                placeholder: "Select status",
                options: STATUS_OPTIONS,
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Status"
            onSubmit={handleUpdateStatus}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
            buttonClass="md:col-span-1"
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
