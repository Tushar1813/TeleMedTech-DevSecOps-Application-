import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Subsequent JWT integration will go here
    console.log('Login credentials:', formData);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Patient Login</h2>
        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="primary-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
