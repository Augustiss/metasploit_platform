import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../styles/AuthPages.css';
import { Link } from 'react-router-dom';


function Register() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an Account</h2>
        <RegisterForm />
        <p className="auth-hint">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
