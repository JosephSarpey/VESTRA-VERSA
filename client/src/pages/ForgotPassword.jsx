/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { MailIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Check your email for a reset link.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">📧 Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email address and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="yourname@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && (
            <p className="text-center text-sm text-blue-700 mt-2">{message}</p>
          )}
        </form>
        <div className="text-center text-sm text-gray-600 mt-6">
          <Link to="/auth/login" className="underline hover:text-indigo-600">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
