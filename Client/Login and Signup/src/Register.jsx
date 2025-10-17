import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register form submitted');
  };

  return (
    <div className="container">
      <div className="form-box Register active-form">
        <form onSubmit={handleSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <i className="fa-solid fa-lock"></i>
          </div>
          <button type="submit" className="btn">Register</button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a href=""><i className="fa-brands fa-google"></i></a>
            <a href=""><i className="fa-brands fa-facebook"></i></a>
            <a href=""><i className="fa-brands fa-github"></i></a>
            <a href=""><i className="fa-brands fa-linkedin"></i></a>
          </div>
          <div className="switch-form">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;