import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
=======
>>>>>>> 48553a4edcbeacb90fdc51c767579f2b7ef8f5c2
import LoginSignup from './LoginSignup';

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
=======
    <div className="App">
      <LoginSignup />
    </div>
>>>>>>> 48553a4edcbeacb90fdc51c767579f2b7ef8f5c2
  );
}

export default App;