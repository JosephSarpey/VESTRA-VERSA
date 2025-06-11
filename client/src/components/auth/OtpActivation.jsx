/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function OtpActivation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpCode = otp.join('');
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp: otpCode });
      toast.success(res.data.message || 'Account activated successfully');
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post('/api/auth/resend-otp', { email });
      toast.success('OTP resent!');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8 relative"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Enter the OTP
        </h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          We’ve sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[i] = el)}
                onChange={(e) => handleOtpChange(e.target.value.replace(/\D/, ''), i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 h-12 text-center border border-gray-300 rounded-md text-xl focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-2">
            {timer > 0 ? (
              <p>Resend OTP in <span className="font-medium">{timer}s</span></p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 hover:underline"
              >
                {resending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default OtpActivation;
