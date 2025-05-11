import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordGenerator.css';

function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

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

  return (
    <div className="vault-wrapper">
      <aside className="side-menu">
        <button onClick={() => navigate('/generate')}>Generate Pass</button>
        <button onClick={() => navigate('/vault')}>Pass History</button>
        <button onClick={() => navigate('/encrypt')}>Encrypt/Decrypt</button>
        <button onClick={() => {
          localStorage.clear();
          navigate('/');
        }}>Logout</button>
      </aside>

      <main className="vault-content">
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
            <div className="generated-password">
              <strong>Password:</strong>
              <span>{generatedPassword}</span>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default PasswordGenerator;
