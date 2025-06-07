/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

let debounceTimeout;

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceTimeout);

    if (keyword.trim().length >= 3) {
      debounceTimeout = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500);
    } else {
      dispatch(resetSearchResults());
      setSearchParams(new URLSearchParams(`?keyword=`));
    }

    return () => clearTimeout(debounceTimeout);
  }, [keyword]);

  function handleAddToCart(productId, totalStock) {
    const existingCartItems = cartItems.items || [];
    const foundItem = existingCartItems.find((item) => item.productId === productId);

    if (foundItem && foundItem.quantity + 1 > totalStock) {
      toast.error(`Only ${foundItem.quantity} quantities can be added for this item`);
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 }))
      .then((res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success(res.payload.message);
        }
      });
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Search Box */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Products..."
            className="pl-12 pr-4 py-6 text-lg rounded-2xl shadow-md focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* No Results */}
      {!searchResults.length && keyword.length >= 3 && (
        <div className="text-center text-2xl font-medium text-gray-500 mt-8">
          No results found
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.map((product) => (
          <ShoppingProductTile
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
