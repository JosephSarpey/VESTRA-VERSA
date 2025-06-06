import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PencilIcon, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id ? "border-red-900 border-[4px]" : "border-black"
      }`}
    >
      <CardContent
        className={`${
          selectedId === addressInfo?._id ? "border-black" : ""
        }  grid p-4 gap-4`}
      >
        <Label>Country : {addressInfo?.country}</Label>
        <Label>Address : {addressInfo?.address}</Label>
        <Label>City :{addressInfo?.city}</Label>
        <Label>Pincode : {addressInfo?.pincode}</Label>
        <Label>Phone : {addressInfo?.phone}</Label>
        <Label>Notes : {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button
          onClick={() => handleEditAddress(addressInfo)}
          className="cursor-pointer"
        >
          <PencilIcon />
          Edit
        </Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          className="cursor-pointer"
        >
          <Trash2 />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
