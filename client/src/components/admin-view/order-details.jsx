import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice";
import { toast } from "sonner";

const initialFormData = {
  status: ''
}

function AdminOrderDetailsView({ orderDetails }) {

  const [formData, setFormData] = useState(initialFormData)
  const dispatch = useDispatch();

  function handlleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;


    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })).then(data => {

      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id))
        dispatch(getAllOrdersForAdmin(orderDetails?._id))
        setFormData(initialFormData)
        toast.success(data?.payload?.message)
      }
    })
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID:</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date(UTC):</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Amount:</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method:</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status:</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status:</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${orderDetails?.orderStatus === "delivered"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected" || orderDetails?.orderStatus === "cancelled"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "processing"
                      ? "bg-blue-500"
                      : orderDetails?.orderStatus === "shipped"
                        ? "bg-purple-500"
                        : orderDetails?.orderStatus === "confirmed"
                          ? "bg-yellow-500"
                          : orderDetails?.orderStatus === "cancelled"
                            ? "bg-red-600"
                            : "bg-gray-500"
                  }`}
              >
                {orderDetails?.orderStatus === "confirmed" ? "Order Placed" : orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details:</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                  <li className="flex items-center justify-between">
                    <span>Title: {item.title}</span>
                    <span>Size: {item.size || "N/A"}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ${item.price}</span>
                  </li>
                ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info:</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{orderDetails?.userName}</span>
              <span>{orderDetails?.addressInfo?.country}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "confirmed", label: "Confirmed" },
                  { id: "processing", label: "Processing" },
                  { id: "shipped", label: "Shipped" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                  { id: "cancelled", label: "Cancelled" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={'Update Order Status'}
            onSubmit={handlleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
