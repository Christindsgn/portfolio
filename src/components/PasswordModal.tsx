import React, { useState } from 'react';
import './PasswordModal.css';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordSubmit: (password: string) => string | void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onPasswordSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (password.trim()) {
      const errorMessage = onPasswordSubmit(password);
      if (errorMessage) {
        setError(errorMessage);
      } else {
        setPassword('');
      }
    } else {
      setError('Please enter a password');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Spell the magic word</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${error ? 'form-input-error' : ''}`}
                placeholder="Enter password"
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>
            <p className="form-help">
              If you don't have password,{' '}
              <span className="help-link">ping me</span>
            </p>
            <button type="submit" className="submit-button">
              View Portfolio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal; 