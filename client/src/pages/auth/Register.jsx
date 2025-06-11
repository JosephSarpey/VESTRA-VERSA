/* eslint-disable no-unused-vars */
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

  async function onSubmit(event) {
    event.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Username, email, and password are required to register.");
      return;
    }

    setLoading(true);
    try {
      const resultAction = await dispatch(registerUser(formData));
      if (
        registerUser.fulfilled.match(resultAction) &&
        resultAction.payload.success
      ) {
        toast.success("Registration successful! Check your email for the OTP.");
        navigate("/activate", { state: { email: formData.email } });
      } else {
        toast.error(resultAction.payload?.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FiUserPlus className="inline-block" /> Register
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <CommonForm
          controls={registerFormControls}
          formData={formData}
          setFormData={setFormData}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          disabled={loading}
        >
          {loading ? <Loading /> : "Register"}
        </button>
      </form>
      <div className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}

export default AuthRegister;