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
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? "border-2 border-red-600 bg-red-50" 
          : "border border-gray-200 hover:border-gray-300"
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-3 py-1 rounded-bl-md font-medium">
          Selected
        </div>
      )}

      <CardContent className="p-5 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{addressInfo?.name || 'No Name'}</span>
            {addressInfo?.isDefault && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{addressInfo?.address}</p>
          <p className="text-sm text-gray-600">
            {[addressInfo?.city, addressInfo?.state, addressInfo?.pincode].filter(Boolean).join(', ')}
          </p>
          <p className="text-sm text-gray-600">{addressInfo?.country}</p>
          <p className="text-sm text-gray-600">Phone: {addressInfo?.phone}</p>
          {addressInfo?.notes && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Note:</span> {addressInfo.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="h-8 px-3 text-gray-700 hover:bg-gray-100"
        >
          <PencilIcon className="h-4 w-4 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
