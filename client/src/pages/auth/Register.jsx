import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiUserPlus } from "react-icons/fi";


const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
  event.preventDefault();

  // Check for missing fields
  if (!formData.userName || !formData.email || !formData.password) {
    toast.error("Username and email and password are required to register.");
    return;
  }

  dispatch(registerUser(formData)).then((data) => {
    if (data?.payload?.success) {
      toast.success(
         data?.payload?.message,
      );
      navigate("/auth/login");
    } else{
      toast.error(data?.payload?.message
      );
    }
  });
}

  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p mt-2>
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
  formControls={registerFormControls}
  formData={formData}
  buttonText={
    <span className="flex items-center gap-2">
      <FiUserPlus /> {/* Use a more appropriate icon */}
      Create Account
    </span>
  }
  setFormData={setFormData}
  onSubmit={onSubmit}
/>
    </div>
  );
}

export default AuthRegister;
