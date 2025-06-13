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
    status : ''
}

function AdminOrderDetailsView({orderDetails}) {

    const [formData, setFormData] = useState(initialFormData)
    const dispatch = useDispatch();

    function handlleUpdateStatus(event) {
        event.preventDefault();
        const {status} = formData;


        dispatch(updateOrderStatus({id : orderDetails?._id, orderStatus : status})).then(data=> {
          
          if (data?.payload?.success) {
            dispatch(getOrderDetailsForAdmin(orderDetails?._id))
            dispatch(getAllOrdersForAdmin(orderDetails?._id))
            setFormData(initialFormData)
            toast.success(data?.payload?.message)
          }
        })
    }

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="space-y-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order ID:</p>
            <Label className="text-right break-all">{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Date(UTC):</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Amount:</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Method:</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Status:</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Status:</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500" :
                    orderDetails?.orderStatus === "rejected" ?  "bg-red-600" 
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Order Details:</div>
            <div className="border rounded-md divide-y">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <div key={index} className="p-3 grid grid-cols-3 gap-4 items-center">
                      <span className="truncate">{item.title}</span>
                      <span className="text-center">Qty: {item.quantity}</span>
                      <span className="text-right">${item.price}</span>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Shipping Info:</div>
          <div className="grid gap-1 text-muted-foreground bg-muted/50 p-4 rounded-md">
            <div>{orderDetails?.userName}</div>
            <div>{orderDetails?.addressInfo?.address}</div>
            <div>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</div>
            <div>{orderDetails?.addressInfo?.country}</div>
            <div>Phone: {orderDetails?.addressInfo?.phone}</div>
            {orderDetails?.addressInfo?.notes && (
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium text-foreground">Notes:</p>
                <p className="text-sm">{orderDetails?.addressInfo?.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "In Process", label: "In Process" },
                  { id: "Shipped", label: "Shipped" },
                  { id: "delivered", label: "Delivered" },
                  { id: "confirmed", label: "Confirmed" },
                  { id: "rejected", label: "Rejected" },
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
