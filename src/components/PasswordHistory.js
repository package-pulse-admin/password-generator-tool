import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordGenerator.css'; // Reuse same styles

function PasswordHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (!token || !username) {
      console.error('Missing token or username');
      navigate('/');
    } else {
      fetchHistory();
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8089/history/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else if (response.status === 404) {
        alert('User not found.');
      } else {
        alert('Failed to fetch password history.');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="generator-wrapper">
      <div className="logout-container">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('username');
            localStorage.removeItem('jwtToken');
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>

      <div className="password-library">
        <h2>Password History</h2>
        {history.length === 0 ? (
          <p>No password history found.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index} className="password-item">
                <div className="password-text">
                  <div><strong>App:</strong> {item.password.appName}</div>
                  <div><strong>Label:</strong> {item.password.passwordLabel}</div>
                  <div><strong>Old Pass:</strong> {item.passwordValue}</div>
                  <div><strong>Updated:</strong> {item.updatedAt}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="encrypt-nav-button-container">
          <button className="small-nav-button" onClick={() => navigate('/generate')}>
            Back to Generator
          </button>
          <button className="small-nav-button" onClick={() => navigate('/encrypt')}>
                              Go to Encrypt/Decrypt
                            </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordHistory;
