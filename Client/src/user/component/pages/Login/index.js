import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted');
  };

  return (
    <div className="container">
      <div className="form-box Login active-form">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <p>or Login with social platforms</p>
          <div className="social-icons">
            <a href=""><i className="fa-brands fa-google"></i></a>
            <a href=""><i className="fa-brands fa-facebook"></i></a>
            <a href=""><i className="fa-brands fa-github"></i></a>
            <a href=""><i className="fa-brands fa-linkedin"></i></a>
          </div>
          <div className="switch-form">
            <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;