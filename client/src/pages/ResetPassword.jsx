/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthText = ["Weak", "Fair", "Good", "Strong", "Very Strong"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
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

          {/* Strength meter */}
          {password && (
            <div className="text-sm font-medium text-center text-gray-700">
              Password Strength: <span className={
                strength <= 1 ? "text-red-500"
                : strength === 2 ? "text-yellow-500"
                : strength === 3 ? "text-blue-500"
                : "text-green-600"
              }>{strengthText}</span>
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
            <p className="text-center text-sm text-blue-700 mt-2">{message}</p>
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
