
import CommonForm from "@/components/common/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addressFormControls } from "@/config";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AddressCard from "./address-card";

const initialAddressFormData = {
  country: "",
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("You can add a maximum of 3 addresses");
      return;
    }

    const action = currentEditedId !== null
      ? editaAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      : addNewAddress({
          ...formData,
          userId: user?.id,
        });

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        setFormData(initialAddressFormData);
        setCurrentEditedId(null);
        toast.success(data?.payload?.message);
      }
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    const toastId = Math.random().toString(36).substr(2, 9);

    toast(
      () => (
        <div>
          <div>
            Are you sure you want to delete this address? This action cannot be undone!
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
              onClick={() => {
                dispatch(
                  deleteAddress({
                    userId: user?.id,
                    addressId: getCurrentAddress._id,
                  })
                ).then((data) => {
                  if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    toast.success(data?.payload?.message);
                    // Deselect if the deleted address was selected
                    if (selectedId === getCurrentAddress._id && setCurrentSelectedAddress) {
                      setCurrentSelectedAddress(null);
                    }
                  }
                });
                toast.dismiss(toastId);
              }}
            >
              Yes, Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: toastId }
    );
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      country: getCurrentAddress?.country,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      pincode: getCurrentAddress?.pincode,
      phone: getCurrentAddress?.phone,
      notes: getCurrentAddress?.notes,
    });
  }

  function isFormValid() {
    return Object.values(formData).every((value) => value.trim() !== "");
  }

  function handleSelectAddress(address) {
    if (setCurrentSelectedAddress) {
      setCurrentSelectedAddress(address);
    }
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList?.map((singleAddressItem) => (
          <AddressCard
            key={singleAddressItem._id}
            selectedId={selectedId}
            addressInfo={singleAddressItem}
            handleDeleteAddress={handleDeleteAddress}
            handleEditAddress={handleEditAddress}
            setCurrentSelectedAddress={handleSelectAddress}
          />
        ))}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          setFormData={setFormData}
          formData={formData}
          buttonText={
            <span className="flex items-center gap-2">
              {currentEditedId !== null ? <FiEdit2 /> : <FiPlusCircle />}
              {currentEditedId !== null ? "Edit" : "Add"}
            </span>
          }
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;