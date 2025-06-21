/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { motion, AnimatePresence } from "framer-motion";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const handleRatingChange = (getRating) => setRating(getRating);

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    if (!user?.id) {
      toast.info("Please login to add items to cart");
      return;
    }

    if (productDetails?.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    let getCartItems = cartItems.items || [];

    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );

    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (getQuantity + 1 > getTotalStock) {
        toast.error(`Only ${getQuantity} quantities can be added for this item`);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        size: selectedSize || null,
      })
    ).then((data) => {
      if (data?.payload.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success(data?.payload?.message);
        setIsAddedToCart(true);
        setTimeout(() => setIsAddedToCart(false), 2000); // Reset after 2s
      }
    });
  };

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  if (!productDetails) return null;

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setIsAddedToCart(false);
    setSelectedSize("");
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast.success(data.payload.message);
      }
    });
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="p-4 sm:p-6 md:p-8 max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold mb-4 sm:hidden break-words">
          {productDetails.title || "Product Details"}
        </DialogTitle>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image Section */}
          <div className="flex-shrink-0 w-full sm:w-1/2 min-w-0">
            {productDetails.image ? (
              <img
                src={productDetails.image}
                alt={productDetails.title || "Product"}
                className="w-full h-auto rounded-lg object-cover aspect-square"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <DialogTitle className="text-2xl font-bold mb-2 hidden sm:block break-words">
              {productDetails.title || "Product Details"}
            </DialogTitle>
            <div className="text-muted-foreground break-words">{productDetails.description}</div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-semibold ${
                productDetails.salePrice > 0 ? 'text-gray-400 line-through' : 'text-primary'
              }`}>
                ${productDetails.price}
              </span>
              {productDetails.salePrice > 0 && (
                <span className="text-2xl font-bold text-green-600">
                  ${productDetails.salePrice}
                </span>
              )}
              <span className="text-sm text-gray-500">
                ({productDetails.totalStock > 0 ? "In Stock" : "Out Of Stock"})
              </span>
            </div>
            {productDetails?.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {productDetails.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        selectedSize === size
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {productDetails?.sizes?.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Available Sizes: </span>
                <span className="text-sm text-gray-600">
                  {productDetails.sizes.map(size => size).join(', ')}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <StarRatingComponent rating={averageReview} />
              <span className="text-sm text-gray-500">
                ({reviews?.length || 0} reviews)
              </span>
            </div>
            <div>
              {productDetails.totalStock === 0 ? (
                <Button className="w-full" disabled>
                  Out Of Stock
                </Button>
              ) : (
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isAddedToCart ? (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Added
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cart"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add To Cart
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              )}
            </div>

            <Separator />

            {/* Reviews */}
            <div className="max-h-[300px] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div className="flex gap-4" key={reviewItem._id}>
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>
                        <p className="text-muted-foreground break-words">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Reviews</h1>
                )}
              </div>
            </div>

            {/* Write Review */}
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;