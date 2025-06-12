/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import img from "../../assets/account2.jpg";
import Address from "./address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { BiLogoPaypal } from "react-icons/bi";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const itemsArray = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];

  const subtotal = itemsArray.reduce(
    (sum, item) =>
      sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );

  const shippingFee = subtotal > 0 ? 5.0 : 0; // flat shipping
  const tax = subtotal * 0.05; // 5% tax
  const total = (subtotal + shippingFee + tax).toFixed(2);

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  const handleInitiatePaypalPayment = () => {
    if (itemsArray.length === 0) {
      toast.error("Your cart is empty! Please add item(s) to proceed.");
      return;
    }

    if (!currentSelectedAddress) {
      toast.error("Please select an address to proceed.");
      return;
    }

    const orderData = {
  userId: user?.id,
  userName: user?.userName, 
  cartId: cartItems?._id,
  cartItems: cartItems.items.map((item) => ({
    productId: item?.productId,
    title: item?.title,
    image: item?.image,
    price: item?.salePrice > 0 ? item?.salePrice : item?.price,
    quantity: item?.quantity,
  })),
  addressInfo: {
    addressId: currentSelectedAddress?._id,
    country: currentSelectedAddress?.country,
    address: currentSelectedAddress?.address,
    city: currentSelectedAddress?.city,
    pincode: currentSelectedAddress?.pincode,
    phone: currentSelectedAddress?.phone,
    notes: currentSelectedAddress?.notes,
  },
  orderStatus: "pending",
  paymentMethod: "paypal",
  paymentStatus: "pending",
  totalAmount: total,
  orderDate: new Date(),
  orderUpdateDate: new Date(),
  paymentId: "",
  payerId: "",

  // Add these fields here to send tax and shipping info with the order:
  taxAmount: tax,         // taxAmount as a number, e.g. 5.00
  shippingFee: shippingFee,     // shippingFee as a number, e.g. 3.99
};


    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (!data?.payload?.success) {
        setIsPaymentStart(false);
        toast.error("Failed to initiate order. Please try again.");
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen font-sans text-gray-800">
      {/* Header Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-b-3xl shadow-lg">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
          alt="Checkout Banner"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-3xl md:text-5xl font-bold">
          Checkout
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 px-4 sm:px-10 py-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl">
        {/* Address Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Shipping Address</h2>
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />

          {currentSelectedAddress && (
            <div className="text-green-600 font-medium flex items-center gap-2 text-sm mt-2">
              <span className="bg-green-100 px-3 py-1 rounded-full">✅ Address Selected</span>
              <span>({currentSelectedAddress.city}, {currentSelectedAddress.country})</span>
            </div>
          )}
        </div>

        {/* Cart + Summary */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Your Cart</h2>

          <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2">
            {cartItems?.items?.length > 0 ? (
              cartItems.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <UserCartItemsContent cartItem={item} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic">No items in cart</p>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 border shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping Fee</span>
                <span>${shippingFee.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </li>
              <li className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total}</span>
              </li>
            </ul>
          </div>

          {/* PayPal Button */}
          <Button
            onClick={handleInitiatePaypalPayment}
            disabled={isPaymentStart}
            className="mt-4 w-full py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex justify-center items-center gap-3"
          >
            {isPaymentStart ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing...
              </>
            ) : (
              <>
                <BiLogoPaypal className="text-2xl" />
                Pay with PayPal
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
