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
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
  isLoading = false,
}) {
  const { user } = useSelector((state) => state.auth);
  const [added, setAdded] = useState(false);
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock < 10;
  const isOnSale = product?.salePrice > 0;
  const isLoggedIn = !!user?.id;
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (!isOutOfStock) {
      if (!isLoggedIn) {
        // Redirect to login with the current path to return after login
        navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
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
              {product?.sizes?.length > 0 && (
                <div className="mb-1">
                  <span className="text-sm font-medium text-gray-700">Available Sizes: </span>
                  <span className="text-sm text-gray-600">
                     {product.sizes.map(size => size).join(', ')}
                  </span>
                </div>
              )}
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
            className={`cursor-pointer w-full flex items-center justify-center gap-2 text-white font-semibold py-2 rounded-lg transition-all duration-300 ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 hover:shadow-lg"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;