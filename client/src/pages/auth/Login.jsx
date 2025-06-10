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
        toast.error(data?.payload?.message || "Login failed");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Login to Your Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Don’t have an account?
            <Link className="ml-2 text-[#FFD700] font-medium hover:underline" to="/auth/register">
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

            <p className="text-right text-sm">
              <Link to="/forgot-password" className="text-[#FFD700] hover:underline">
                Forgot Password?
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthLogin;
