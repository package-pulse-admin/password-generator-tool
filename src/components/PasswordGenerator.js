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
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editData, setEditData] = useState({ id: null, value: '', appName: '', passwordLabel: '' });
  const [newPasswordData, setNewPasswordData] = useState({ appName: '', passwordLabel: '', value: '' });
  const [saveFormVisible, setSaveFormVisible] = useState(false);


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

  const savePassword = () => {
    if (!generatedPassword) return;

    setNewPasswordData({
      appName: '',
      passwordLabel: '',
      value: generatedPassword
    });

    setSaveFormVisible(true);
  };

  const submitSave = async () => {
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
        setSaveFormVisible(false);
        fetchSavedPasswords();
        alert('Password saved!');
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

  const handleEditClick = (item) => {
    console.log('Editing item:', item);
    setEditData({
      id: item.id,
      value: item.passwordValue,
      appName: item.appName,
      passwordLabel: item.passwordLabel
    });
    setEditFormVisible(true);
  };

  const submitEdit = async () => {
    const existing = passwordList.find(p => p.id === editData.id);
    const body = {
      value: editData.value || existing.value,
      appName: editData.appName || existing.appName,
      passwordLabel: editData.passwordLabel || existing.passwordLabel
    };

    try {
      const response = await fetch(`http://localhost:8089/library/${username}?passId=${editData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        alert('Password updated!');
        setEditFormVisible(false);
        fetchSavedPasswords();
      } else {
        const msg = await response.text();
        alert(`Update failed: ${msg}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
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
          <h2>Vault</h2>
          {passwordList.length === 0 ? (
            <p>No passwords saved yet.</p>
          ) : (
            <ul>
              {passwordList.map((item, idx) => (
                <li key={idx} className="password-item">
                 <div className="password-text">
                       <div><strong>App:</strong> {item.appName}</div>
                       <div><strong>Label:</strong> {item.passwordLabel}</div>
                       <div style={{ wordBreak: 'break-word' }}><strong>Pass:</strong> {item.passwordValue}</div>
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
                      onClick={() => checkPassword(item.passwordValue)}
                    >
                      Check
                    </button>
                    <button className="delete-button" onClick={() => handleEditClick(item)}>Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {editFormVisible && (
            <div className="modal-overlay" onClick={() => setEditFormVisible(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Password</h3>
                <label>App Name:</label>
                <input
                  type="text"
                  onChange={(e) => setEditData({ ...editData, appName: e.target.value })}
                  placeholder={editData.appName}
                />
                <label>Password Label:</label>
                <input
                  type="text"
                  onChange={(e) => setEditData({ ...editData, passwordLabel: e.target.value })}
                  placeholder={editData.passwordLabel}
                />
                <label>Password Value:</label>
                <input
                  type="text"
                  onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                  placeholder={editData.value}
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={submitEdit} className="delete-button">Save Changes</button>
                  <button onClick={() => setEditFormVisible(false)} className="delete-button">Cancel</button>
                </div>
              </div>
            </div>
          )}
        {saveFormVisible && (
  <div className="modal-overlay" onClick={() => setSaveFormVisible(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Save Generated Password</h3>
      <label>App Name:</label>
      <input
        type="text"
        value={newPasswordData.appName}
        onChange={(e) => setNewPasswordData({ ...newPasswordData, appName: e.target.value })}
      />
      <label>Password Label:</label>
      <input
        type="text"
        value={newPasswordData.passwordLabel}
        onChange={(e) => setNewPasswordData({ ...newPasswordData, passwordLabel: e.target.value })}
      />
      <label>Password Value:</label>
      <input
        type="text"
        onChange={(e) => setNewPasswordData({ ...newPasswordData, value: e.target.value })}
        placeholder={newPasswordData.value}
      />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={submitSave} className="delete-button">Save</button>
        <button onClick={() => setSaveFormVisible(false)} className="delete-button">Cancel</button>
      </div>
    </div>
  </div>
)}

          {/* Button to go to Encrypt/Decrypt */}
          <div className="encrypt-nav-button-container">
            <button className="small-nav-button" onClick={() => window.location.href = '/encrypt'}>
              Go to Encrypt/Decrypt
            </button>
            <button className="small-nav-button" onClick={() => window.location.href = '/history'}>
              Go to History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator;
