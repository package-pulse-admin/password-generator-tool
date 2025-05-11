import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PasswordGenerator from './components/PasswordGenerator';
import PasswordEncryptor from './components/PasswordEncryptor';
import VaultPage from './components/VaultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/generate" element={<PasswordGenerator />} />
        <Route path="/encrypt" element={<PasswordEncryptor />} />
        <Route path="/vault" element={<VaultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
