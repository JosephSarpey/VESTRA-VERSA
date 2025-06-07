import { useDispatch, useSelector } from "react-redux";
import img from "../../assets/account2.jpg";
import Address from "./address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { BiLogoPaypal } from "react-icons/bi";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();

  const itemsArray = Array.isArray(cartItems)
    ? cartItems
    : cartItems?.items || [];

  const total = itemsArray
    .reduce(
      (sum, item) =>
        sum +
        (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    )
    .toFixed(2);

  function handleInitiatePaypalPayment() {
    if (itemsArray.length === 0) {
      toast.error("Your cart is empty! Please add item(s) to proceed.");
      return;
    }

    if (currentSelectedAddress === null) {
      toast.error("Please select an address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.id,
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
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-b-xl shadow-md">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
          alt="Checkout Banner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 px-4 sm:px-8 py-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
        {/* Address Selector */}
        <div className="space-y-4">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>

        {/* Cart Items & Summary */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
            {cartItems && cartItems.items && cartItems.items.length > 0 ? (
              cartItems.items.map((item, index) => (
                <UserCartItemsContent key={index} cartItem={item} />
              ))
            ) : (
              <p className="text-gray-500 italic">No items in cart</p>
            )}
          </div>

          <div className="flex justify-between items-center text-xl font-semibold text-gray-900 border-t pt-4 mt-2">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <Button
            onClick={handleInitiatePaypalPayment}
            className="mt-6 w-full py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            <span className="flex items-center justify-center gap-2">
              <BiLogoPaypal className="text-2xl" />
              {isPaymentStart ? "Processing..." : "Pay with PayPal"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
