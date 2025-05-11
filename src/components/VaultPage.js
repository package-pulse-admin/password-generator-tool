import React, { useState } from 'react';
import './VaultPage.css';

function VaultPage() {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [appName, setAppName] = useState('');
  const [label, setLabel] = useState('');

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let charSet = '';
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;

    if (charSet === '') {
      setGeneratedPassword('');
      return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      password += charSet[randomIndex];
    }

    setGeneratedPassword(password);
  };

  const savePassword = () => {
    if (!generatedPassword || !appName) {
      alert('Please generate a password and fill in the app name.');
      return;
    }

    // Симулирай запис - в реална апликация тук ще е заявка към API
    console.log('Saved:', {
      app: appName,
      label: label,
      password: generatedPassword,
    });

    setAppName('');
    setLabel('');
    setGeneratedPassword('');
    alert('Password saved!');
  };

  return (
    <div className="vault-content">
      <form className="vault-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Generate Password</h2>

        <div className="form-row">
          <label>
            Length:
            <input
              type="range"
              min={4}
              max={32}
              value={passwordLength}
              onChange={(e) => setPasswordLength(e.target.value)}
            />
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
            Include Uppercase
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
            />
            Include Lowercase
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Include Digits
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Include Symbols
          </label>
        </div>

        <div className="form-row">
          <input
            type="text"
            readOnly
            value={generatedPassword}
            placeholder="Generated Password"
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="App Name"
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
          />
        </div>

        <div className="vault-buttons">
          <button type="button" onClick={generatePassword}>
            Generate
          </button>
          <button type="button" onClick={savePassword}>
            Save Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default VaultPage;
