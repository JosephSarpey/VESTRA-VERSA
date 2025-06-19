/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";
import { getPasswordStrength, getPasswordStrengthText, getPasswordStrengthColor } from "@/utils/passwordStrength";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthText = getPasswordStrengthText(strength);
  const strengthColor = getPasswordStrengthColor(strength);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if password is strong enough (at least 'Fair' strength)
    if (strength < 2) {
      setMessage("Please choose a stronger password");
      return;
    }
    
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setMessage(data.message || "Password has been reset.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">🔐 Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Choose a strong new password for your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </div>
          </div>

          {/* Password strength meter */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Password Strength: <span className={`font-medium ${strengthColor.replace('bg', 'text')}`}>{strengthText}</span></span>
                <span className="text-xs text-gray-500">{password.length}/8+ characters</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${strengthColor}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Use at least 8 characters with a mix of letters, numbers & symbols
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {message && (
            <p className={`text-center text-sm mt-2 ${
              message.includes("wrong") || message.includes("stronger") 
                ? "text-red-600" 
                : "text-blue-700"
            }`}>
              {message}
            </p>
          )}
        </form>
        <div className="text-center text-sm text-gray-600 mt-6">
          <Link to="/auth/login" className="underline hover:text-indigo-600">Return to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
