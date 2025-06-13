import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiUserPlus } from "react-icons/fi";
import Loading from "@/components/common/Loading";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Username, email, and password are required to register.");
      return;
    }

    setLoading(true);
    dispatch(registerUser(formData)).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/activate", { state: { email: formData.email } })
      } else {
        toast.error(data?.payload?.message || "Registration failed");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Create New Account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?
          <Link
            className="font-medium ml-2 text-[#FFD700] hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      {loading ? (
        <Loading message="Creating your account..." />
      ) : (
        <>
          <CommonForm
            formControls={registerFormControls}
            formData={formData}
            buttonText={
              <span className="flex items-center gap-2">
                <FiUserPlus />
                Create Account
              </span>
            }
            setFormData={setFormData}
            onSubmit={onSubmit}
          />

          <p className="text-center text-sm text-gray-600 mt-6">
            Need help?{" "}
            <Link to="/shop/contact" className="text-[#FFD700] hover:underline">
              Contact Support
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthRegister;
