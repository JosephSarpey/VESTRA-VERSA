import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  ChevronLeftIcon,
  ChevronRightIcon,
  Footprints,
  LoaderPinwheel,
  ShirtIcon,
  Venus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Footer from "@/components/shopping-view/footer";
import logo from "../../assets/vv_logo.jpg";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Venus },
  { id: "bags", label: "Bags", icon: BriefcaseBusiness },
  { id: "footwear", label: "Footwear", icon: Footprints },
  { id: "preorder", label: "PreOrder", icon: LoaderPinwheel },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success(data?.payload?.message);
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (featureImageList.length + 1)); // +1 for text slide
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Slideshow Banner */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {[...featureImageList, { type: "textSlide" }].map((slide, index) =>
          slide.type === "textSlide" ? (
            <div
              key="text-slide"
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity transform duration-1000 ${index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
                }`}
            >
              {/* Gradient Background with soft gold touch */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a1e0f] to-[#0d0d0d] opacity-95 z-0" />
              {/* Optional overlay glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent via-30% to-[#d4af3740] z-10 mix-blend-overlay" />
              <div className="z-20 px-4 text-center text-white">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#B8860B] to-[#FFD700] bg-clip-text text-transparent mb-4 drop-shadow-lg">
                  WELCOME TO VESTRA VERSA
                </h1>
                <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">
                  Style. Simplicity. Delivered.
                </p>

                {/* Logo */}
                <img
                  src={logo}
                  alt="Vestra Versa Logo"
                  className="rounded-full mx-auto mt-6 w-24 md:w-32 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                />

                <Button className="mt-6 px-6 py-3 text-lg bg-[#FFD700] text-black hover:bg-[#f5c518] shadow-md">
                  Start Shopping
                </Button>
              </div>

            </div>
          ) : (
            <img
              key={index}
              src={slide?.image}
              alt={`slide-${index}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity transform duration-3000 ${index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
                }`}
            />
          )
        )}
        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev - 1 + featureImageList.length + 1) %
                (featureImageList.length + 1)
            )
          }
          className="cursor-pointer absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 z-30"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev + 1) % (featureImageList.length + 1)
            )
          }
          className="cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 z-30"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Shop By Category */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 relative inline-block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-indigo-500 after:rounded-full">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer hover:shadow-xl hover:scale-105 transform transition-all duration-300 bg-white rounded-xl"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="w-12 h-12 mb-3 text-indigo-500" />
                  <span className="font-semibold text-gray-800">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 relative inline-block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-indigo-500 after:rounded-full">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {productList?.slice(0, 4).map((productItem) => (
              <ShoppingProductTile
                key={productItem.id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default ShoppingHome;
