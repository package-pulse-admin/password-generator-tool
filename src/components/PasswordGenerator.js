import React, { useState, useEffect } from 'react';
import './PasswordGenerator.css';
import { useNavigate } from 'react-router-dom';

function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordList, setPasswordList] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('jwtToken');


  if (!token) {
    console.error('No token found, please log in again.');
    navigate('/');
  }

  const generatePassword = async () => {
    const params = new URLSearchParams({
      length,
      upper: useUpper,
      lower: useLower,
      digits: useDigits,
      symbols: useSymbols
    });

    try {
      const response = await fetch(`http://localhost:8089/api/v1/password/generate?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate password');
      }

      const password = await response.text();
      setGeneratedPassword(password);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const fetchSavedPasswords = async () => {
    try {
      const response = await fetch(`http://localhost:8089/library/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPasswordList(data);
      } else {
        console.error('Failed to fetch saved passwords');
      }
    } catch (error) {
      console.error('Error fetching saved passwords:', error);
    }
  };

  const savePassword = async () => {
    if (!generatedPassword) return;

    try {
      const response = await fetch(`http://localhost:8089/library/${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: generatedPassword }),
      });

      if (response.ok) {
        alert('Password saved!');
        fetchSavedPasswords();
      } else {
        const msg = await response.text();
        alert(`Error saving password: ${msg}`);
      }
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const deletePassword = async (passId) => {
    try {
      const response = await fetch(`http://localhost:8089/library/${username}?passId=${passId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Password deleted successfully!');
        fetchSavedPasswords();
      } else {
        const msg = await response.text();
        alert(`Error deleting password: ${msg}`);
      }
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const checkPassword = async (password) => {
    try {
      const response = await fetch(`http://localhost:8089/api/v1/password/check?password=${password}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const msg = await response.text();
        alert(`Strength of password ${password} is: ${msg}`);
      } else {
        const msg = await response.text();
        alert(`Error checking password: ${msg}`);
      }
    } catch (error) {
      console.error('Error checking password:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSavedPasswords();
    }
  }, [token]);

  return (
    <div className="generator-wrapper">
      <div className="logout-container">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('username');
            localStorage.removeItem('jwtToken');
            window.location.href = '/';
          }}
        >
          Logout
        </button>
      </div>

      <div className="forms-container">
        {/* Password Generator Form */}
        <form className="generator-form" onSubmit={(e) => { e.preventDefault(); generatePassword(); }}>
          <h2>Password Generator</h2>

          <label>Length: {length}</label>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />

          <label>
            <input type="checkbox" checked={useUpper} onChange={() => setUseUpper(!useUpper)} />
            Include Uppercase
          </label>
          <label>
            <input type="checkbox" checked={useLower} onChange={() => setUseLower(!useLower)} />
            Include Lowercase
          </label>
          <label>
            <input type="checkbox" checked={useDigits} onChange={() => setUseDigits(!useDigits)} />
            Include Digits
          </label>
          <label>
            <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} />
            Include Symbols
          </label>

          <button type="submit">Generate</button>

          {generatedPassword && (
            <div className="generated-password" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <strong>Password:</strong>
              <span style={{ wordBreak: 'break-all' }}>{generatedPassword}</span>
              <button type="button" onClick={savePassword}>Save</button>
            </div>
          )}
        </form>

        {/* Password Library Display */}
        <div className="password-library">
          <h2>Saved Passwords</h2>
          {passwordList.length === 0 ? (
            <p>No passwords saved yet.</p>
          ) : (
            <ul>
              {passwordList.map((item, idx) => (
                <li key={idx} className="password-item">
                  <div className="password-text">
                    <strong>Password:</strong> {item.password_value}
                  </div>
                  <div className="password-actions">
                    <button
                      className="delete-button"
                      onClick={() => deletePassword(item.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => checkPassword(item.password_value)}
                    >
                      Check
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Button to go to Encrypt/Decrypt */}
          <div className="encrypt-nav-button-container">
            <button
              className="small-nav-button"
              onClick={() => window.location.href = '/encrypt'}
            >
              Go to Encrypt/Decrypt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator;
