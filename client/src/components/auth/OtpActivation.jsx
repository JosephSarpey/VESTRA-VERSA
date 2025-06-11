import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function OtpActivation() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Activation failed.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Activate Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%' }}>Activate</button>
      </form>
      {message && <div style={{ marginTop: 10 }}>{message}</div>}
    </div>
  );
}

export default OtpActivation;