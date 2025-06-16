import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();


  const handleLogin = async () => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true); // Start loading
    setMessage(''); // Clear any previous messages

    try {
      const response = await axios.post(
        'http://localhost:8000/users/login',
        new URLSearchParams({
          username: username,
          password: password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Store the token and user info
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', response.data.username);

      setMessage('Login successful!');

      // Redirect to the profile page after a brief delay to show a success message
      setTimeout(() => {
        navigate('/profile');
      }, 500);

    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setMessage(`Error: ${detail[0].msg} → ${detail[0].loc?.join('.')}`);
      } else {
        setMessage(`Error: ${detail || 'Login failed.'}`);
      }
    } finally {
      setIsLoading(false); // End loading regardless of success/failure
    }
  };




  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Username Input */}
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Login Button */}
      <button onClick={handleLogin}>Login</button>

      {/* Feedback Message */}
      {message && (
        <p
          className={message.includes('success') ? 'success' : 'error'}
          style={{
            color: message.includes('success') ? '#10b981' : '#f87171',
            marginTop: '10px',
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default LoginForm;
