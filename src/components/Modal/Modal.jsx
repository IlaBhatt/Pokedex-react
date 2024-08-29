import React from 'react';

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
            <h1>{title}</h1>
            <button className="close-button" onClick={onClose}>×</button>
        </div>
        <hr></hr>
        {children}
        </div>
    </div>
  );
};

export default Modal;
