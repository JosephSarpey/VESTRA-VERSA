import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { PlusCircle } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  sizes: [],
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setuploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productsList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  // Auto-calculate salePrice as 20% off price when adding a product
  useEffect(() => {
    if (currentEditedId === null) {
      const priceNum = parseFloat(formData.price);
      if (!isNaN(priceNum) && priceNum > 0) {
        setFormData((prev) => ({
          ...prev,
          salePrice: (priceNum * 0.8).toFixed(2),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          salePrice: "",
        }));
      }
    }
    
  }, [formData.price, currentEditedId]);

  function onSubmit(event) {
    event.preventDefault();
  
    const productData = {
      ...formData,
      sizes: formData.sizes || [], // Ensure sizes is always an array
    };
  
    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: productData, // Use the updated productData
        })
      ).then((data) => {
        if (data?.payload.success) {
          dispatch(fetchAllProducts());
          toast.success(data?.payload?.message);
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...productData, // Use the updated productData
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast.success(data?.payload?.message);
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message);
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(productsList, uploadedImageUrl, "productsList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => setOpenCreateProductsDialog(true)}
        ><PlusCircle/>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productsList && productsList.length > 0
          ? productsList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto max-w-md w-full bg-white p-0"
        >
          <div className="h-full flex flex-col p-6">
            <SheetHeader>
              <SheetTitle className="cursor-pointer text-xl font-semibold">
                {currentEditedId !== null ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setuploadedImageUrl={setuploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
            <div className="mt-6 flex-1">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <CommonForm
                  onSubmit={onSubmit}
                  formData={formData}
                  setFormData={setFormData}
                  buttonText={currentEditedId !== null ? "Edit" : "Add"}
                  formControls={addProductFormElements}
                  isBtnDisabled={!isFormValid()}
                  className="flex flex-col gap-4"
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;