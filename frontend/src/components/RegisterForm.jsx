// file: src/components/registerForm.jsx

import React, { useState } from 'react';
import { registerUser } from '../services/api';

function RegisterForm() {
  // State declarations
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Validation regex
  const passwordSafeRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle form submission
  const handleSubmit = async () => {
    // Validate email
    if (!emailRegex.test(email)) {
      setMessage('Error: Please enter a valid email address.');
      return;
    }

    // Validate password strength
    if (!passwordSafeRegex.test(password)) {
      setMessage(
        'Error: Password must be at least 10 characters long and include 1 uppercase letter, 1 number, and 1 special character.'
      );
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match.');
      return;
    }

    // Send registration request
    try {
      const response = await registerUser({
        username,
        email,
        password,
      });

      setMessage(response.detail || 'User registered successfully!');
    } catch (err) {
      const fullDetail = err.response?.data?.detail;
      console.error('🚨 FastAPI validation error:', fullDetail);

      if (Array.isArray(fullDetail)) {
        const { msg, loc } = fullDetail[0];
        setMessage(`Error: ${msg} → ${loc?.join('.')}`);
      } else {
        setMessage(`Error: ${fullDetail || err.message}`);
      }
    }
  };

  // Component rendering
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Username Input */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {email.length > 0 && !emailRegex.test(email) && (
        <p style={{ fontSize: '0.85rem', color: '#f87171' }}>Invalid email format</p>
      )}

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {password.length > 0 && (
        <p
          style={{
            fontSize: '0.85rem',
            color: passwordSafeRegex.test(password) ? '#10b981' : '#f87171',
          }}
        >
          {passwordSafeRegex.test(password)
            ? 'Strong password ✅'
            : 'Password must be 10+ chars, 1 capital, 1 number, 1 special'}
        </p>
      )}

      {/* Confirm Password Input */}
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* Submit Button */}
      <button onClick={handleSubmit}>Create User</button>

      {/* Feedback Message */}
      {message && (
        <p
          style={{
            color: message.includes('Error') ? '#f87171' : '#10b981',
            marginTop: '1rem',
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default RegisterForm;