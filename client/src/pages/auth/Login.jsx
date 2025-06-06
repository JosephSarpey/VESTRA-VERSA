import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BiLogIn } from "react-icons/bi";

const initialState = {
  email: '',
  password: '',
}

function AuthLogin() {

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault()

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(
           data?.payload?.message,
        );
      } else{
        toast.error('Email and password are required'
        );
      }
    })
  }

  return <div className="mx-auto w-full max-w-md space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Login to Your Account
      </h1>
      <p mt-2>Don't have an account?
      <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/register'>Register Now</Link>
      </p>
    </div>
    <CommonForm 
  formControls={loginFormControls}
  formData={formData}
  buttonText={
    <span className="flex items-center gap-2">
      <BiLogIn />
      LogIn
    </span>
  }
  setFormData={setFormData}
  onSubmit={onSubmit}
/>
  </div>
}

export default AuthLogin;
