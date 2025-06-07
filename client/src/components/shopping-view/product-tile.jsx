/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { categoryOptionsMap } from "@/config";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { getReviews } from "@/store/shop/review-slice";
import StarRatingComponent from "@/components/common/star-rating";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
  isLoading = false,
}) {
  const [added, setAdded] = useState(false);
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock < 10;
  const isOnSale = product?.salePrice > 0;

  const dispatch = useDispatch();
  const [averageReview, setAverageReview] = useState(0);
  const [hasReviews, setHasReviews] = useState(false);

  const handleCartClick = () => {
    if (!isOutOfStock) {
      handleAddToCart(product?._id, product?.totalStock);
      setAdded(true);
    }
  };

  useEffect(() => {
    let timeout;
    if (added) {
      timeout = setTimeout(() => setAdded(false), 1500);
    }
    return () => clearTimeout(timeout);
  }, [added]);

  useEffect(() => {
    if (product?._id) {
      dispatch(getReviews(product._id)).then((res) => {
        const items = res?.payload || [];
        if (items.length > 0) {
          const avg =
            items.reduce((sum, item) => sum + item.reviewValue, 0) /
            items.length;
          setAverageReview(avg);
          setHasReviews(true);
        } else {
          setAverageReview(0);
          setHasReviews(false);
        }
      });
    }
  }, [dispatch, product?._id]);

  return (
    <Card className="w-full max-w-sm mx-auto border border-gray-100 shadow-md rounded-2xl overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div
        onClick={() => !isLoading && handleGetProductDetails(product?._id)}
        className={cn(
          "cursor-pointer group relative",
          isLoading && "pointer-events-none"
        )}
      >
        <div className="overflow-hidden rounded-t-2xl relative h-[280px] bg-gray-100">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {/* 🔥 Animated Badge */}
          <AnimatePresence>
            {!isLoading && (isOutOfStock || isLowStock || isOnSale) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute top-3 left-3 z-10"
              >
                <Badge
                  className={`text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md ${
                    isOutOfStock
                      ? "bg-red-600"
                      : isLowStock
                      ? "bg-orange-500"
                      : "bg-gradient-to-r from-green-400 to-emerald-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Out Of Stock"
                    : isLowStock
                    ? `Only ${product?.totalStock} left`
                    : "On Sale"}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-4 space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-24 mt-2" />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {product?.title}
              </h3>
              <p className="text-sm text-gray-500">
                {categoryOptionsMap[product?.category]}
              </p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span
                  className={`text-base font-medium ${
                    isOnSale ? "text-gray-400 line-through" : "text-gray-800"
                  }`}
                >
                  ${product?.price}
                </span>
                {isOnSale && (
                  <span className="text-xl font-bold text-green-600">
                    ${product?.salePrice}
                  </span>
                )}
              </div>

              {/* ⭐ Rating Display */}
              <div className="flex items-center gap-1 mt-2">
                {hasReviews ? (
                  <>
                    <StarRatingComponent rating={averageReview} />
                    <span className="text-xs text-muted-foreground">
                      ({averageReview.toFixed(2)})
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    No reviews yet
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded-lg" />
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCartClick}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-2 rounded-lg transition-all duration-300 ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 hover:shadow-lg"
            }`}
          >
            {added ? (
              <>
                <CheckCircle className="w-5 h-5 text-white" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? "Out Of Stock" : "Add to Cart"}
              </>
            )}
          </motion.button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;