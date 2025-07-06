import React, { useState } from 'react';
import './PasswordEncryptor.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function PasswordEncryptor() {
  const [password, setPassword] = useState('');
  const [encryptionType, setEncryptionType] = useState('bcrypt');
  const [encryptedPassword, setEncryptedPassword] = useState('');
  const [error, setError] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [decryptType, setDecryptType] = useState('AES');
  const [encryptedInput, setEncryptedInput] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');
  const [decryptError, setDecryptError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaveFormVisible, setIsSaveFormVisible] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    appName: '',
    passwordLabel: '',
    value: ''
  });

  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    console.error('No token found, please log in again.');
    navigate('/');
  }

  const handleEncrypt = async (e) => {
    e.preventDefault();
    setEncryptedPassword('');
    setError(null);

    try {
      const endpoint = `http://localhost:8089/api/v1/encrypt/${encryptionType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const result = await response.text();
      response.ok ? setEncryptedPassword(result) : setError(`Error: ${result}`);
    } catch (err) {
      setError('Unexpected error during encryption.');
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setDecryptedOutput('');
    setDecryptError(null);

    try {
      const endpoint = `http://localhost:8089/api/v1/decrypt/${decryptType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: encryptedInput })
      });

      const result = await response.text();
      response.ok ? setDecryptedOutput(result) : setDecryptError(`Error: ${result}`);
    } catch (err) {
      setDecryptError('Unexpected error during decryption.');
    }
  };

  const handleSubmitSaveForm = async () => {
    try {
      const response = await fetch(`http://localhost:8089/library/${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPasswordData),
      });

      if (response.ok) {
        alert('Password saved!');
        setIsSaveFormVisible(false);
      } else {
        const msg = await response.text();
        alert(`Error saving password: ${msg}`);
      }
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  return (
    <div className="encryptor-wrapper">
      <div className="logout-container">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('username');
            window.location.href = '/';
          }}
        >
          Logout
        </button>
      </div>

      <div className="forms-container">
        {/* Encrypt Form */}
        <form className="encryptor-form" onSubmit={handleEncrypt}>
          <h2>Password Encryptor</h2>

          <label>
            Password:
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </label>

          <label>
            Encryption Type:
            <select value={encryptionType} onChange={(e) => setEncryptionType(e.target.value)}>
              <option value="bcrypt">bcrypt</option>
              <option value="AES">AES</option>
              <option value="RSA">RSA</option>
            </select>
          </label>

          <button type="submit">Encrypt</button>

          {error && <div className="error-message">{error}</div>}
          {encryptedPassword && (
            <div className="generated-password">
              <strong>Encrypted Password:</strong>
              <span>{encryptedPassword}</span>
              <button
                onClick={() => {
                  setNewPasswordData({
                    appName: '',
                    passwordLabel: '',
                    value: encryptedPassword
                  });
                  setIsSaveFormVisible(true);
                }}
              >
                Save
              </button>
              <button onClick={() => window.location.href = '/generate'}>
                Password Library
              </button>

              {isSaveFormVisible && (
                <div
                  className="modal-overlay"
                  onClick={() => setIsSaveFormVisible(false)} // Close modal on overlay click
                >
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                  >
                    <h3>Save Encrypted Password</h3>
                    <label>
                      App Name:
                      <input
                        type="text"
                        value={newPasswordData.appName}
                        onChange={(e) =>
                          setNewPasswordData({ ...newPasswordData, appName: e.target.value })
                        }
                        placeholder="App name"
                      />
                    </label>

                    <label>
                      Label:
                      <input
                        type="text"
                        value={newPasswordData.passwordLabel}
                        onChange={(e) =>
                          setNewPasswordData({ ...newPasswordData, passwordLabel: e.target.value })
                        }
                        placeholder="Label"
                      />
                    </label>

                    <label>
                      Password Value:
                      <input type="text" value={newPasswordData.value} readOnly />
                    </label>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={handleSubmitSaveForm}
                        className="save-button"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSaveFormVisible(false)}
                        className="save-button"
                        style={{ backgroundColor: '#ccc', color: '#333' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Decrypt Form */}
        <form className="encryptor-form" onSubmit={handleDecrypt}>
          <h2>Password Decryptor</h2>

          <label>
            Encrypted Value:
            <input
              type="text"
              value={encryptedInput}
              onChange={(e) => setEncryptedInput(e.target.value)}
              required
            />
          </label>

          <label>
            Encryption Type:
            <select value={decryptType} onChange={(e) => setDecryptType(e.target.value)}>
              <option value="AES">AES</option>
              <option value="RSA">RSA</option>
            </select>
          </label>

          <button type="submit">Decrypt</button>

          {decryptError && <div className="error-message">{decryptError}</div>}
          {decryptedOutput && (
            <div className="generated-password">
              <strong>Decrypted Password:</strong>
              <span>{decryptedOutput}</span>
            </div>
          )}

          <div className="encrypt-nav-button-container">
            <button
              className="small-nav-button"
              onClick={() => window.location.href = '/generate'}
            >
              Password Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordEncryptor;
