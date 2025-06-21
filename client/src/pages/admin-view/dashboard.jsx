import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setuploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setuploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  return (
    <div>
      <h2>Admin features</h2>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setuploadedImageUrl={setuploadedImageUrl}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
      />
      <Button onClick={handleUploadFeatureImage} disabled={!uploadedImageUrl}>
        Upload Feature Image
      </Button>
      <div>
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((feature) => (
            <div key={feature._id} style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
              <img src={feature.image} alt="feature" style={{ width: 100, height: 100, objectFit: "cover", marginRight: 10 }} />
              <Button variant="destructive" onClick={() => handleDeleteFeatureImage(feature._id)}>
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p>No features found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;