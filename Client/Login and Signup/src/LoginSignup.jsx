import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const LoginSignup = () => {
  return (
    <div className="container">
      <div className="form-box">
        <div className="switch-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;