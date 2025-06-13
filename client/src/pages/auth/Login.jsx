import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BiLogIn } from "react-icons/bi";
import Loading from "@/components/common/Loading";

const initialState = {
  email: '',
  password: '',
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    dispatch(loginUser(formData)).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message || 'Login failed');
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Login to Your Account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-[#FFD700] hover:underline"
            to="/auth/register"
          >
            Register Now
          </Link>
        </p>
      </div>

      {loading ? (
        <Loading message="Logging you in..." />
      ) : (
        <>
          <CommonForm
            formControls={loginFormControls}
            formData={formData}
            buttonText={
              <span className="flex items-center gap-2">
                <BiLogIn />
                Log In
              </span>
            }
            setFormData={setFormData}
            onSubmit={onSubmit}
          />

          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <Link to="/forgot-password" className="hover:underline text-[#FFD700]">
              Forgot Password?
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthLogin;
