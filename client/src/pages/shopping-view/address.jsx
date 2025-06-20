/* eslint-disable react-hooks/exhaustive-deps */
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
  name: "",
  country: "",
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

function Address({setCurrentSelectedAddress, selectedId}) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData)
      toast.error('You can add a maximum of 3 addresses')

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast.success(data?.payload.message)
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload.success) {
            dispatch(fetchAllAddresses(user?.id));
            toast.success(data?.payload.message);
            setFormData(initialAddressFormData);
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    const toastId = Math.random().toString(36).substr(2, 9); // unique id for the toast

    toast(
      () => (
        <div>
          <div>Are you sure you want to delete this address? This action cannot be undone!</div>
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
      name: getCurrentAddress?.name,
      country: getCurrentAddress?.country,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      pincode: getCurrentAddress?.pincode,
      phone: getCurrentAddress?.phone,
      notes: getCurrentAddress?.notes,
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  console.log(addressList, "addressList");

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
               selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
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
