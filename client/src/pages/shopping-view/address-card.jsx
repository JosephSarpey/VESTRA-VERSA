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
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer relative border ${
        isSelected
          ? "border-red-900 border-4 bg-red-50 shadow-lg"
          : "border-black"
      } transition-all duration-200`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full select-none flex items-center gap-1 shadow">
          <span>✅</span> Address Selected
        </div>
      )}

      <CardContent className="grid p-4 gap-4">
        <Label>Country : {addressInfo?.country}</Label>
        <Label>Address : {addressInfo?.address}</Label>
        <Label>City : {addressInfo?.city}</Label>
        <Label>Pincode : {addressInfo?.pincode}</Label>
        <Label>Phone : {addressInfo?.phone}</Label>
        <Label>Notes : {addressInfo?.notes}</Label>
      </CardContent>

      <CardFooter className="p-3 flex justify-between">
        <Button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click event
            handleEditAddress(addressInfo);
          }}
          className="cursor-pointer"
        >
          <PencilIcon />
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click event
            handleDeleteAddress(addressInfo);
          }}
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
