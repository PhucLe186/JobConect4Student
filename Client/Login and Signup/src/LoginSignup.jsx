import React, { useState, useEffect } from 'react';
import './style.scss';

const LoginSignup = () => {
<<<<<<< HEAD
    const [isActive, setIsActive] = useState(false);
    const [genderSelected, setGenderSelected] = useState(false);
    const [showRoleSelection, setShowRoleSelection] = useState(true);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        if (mode === 'signup') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, []);

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

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setShowRoleSelection(false);
    };

    if (showRoleSelection) {
        return (
            <div className="role-selection-container">
                <div className="role-selection-box">
                    <button className="back-btn" onClick={() => window.history.back()}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1>Choose Your Role</h1>
                    <p>Please select your role to continue</p>
                    <div className="role-options">
                        <div className="role-card" onClick={() => handleRoleSelect('student')}>
                            <i className="fa-solid fa-graduation-cap"></i>
                            <h3>Student</h3>
                            <p>Looking for jobs and internships</p>
                        </div>
                        <div className="role-card" onClick={() => handleRoleSelect('employer')}>
                            <i className="fa-solid fa-building"></i>
                            <h3>Employer</h3>
                            <p>Hiring talented individuals</p>
                        </div>
                        <div className="role-card" onClick={() => handleRoleSelect('admin')}>
                            <i className="fa-solid fa-user-shield"></i>
                            <h3>Admin</h3>
                            <p>Managing the platform</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <div className="input-row">
                        <div className="input-box half-width">
                            <input type="date" placeholder="Date of Birth" required />
                            <i className="fa-solid fa-calendar"></i>
                        </div>
                        <div className="input-box half-width">
                            <select required onChange={(e) => setGenderSelected(e.target.value !== '')}>
                                <option value="">Select Gender</option>
                                <option value="male">♂️ Male</option>
                                <option value="female">♀️ Female</option>
                                <option value="other">⚧️ Other</option>
                            </select>
                            {!genderSelected && <i className="fa-solid fa-venus-mars"></i>}
                        </div>
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
=======
  const [isActive, setIsActive] = useState(false);
  const [genderSelected, setGenderSelected] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'signup') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

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

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  if (showRoleSelection) {
    return (
      <div className="role-selection-container">
        <div className="role-selection-box">
          <button className="back-btn" onClick={() => window.history.back()}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1>Choose Your Role</h1>
          <p>Please select your role to continue</p>
          <div className="role-options">
            <div className="role-card" onClick={() => handleRoleSelect('student')}>
              <i className="fa-solid fa-graduation-cap"></i>
              <h3>Student</h3>
              <p>Looking for jobs and internships</p>
            </div>
            <div className="role-card" onClick={() => handleRoleSelect('employer')}>
              <i className="fa-solid fa-building"></i>
              <h3>Employer</h3>
              <p>Hiring talented individuals</p>
            </div>
            <div className="role-card" onClick={() => handleRoleSelect('admin')}>
              <i className="fa-solid fa-user-shield"></i>
              <h3>Admin</h3>
              <p>Managing the platform</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <button type="submit" className="btn">Login</button>
          <p>or Login with social platforms</p>
          <div className="social-icons">
            <a href=""><i className="fa-brands fa-google"></i></a>
            <a href=""><i className="fa-brands fa-facebook"></i></a>
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
          <div className="input-row">
            <div className="input-box half-width">
              <input type="date" placeholder="Date of Birth" required />
              <i className="fa-solid fa-calendar"></i>
            </div>
            <div className="input-box half-width">
              <select required onChange={(e) => setGenderSelected(e.target.value !== '')}>
                <option value="">Select Gender</option>
                <option value="male">♂️ Male</option>
                <option value="female">♀️ Female</option>
                <option value="other">⚧️ Other</option>
              </select>
              {!genderSelected && <i className="fa-solid fa-venus-mars"></i>}
            </div>
          </div>
          <button type="submit" className="btn">Register</button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a href=""><i className="fa-brands fa-google"></i></a>
            <a href=""><i className="fa-brands fa-facebook"></i></a>
          </div>
        </form>
      </div>

      <div className="Toggle-box"></div>

      <div className="Toggle-panel Toggle-left">
        <h1>Hello, Welcome!</h1>
        <p>Don't have an account? Sign up now!</p>
        <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
      </div>

      <div className="Toggle-panel Toggle-right">
        <h1>Welcome Back!</h1>
        <p>Already have an Account?</p>
        <button className="btn Login-btn" onClick={handleLoginClick}>Login</button>
      </div>
    </div>
  );
};

export default LoginSignup;
>>>>>>> 48553a4edcbeacb90fdc51c767579f2b7ef8f5c2
