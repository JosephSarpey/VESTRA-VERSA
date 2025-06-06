import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { categoryOptionsMap } from "@/config";
import { ShoppingCart } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
              On Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {product?.title}
          </h2>
          <p className="text-sm text-gray-500">
            {categoryOptionsMap[product?.category]}
          </p>
          <div className="flex items-center space-x-2">
            <span
              className={`text-md ${
                product?.salePrice > 0
                  ? "line-through text-red-500"
                  : "text-gray-800"
              } font-medium`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-xl font-semibold text-green-600">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="cursor-not-allowed opacity-60 w-full bg-primary hover:bg-primary/90 text-white font-medium tracking-wide rounded-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
            <ShoppingCart className="w-4 h-4" />
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
            className="cursor-pointer w-full bg-primary hover:bg-primary/90 text-white font-medium tracking-wide rounded-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
