import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PayPalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
  
      if (!orderId) {
        console.error("No order ID found in session storage");
        window.location.href = "/shop/checkout?error=missing_order";
        return;
      }
  
      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/payment-success";
          } else {
            console.error("Payment capture failed:", data?.payload?.message);
            window.location.href = `/shop/checkout?error=payment_failed&paymentId=${paymentId}`;
          }
        })
        .catch((error) => {
          console.error("Payment capture error:", error);
          window.location.href = `/shop/checkout?error=payment_error&paymentId=${paymentId}`;
        });
    } else {
      window.location.href = "/shop/checkout?error=invalid_payment";
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md p-6 shadow-md rounded-2xl text-center">
        <CardHeader className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <CardTitle className="text-xl font-medium text-gray-800">
            Processing your payment...
          </CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-500 mt-2">
          Please do not close this page or refresh while we complete your transaction.
        </p>
      </Card>
    </div>
  );
}

export default PayPalReturnPage;
