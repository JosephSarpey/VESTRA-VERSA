import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled
}) {
  function renderInputsByComponentType(getConrtrolItem) {
    let element = null;
    const value = formData[getConrtrolItem.name] || "";

    switch (getConrtrolItem.componentType) {
      case "input":
        element = (
          <Input
            name={getConrtrolItem.name}
            placeholder={getConrtrolItem.placeholder}
            id={getConrtrolItem.name}
            type={getConrtrolItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getConrtrolItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getConrtrolItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getConrtrolItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getConrtrolItem.options && getConrtrolItem.options.length > 0
                ? getConrtrolItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getConrtrolItem.name}
            placeholder={getConrtrolItem.placeholder}
            id={getConrtrolItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getConrtrolItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getConrtrolItem.name}
            placeholder={getConrtrolItem.placeholder}
            id={getConrtrolItem.name}
            type={getConrtrolItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getConrtrolItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
