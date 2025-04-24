import React, { useState } from 'react';
import './PasswordEncryptor.css';

function PasswordEncryptor() {
  const [password, setPassword] = useState('');
  const [encryptionType, setEncryptionType] = useState('bcrypt');
  const [encryptedPassword, setEncryptedPassword] = useState('');
  const [error, setError] = useState(null);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEncryptionTypeChange = (e) => {
    setEncryptionType(e.target.value);
  };

  const handleEncrypt = async (e) => {
    e.preventDefault();
    setEncryptedPassword('');
    setError(null);

    try {
      const endpoint = `http://localhost:8081/api/v1/encrypt/${encryptionType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const result = await response.text();
        setEncryptedPassword(result);
      } else {
        const errorMsg = await response.text();
        setError(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Encryption error:', err);
      setError('Unexpected error during encryption.');
    }
  };

  return (
    <div className="encryptor-wrapper">
      <div className="forms-container">
        <form className="encryptor-form" onSubmit={handleEncrypt}>
          <h2>Password Encryptor</h2>

          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>

          <label>
            Encryption Type:
            <select value={encryptionType} onChange={handleEncryptionTypeChange}>
              <option value="bcrypt">bcrypt</option>
              <option value="sha256">sha256</option>
              <option value="md5">md5</option>
            </select>
          </label>

          <button type="submit">Encrypt</button>

          {error && <div className="error-message">{error}</div>}

          {encryptedPassword && (
            <div className="generated-password">
              <strong>Encrypted Password:</strong>
              <span>{encryptedPassword}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default PasswordEncryptor;
