import React, { useEffect } from 'react';
import './SuccessModal.css';

const SuccessModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="check-icon">✔️</span>
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default SuccessModal;
