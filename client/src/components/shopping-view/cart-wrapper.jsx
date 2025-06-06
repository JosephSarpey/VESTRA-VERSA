import { CreditCard, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  // Always use cartItems.items if cartItems is an object
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

  return (
    <SheetContent className="sm:max-w-md p-6 space-y-6">
      <SheetHeader>
        <SheetTitle className="text-xl font-semibold text-gray-800">
          My Cart
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
        {itemsArray && itemsArray.length > 0 ? (
          itemsArray.map((item, index) => (
            <UserCartItemsContent key={index} cartItem={item} />
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-medium text-gray-800">
          <span>Total</span>
          <span>${total}</span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full mt-6 text-white bg-black hover:bg-gray-800 transition duration-300"
        >
          <Wallet className="w-4 h-4" />
          Proceed To Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
