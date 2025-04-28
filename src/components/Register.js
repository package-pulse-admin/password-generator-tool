import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';
import './Form.css';

function Register() {
  const [form, setForm] = useState({
    id: null,
    username: '',
    password: '',
    fullName: '',
    address: '',
    code: '',
  });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8085/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowModal(true);
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="fullName"
          placeholder="Email"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="code"
          type="number"
          placeholder="Code"
          value={form.code}
          onChange={handleChange}
        />
        <button type="submit">SIGN UP</button>
        <p>
          Already have an account?{' '}
          <span className="link" onClick={() => navigate('/')}>
            Login
          </span>
        </p>
      </form>
      {showModal && <SuccessModal message="Congratulations! You registered successfully." onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Register;
