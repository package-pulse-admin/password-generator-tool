import React, { useEffect } from 'react';
import './ErrorModal.css';

const ErrorModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="error-icon">❌</span>
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default ErrorModal;
