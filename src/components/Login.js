import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from './ErrorModal';
import './Form.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8089/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
          const data = await res.json();
          const token = data.token;
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('username', username);
          navigate('/generate');
        } else {
      setShowError(true);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">SIGN IN</button>
        <p>
          Forgot <span className="link">Username / Password?</span><br />
          Don't have an account?{' '}
          <span className="link" onClick={() => navigate('/register')}>
            Sign up
          </span>
        </p>
      </form>
      {showError && (
        <ErrorModal
          message="Wrong username or password"
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}

export default Login;
