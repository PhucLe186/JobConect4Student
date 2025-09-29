import React, { useState } from 'react';
import './style.scss';

const LoginSignup = () => {
    const [isActive, setIsActive] = useState(false);

    const handleRegisterClick = () => {
        setIsActive(true);
    };

    const handleLoginClick = () => {
        setIsActive(false);
    };

    const handleSubmit = (e, type) => {
        e.preventDefault();
        console.log(`${type} form submitted`);
    };

    return (
        <div className={`container ${isActive ? 'active' : ''}`}>
            <div className="form-box Login">
                <form onSubmit={(e) => handleSubmit(e, 'Login')}>
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
                    <button type="submit" className="btn">
                        Login
                    </button>
                    <p>or Login with social platforms</p>
                    <div className="social-icons">
                        <a href="">
                            <i className="fa-brands fa-google"></i>
                        </a>
                        <a href="">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="">
                            <i className="fa-brands fa-github"></i>
                        </a>
                        <a href="">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </div>
                </form>
            </div>

            <div className="form-box Register">
                <form onSubmit={(e) => handleSubmit(e, 'Register')}>
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
                    <button type="submit" className="btn">
                        Register
                    </button>
                    <p>or register with social platforms</p>
                    <div className="social-icons">
                        <a href="">
                            <i className="fa-brands fa-google"></i>
                        </a>
                        <a href="">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="">
                            <i className="fa-brands fa-github"></i>
                        </a>
                        <a href="">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </div>
                </form>
            </div>

            <div className="Toggle-box"></div>

            <div className="Toggle-panel Toggle-left">
                <h1>Hello, Welcome!</h1>
                <p>Don't have an account? Sign up now!</p>
                <button className="btn register-btn" onClick={handleRegisterClick}>
                    Register
                </button>
            </div>

            <div className="Toggle-panel Toggle-right">
                <h1>Welcome Back!</h1>
                <p>Already have an Account?</p>
                <button className="btn Login-btn" onClick={handleLoginClick}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginSignup;
s;
