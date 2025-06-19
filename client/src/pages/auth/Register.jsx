import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiUserPlus, FiEye, FiEyeOff } from "react-icons/fi";
import Loading from "@/components/common/Loading";
import { getPasswordStrength, getPasswordStrengthText, getPasswordStrengthColor } from "@/utils/passwordStrength";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  function onSubmit(event) {
    event.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Username, email, and password are required to register.");
      return;
    }

    // Check if password is strong enough (at least 'Fair' strength)
    if (passwordStrength < 2) {
      toast.error("Please choose a stronger password.");
      return;
    }

    setLoading(true);
    dispatch(registerUser(formData)).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/activate", { state: { email: formData.email } });
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
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-[#FFD700] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {loading ? (
        <Loading message="Creating your account..." />
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {registerFormControls.map((control) => (
            <div key={control.name} className="space-y-1">
              <label htmlFor={control.name} className="block text-sm font-medium text-gray-700">
                {control.label}
              </label>
              <div className="relative">
                <input
                  id={control.name}
                  name={control.name}
                  type={control.name === 'password' ? (showPassword ? 'text' : 'password') : control.type}
                  placeholder={control.placeholder}
                  value={formData[control.name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
                {control.name === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
              
              {control.name === 'password' && formData.password && (
                <div className="mt-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Password Strength: {getPasswordStrengthText(passwordStrength)}</span>
                    <span>{formData.password.length}/8+ characters</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <p>Use at least 8 characters with a mix of letters, numbers & symbols</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <button
            type="submit"
            className="w-full bg-black text-[#FFD700] py-2 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            <FiUserPlus className="h-5 w-5" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="font-medium text-amber-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="font-medium text-amber-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default AuthRegister;
