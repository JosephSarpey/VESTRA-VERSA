import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      const getCartItems = cartItems.items || [];
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );
      const getCurrentProductIndex = productList.findIndex(
        (product) => product._id === getCartItem?.productId
      );
      const getTotalStock = productList[getCurrentProductIndex].totalStock;

      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantities can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload.success) {
        toast.success("Cart item updated");
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload.success) {
        toast.success("Item removed from cart");
      }
    });
  }

  const unitPrice =
    cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const totalPrice = unitPrice * cartItem?.quantity;
  const isDiscounted =
    cartItem?.salePrice > 0 && cartItem?.salePrice < cartItem?.price;

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-full md:w-20 h-40 md:h-20 object-cover rounded-lg"
      />

      <div className="flex flex-col md:flex-row md:justify-between w-full gap-2">
        {/* Title & Quantity Section */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-semibold text-gray-800">
              {cartItem?.title}
            </h3>
            {isDiscounted && (
              <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full font-medium">
                Discount
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            ${unitPrice.toFixed(2)} x {cartItem?.quantity}
            {cartItem?.size && (
              <span className="ml-2 text-xs text-gray-500">
                (Size: {cartItem.size})
              </span>
            )}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-base font-medium px-2">{cartItem?.quantity}</span>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Price & Delete */}
        <div className="flex flex-row justify-between md:flex-col md:items-end">
          <p className="text-lg font-semibold text-gray-900">
            ${totalPrice.toFixed(2)}
          </p>
          <Trash2
            onClick={() => handleCartItemDelete(cartItem)}
            className="cursor-pointer text-gray-500 hover:text-red-500 mt-1"
            size={20}
          />
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
