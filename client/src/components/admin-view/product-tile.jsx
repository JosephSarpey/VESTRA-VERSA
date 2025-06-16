import { PencilLine, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.category}</h2>

          {/* Add this section to display sizes */}
          {product?.sizes?.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium">Sizes: </span>
              <span className="text-sm">
                {product.sizes.map(size => size).join(', ')}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product?.salePrice > 0 ? "line-through text-red-500" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-xl font-bold text-green-600">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            className="cursor-pointer"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          ><PencilLine />
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            className="cursor-pointer"
          > <Trash2 />
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
