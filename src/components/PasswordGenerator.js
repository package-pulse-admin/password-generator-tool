import React, { useState } from 'react';
import './PasswordGenerator.css';

function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = async () => {
    const params = new URLSearchParams({
      length,
      upper: useUpper,
      lower: useLower,
      digits: useDigits,
      symbols: useSymbols
    });

    try {
      const response = await fetch(`http://localhost:8080/generate?${params.toString()}`);
      const password = await response.text();
      setGeneratedPassword(password);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  return (
    <div className="generator-wrapper">
    <div className="logout-container">
              <button className="logout-button" onClick={() => window.location.href = '/'}>
                Logout
              </button>
            </div>
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
            <strong>Password:</strong> {generatedPassword}
          </div>
        )}
      </form>
    </div>
  );
}

export default PasswordGenerator;
